import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Navigation as NavigationIcon, Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import indiaMap from '@/assets/india-map.png';

const Home = () => {
  const [mapImage, setMapImage] = useState(indiaMap);

  useEffect(() => {
    // Check if custom map exists in public folder
    const checkCustomMap = async () => {
      try {
        const response = await fetch('/custom-map.png');
        if (response.ok) {
          setMapImage('/custom-map.png');
        }
      } catch (error) {
        // If custom map doesn't exist, use default
        setMapImage(indiaMap);
      }
    };
    
    checkCustomMap();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0, scale: 0.8 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.08,
      y: -8,
      rotateX: 5,
      transition: {
        duration: 0.4,
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    },
    tap: {
      scale: 0.95,
      y: 0,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: Languages,
      title: 'Translator',
      description: 'Translate text to multiple Indian languages instantly',
      path: '/translator',
      gradient: 'from-primary to-accent'
    },
    {
      icon: NavigationIcon,
      title: 'Safe Directions',
      description: 'AI-powered route planning with safety recommendations',
      path: '/routes',
      gradient: 'from-secondary to-primary'
    },
    {
      icon: MessageCircle,
      title: 'AI Chatbot',
      description: 'Your intelligent travel companion for India',
      path: '/chatbot',
      gradient: 'from-accent to-secondary'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
      {/* Hero Background */}
      <div className="absolute inset-0 hero-gradient opacity-20" />
      
      {/* India Map Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={mapImage} 
          alt="India Map" 
          className="w-full h-full opacity-10 object-cover"
        />
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center max-w-6xl mx-auto"
      >
        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Unfold India
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Travel Smart. Travel Safe. Travel with AI.
        </motion.p>

        {/* Feature Buttons */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <Link key={feature.path} to={feature.path}>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="group relative backdrop-blur-[20px] bg-white/15 rounded-2xl p-8 text-center overflow-hidden hover:backdrop-blur-[30px] hover:bg-white/25 hover:brightness-110 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
              >
                {/* Subtle Glow Effect on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 ease-out bg-gradient-to-br ${feature.gradient} blur-3xl`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient}`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-foreground transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground transition-all duration-300 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Enhanced Floating Elements */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/30 to-accent/20 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1, 0.8, 1.3, 1],
            x: [0, -40, 20, 0],
            y: [0, 30, -15, 0]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.33, 0.66, 1]
          }}
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-secondary/30 to-primary/20 rounded-full blur-2xl"
        />
        
        <motion.div
          animate={{ 
            rotate: 180,
            scale: [1, 1.5, 0.8, 1],
            opacity: [0.3, 0.6, 0.2, 0.3]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-accent/40 to-secondary/30 rounded-full blur-xl"
        />
      </motion.div>
    </div>
  );
};

export default Home;