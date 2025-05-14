'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(true); // Still true for testing

  useEffect(() => {
    console.log('Cookie banner mounted, isVisible:', isVisible);
    // Temporarily commented out localStorage check for testing
    // const hasConsent = localStorage.getItem('cookieConsent');
    // if (!hasConsent) {
    //   setIsVisible(true);
    // }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FF7F50]/95 backdrop-blur-sm z-[9999] border-t border-[#FF7F50]/20">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white mb-2">Cookie Notice</h2>
            <p className="text-white/90">
              We use cookies to improve your experience. By using this site, you accept our{' '}
              <Link href="/cookie-policy" className="text-white font-medium hover:text-white/80 underline">
                cookie policy
              </Link>
              .
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="px-6 py-2.5 bg-white text-[#FF7F50] rounded-md hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#FF7F50] transition-colors font-medium whitespace-nowrap"
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
} 