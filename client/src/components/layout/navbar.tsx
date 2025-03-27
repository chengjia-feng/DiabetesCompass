import React from 'react';
import { CompassLogoSVG } from '../ui/compass-logo';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-[#322459] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center">
              <CompassLogoSVG />
              <div className="ml-4">
                <span className="text-white text-xl font-bold">COMPASS</span>
                <span className="text-[#F28705] text-xl font-bold">.</span>
              </div>
            </a>
          </Link>
          
          <div className="hidden md:flex space-x-4 items-center">
            <Link href="/about">
              <a className="text-white hover:text-[#F28705] px-3 py-2 text-sm font-medium transition-colors">
                About
              </a>
            </Link>
            <Link href="/resources">
              <a className="text-white hover:text-[#F28705] px-3 py-2 text-sm font-medium transition-colors">
                Resources
              </a>
            </Link>
            <Link href="/#startup-form">
              <a>
                <Button 
                  className="bg-[#F28705] hover:bg-[#E74F0D] text-white"
                >
                  Get Started
                </Button>
              </a>
            </Link>
          </div>
          
          {/* Mobile menu button - we'll keep this simple */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="text-white"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
