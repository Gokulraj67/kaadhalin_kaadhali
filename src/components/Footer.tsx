import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background border-t py-4 mt-8">
      <div className="container mx-auto px-4 text-muted-foreground text-sm flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-2 md:mb-0">
          &copy; {currentYear} Kadhalin Kaadhali. All rights reserved.
        </div>
        <div className="flex flex-col items-center md:items-end">
          <p className="mb-1">Contact: contact@kadhalinkaadhali.com</p>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/kadhalin_kaadhali/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Instagram
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Facebook
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Twitter
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
