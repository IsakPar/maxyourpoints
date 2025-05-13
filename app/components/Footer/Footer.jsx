"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react"
import { Button } from "../ui/Button"

const OutlinedGradientButton = ({ href, children, type, disabled }) => {
  const style = {
    background: "white",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition: "all 0.5s ease",
  }

  const buttonContent = (
    <button
      type={type}
      disabled={disabled}
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-lg text-stone-950 hover:text-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
      }}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

const Footer = () => {
  return (
    <footer className="w-full max-w-[1440px] mx-auto px-4 md:px-16 py-12 md:py-20 flex flex-col justify-start items-start gap-10 md:gap-20 overflow-hidden">
      {/* Main footer content */}
      <div className="w-full flex flex-col md:flex-row justify-start items-start gap-10 md:gap-12 lg:gap-16">
        {/* Logo and navigation links */}
        <div className="w-full md:w-1/2 flex flex-col justify-start items-start gap-8">
          {/* Logo */}
          <div className="flex justify-start items-start">
            <div className="w-20 h-9 relative overflow-hidden">
              <div className="w-16 h-9 left-[6.67px] top-0 absolute overflow-hidden">
                <div className="left-[50.82px] top-[10.87px] absolute">
                  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.9112 7.08112L16.8741 7.11832C17.1343 6.41212 17.6546 6.15192 18.1006 6.15192C18.7325 6.15192 19.29 6.63512 19.29 7.34132C19.29 7.49002 19.29 7.67582 19.2157 7.89882C17.9148 11.244 15.1643 12.9537 12.4882 13.2139C11.2617 15.2953 9.25461 16.8192 6.39261 16.8192C2.30411 16.8192 0.48291 13.5856 0.48291 10.0546C0.48291 5.70592 3.23341 0.874023 7.84221 0.874023C8.84571 0.874023 9.70061 1.09712 10.4068 1.39442C12.4882 2.17492 13.8263 4.88822 13.8263 7.78732C13.8263 8.71652 13.7519 9.64572 13.5289 10.5378C14.9042 10.0546 16.205 8.93952 16.9112 7.08112ZM9.14311 3.92182V3.88472C8.32541 3.88472 7.84221 4.96252 7.84221 6.26342C7.84221 8.15902 8.88291 9.90592 10.5183 10.5378C10.7785 9.72012 10.89 8.79092 10.89 7.71302C10.89 5.63162 10.2581 3.92182 9.14311 3.92182ZM6.42981 14.1059C7.47051 14.1059 8.51121 13.6599 9.32891 12.7307C6.91301 11.6528 5.38911 9.12542 5.38911 6.70942C5.38911 5.89172 5.53781 5.03692 5.76081 4.29352C4.27411 5.52012 3.41921 7.93602 3.41921 10.0546C3.41921 12.805 4.72011 14.1059 6.42981 14.1059Z"
                      fill="#0D0500"
                    />
                  </svg>
                </div>
                <div className="left-[34.33px] top-[11.32px] absolute">
                  <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.0568 6.08131L17.0196 6.11851C17.2798 5.41231 17.7258 5.11501 18.1718 5.11501C18.8037 5.11501 19.4355 5.67251 19.4355 6.37871C19.4355 6.56451 19.3984 6.71321 19.324 6.89901C17.8745 10.43 15.7187 14.5557 12.2621 16.9716L12.1878 17.715C11.7789 22.1752 9.51169 24.9999 6.64969 24.9999C4.49389 24.9999 3.23018 23.5132 3.23018 21.7663C3.23018 18.607 6.46379 17.4548 9.47449 15.5221C9.54879 14.7415 9.58599 13.8495 9.62309 12.8459C8.13639 14.4813 6.53818 15.1504 5.12578 15.1504C2.30098 15.1504 -0.00341797 12.8459 -0.00341797 9.31501C-0.00341797 3.88841 3.56468 0.320312 7.54169 0.320312H7.57889C10.2922 0.320312 13.1913 1.76981 13.1913 4.37161C13.1913 5.22651 12.8196 9.87251 12.5223 13.4778C14.5293 11.5822 16.2019 8.49731 17.0568 6.08131ZM5.53459 12.4743C6.90989 12.4743 8.76828 11.6194 9.92048 7.41941C10.1063 6.49021 10.2178 5.67251 10.1807 4.70611C9.95769 3.70261 9.10279 3.10791 7.87618 3.10791C5.34878 3.10791 2.93288 5.52381 2.93288 9.20351C2.93288 11.4336 3.97358 12.4743 5.53459 12.4743ZM6.94698 22.2867H6.98419C7.76469 22.2867 8.61958 21.7663 9.17708 18.4212C7.54168 19.3875 6.01779 20.3539 6.01779 21.5061C6.01779 21.9893 6.38948 22.2867 6.94698 22.2867Z"
                      fill="#0D0500"
                    />
                  </svg>
                </div>
                <div className="left-[18.55px] top-[10.87px] absolute">
                  <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.6485 7.08112L16.6114 7.11832C16.8715 6.41212 17.3919 6.15192 17.8379 6.15192C18.4698 6.15192 19.0273 6.63512 19.0273 7.34132C19.0273 7.49002 19.0273 7.67582 18.953 7.89882C17.6521 11.244 14.9016 12.9537 12.2255 13.2139C10.999 15.2953 8.99191 16.8192 6.12991 16.8192C2.04141 16.8192 0.220215 13.5856 0.220215 10.0546C0.220215 5.70592 2.97061 0.874023 7.57951 0.874023C8.58301 0.874023 9.43791 1.09712 10.1441 1.39442C12.2255 2.17492 13.5636 4.88822 13.5636 7.78732C13.5636 8.71652 13.4892 9.64572 13.2662 10.5378C14.6415 10.0546 15.9423 8.93952 16.6485 7.08112ZM8.88041 3.92182V3.88472C8.06271 3.88472 7.57951 4.96252 7.57951 6.26342C7.57951 8.15902 8.62021 9.90592 10.2556 10.5378C10.5158 9.72012 10.6273 8.79092 10.6273 7.71302C10.6273 5.63162 9.99541 3.92182 8.88041 3.92182ZM6.16711 14.1059C7.20781 14.1059 8.24851 13.6599 9.06621 12.7307C6.65031 11.6528 5.12641 9.12542 5.12641 6.70942C5.12641 5.89172 5.27511 5.03692 5.49811 4.29352C4.01141 5.52012 3.15651 7.93602 3.15651 10.0546C3.15651 12.805 4.45741 14.1059 6.16711 14.1059Z"
                      fill="#0D0500"
                    />
                  </svg>
                </div>
                <div className="left-0 top-[10.24px] absolute">
                  <svg width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21.1094 5.90851C20.589 5.90851 20.143 6.16871 19.8456 6.87491C18.8793 9.32801 16.8721 13.4909 14.8278 13.4909C13.5406 13.4909 12.5445 13.1998 11.5379 12.9056C10.51 12.6052 9.47117 12.3015 8.10028 12.3015C7.61708 12.3015 6.94804 12.3759 6.31617 12.4874C8.21975 9.89161 8.93089 6.74791 9.61997 0.805611C8.32251 0.723011 7.2671 0.483311 6.49782 0.241211C5.67617 7.77771 4.74311 10.6513 1.33554 13.4909C0.889514 13.8626 0.666504 14.383 0.666504 14.9034C0.666504 15.7211 1.37272 16.4273 2.26477 16.4273C2.56212 16.4273 2.89663 16.3158 3.23115 16.1671C5.12677 15.3122 6.279 15.0892 7.69142 15.0892C8.58959 15.0892 9.66433 15.3461 10.815 15.621C12.1404 15.9378 13.5665 16.2786 14.9394 16.2786C17.95 16.2786 19.92 13.3423 22.1129 7.65541C22.2245 7.46961 22.2616 7.24661 22.2616 7.06071C22.2616 6.35451 21.7041 5.90851 21.1094 5.90851Z"
                      fill="#0D0500"
                    />
                  </svg>
                </div>
                <div className="left-[1.15px] top-0 absolute">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.68617 8.70287C6.35926 8.93784 7.41008 9.2114 8.77251 9.29233L8.99552 9.29222C13.1956 9.29222 15.9461 6.6904 15.9461 3.56821C15.9461 1.56109 14.385 0 12.192 0C9.2557 0 7.21142 2.00712 6.17069 5.98419C4.86978 5.27798 3.97773 4.01424 3.5317 2.41598C3.30868 1.63543 2.82549 1.15223 2.15644 1.15223C1.33873 1.15223 0.818359 1.78411 0.818359 2.63899C0.818359 5.16648 2.78832 7.58245 5.68749 8.69752L5.68617 8.70287ZM9.21853 6.57889C9.77603 4.01424 10.6681 2.78767 11.8575 2.78767C12.4894 2.78767 12.8982 3.15936 12.8982 3.8284C12.8982 5.05497 11.5973 6.50455 9.21853 6.57889Z"
                      fill="#0D0500"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links - Two columns */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/accessibility">Accessibility</FooterLink>
              <FooterLink href="/airline-aviation">Airline & Aviation</FooterLink>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <FooterLink href="/credit-cards-points">Credit Cards & Points</FooterLink>
              <FooterLink href="/hotel-trip-reports">Hotel & Trip Reports</FooterLink>
              <FooterLink href="/travel-hacks-deals">Travel Hacks & Deals</FooterLink>
            </div>
          </div>
        </div>

        {/* Subscribe Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-start items-start gap-6 bg-[#ECFDF5] p-6 rounded-xl">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch text-stone-950 text-base font-bold font-['Inter'] leading-normal">
              Subscribe
            </div>
            <div className="self-stretch text-stone-950 text-base font-bold font-['Inter'] leading-normal">
              Join our newsletter to stay up to date on features and releases.
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <div className="self-stretch flex flex-col sm:flex-row justify-start items-start gap-4">
              <div className="flex-1 px-3 py-2 bg-white/80 rounded-xl outline outline-1 outline-stone-950/20 flex justify-start items-center gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent outline-none text-stone-950 text-base font-bold font-['Inter'] leading-normal placeholder:text-stone-950/60"
                />
              </div>
              <OutlinedGradientButton type="submit">Subscribe</OutlinedGradientButton>
            </div>
            <div className="self-stretch text-stone-950 text-xs font-bold font-['Inter'] leading-none">
              By subscribing you agree to our Privacy Policy and consent to receive updates.
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="self-stretch flex flex-col justify-start items-start gap-8">
        <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-stone-950/20"></div>
        <div className="self-stretch flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          {/* Copyright and Policy Links */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">
              © 2024 MaxYourPoints. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-stone-950 text-sm font-bold font-['Inter'] underline leading-tight hover:text-orange-500"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-stone-950 text-sm font-bold font-['Inter'] underline leading-tight hover:text-orange-500"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-stone-950 text-sm font-bold font-['Inter'] underline leading-tight hover:text-orange-500"
              >
                Cookies Settings
              </Link>
              <Link
                href="/disclaimer"
                className="text-stone-950 text-sm font-bold font-['Inter'] underline leading-tight hover:text-orange-500"
              >
                Disclaimer
              </Link>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center items-start gap-3">
            <SocialIcon icon={<Facebook size={20} />} href="https://facebook.com" />
            <SocialIcon icon={<Instagram size={20} />} href="https://instagram.com" />
            <SocialIcon icon={<Twitter size={20} />} href="https://twitter.com" />
            <SocialIcon icon={<Linkedin size={20} />} href="https://linkedin.com" />
            <SocialIcon icon={<Youtube size={20} />} href="https://youtube.com" />
          </div>
        </div>

        {/* Built by IMP Digital Services */}
        <div className="self-stretch flex justify-center md:justify-end items-center pt-2">
          <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight">
            Built by IMP Digital Services
          </div>
        </div>
      </div>
    </footer>
  )
}

// Helper component for footer links
const FooterLink = ({ href, children }) => {
  return (
    <Link href={href} className="py-1 inline-flex justify-start items-start hover:text-orange-500 transition-colors">
      <div className="text-stone-950 text-sm font-bold font-['Inter'] leading-tight hover:text-orange-500">
        {children}
      </div>
    </Link>
  )
}

// Helper component for social media icons
const SocialIcon = ({ icon, href }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full hover:bg-stone-100 transition-colors"
      aria-label="Social media link"
    >
      <div className="text-stone-950">{icon}</div>
    </Link>
  )
}

export default Footer
