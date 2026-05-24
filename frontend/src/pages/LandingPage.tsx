import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import ThemeToggle from '../components/ui/ThemeToggle';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-background font-body-base transition-colors duration-300">
      
      {/* Premium Header */}
      <header className="absolute top-0 w-full z-20 bg-surface/80 backdrop-blur-md border-b-[3px] border-on-background">
        <div className="max-w-max-width mx-auto px-gutter-desktop h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-primary text-on-primary flex items-center justify-center rounded neo-border neo-shadow group-hover:-translate-y-1 transition-all duration-300">
              <Icon name="auto_awesome" className="w-6 h-6 fill-current" />
            </div>
            <span className="font-display-hero text-headline-lg font-extrabold uppercase tracking-tight text-on-surface">
              SlotSpark
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 font-label-bold text-on-surface uppercase tracking-widest">
            <Link to="/" className="border-b-[3px] border-on-surface pb-1">Home</Link>
            <Link to="/explore" className="hover:text-primary transition-colors pb-1">Explore Deals</Link>
            <a href="#how-it-works" className="hover:text-primary transition-colors pb-1">How it Works</a>
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <ThemeToggle />
            <Link to="/login" className="hidden md:block">
              <button className="px-6 py-3 bg-secondary text-on-secondary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                Partner Login
              </button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-on-surface p-2 neo-border rounded hover:bg-surface-variant"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name={isMobileMenuOpen ? "close" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-0 w-full bg-surface border-b-[3px] border-on-background flex flex-col p-6 gap-6 font-label-bold text-on-surface uppercase tracking-widest neo-shadow">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="border-b-[2px] border-transparent hover:border-primary pb-1 w-max">Home</Link>
            <Link to="/explore" onClick={() => setIsMobileMenuOpen(false)} className="border-b-[2px] border-transparent hover:border-primary pb-1 w-max">Explore Deals</Link>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="border-b-[2px] border-transparent hover:border-primary pb-1 w-max">How it Works</a>
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mt-4">
              <button className="w-full px-6 py-3 bg-secondary text-on-secondary font-label-bold uppercase tracking-widest rounded neo-border shadow-[2px_2px_0px_0px_var(--color-shadow)] active:translate-y-1 active:shadow-none transition-all">
                Partner Login
              </button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-32 overflow-hidden bg-transparent transition-colors duration-300">
        <div className="max-w-max-width mx-auto px-gutter-desktop relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary-container text-on-tertiary-container font-label-bold uppercase tracking-widest mb-8 rounded neo-border neo-shadow">
                <span className="w-2 h-2 bg-on-tertiary-container animate-pulse"></span>
                LIVE AVAILABILITY
              </div>
              <h1 className="font-display-hero text-display-lg text-on-surface tracking-tight leading-[1.1] mb-8 uppercase">
                Experience More.<br />
                <span className="bg-primary-container text-on-primary-container px-4 block w-max mt-2 neo-border">Spend Less.</span>
              </h1>
              <p className="font-body-lg text-on-surface-variant mb-12 max-w-xl">
                The premium deal marketplace connecting you with exclusive, real-time availability at top-tier establishments. Book instant slots and unlock exceptional value.
              </p>
              <div className="flex flex-wrap gap-6 mb-16">
                <Link to="/explore">
                  <button className="flex items-center gap-3 px-8 py-4 bg-primary text-on-primary font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all group">
                    Browse All Offers <Icon name="arrow_forward" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-8 py-4 bg-surface text-on-surface font-label-bold uppercase tracking-widest rounded neo-border neo-shadow hover:-translate-y-1 hover:neo-shadow-hover transition-all">
                    Partner with Us
                  </button>
                </Link>
              </div>
              <div className="flex items-center gap-12 border-t-[3px] border-on-surface pt-8">
                <div>
                  <div className="font-display-hero text-headline-lg text-on-surface mb-1">500+</div>
                  <div className="font-label-bold text-on-surface-variant uppercase tracking-widest">Premium Partners</div>
                </div>
                <div>
                  <div className="font-display-hero text-headline-lg text-on-surface mb-1">10k+</div>
                  <div className="font-label-bold text-on-surface-variant uppercase tracking-widest">Daily Slots</div>
                </div>
              </div>
            </motion.div>
            
            <Tilt
              className="relative lg:h-[600px] flex items-center justify-center w-full"
              perspective={1000}
              glareEnable={true}
              glareMaxOpacity={0.3}
              glareColor="#ffffff"
              glarePosition="all"
              scale={1.02}
              tiltMaxAngleX={4}
              tiltMaxAngleY={4}
              transitionSpeed={2000}
            >
              {/* Decorative background elements */}
              <motion.div 
                animate={{ y: [0, -15, 0], rotate: [-6, -2, -6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/20 rounded-lg blur-3xl transform"
              ></motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0], rotate: [3, 0, 3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 neo-border rounded-lg transform scale-105 bg-surface/50 backdrop-blur-sm neo-shadow"
              ></motion.div>
              
              {/* Main Image Container */}
              <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden rounded-lg neo-border neo-shadow bg-surface">
                <img 
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop" 
                  alt="Premium Restaurant Dining" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-transform duration-700 hover:scale-105"
                />
                {/* Floating UI Element */}
                <div className="absolute bottom-8 right-8 bg-surface p-6 flex items-center gap-6 rounded neo-border neo-shadow animate-bounce" style={{ animationDuration: '4s' }}>
                  <div className="w-14 h-14 bg-secondary text-on-secondary flex items-center justify-center rounded neo-border">
                    <Icon name="restaurant" className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="font-headline-md text-on-surface mb-2 uppercase">The Artisan Grill</div>
                    <div className="font-label-bold text-on-surface-variant flex items-center gap-2">
                      <span className="w-3 h-3 bg-secondary-container neo-border"></span> 2 Slots Available
                    </div>
                  </div>
                  <div className="ml-4 bg-tertiary text-on-tertiary font-headline-md px-3 py-1 neo-border">
                    -30%
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-surface-variant neo-border border-l-0 border-r-0 transition-colors duration-300">
        <div className="max-w-max-width mx-auto px-gutter-desktop text-center">
          <h2 className="font-display-hero text-headline-lg font-bold text-on-surface mb-20 uppercase tracking-tight">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Step 1 */}
            <div className="bg-surface rounded-lg neo-border neo-shadow p-10 relative mt-8 md:mt-0 text-left">
              <div className="absolute -top-8 left-8 w-16 h-16 bg-primary text-on-primary flex items-center justify-center rounded neo-border neo-shadow font-display-hero text-headline-lg">1</div>
              <h3 className="font-headline-md text-on-surface mt-6 mb-4 uppercase">Discover Deals</h3>
              <p className="font-body-md text-on-surface-variant">Browse our curated marketplace for real-time, time-based offers from top-tier partners in your area.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface rounded-lg neo-border neo-shadow p-10 relative mt-16 md:mt-0 md:translate-y-8 text-left">
              <div className="absolute -top-8 left-8 w-16 h-16 bg-secondary text-on-secondary flex items-center justify-center rounded neo-border neo-shadow font-display-hero text-headline-lg">2</div>
              <h3 className="font-headline-md text-on-surface mt-6 mb-4 uppercase">Book Instantly</h3>
              <p className="font-body-md text-on-surface-variant">Secure your slot with instant booking. No waiting, no hassle, just immediate confirmation of your reservation.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface rounded-lg neo-border neo-shadow p-10 relative mt-16 md:mt-0 text-left">
              <div className="absolute -top-8 left-8 w-16 h-16 bg-tertiary text-on-tertiary flex items-center justify-center rounded neo-border neo-shadow font-display-hero text-headline-lg">3</div>
              <h3 className="font-headline-md text-on-surface mt-6 mb-4 uppercase">Experience More</h3>
              <p className="font-body-md text-on-surface-variant">Enjoy your premium experience at a fraction of the cost, knowing your spot is guaranteed and pre-paid.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-background transition-colors duration-300">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-max-width mx-auto px-gutter-desktop text-center"
        >
          <h2 className="font-display-hero text-headline-lg text-on-background mb-6 uppercase tracking-tight inline-block bg-primary-container text-on-primary-container px-6 py-3 neo-border neo-shadow">Premium Categories</h2>
          <p className="font-body-lg text-on-surface-variant mb-20 max-w-2xl mx-auto">Discover exclusive time-based offers across our curated selection of top-tier partners.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/explore" className="bg-surface rounded-lg neo-border neo-shadow hover:neo-shadow-hover hover:-translate-y-2 p-10 transition-all group cursor-pointer">
              <div className="w-20 h-20 bg-primary-container text-on-primary-container flex items-center justify-center rounded mx-auto mb-8 neo-border neo-shadow group-hover:-translate-y-1 transition-transform">
                <Icon name="restaurant" className="w-10 h-10" />
              </div>
              <h3 className="font-headline-md text-on-surface mb-3 uppercase tracking-tight">Restaurants</h3>
              <p className="font-body-md text-on-surface-variant">Fine dining & casual eateries</p>
            </Link>

            <Link to="/explore" className="bg-surface rounded-lg neo-border neo-shadow hover:neo-shadow-hover hover:-translate-y-2 p-10 transition-all group cursor-pointer">
              <div className="w-20 h-20 bg-secondary-container text-on-secondary-container flex items-center justify-center rounded mx-auto mb-8 neo-border neo-shadow group-hover:-translate-y-1 transition-transform">
                <Icon name="fitness_center" className="w-10 h-10" />
              </div>
              <h3 className="font-headline-md text-on-surface mb-3 uppercase tracking-tight">Fitness</h3>
              <p className="font-body-md text-on-surface-variant">Studios & personal training</p>
            </Link>

            <Link to="/explore" className="bg-surface rounded-lg neo-border neo-shadow hover:neo-shadow-hover hover:-translate-y-2 p-10 transition-all group cursor-pointer">
              <div className="w-20 h-20 bg-tertiary-container text-on-tertiary-container flex items-center justify-center rounded mx-auto mb-8 neo-border neo-shadow group-hover:-translate-y-1 transition-transform">
                <Icon name="spa" className="w-10 h-10" />
              </div>
              <h3 className="font-headline-md text-on-surface mb-3 uppercase tracking-tight">Wellness</h3>
              <p className="font-body-md text-on-surface-variant">Salons & beauty treatments</p>
            </Link>

            <Link to="/explore" className="bg-surface rounded-lg neo-border neo-shadow hover:neo-shadow-hover hover:-translate-y-2 p-10 transition-all group cursor-pointer">
              <div className="w-20 h-20 bg-primary text-on-primary flex items-center justify-center rounded mx-auto mb-8 neo-border neo-shadow group-hover:-translate-y-1 transition-transform">
                <Icon name="medical_services" className="w-10 h-10" />
              </div>
              <h3 className="font-headline-md text-on-surface mb-3 uppercase tracking-tight">Clinics</h3>
              <p className="font-body-md text-on-surface-variant">Health & specialized care</p>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-variant py-16 neo-border border-l-0 border-r-0 border-b-0 text-center transition-colors duration-300">
        <div className="max-w-max-width mx-auto px-gutter-desktop">
          <div className="flex items-center justify-center gap-3 mb-10 text-on-surface">
            <Icon name="auto_awesome" className="w-8 h-8" />
            <span className="font-display-hero text-headline-md uppercase tracking-tight bg-primary text-on-primary px-3 py-1 rounded neo-border neo-shadow">SlotSpark</span>
          </div>
          <div className="flex items-center justify-center gap-10 font-label-bold text-on-surface uppercase tracking-widest mb-10">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
          <p className="font-label-bold text-on-surface-variant uppercase tracking-widest">&copy; 2026 SlotSpark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
