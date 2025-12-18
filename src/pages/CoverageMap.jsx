import { Helmet } from 'react-helmet-async';
import CoverageMapSection from '../components/home/CoverageMapSection';

const CoverageMap = () => {
  return (
    <>
      <Helmet>
        <title>Service Coverage Map - StyleDecor</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Service Coverage Area</h1>
            <p className="text-lg opacity-90">We serve across Dhaka and surrounding areas</p>
          </div>
        </div>

        <div className="py-8">
          <CoverageMapSection />
        </div>
      </div>
    </>
  );
};

export default CoverageMap;