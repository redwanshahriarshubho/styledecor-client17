import { Helmet } from 'react-helmet-async';
import { Award, Users, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - StyleDecor</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-primary to-secondary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About StyleDecor</h1>
            <p className="text-lg opacity-90">Transforming spaces, creating memories</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                StyleDecor was founded with a simple mission: to make professional decoration services accessible to everyone. We believe that every space deserves to be beautiful, and every occasion deserves to be memorable.
              </p>
              <p className="text-gray-600 mb-4">
                With years of experience in the decoration industry, we've helped thousands of clients transform their homes, offices, and event venues into stunning spaces that reflect their unique style and vision.
              </p>
              <p className="text-gray-600">
                Our team of expert decorators brings creativity, professionalism, and attention to detail to every project, ensuring that your vision becomes a reality.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop"
                alt="Our team"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">50+</h3>
              <p className="text-gray-600">Expert Decorators</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">98%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-2">1000+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Quality</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Every project receives our full attention and commitment to excellence.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-secondary">Creativity</h3>
                <p className="text-gray-600">
                  We bring fresh, innovative ideas to every project, ensuring your space is unique and memorable.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-accent">Trust</h3>
                <p className="text-gray-600">
                  We build lasting relationships with our clients based on transparency, reliability, and trust.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16 pt-8 border-t">
            <p className="text-gray-600 mb-2">Project Developed By</p>
            <h3 className="text-2xl font-bold text-primary">Redwan Shahriar</h3>
            <p className="text-gray-600 mt-2">Full Stack Web Developer</p>
            <div className="flex justify-center gap-4 mt-4">
              <a href="https://github.com/redwanshahriar" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/redwan-shahriar-shubho-799532240/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                LinkedIn
              </a>
              <a href="https://x.com/Shubho_17" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Twitter
              </a>
              <a href="mailto:redwanshahriarshubho.1789@gmail.com" className="btn btn-outline btn-sm">
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;