#!/usr/bin/env python3
"""
Create .github directory (if missing) and validate folder/path references in repository files.

Usage:
  python tools/validate_and_create_github.py --root .              # report only
  python tools/validate_and_create_github.py --root . --apply    # apply suggested fixes

This script scans source files for quoted path-like strings (./, ../, /, C:\\) and
verifies the referenced directories exist. If a referenced directory is missing,
it suggests the closest existing directory (fuzzy match) and can optionally
replace the path in-place when run with --apply.
By default, it uses the script's own directory as the repository root,
so moving this script will still create `.github` next to it."""
from __future__ import annotations

import argparse
import difflib
import os
import re
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple


PATH_REGEX = re.compile(r'(?P<quote>["\'`])(?P<path>(?:[A-Za-z]:\\|[A-Za-z]:/|\\|/|\.\.?/|\.\\)[^"\'`\s]+)(?P=quote)')


def ensure_github_dir(root: Path) -> Path:
    github_dir = root / '.github'
    if not github_dir.exists():
        github_dir.mkdir(parents=True, exist_ok=True)
        print(f'Created {github_dir}')
    else:
        print(f'{github_dir} exists')
    return github_dir


def collect_dirs(root: Path, exclude: Optional[Set[str]] = None) -> List[Path]:
    exclude = exclude or {'.git', 'node_modules', '.next', 'out', 'dist', 'venv'}
    dirs = []
    for dirpath, dirnames, _ in os.walk(root):
        parts = Path(dirpath).parts
        if any(p in exclude for p in parts):
            # prune by clearing dirnames
            dirnames[:] = []
            continue
        dirs.append(Path(dirpath))
    return dirs


def find_path_strings(text: str) -> List[Tuple[str, str]]:
    # returns list of (quote, path)
    results = []
    for m in PATH_REGEX.finditer(text):
        q = m.group('quote')
        p = m.group('path')
        results.append((q, p))
    return results


def resolve_candidate(path_str: str, file_dir: Path, repo_root: Path) -> Optional[Path]:
    # Try to resolve the path string to an absolute path we can check
    # Handle Windows drives and UNC, absolute and relative
    p = path_str
    # Normalize slashes for path ops
    p_norm = p.replace('\\', os.sep).replace('/', os.sep)
    # If it's an absolute Windows path like C:\ or starts with drive
    if re.match(r'^[A-Za-z]:\\', p) or re.match(r'^[A-Za-z]:/', p):
        return Path(p_norm)
    # If starts with os.sep (rooted path), treat as repo-root relative
    if p_norm.startswith(os.sep):
        cand = repo_root.joinpath(p_norm.lstrip(os.sep))
        return cand
    # Otherwise resolve relative to the file directory
    return (file_dir / p_norm).resolve()


def find_best_dir_match(missing_dir: Path, dir_list: List[Path], max_suggestions: int = 3) -> List[Path]:
    # Use basename fuzzy matching first, then path-level
    name = missing_dir.name
    choices = [str(d) for d in dir_list]
    matches = difflib.get_close_matches(name, [Path(c).name for c in dir_list], n=max_suggestions, cutoff=0.6)
    # map back to full paths
    full_matches = []
    for m in matches:
        for d in dir_list:
            if d.name == m:
                full_matches.append(d)
                break
    # if not enough matches, try full-path matching
    if len(full_matches) < 1:
        full_matches = [dir_list[0]] if dir_list else []
    return full_matches


def process_file(path: Path, repo_root: Path, dir_list: List[Path], apply: bool = False) -> Tuple[bool, List[str]]:
    changed = False
    suggestions = []
    text = path.read_text(encoding='utf-8', errors='ignore')
    found = find_path_strings(text)
    if not found:
        return False, []

    new_text = text
    for quote, p in found:
        try:
            candidate = resolve_candidate(p, path.parent, repo_root)
        except Exception:
            candidate = None
        if candidate is None:
            continue
        if candidate.exists():
            continue
        # candidate doesn't exist -> try to suggest
        matches = find_best_dir_match(candidate, dir_list)
        if not matches:
            suggestions.append(f'{path}: no match for {p}')
            continue
        best = matches[0]
        suggestions.append(f'{path}: {p} -> {best.relative_to(repo_root)}')
        if apply:
            # compute relative path from file to suggested dir, then keep original filename if any
            # if original path had a file part, preserve it
            orig_sep = '\\' if '\\' in p else ('/' if '/' in p else os.sep)
            # If original path included more than just the directory, try to keep basename
            orig_tail = Path(p.replace('\\', os.sep).replace('/', os.sep)).name
            # Construct a relative path to the suggested directory
            rel = os.path.relpath(str(best), start=str(path.parent))
            # If original looked like a full file path (had an extension), append the original tail
            if '.' in orig_tail and not rel.endswith(orig_tail):
                rel = os.path.join(rel, orig_tail)
            replacement = rel.replace(os.sep, orig_sep)
            # replace the path inside quotes only for this occurrence
            # Build exact target string to replace
            old_full = f'{quote}{p}{quote}'
            new_full = f'{quote}{replacement}{quote}'
            if old_full in new_text:
                new_text = new_text.replace(old_full, new_full, 1)
                changed = True

    if apply and changed:
        path.write_text(new_text, encoding='utf-8')

    return changed, suggestions


def main() -> int:
    ap = argparse.ArgumentParser(description='Ensure .github and validate path-like strings in repo files')
    ap.add_argument('--root', default=None, help='Repository root (default: script directory)')
    ap.add_argument('--apply', action='store_true', help='Apply suggested fixes (in-place)')
    ap.add_argument('--ext', nargs='+', default=['.js', '.ts', '.tsx', '.jsx', '.py', '.md', '.json', '.yml', '.yaml', '.html', '.env', '.ps1', '.sh'], help='File extensions to scan')
    args = ap.parse_args()

    script_dir = Path(__file__).resolve().parent
    repo_root = Path(args.root).resolve() if args.root else script_dir
    if not repo_root.exists():
        print('Root does not exist:', repo_root)
        return 2

    ensure_github_dir(repo_root)

    dir_list = collect_dirs(repo_root)

    # gather candidate files
    files = []
    for ext in args.ext:
        files.extend(repo_root.rglob(f'*{ext}'))

    files = [f for f in files if '.git' not in f.parts and 'node_modules' not in f.parts]

    total_changed = 0
    all_suggestions: Dict[Path, List[str]] = {}
    for f in files:
        changed, suggestions = process_file(f, repo_root, dir_list, apply=args.apply)
        if changed:
            total_changed += 1
        if suggestions:
            all_suggestions[f] = suggestions

    # report
    if all_suggestions:
        print('\nSuggestions / Issues found:')
        for f, sug in all_suggestions.items():
            for s in sug:
                print('-', s)
    else:
        print('\nNo missing directory references found.')

    if args.apply:
        print(f'Applied fixes to {total_changed} files')
    else:
        print(f'Run with --apply to apply suggested fixes (found suggestions for {len(all_suggestions)} files)')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
