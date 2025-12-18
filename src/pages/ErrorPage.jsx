import { Link, useRouteError } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <Helmet>
        <title>Error - StyleDecor</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {error?.statusText || error?.message || 
              "The page you're looking for doesn't exist or has been moved."}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/" className="btn btn-primary gap-2">
              <Home size={20} />
              Go Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-outline gap-2">
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;