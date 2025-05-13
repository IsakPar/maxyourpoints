import Navbar from "../components/Navbar/Navbar.jsx";
import Header from "../components/Header/Header.js";
import HeaderContent from "../components/HeaderContent/HeaderContent.js";
import BlogShowcase from "../components/BlogShowcase/BlogShowcase.js";
import BlogCarousel from "../components/BlogCarousel/BlogCarousel.jsx";
import CTASection from "../components/CTASection/CTASection.jsx";
import Footer from "../components/Footer/Footer.jsx";
import VideoButton from "../components/VideoButton/VideoButton.js";

function HomePage() {
  return (
    <div>
      <Navbar />
      <Header />
      <HeaderContent />
      <BlogShowcase />
      <BlogCarousel />
      <CTASection />
      <VideoButton />
      <Footer />
    </div>
  );
}

export default HomePage; 