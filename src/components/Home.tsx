import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs';
import { useQuery } from '@tanstack/react-query';
import { stripeAPI } from '../services/api';
import { 
  ArrowRight, 
  CheckCircle, 
  Star,
  FileText,
  Zap,
  Clock,
  Mail,
  Sparkles,
  Eye,
  BarChart3,
  Users,
  Globe,
  Settings,
  FolderOpen,
  Tag,
  Cog,
  Play
} from 'lucide-react';
import ThreeBackground from './ThreeBackground';
import Logo from './Logo';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const pricingRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const gearRef = useRef<HTMLDivElement>(null);
  const gearRef2 = useRef<HTMLDivElement>(null);
  const gearRef3 = useRef<HTMLDivElement>(null);
  const invoiceAnimationRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const [isGearOpen, setIsGearOpen] = useState(false);

  // Fetch products from Stripe API
  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['stripe-products'],
    queryFn: () => stripeAPI.getProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Track mouse movement for interactive animations
  useEffect(() => {
    const handleMouseMove = () => {
      // setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Real features based on actual system
  const features = [
    {
      icon: Mail,
      title: 'Gmail Integration',
      description: 'Automatically scan your Gmail accounts for invoice emails in real-time',
      highlight: 'Auto-Scan'
    },
    {
      icon: Zap,
      title: 'AI Data Extraction',
      description: 'Extract vendor names, amounts, dates, and invoice numbers automatically',
      highlight: 'AI-Powered'
    },
    {
      icon: FolderOpen,
      title: 'Google Drive Storage',
      description: 'Invoices automatically saved and organized in your Google Drive',
      highlight: 'Auto-Save'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share invoice management with team members via Google Groups',
      highlight: 'Team Ready'
    },
    {
      icon: Tag,
      title: 'Smart Categorization',
      description: 'Automatic tagging and categorization of invoices by vendor and type',
      highlight: 'Smart Tags'
    },
    {
      icon: BarChart3,
      title: 'Real-time Dashboard',
      description: 'Track pending, processed invoices with status updates and analytics',
      highlight: 'Live Data'
    }
  ];

  // Transform Stripe products to match our UI format
  const pricingPlans = productsData?.products?.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    period: product.recurring ? '/month' : '',
    description: product.description || '',
    features: product.features || [],
    popular: product.popular || false,
    cta: product.price === 'Contact Sales' ? 'Contact Sales' : 'Start Free Trial',
    price_id: product.price_id
  })) || [];

  // Fallback static data if API fails
  const fallbackPricingPlans = [
    {
      name: 'Starter',
      price: '$19',
      period: '/month',
      description: 'Perfect for small businesses',
      features: [
        '3 email connections',
        'AI-powered invoice processing',
        'Google Drive integration',
        'Email support'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Business',
      price: '$50',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        '10 email connections',
        'AI-powered invoice processing',
        'Google Drive integration',
        'Priority email support'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '$100',
      period: '/month',
      description: 'For established organizations',
      features: [
        '30 email connections',
        'AI-powered invoice processing',
        'Google Drive integration',
        'Priority email support'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: '$200',
      period: '/month',
      description: 'For large scale operations',
      features: [
        'Unlimited email connections',
        'AI-powered invoice processing',
        'Google Drive integration',
        'Dedicated support'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  // Use dynamic data if available, otherwise fallback to static
  const displayPricingPlans = pricingPlans.length > 0 ? pricingPlans : fallbackPricingPlans;

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Accounting Manager',
      company: 'TechStart Inc.',
      content: 'The Gmail integration saves us 15 hours per week. Invoices are automatically categorized and stored in our Google Drive. Game changer!',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'CFO',
      company: 'GrowthCorp',
      content: 'AI extraction is incredibly accurate. No more manual data entry. Our team collaboration through Google Groups is seamless.',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'Operations Director',
      company: 'ScaleUp Solutions',
      content: 'Setup took literally 30 seconds. Connected our Gmail, and invoices started flowing into organized folders automatically.',
      rating: 5
    }
  ];

  const stats = [
    { label: 'Setup Time', value: '30 sec', icon: Clock },
    { label: 'Detection Rate', value: 'Auto', icon: Eye },
    { label: 'Google Integration', value: '100%', icon: Globe }
  ];

  // Enhanced Gear Click Handler with cool animations
  const handleGearClick = () => {
    if (gearRef.current) {
      const timeline = anime.timeline({
        complete: () => setIsGearOpen(!isGearOpen)
      });

      if (!isGearOpen) {
        // Opening animation - gear spins and expands, revealing features
        timeline
          .add({
            targets: gearRef.current,
            rotate: '+=720deg',
            scale: [1, 1.5, 1.2],
            duration: 1000,
            easing: 'easeOutElastic(1, .6)'
          })
          .add({
            targets: '.gear-feature',
            opacity: [0, 1],
            scale: [0, 1],
            translateY: [-50, 0],
            duration: 500,
            delay: anime.stagger(100),
            easing: 'easeOutBounce'
          }, '-=500')
          .add({
            targets: '.floating-icons',
            opacity: [0, 1],
            scale: [0, 1],
            duration: 800,
            delay: anime.stagger(50),
            easing: 'easeOutElastic(1, .8)'
          }, '-=300');
      } else {
        // Closing animation
        timeline
          .add({
            targets: '.gear-feature',
            opacity: [1, 0],
            scale: [1, 0],
            duration: 300,
            delay: anime.stagger(50, {start: 200})
          })
          .add({
            targets: '.floating-icons',
            opacity: [1, 0],
            scale: [1, 0],
            duration: 300,
            delay: anime.stagger(30)
          }, '-=200')
          .add({
            targets: gearRef.current,
            rotate: '+=360deg',
            scale: [1.2, 1],
            duration: 500,
            easing: 'easeInOutQuart'
          }, '-=100');
      }
    }
  };

  useEffect(() => {
    // Continuous gear rotation
    if (gearRef.current) {
      anime({
        targets: gearRef.current,
        rotate: '360deg',
        duration: 8000,
        loop: true,
        easing: 'linear'
      });
    }

    // Secondary gears with different speeds
    if (gearRef2.current) {
      anime({
        targets: gearRef2.current,
        rotate: '-360deg',
        duration: 12000,
        loop: true,
        easing: 'linear'
      });
    }

    if (gearRef3.current) {
      anime({
        targets: gearRef3.current,
        rotate: '360deg',
        duration: 6000,
        loop: true,
        easing: 'linear'
      });
    }

    // Floating icons animation
    anime({
      targets: '.floating-icon',
      translateY: [0, -10, 0],
      duration: 3000,
      loop: true,
      delay: anime.stagger(200),
      easing: 'easeInOutSine'
    });

    // Enhanced Invoice flow animation
    if (invoiceAnimationRef.current) {
      anime({
        targets: '.invoice-item',
        translateX: ['-100px', 'calc(100vw + 100px)'],
        opacity: [0, 1, 1, 0],
        duration: 8000,
        loop: true,
        delay: anime.stagger(2000),
        easing: 'easeInOutQuart'
      });
    }

    // Sparkle effects
    anime({
      targets: '.sparkle',
      scale: [0, 1, 0],
      opacity: [0, 1, 0],
      duration: 2000,
      loop: true,
      delay: anime.stagger(300),
      easing: 'easeInOutSine'
    });

    // Hero entrance animations
    if (heroRef.current) {
      const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 800
      });

      timeline
      .add({
        targets: '.hero-badge',
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.8, 1],
        duration: 600
      })
      .add({
        targets: '.hero-title',
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 800,
        delay: 200
      }, '-=400')
      .add({
        targets: '.hero-description',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 200
      }, '-=300')
      .add({
        targets: '.hero-buttons',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: 100
      }, '-=200')
      .add({
        targets: '.hero-stats',
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        delay: anime.stagger(100)
      }, '-=100');
    }

    // GSAP ScrollTrigger animations
    if (featuresRef.current) {
      gsap.set('.feature-card', { y: 60, opacity: 0 });
      gsap.to('.feature-card', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
        }
      });
    }

    if (pricingRef.current) {
      gsap.set('.pricing-card', { y: 80, opacity: 0, scale: 0.95 });
      gsap.to('.pricing-card', {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: pricingRef.current,
          start: 'top 75%',
        }
      });
    }

    if (testimonialsRef.current) {
      gsap.set('.testimonial-card', { x: -60, opacity: 0 });
      gsap.to('.testimonial-card', {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 75%',
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Three.js Background */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        {/* Floating Animation Elements */}
        <div ref={floatingElementsRef} className="fixed inset-0 pointer-events-none z-20">
          {/* Floating Icons */}
          <div className="floating-icon absolute top-20 left-10 opacity-40">
            <Mail className="w-8 h-8 text-blue-500 filter drop-shadow-lg" />
          </div>
          <div className="floating-icon absolute top-40 right-20 opacity-40">
            <Zap className="w-10 h-10 text-yellow-500 filter drop-shadow-lg" />
          </div>
          <div className="floating-icon absolute bottom-40 left-20 opacity-40">
            <FileText className="w-9 h-9 text-green-500 filter drop-shadow-lg" />
          </div>
          
          {/* Sparkles */}
          <div className="sparkle absolute top-32 left-1/4">
            <Sparkles className="w-6 h-6 text-purple-400 filter drop-shadow-lg" />
          </div>
          <div className="sparkle absolute top-64 right-1/3">
            <Sparkles className="w-5 h-5 text-pink-400 filter drop-shadow-lg" />
          </div>
          <div className="sparkle absolute bottom-32 left-1/3">
            <Sparkles className="w-7 h-7 text-blue-400 filter drop-shadow-lg" />
          </div>
        </div>
        
        {/* Navigation Header */}
        <header className="relative z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo size="md" />
              
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-all font-medium hover:scale-105 transform">Features</a>
                <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-all font-medium hover:scale-105 transform">Pricing</a>
                <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-all font-medium hover:scale-105 transform">Reviews</a>
              </nav>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 transition-all font-medium hover:scale-105 transform"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section ref={heroRef} className="relative pt-20 pb-20 lg:pt-28 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-5xl mx-auto">
              {/* Interactive Animated Gears */}
              <div className="absolute top-10 right-10 z-30">
                <div 
                  ref={gearRef} 
                  onClick={handleGearClick}
                  className="cursor-pointer transform hover:scale-110 transition-transform duration-200 filter drop-shadow-2xl"
                >
                  <Settings className="w-20 h-20 text-indigo-500 hover:text-indigo-600" />
                </div>
                
                {/* Additional decorative gears */}
                <div ref={gearRef2} className="absolute -top-8 -left-8 opacity-60">
                  <Cog className="w-12 h-12 text-purple-500 filter drop-shadow-lg" />
                </div>
                <div ref={gearRef3} className="absolute top-12 left-12 opacity-70">
                  <Cog className="w-10 h-10 text-blue-500 filter drop-shadow-lg" />
                </div>
              </div>

              {/* Gear Features Panel */}
              {isGearOpen && (
                <div className="absolute top-20 right-40 z-40 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <div className="gear-feature flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 cursor-pointer transition-all">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Connect Gmail</span>
                    </div>
                    <div className="gear-feature flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 cursor-pointer transition-all">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">View Dashboard</span>
                    </div>
                    <div className="gear-feature flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 cursor-pointer transition-all">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Settings</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Invoice Flow Animation */}
              <div ref={invoiceAnimationRef} className="absolute top-20 left-0 w-full overflow-hidden opacity-40 pointer-events-none">
                <div className="invoice-item absolute top-0 left-0">
                  <FileText className="w-10 h-10 text-indigo-500 filter drop-shadow-lg" />
                </div>
                <div className="invoice-item absolute top-4 left-0">
                  <FileText className="w-8 h-8 text-purple-500 filter drop-shadow-lg" />
                </div>
                <div className="invoice-item absolute top-8 left-0">
                  <FileText className="w-9 h-9 text-blue-500 filter drop-shadow-lg" />
                </div>
              </div>

              <div className="hero-badge inline-flex items-center px-6 py-3 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-8 border border-indigo-300/50 dark:border-indigo-700/50 shadow-xl">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                Gmail-powered invoice automation
              </div>

              <h1 className="hero-title text-5xl sm:text-6xl lg:text-8xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Automate Your
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Invoice Management
                </span>
              </h1>

              <p className="hero-description text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                Connect your Gmail, let AI extract invoice data, and watch as everything gets automatically organized in Google Drive. Setup takes 30 seconds.
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <Link
                  to="/login"
                  className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <button className="group bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300/50 dark:border-gray-600/50 text-gray-900 dark:text-gray-200 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center shadow-xl hover:shadow-2xl transform hover:scale-105">
                  <Play className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform" />
                  Watch Demo
                </button>
              </div>

              {/* Enhanced Stats */}
              <div className="hero-stats grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                    <stat.icon className="w-10 h-10 text-indigo-500 mx-auto mb-3 filter drop-shadow-lg" />
                    <div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent dark:via-gray-900/30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                Three simple steps to automated invoice management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: Mail,
                  title: 'Connect Gmail',
                  description: 'Securely connect your Gmail account with OAuth authentication'
                },
                {
                  step: '02',
                  icon: Zap,
                  title: 'AI Scanning',
                  description: 'Our AI automatically scans and extracts invoice data from emails'
                },
                {
                  step: '03',
                  icon: FolderOpen,
                  title: 'Auto-Organize',
                  description: 'Invoices are automatically saved and organized in Google Drive'
                }
              ].map((process, index) => (
                <div key={index} className="bg-white/90 dark:bg-gray-800/90 p-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all border border-gray-200/50 dark:border-gray-700/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl transform hover:rotate-12 transition-transform">
                    <process.icon className="w-10 h-10" />
                  </div>
                  <div className="text-sm font-black text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text mb-2">
                    STEP {process.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
              <span className="block text-indigo-600 dark:text-indigo-400">Gmail → AI → Drive</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real features that actually work with your existing Gmail and Google Drive setup
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card group">
                  <div className="h-full p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl">
                    <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <span className="text-xs font-semibold px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
                        {feature.highlight}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple pricing
              <span className="block text-indigo-600 dark:text-indigo-400">that scales with you</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your email connection needs. All plans include AI-powered invoice processing.
            </p>
          </div>
          
          {productsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading pricing plans...</span>
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Failed to load pricing plans. Showing default plans.</p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {displayPricingPlans.map((plan, index) => (
                  <div key={index} className={`pricing-card relative ${plan.popular ? 'lg:scale-105' : ''}`}>
                    <div className={`h-full p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                      plan.popular 
                        ? 'border-indigo-500 shadow-lg' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                    }`}>
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                        
                        <div className="mb-8">
                          <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                          <span className="text-gray-500 dark:text-gray-400 ml-1 text-lg">{plan.period}</span>
                        </div>
                        
                        <ul className="space-y-4 mb-8 text-left">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                          plan.popular
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}>
                          {plan.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {displayPricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card relative ${plan.popular ? 'lg:scale-105' : ''}`}>
                <div className={`h-full p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-indigo-500 shadow-lg' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1 text-lg">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/login"
                    className={`w-full block text-center py-4 px-6 rounded-xl font-bold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" ref={testimonialsRef} className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Real users,
              <span className="block text-indigo-600 dark:text-indigo-400">real results</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how freelancers and businesses use our Gmail invoice scanner
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="h-full p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-indigo-600 dark:bg-indigo-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to automate your
            <span className="block">invoice management?</span>
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-3xl mx-auto">
            Connect your Gmail account now and start scanning for invoices automatically. Free 14-day trial, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Connect Gmail & Start Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-indigo-600 transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="mb-6">
                <Logo size="sm" showText={true} />
              </div>
              <p className="text-gray-400 leading-relaxed">
                Automatically scan Gmail for invoices and organize them in Google Drive with AI-powered data extraction.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gmail Integration</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Google Drive</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Invoice Manager. All rights reserved. Gmail integration for invoice automation.</p>
          </div>
        </div>
      </footer>

      </div>
    </div>
  );
};

export default Home; 