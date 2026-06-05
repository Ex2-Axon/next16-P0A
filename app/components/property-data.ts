export type PropertyCategory = 'Penthouse' | 'Mansion' | 'Private Island';

export type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  numericPrice: number;
  category: PropertyCategory;
  image: string;
  details: {
    area: string;
    beds: number;
    baths: number;
    perfectionScore: number;
  };
  highlights: string[];
  specs: {
    privacy: number;
    aesthetic: number;
    security: number;
  };
};

export const categories = ['All', 'Penthouse', 'Mansion', 'Private Island'] as const;

export const propertiesData: Property[] = [
  {
    id: 'prop-1',
    title: 'The Overlord Sky-Penthouse',
    location: 'Sukhumvit Peak, Bangkok',
    price: '380,000,000 ฿',
    numericPrice: 380,
    category: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    details: { area: '1,250 ตร.ม.', beds: 5, baths: 6, perfectionScore: 99.9 },
    highlights: ['สระว่ายน้ำกระจกนิรภัยลอยฟ้าบนชั้น 88', 'ลิฟต์ส่วนตัวสแกนลายนิ้วมือและม่านตา', 'ระบบควบคุมสภาพอากาศและออกซิเจนบริสุทธิ์'],
    specs: { privacy: 100, aesthetic: 99, security: 100 },
  },
  {
    id: 'prop-2',
    title: 'Aura Obsidian Megamansion',
    location: 'Lakeside Sanctuary, Eastern Outer Ring',
    price: '720,000,000 ฿',
    numericPrice: 720,
    category: 'Mansion',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    details: { area: '3,400 ตร.ม.', beds: 8, baths: 10, perfectionScore: 100 },
    highlights: ['โรงจอดรถซูเปอร์คาร์ใต้ดินระบบไฮดรอลิก 12 คัน', 'ผนังกระจกกันกระสุนแบบโค้ง 360 องศา', 'ห้องนิรภัยมาตรฐานสูงสุดระดับสากล (Panic Room)'],
    specs: { privacy: 98, aesthetic: 100, security: 100 },
  },
  {
    id: 'prop-3',
    title: 'The Siren Sanctuary Isle',
    location: 'Phuket Deep Blue Archipelago',
    price: '1,450,000,000 ฿',
    numericPrice: 1450,
    category: 'Private Island',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    details: { area: '24 ไร่', beds: 12, baths: 15, perfectionScore: 99.8 },
    highlights: ['ลานจอดเฮลิคอปเตอร์คู่ขนานท่ามกลางวิวทะเล', 'หาดทรายขาวส่วนตัวที่คัดกรองตะกอนพิเศษ', 'ท่าเทียบเรือยอทช์ระดับซูเปอร์เมกะยอทช์'],
    specs: { privacy: 100, aesthetic: 98, security: 99 },
  },
  {
    id: 'prop-4',
    title: 'Celestial Glass Dome Villa',
    location: 'Chao Phraya Riverfront Frontline',
    price: '490,000,000 ฿',
    numericPrice: 490,
    category: 'Mansion',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
    details: { area: '1,800 ตร.ม.', beds: 6, baths: 8, perfectionScore: 99.7 },
    highlights: ['โดมกระจกไร้ขอบพับเปิดรับลมธรรมชาติได้ทั้งหลัง', 'สวนป่าฝนลอยฟ้าในร่มควบคุมอุณหภูมิ', 'ท่าน้ำส่วนตัวพร้อมระเบียงชมวิวโค้งน้ำที่สวยที่สุด'],
    specs: { privacy: 95, aesthetic: 100, security: 98 },
  },
];
