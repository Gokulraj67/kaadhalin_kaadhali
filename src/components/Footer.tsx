import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-background border-t py-6 mt-12">
      <div className="container px-4 sm:px-6 lg:px-8 text-muted-foreground text-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          &copy; {currentYear} Kadhalin Kaadhali. All rights reserved.
        </div>
        <div className="flex flex-col items-center sm:items-end gap-2">
          <p>contact@kadhalinkaadhali.com</p>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/kadhalin_kaadhali/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Instagram
            </a>
            <a href="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
