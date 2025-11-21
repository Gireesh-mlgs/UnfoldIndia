import { useLocation } from "react-router-dom";
import { useEffect } from "react";


const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="text-center glass glass-hover p-12 rounded-2xl max-w-md">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-block bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
