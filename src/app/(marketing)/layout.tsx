import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { ParticlesBackground } from '@/components/marketing/ParticlesBackground';
import { GridBackground } from '@/components/marketing/GridBackground';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background flex flex-col relative">
      <GridBackground />
      <ParticlesBackground />
      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
