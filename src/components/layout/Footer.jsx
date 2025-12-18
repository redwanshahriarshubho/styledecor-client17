import { Link } from 'react-router-dom';
import { Palette, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="text-primary" size={32} />
              <span className="text-2xl font-bold">
                <span className="text-primary">Style</span>
                <span className="text-secondary">Decor</span>
              </span>
            </div>
            <p className="text-sm mb-4">
              Transform your spaces with our professional decoration services for homes, weddings, offices, and special events.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gray-800 hover:bg-primary border-none">
                <Facebook size={16} />
              </a>
              <a href="https://x.com/Shubho_17" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gray-800 hover:bg-primary border-none">
                <Twitter size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gray-800 hover:bg-primary border-none">
                <Instagram size={16} />
              </a>
              <a href="https://www.linkedin.com/in/redwan-shahriar-shubho-799532240/" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm bg-gray-800 hover:bg-primary border-none">
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition">Services</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition">Contact</Link>
              </li>
              <li>
                <Link to="/coverage-map" className="hover:text-primary transition">Coverage Map</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>• Home Decoration</li>
              <li>• Wedding Decoration</li>
              <li>• Office Decoration</li>
              <li>• Event Management</li>
              <li>• Seminar Setup</li>
              <li>• Custom Packages</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-primary mt-1" />
                <span>123 Decoration Street<br />Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-primary" />
                <span>+880 1401445752</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary" />
                <span>info@styledecor.com</span>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">Business Hours</h4>
              <p className="text-sm">Monday - Saturday: 9:00 AM - 8:00 PM</p>
              <p className="text-sm">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} StyleDecor. All rights reserved.</p>
          <p className="mt-1">Developed with ❤️ by <span className="font-semibold text-primary">Redwan Shahriar</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;