import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import TopDecoratorsSection from '../components/home/TopDecoratorsSection';
import CoverageMapSection from '../components/home/CoverageMapSection';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home - StyleDecor | Professional Decoration Services</title>
      </Helmet>
      
      <div>
        <HeroSection />
        <ServicesSection />
        <TopDecoratorsSection />
        <CoverageMapSection />
      </div>
    </>
  );
};

export default Home;