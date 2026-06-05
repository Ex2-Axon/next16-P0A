"use client";

import { useEffect, useMemo, useState } from 'react';
import BrandNavbar from './brand-navbar';
import HeroSection from './hero-section';
import PropertyGrid from './property-grid';
import PropertyInsight from './property-insight';
import ProtocolChecklist from './protocol-checklist';
import GalleryShowcase from './gallery-showcase';
import BookingSection from './booking-section';
import Footer from './Footer';
import CookieBanner from './CookieBanner';
import { Property, PropertyCategory, propertiesData } from './property-data';

const initialProperty = propertiesData[0];

export default function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | PropertyCategory>('All');
  const [priceRange, setPriceRange] = useState(1500);
  const [selectedProperty, setSelectedProperty] = useState<Property>(initialProperty);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [tourMode, setTourMode] = useState<'Normal' | 'Thermal' | 'Blueprint'>('Normal');
  const [scanProgress, setScanProgress] = useState(0);
  const [checkedProtocols, setCheckedProtocols] = useState<Record<string, boolean>>({ p1: true, p2: true, p3: false, p4: false, p5: false });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 45);
    return () => window.clearInterval(interval);
  }, []);

  const filteredProperties = useMemo(
    () => propertiesData.filter((property) => {
      const matchesCategory = selectedCategory === 'All' || property.category === selectedCategory;
      const matchesPrice = property.numericPrice <= priceRange;
      const matchesQuery = property.title.toLowerCase().includes(searchQuery.toLowerCase()) || property.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesQuery;
    }),
    [selectedCategory, priceRange, searchQuery],
  );

  const triggerNotification = (message: string) => {
    setActiveNotification(message);
    window.setTimeout(() => setActiveNotification(null), 4000);
  };

  const handleBooking = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedTime || !clientName || !clientPhone) {
      triggerNotification('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setBookingConfirmed(true);
    triggerNotification('จองสิทธิ์การเข้าชมส่วนตัวสำเร็จ');
  };

  const toggleProtocol = (id: string) => {
    setCheckedProtocols((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <BrandNavbar />
      <HeroSection
        searchQuery={searchQuery}
        onSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        onPriceRange={setPriceRange}
      />
      <PropertyGrid
        filteredProperties={filteredProperties}
        selectedProperty={selectedProperty}
        onSelectProperty={setSelectedProperty}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <PropertyInsight
        selectedProperty={selectedProperty}
        tourMode={tourMode}
        onTourModeChange={setTourMode}
        isVideoPlaying={isVideoPlaying}
        onToggleVideo={() => setIsVideoPlaying((current) => !current)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((current) => !current)}
        scanProgress={scanProgress}
        triggerNotification={triggerNotification}
      />
      <ProtocolChecklist
        checkedProtocols={checkedProtocols}
        onToggleProtocol={toggleProtocol}
        triggerNotification={triggerNotification}
      />
      <GalleryShowcase />
      <BookingSection
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        clientName={clientName}
        clientPhone={clientPhone}
        bookingConfirmed={bookingConfirmed}
        onSetSelectedDate={setSelectedDate}
        onSetSelectedTime={setSelectedTime}
        onSetClientName={setClientName}
        onSetClientPhone={setClientPhone}
        onSubmit={handleBooking}
        onResetBooking={() => {
          setBookingConfirmed(false);
          setClientName('');
          setClientPhone('');
          setSelectedDate('');
          setSelectedTime('');
        }}
      />

      {activeNotification && (
        <div className="fixed right-4 top-6 z-50 rounded-3xl border border-amber-400/20 bg-slate-950/95 px-5 py-4 text-slate-100 shadow-[0_0_30px_rgba(245,158,11,0.25)] backdrop-blur-xl">
          <p className="text-sm font-semibold">{activeNotification}</p>
        </div>
      )}

      <Footer />
      <CookieBanner />
    </main>
  );
}
