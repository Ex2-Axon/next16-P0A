const apiBaseUrl =
  process.env.SERVER_API_URL ||
  process.env.NEXT_PUBLIC_SERVER_API_URL ||
  "http://localhost:3010";

export async function fetchRemoteComponent(slug: string) {
  const response = await fetch(`${apiBaseUrl}/api/components/${slug}`, {
    next: { revalidate: 30 },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload?.data?.component ?? null;
}

export function getServerApiUrl() {
  return apiBaseUrl;
}
