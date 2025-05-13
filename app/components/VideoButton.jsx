const VideoButton = ({ position = { left: "620px", top: "252px" }, onClick }) => {
  return (
    <div className="video-button-container w-48 h-40 absolute" style={{ left: position.left, top: position.top }}>
      <div data-svg-wrapper className="absolute left-0 top-0">
        <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 0H180C191.046 0 200 8.954 200 20V140C200 151.046 191.046 160 180 160H20C8.954 160 0 151.046 0 140V20C0 8.954 8.954 0 20 0ZM91.7 112.2L130.6 86.2C132.696 84.834 133.96 82.502 133.96 80C133.96 77.498 132.696 75.166 130.6 73.8L91.7 47.8C89.403 46.248 86.438 46.089 83.988 47.387C81.539 48.685 80.005 51.228 80 54V106C80.005 108.772 81.539 111.315 83.988 112.613C86.438 113.911 89.403 113.752 91.7 112.2Z"
            fill="black"
            fillOpacity="0.15"
          />
        </svg>
      </div>
      <div data-svg-wrapper className="absolute" style={{ left: "68px", top: "48px" }}>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.33301 32.0002C5.33301 17.2726 17.2721 5.3335 31.9997 5.3335C39.0721 5.3335 45.8549 8.14302 50.8559 13.144C55.8568 18.145 58.6663 24.9278 58.6663 32.0002C58.6663 46.7278 46.7273 58.6669 31.9997 58.6669C17.2721 58.6669 5.33301 46.7278 5.33301 32.0002ZM27.1198 43.4136L42.6664 33.7069C43.2482 33.3343 43.6001 32.6911 43.6001 32.0002C43.6001 31.3094 43.2482 30.6661 42.6664 30.2936L27.0664 20.5869C26.452 20.1995 25.6758 20.1757 25.0388 20.5246C24.4018 20.8736 24.004 21.5405 23.9998 22.2669V41.7336C23.9912 42.4776 24.3963 43.1649 25.0514 43.5176C25.7065 43.8704 26.5033 43.8303 27.1198 43.4136Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  )
}

export default VideoButton
