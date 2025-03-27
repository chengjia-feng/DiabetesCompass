import React from 'react';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import Hero from '@/components/home/hero';
import StartupForm from '@/components/form/startup-form';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F1F2FA]">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <StartupForm />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
