'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Shield, Cookie, CheckCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check consent status on mount
  useEffect(() => {
    if (!mounted) return;

    // Add delay to ensure localStorage is available (Safari fix) and prevent hydration issues
    const timer = setTimeout(() => {
      try {
        const hasConsent = window.localStorage.getItem('maxyourpoints-cookie-consent');
        if (!hasConsent) {
          setIsVisible(true);
        }
        setIsLoaded(true);
      } catch (error) {
        // Fallback for Safari private mode or localStorage issues
        console.warn('localStorage not available, showing banner');
        setIsVisible(true);
        setIsLoaded(true);
      }
    }, 300); // Increased delay to prevent flickering

    return () => clearTimeout(timer);
  }, [mounted]);

  // Handle accept with loading state
  const handleAccept = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAccepting(true);
    
    try {
      window.localStorage.setItem('maxyourpoints-cookie-consent', 'accepted');
      window.localStorage.setItem('maxyourpoints-consent-date', new Date().toISOString());
      
      // Add small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsVisible(false);
    } catch (error) {
      console.warn('Could not save consent to localStorage');
      setIsAccepting(false);
    }
  }, []);

  // Handle dismiss without consent
  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  }, []);

  // Don't render until loaded and mounted (prevents hydration mismatch)
  if (!mounted || !isLoaded || !isVisible) return null;

  const overlayContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}
    >
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"
        onClick={handleDismiss}
      />
      
      {/* Main content card */}
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-500">
        
        {/* Header with gradient background */}
        <div 
          className="px-8 py-6 relative"
          style={{ 
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)',
          }}
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header content */}
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                🍪 Privacy & Cookies at Max Your Points
              </h2>
              <p className="text-white/90 text-sm">
                Simple, transparent, and traveler-friendly
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="space-y-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              We use <strong>essential cookies only</strong> to make our travel rewards content work smoothly. 
              No third-party tracking, no intrusive ads, no data selling - just the technical cookies needed 
              for core functionality.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Cookie className="w-4 h-4 text-blue-600" />
                <span>Essential only</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>No tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <X className="w-4 h-4 text-red-600" />
                <span>No ads</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What we collect:</strong> Session data, preferences, and basic analytics to improve your travel hacking experience. 
                <Link href="/cookie-policy" className="underline hover:no-underline ml-1 font-medium">
                  Read our full cookie policy →
                </Link>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isAccepting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept & Continue ✈️</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, you agree to our essential cookie usage. You can change preferences anytime in your browser settings.
          </p>
        </div>
      </div>
    </div>
  );

  // Use portal to render outside normal DOM hierarchy for better overlay control
  return mounted && typeof window !== 'undefined' 
    ? createPortal(overlayContent, document.body)
    : null;
} 