import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Navigation, Clock, Shield, Route } from 'lucide-react';

const Routes = () => {
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [routes, setRoutes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindRoutes = async (e) => {
    e.preventDefault();
    if (!startLocation || !destination) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRoutes({
        fastest: {
          duration: '4h 32m',
          distance: '287 km',
          traffic: 'Moderate',
          route: 'NH44 → State Highway 15 → City Ring Road'
        },
        safest: {
          duration: '5h 15m',
          distance: '312 km',
          safety_score: 92,
          route: 'Express Highway → Bypass Route → Local Roads',
          features: ['Well-lit roads', 'Police checkpoints', 'Rest stops']
        }
      });
      setIsLoading(false);
    }, 2000);
  };

  const SafetyScore = ({ score }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(220 20% 20%)"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="hsl(120 100% 50%)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 0 8px hsl(120 100% 50% / 0.3))' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Safe Directions
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">AI-powered route planning with safety insights</p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleFindRoutes}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass glass-hover p-8 rounded-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary w-5 h-5" />
              <input
                type="text"
                placeholder="Start Location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || !startLocation || !destination}
            className="w-full backdrop-blur-[20px] bg-primary/25 border border-primary/30 hover:bg-primary/35 hover:backdrop-blur-[25px] p-4 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Finding Routes...</span>
                </>
              ) : (
                <>
                  <Route className="w-5 h-5" />
                  <span>Find Routes</span>
                </>
              )}
            </span>
          </motion.button>
        </motion.form>

        {/* Results */}
        {routes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Fastest Route */}
            <div className="glass glass-hover p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl glow-primary">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">🚗 Fastest Route</h3>
                  <p className="text-muted-foreground">Quickest way to reach</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-2xl font-bold text-primary">{routes.fastest.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-xl font-semibold text-foreground">{routes.fastest.distance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Traffic</span>
                  <span className="text-secondary font-medium">{routes.fastest.traffic}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Route Preview:</p>
                  <p className="text-foreground">{routes.fastest.route}</p>
                </div>
              </div>
            </div>

            {/* Safest Route */}
            <div className="glass glass-hover p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
              
              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl glow-secondary">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">🛡️ Safest Route</h3>
                  <p className="text-muted-foreground">AI Recommended</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="text-xl font-semibold text-foreground">{routes.safest.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="text-xl font-semibold text-foreground">{routes.safest.distance}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Safety Score</span>
                  <SafetyScore score={routes.safest.safety_score} />
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Safety Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {routes.safest.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Map Placeholder */}
        {routes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass glass-hover p-8 rounded-2xl text-center"
          >
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl h-64 flex items-center justify-center border border-border">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Map</h3>
                <p className="text-muted-foreground">Google Maps integration coming soon</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Routes;