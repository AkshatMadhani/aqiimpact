import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calculator, Map, Shield, ArrowRight, Sparkles, TrendingUp, 
  Users, Heart, Wind, Zap, ChevronDown, Star, Award, 
  Activity, Navigation, CheckCircle, ChevronRight, Lock, Twitter, Linkedin, Github
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FeatureCard = ({ feature, index, isAuthenticated }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const colors = [
    { bg: '#E8F4FF', accent: '#B6E0FF', icon: '#4DA6FF' },
    { bg: '#FFE8EC', accent: '#FFB6C1', icon: '#FF69B4' },
    { bg: '#E8FFE8', accent: '#B6FFB6', icon: '#4CAF50' },
  ];
  const color = colors[index % colors.length];

  const handleClick = (e) => {
    e.preventDefault();
    
    // All features require login now (no public features)
    if (!isAuthenticated) {
      toast.error('🔒 Please login to access this feature');
      navigate('/login');
    } else {
      navigate(feature.link);
    }
  };

  const isLocked = !isAuthenticated;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <motion.div
        className={`relative bg-white rounded-3xl p-8 h-full border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] transition-all duration-300 ${
          isLocked ? 'opacity-75' : 'hover:shadow-[8px_8px_0px_0px_#111827]'
        }`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: isLocked ? 0 : -5 }}
        style={{ background: `linear-gradient(135deg, white 0%, ${color.bg} 100%)` }}
      >
        {isLocked && (
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-300 p-2 rounded-full border-2 border-gray-900">
              <Lock className="w-4 h-4 text-gray-900" />
            </div>
          </div>
        )}
        
        <div className="absolute top-4 left-4 text-sm font-bold text-gray-900/30">0{index + 1}</div>
        <motion.div
          className="relative w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-gray-900 mb-6 overflow-hidden"
          animate={isHovered && !isLocked ? { rotate: 360 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 opacity-50" style={{ background: `linear-gradient(135deg, ${color.bg} 0%, ${color.accent} 100%)` }} />
          <feature.icon className="w-8 h-8 relative z-10" style={{ color: color.icon }} />
        </motion.div>
        <div className="relative">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
          <p className="text-gray-700 mb-6 leading-relaxed">{feature.description}</p>
          <ul className="space-y-2 mb-6">
            {feature.benefits.map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4" style={{ color: color.icon }} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 text-gray-900 font-medium hover:gap-3 transition-all"
          >
            <span className="relative">
              {isLocked ? (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Login to Access
                </span>
              ) : 'Explore Feature'}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-[2px]"
                style={{ background: color.accent }}
                initial={{ width: 0 }}
                animate={isHovered ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.3 }}
              />
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-gray-900"
          style={{ background: color.accent }}
          animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
};

const FloatingElement = ({ children, className, delay = 0 }) => (
  <motion.div
    className={className}
    animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 6, repeat: Infinity, delay }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const features = [
    {
      value: 'exposure',
      icon: Calculator,
      title: 'Personal Exposure Calculator',
      description: 'Get real-time personalized air pollution exposure based on your activity, health profile, and location.',
      link: '/exposure',
      benefits: ['AI-powered recommendations', 'Health-specific insights', 'Real-time AQI data'],
    },
    {
      value: 'routes',
      icon: Map,
      title: 'Smart Route Finder',
      description: 'Find the cleanest air route between any two locations with automatic path generation and map visualization.',
      link: '/routes',
      benefits: ['Compare multiple routes', 'Map visualization', 'Time & AQI balance'],
    },
    {
      value: 'monitoring',
      icon: Activity,
      title: 'Real-Time Air Quality Monitoring',
      description: 'Track air quality in real-time across multiple locations with live AQI updates and pollution alerts.',
      link: '/exposure',
      benefits: ['Live AQI updates', 'Multiple locations', 'Pollution alerts'],
    },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users', color: 'from-blue-400 to-blue-600' },
    { icon: Activity, value: '1M+', label: 'Routes Calculated', color: 'from-purple-400 to-purple-600' },
    { icon: Navigation, value: '200+', label: 'Cities Covered', color: 'from-pink-400 to-pink-600' },
    { icon: TrendingUp, value: '98%', label: 'Accuracy Rate', color: 'from-green-400 to-green-600' },
  ];

  const howItWorks = [
    { step: '01', icon: Users, title: 'Create Account', description: 'Sign up for free in seconds. No credit card required.' },
    { step: '02', icon: Calculator, title: 'Enter Details', description: 'Add your health profile and activity information.' },
    { step: '03', icon: Activity, title: 'Get Insights', description: 'Receive personalized air quality exposure analysis.' },
    { step: '04', icon: Navigation, title: 'Take Action', description: 'Make informed decisions with AI-powered recommendations.' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Fitness Enthusiast', text: 'AirImpact helps me plan my morning runs on the cleanest routes. Game changer!', rating: 5 },
    { name: 'Michael Chen', role: 'Parent', text: 'As a parent, knowing the air quality before taking my kids outside gives me peace of mind.', rating: 5 },
    { name: 'Dr. Patel', role: 'Healthcare Professional', text: 'I recommend this to my patients with respiratory conditions. The data is accurate and actionable.', rating: 5 },
  ];

  return (
    <div className="bg-white">
      <section className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        </div>
        <FloatingElement className="absolute top-20 left-10 opacity-20" delay={0}>
          <Star className="w-24 h-24 text-white fill-white" />
        </FloatingElement>
        <FloatingElement className="absolute bottom-20 right-20 opacity-20" delay={1}>
          <Wind className="w-32 h-32 text-white" />
        </FloatingElement>
        <FloatingElement className="absolute top-1/2 right-10 opacity-20" delay={2}>
          <Zap className="w-20 h-20 text-white" />
        </FloatingElement>

        <div className="container mx-auto px-6 relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/30">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">Powered by AI & Real-time Data</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Breathe <span className="text-yellow-300">Smarter</span><br />
              Trust What You Breathe
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Your intelligent companion for navigating air quality. Calculate exposure, find clean routes, and make informed decisions to protect your health.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="bg-yellow-300/20 backdrop-blur-sm border-2 border-yellow-300 rounded-2xl px-6 py-3 mb-8 inline-block">
                <p className="text-white font-bold text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign up to unlock all features!
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl text-lg font-black border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 flex items-center gap-2 justify-center">
                      <Zap className="w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="bg-white/20 backdrop-blur-md text-white font-bold py-4 px-8 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200 text-lg flex items-center gap-2 justify-center">
                      <User className="w-5 h-5" />
                      Sign In
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link to="/exposure">
                  <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl text-lg font-black border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 flex items-center gap-2 justify-center">
                    <Calculator className="w-5 h-5" />
                    Calculate Exposure
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="font-semibold">Free Forever</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="font-semibold">No Credit Card Required</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span className="font-semibold">Real-time Data</span></div>
            </motion.div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -5, scale: 1.05 }}>
                <div className="bg-white rounded-3xl p-6 text-center border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[8px_8px_0px_0px_#111827] transition-all duration-300">
                  <div className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-gray-900`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-gray-900 rounded-full px-4 py-2 mb-4 shadow-[2px_2px_0px_0px_#111827]">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-gray-900 font-semibold">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Three powerful tools to help you breathe cleaner air and make informed decisions</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={feature.value} feature={feature} index={index} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-gray-900 rounded-full px-4 py-2 mb-4 shadow-[2px_2px_0px_0px_#111827]">
              <Navigation className="w-5 h-5 text-blue-500" />
              <span className="text-gray-900 font-semibold">How It Works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Four simple steps to start protecting your health</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[8px_8px_0px_0px_#111827] transition-all duration-300 text-center relative">
                  <div className="absolute top-4 right-4 text-6xl font-black text-gray-100">{item.step}</div>
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-gray-900 relative z-10">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{item.title}</h4>
                  <p className="text-gray-600 relative z-10">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white border-2 border-gray-900 rounded-full px-4 py-2 mb-4 shadow-[2px_2px_0px_0px_#111827]">
              <Heart className="w-5 h-5 text-red-500" /><span className="text-gray-900 font-semibold">Loved by Users</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What People Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} whileHover={{ y: -10 }}>
                <div className="bg-white rounded-3xl p-8 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[8px_8px_0px_0px_#111827] transition-all duration-300 h-full">
                  <div className="flex space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-400 to-purple-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-gray-900">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-4xl mx-auto">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block mb-8">
              <Award className="w-20 h-20 text-yellow-300" />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">Ready to Breathe Easier?</h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10">
              Join thousands of users who are making smarter decisions about their air quality exposure. Start your journey to healthier breathing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register">
                    <motion.button className="bg-yellow-300 px-10 py-5 rounded-2xl text-xl font-bold text-gray-900 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 flex items-center gap-2 justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Create Free Account<ArrowRight className="w-6 h-6" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button className="bg-white/20 backdrop-blur-md text-white font-semibold py-5 px-10 rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-200 text-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      Sign In Now
                    </motion.button>
                  </Link>
                </>
              ) : (
                <Link to="/exposure">
                  <motion.button className="bg-yellow-300 px-10 py-5 rounded-2xl text-xl font-bold text-gray-900 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all duration-200 flex items-center gap-2 justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Start Calculating<ArrowRight className="w-6 h-6" />
                  </motion.button>
                </Link>
              )}
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span>Free Forever</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span>No Credit Card Required</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /><span>Real-time Data</span></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-xl border-2 border-white">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold">Air<span className="text-yellow-300">Impact</span></span>
              </div>
              <p className="text-gray-400 mb-6">Your intelligent companion for navigating air quality. Making air pollution data accessible and actionable for everyone.</p>
              <div className="flex gap-4">
                <motion.a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center transition-colors"
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/exposure" className="text-gray-400 hover:text-white transition-colors">Exposure Calculator</Link></li>
                <li><Link to="/routes" className="text-gray-400 hover:text-white transition-colors">Route Finder</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About AQI</a></li>
                <li><a href="#guidelines" className="text-gray-400 hover:text-white transition-colors">Health Guidelines</a></li>
                <li><a href="mailto:support@airimpact.com" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2026 AirImpact. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;