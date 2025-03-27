import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const Hero: React.FC = () => {
  return (
    <div id="hero" className="relative bg-[#322459] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Building Intelligence for <span className="text-[#F28705]">Human-Centered</span> Health Innovation
            </h1>
            <p className="mt-4 text-lg text-gray-200 max-w-2xl">
              COMPASS helps diabetes-focused startups build better products through patient insights, 
              market intelligence, and human-centered design.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row">
              <Link href="#startup-form">
                <a className="bg-[#F28705] hover:bg-[#E74F0D] text-white font-medium py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 mb-4 sm:mb-0 sm:mr-4 text-center">
                  Start Your Assessment
                </a>
              </Link>
              <Link href="/about">
                <a className="border-2 border-white text-white font-medium py-3 px-6 rounded-md hover:bg-white hover:text-[#322459] transition duration-300 ease-in-out text-center">
                  Learn More
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Healthcare professional with patient" 
              className="rounded-lg shadow-xl max-w-full h-auto"
            />
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F1F2FA] to-transparent"></div>
    </div>
  );
};

export default Hero;
