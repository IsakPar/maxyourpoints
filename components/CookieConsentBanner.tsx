'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Shield, Cookie } from 'lucide-react';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check consent status on mount
  useEffect(() => {
    // Add delay to ensure localStorage is available (Safari fix)
    const timer = setTimeout(() => {
      try {
        const hasConsent = window.localStorage.getItem('maxyourpoints-cookie-consent');
        setIsVisible(!hasConsent);
        setIsLoaded(true);
      } catch (error) {
        // Fallback for Safari private mode or localStorage issues
        console.warn('localStorage not available, showing banner');
        setIsVisible(true);
        setIsLoaded(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle accept with Safari-compatible event handling
  const handleAccept = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      window.localStorage.setItem('maxyourpoints-cookie-consent', 'accepted');
      window.localStorage.setItem('maxyourpoints-consent-date', new Date().toISOString());
    } catch (error) {
      console.warn('Could not save consent to localStorage');
    }
    
    setIsVisible(false);
  }, []);

  // Handle dismiss without consent
  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  }, []);

  // Don't render until loaded (prevents flash)
  if (!isLoaded || !isVisible) return null;

  return (
    <div 
      className="fixed top-16 left-0 right-0 z-[60] pointer-events-auto transform animate-in slide-in-from-top-full duration-500 border-b-4 border-yellow-400"
      style={{ 
        background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Left side - Icon + Content */}
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 mt-1">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                🍪 Cookies at Max Your Points
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-3">
                We use <strong>essential cookies only</strong> - no third-party tracking, no ads, no nonsense. 
                Just the technical cookies needed to make our travel hacking content work smoothly.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <Cookie className="w-3 h-3" />
                  Essential only
                </span>
                <span>🔒 No tracking</span>
                <span>🚫 No ads</span>
                <Link href="/cookie-policy" className="underline hover:text-white transition-colors">
                  Full cookie policy
                </Link>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              aria-label="Dismiss banner"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-white text-sky-700 rounded-xl font-semibold text-sm hover:bg-sky-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-700 animate-pulse hover:animate-none"
            >
              Got it! ✈️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 