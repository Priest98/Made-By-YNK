/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from "motion/react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Lenis from "lenis";
import { 
  Instagram, 
  ArrowRight, 
  MessageCircle, 
  Menu, 
  X, 
  Clock, 
  MapPin, 
  Plus,
} from "lucide-react";

// --- Motion System Upgrade (Luxury Behavioral) ---

const luxuryEase = [0.22, 1, 0.36, 1]; // Slow start -> gentle settle
const luxuryHoverEase = [0.33, 1, 0.68, 1]; // Smooth acceleration

const luxuryEntrance = { 
  duration: 1.4, 
  ease: luxuryEase 
};

const luxuryHover = { 
  duration: 0.7, 
  ease: luxuryHoverEase 
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-5%" },
  transition: luxuryEntrance
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.16, 
      delayChildren: 0.1
    }
  },
  viewport: { once: true }
};

// --- Components ---

const LuxuryButton: React.FC<{ children: React.ReactNode, href: string, className?: string, outline?: boolean }> = ({ children, href, className = "", outline = false }) => (
  <motion.a
    href={href}
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.98, opacity: 0.8 }}
    transition={luxuryHover}
    className={`px-8 md:px-12 py-5 text-[9px] tracking-[0.5em] uppercase transition-all duration-1000 flex items-center justify-center md:justify-start gap-6 group/btn relative overflow-hidden w-full md:w-auto ${
      outline 
        ? 'border border-luxury-dark/10 text-luxury-dark hover:border-luxury-dark/40 hover:bg-white/5' 
        : 'bg-luxury-dark text-white hover:bg-stone-800 shadow-sm'
    } ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <motion.div
      initial={{ x: 0, opacity: 0.5 }}
      whileHover={{ x: 4, opacity: 1 }}
      transition={luxuryHover}
      className="relative z-10"
    >
      <ArrowRight size={12} strokeWidth={1} />
    </motion.div>
  </motion.a>
);

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] bg-luxury-cream flex flex-col items-center justify-center p-8"
    >
      <div className="grain-overlay opacity-[0.05]" />
      
      <div className="relative flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-[10px] tracking-[0.5em] uppercase text-stone-400 mb-24 font-light text-center"
        >
          Artistry in Motion<br/>Since 2026
        </motion.div>

        <div className="overflow-hidden mb-6 h-12 md:h-20">
          <motion.h2 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-serif tracking-tighter"
          >
            MADE BY YNK
          </motion.h2>
        </div>

        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="h-px bg-luxury-dark w-full max-w-[280px] mb-6 opacity-20 origin-left"
        />

        <div className="flex items-center gap-6 text-[11px] tracking-[0.5em] uppercase text-stone-500 font-light">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {percent < 50 ? "Dreaming" : "Creating"}
          </motion.span>
          <div className="w-12 h-px bg-stone-200" />
          <span>{percent}%</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-[10px] tracking-[0.3em] uppercase"
      >
        Psalm 118:23
      </motion.div>
    </motion.div>
  );
};

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.7, 
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .clickable')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-stone-400 pointer-events-none z-[100] hidden md:block"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2 : 1,
        backgroundColor: isHovering ? "rgba(245, 242, 237, 0.2)" : "rgba(245, 242, 237, 0)",
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
    />
  );
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.8, ease: luxuryEase, delay: 0.5 }}
        className={`fixed top-8 left-1/2 -translate-x-1/2 z-[60] py-4 px-12 rounded-full border border-stone-200/30 backdrop-blur-xl flex items-center gap-16 transition-all duration-[1500ms] ${scrolled ? 'shadow-xl shadow-black/[0.02] bg-luxury-cream/80 py-3' : 'bg-transparent'}`}
      >
        <span className="text-[8px] tracking-[0.6em] uppercase font-light text-luxury-dark/40">Lagos / Atelier</span>
        
        <h1 className="text-lg font-serif italic tracking-[0.1em] text-luxury-dark/80">YNK</h1>

        <button 
          onClick={() => setIsOpen(true)}
          className="group flex flex-col items-end cursor-pointer gap-1.5"
        >
          <div className="w-6 h-[0.5px] bg-luxury-dark/60 group-hover:w-8 transition-all duration-700"></div>
          <div className="w-4 h-[0.5px] bg-luxury-dark/60 group-hover:w-8 transition-all duration-700"></div>
        </button>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-luxury-cream flex flex-col items-center justify-center pointer-events-auto"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-10 p-4 hover:rotate-90 transition-transform duration-500"
            >
              <X size={32} strokeWidth={1} />
            </button>
            <div className="flex flex-col items-center gap-8 text-center">
              {['Collection', 'About', 'Bespoke', 'Bridal', 'Contact'].map((item, idx) => (
                <motion.a
                  key={item}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl sm:text-6xl font-serif tracking-tight hover:italic transition-all duration-300"
                >
                  {item}
                </motion.a>
              ))}
            </div>
            <div className="absolute bottom-10 flex flex-col items-center gap-4">
              <span className="text-[10px] tracking-[0.4em] uppercase opacity-50">Lagos, Nigeria</span>
              <div className="flex gap-6">
                <Instagram size={20} strokeWidth={1} />
                <MessageCircle size={20} strokeWidth={1} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const TestimonialCard = ({ id, name, handle, text }: { id: string, name: string, handle: string, text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = text.length > 140;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="min-w-[85vw] md:min-w-0 md:w-full p-6 md:p-10 bg-white/40 backdrop-blur-xl border border-stone-200/50 rounded-[40px] shadow-sm flex flex-col justify-between snap-center"
    >
      <div>
        <div className="flex justify-between items-start mb-8">
          <span className="text-[10px] text-stone-400 font-mono tracking-widest">({id})</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-luxury-gold rounded-full" />
            ))}
          </div>
        </div>
        <p className={`text-base leading-relaxed text-stone-600 font-light italic transition-all duration-500 ${!isExpanded && isLong ? 'line-clamp-4' : ''}`}>
          "{text}"
        </p>
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-[10px] tracking-[0.3em] uppercase text-luxury-dark font-bold hover:opacity-60 transition-opacity"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      <div className="mt-12 flex items-center gap-4 border-t border-stone-100 pt-8">
        <div className="w-10 h-10 rounded-full bg-luxury-beige flex items-center justify-center text-[10px] font-serif italic text-stone-400 shrink-0">
          {name[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-stone-900">{name}</span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-light mt-1">{handle}</span>
        </div>
      </div>
    </motion.div>
  );
};

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <motion.div
    {...fadeInUp}
    className="mb-12 md:mb-16"
  >
    <div className="flex items-center gap-4 mb-6 md:mb-4">
      <motion.div 
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-[0.5px] w-16 md:w-12 bg-stone-300 origin-left" 
      />
      <span className="text-[9px] md:text-[10px] tracking-[0.5em] md:tracking-[0.4em] uppercase text-stone-400 font-light">
        {subtitle}
      </span>
    </div>
    <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif tracking-tight leading-tight md:leading-normal">{title}</h2>
  </motion.div>
);

const CollectionCard = ({ video, title, category, isActive, index, gradient }: { video: string, title: string, category: string, isActive: boolean, index: number, gradient: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <motion.div
      whileHover={{ scale: isActive ? 1.06 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{ 
        scale: isActive ? 1.04 : 1.0,
        boxShadow: isActive ? "0 0 40px rgba(34, 197, 94, 0.2)" : "0 20px 25px -5px rgb(0 0 0 / 0.1)",
      }}
      transition={{ duration: 0.8, ease: luxuryEase }}
      className={`relative h-[50vh] sm:h-[55vh] md:h-[600px] min-w-[78vw] sm:min-w-[45vw] md:min-w-[420px] max-w-[290px] sm:max-w-[330px] md:max-w-none rounded-[20px] sm:rounded-[24px] md:rounded-[32px] overflow-hidden flex-shrink-0 group cursor-pointer border transition-colors duration-1000 snap-center ${isActive ? 'border-chrome-green/30' : 'border-transparent'}`}
    >
      {/* Video Backdrop */}
      <video 
        ref={videoRef}
        autoPlay
        loop 
        muted 
        playsInline 
        preload="auto"
        className={`collection-video absolute inset-0 w-full h-full object-cover z-10 transition-all duration-1000 ${isActive ? 'saturate-100 scale-105' : 'saturate-[0.8] opacity-90 scale-100'}`}
        style={{ transition: 'opacity 0.5s ease, transform 1s ease, filter 1s ease' }}
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Subtle Typography Gradient (Bottom 30%) */}
      <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

      {/* Glassmorphic Play Button */}
      <div className={`absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="px-5 py-2.5 md:px-6 md:py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 md:gap-3 text-white text-[9px] md:text-[10px] tracking-[0.2em] uppercase font-sans group/play shadow-xl"
        >
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-white/20 flex items-center justify-center">
            <div className="w-0 h-0 border-t-[3px] md:border-t-[4px] border-t-transparent border-l-[6px] md:border-l-[7px] border-l-white border-b-[3px] md:border-b-[4px] border-b-transparent ml-0.5" />
          </div>
          View
        </motion.button>
      </div>

      {/* Content */}
      <div className="absolute inset-x-4 bottom-6 sm:inset-x-6 sm:bottom-8 md:inset-x-8 md:bottom-10 z-20">
        <span className="text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/70 mb-2 block font-light">{category}</span>
        <h3 className="text-lg sm:text-xl md:text-4xl font-serif text-white tracking-tight leading-none italic">{title}</h3>
      </div>
    </motion.div>
  );
};

// --- Main Content Component ---

const MainContent: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(2); // Start with the middle card active
  const founderVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (founderVideoRef.current) {
      founderVideoRef.current.currentTime = 7;
    }
  }, []);

  const items = [
    { category: "Bridal", title: "The Showstopper", video: "/dolls/doll-1.mp4", gradient: "bg-sage-100" },
    { category: "Signature", title: "Baby Doll", video: "/dolls/doll-2.mp4", gradient: "bg-peach-100" },
    { category: "Atelier", title: "Masterpiece", video: "/dolls/doll-5.mp4", gradient: "bg-chrome-green shadow-chrome" },
    { category: "Bridal", title: "Sparkling White", video: "/dolls/doll-4.mp4", gradient: "bg-sage-100" },
    { category: "Bespoke", title: "Beaded Silk", video: "/dolls/doll-3.mp4", gradient: "bg-peach-100" }
  ];
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 1.1]);

  return (
    <SmoothScroll key="content">
      <div ref={scrollRef} className="relative min-h-screen selection:bg-stone-200 overflow-x-hidden bg-luxury-cream">
        {/* Background Accents */}
        <div className="blur-accent -top-48 -left-48 w-96 h-96 bg-luxury-beige" />
        <div className="blur-accent -bottom-48 -right-48 w-[500px] h-[500px] bg-luxury-accent opacity-40" />
        
        <div className="grain-overlay" />
        <CustomCursor />
        <Navigation />

        {/* Side Rail (Artistic Flair Theme) */}
        <div className="fixed left-10 bottom-12 z-50 hidden lg:flex flex-col gap-8">
          {['Instagram', 'WhatsApp', 'Contact'].map((item) => (
            <a
              key={item}
              href={item === 'WhatsApp' ? 'https://wa.me/+2348184287848' : '#'}
              className="vertical-text text-[10px] tracking-[0.3em] uppercase opacity-40 hover:opacity-100 transition-opacity cursor-pointer text-luxury-dark"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Floating Consultation Bubble */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 1 }}
          className="fixed bottom-12 right-6 md:bottom-24 md:right-12 w-16 h-16 md:w-20 md:h-20 rounded-full backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer shadow-sm z-[50]"
        >
          <a href="https://wa.me/+2348184287848" className="text-center leading-none">
            <div className="text-[7px] md:text-[8px] uppercase tracking-widest text-luxury-dark/60">Book</div>
            <div className="text-[7px] md:text-[8px] uppercase tracking-widest font-bold text-luxury-dark">Private</div>
          </a>
        </motion.div>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Main Hero Video - Full Screen on Mobile, Editorial Card on Desktop */}
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.5, ease: luxuryEase }}
            style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -50]) }}
            className="absolute inset-0 md:inset-auto md:left-20 md:top-1/2 md:-translate-y-1/2 md:w-[400px] md:h-[550px] shadow-2xl overflow-hidden group z-10"
          >
            <div className="absolute inset-0 bg-luxury-dark/10 z-20 block md:hidden" />
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
              className="w-full h-full object-cover grayscale-[0.2] opacity-70 md:opacity-80 transition-opacity duration-700 z-10"
            >
              <source src="/hero-page.mp4#t=,18" type="video/mp4" />
            </video>
          </motion.div>

          <div className="relative w-full max-w-7xl h-full flex flex-col items-center justify-center px-6 md:px-8">

            {/* Secondary Floating Image (Desktop Only) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              style={{ y: useTransform(scrollYProgress, [0, 0.5], [0, -120]) }}
              className="absolute right-10 top-20 w-[240px] h-[320px] z-10 shadow-xl overflow-hidden border border-white/20 hidden lg:block"
            >
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="auto"
                className="w-full h-full object-cover opacity-70 transition-opacity duration-700 z-10"
              >
                <source src="/hero-page-2.mp4#t=10,28" type="video/mp4" />
              </video>
            </motion.div>

            <motion.div 
              style={{ y: heroY, opacity: heroOpacity }}
              className="relative z-20 text-center pointer-events-none px-4"
            >
              <div className="overflow-hidden mb-4">
                <motion.h1 
                  initial={{ opacity: 0, y: "100%" }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-luxury-dark text-5xl sm:text-6xl md:text-[140px] font-serif leading-[0.9] md:leading-[0.8] tracking-[-0.04em] italic mb-6 select-none"
                >
                  <span className="block">Made by</span> 
                  <span className="block"> YNK</span>
                </motion.h1>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="flex justify-center items-center gap-4 md:gap-6 mb-12"
              >
                <span className="text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-light text-stone-500/80">Bespoke</span>
                <div className="w-8 md:w-10 h-[0.5px] bg-luxury-dark opacity-20" />
                <span className="text-[9px] md:text-[11px] tracking-[0.4em] md:tracking-[0.5em] uppercase font-light text-stone-500/80">Bridal</span>
              </motion.div>

              <div className="pointer-events-auto">
                <p className="text-lg md:text-2xl font-serif italic text-stone-400 mb-16 tracking-wide font-light">“You dream, we create”</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full max-w-xs mx-auto">
                  <LuxuryButton href="#collection">
                    Explore Collection
                  </LuxuryButton>
                </div>
              </div>
            </motion.div>

            {/* Religious Underscore */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2.2, duration: 2.5 }}
              className="absolute bottom-10 right-4 md:right-10 text-[9px] tracking-[0.3em] font-light text-luxury-dark"
            >
              Psalm 118:23
            </motion.div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-30"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-luxury-dark to-transparent" />
          </motion.div>
        </section>

        {/* Collection Section */}
        <section id="collection" className="py-24 md:py-56 overflow-hidden bg-white">
          <div className="px-4 md:px-20 max-w-[1920px] mx-auto mb-16 md:mb-20">
            <SectionHeading title="Premium Collections" subtitle="Agency Grade Selection" />
          </div>

          <div className="relative w-full overflow-x-hidden">
            <motion.div 
              ref={carouselRef}
              onScroll={() => {
                if (carouselRef.current) {
                  const scrollX = carouselRef.current.scrollLeft;
                  const width = carouselRef.current.offsetWidth;
                  // Handle responsive width for active index calculation
                  const itemWidth = width < 640 ? width * 0.78 : width < 1024 ? width * 0.45 : 420;
                  const index = Math.round(scrollX / itemWidth);
                  setActiveIndex(index);
                }
              }}
              className="flex gap-3 sm:gap-6 md:gap-12 overflow-x-auto pb-12 no-scrollbar px-[11vw] sm:px-[27.5vw] md:px-[20%] snap-x snap-mandatory"
            >
              {items.map((item, idx) => (
                <CollectionCard 
                  key={idx}
                  index={idx}
                  isActive={activeIndex === idx}
                  category={item.category}
                  title={item.title}
                  video={item.video}
                  gradient={item.gradient}
                />
              ))}
            </motion.div>

            {/* Controls */}
            <div className="mt-16 flex items-center justify-center gap-12 md:gap-16">
              <button 
                onClick={() => {
                  const prevIndex = Math.max(0, activeIndex - 1);
                  if (carouselRef.current) {
                    const items = carouselRef.current.children;
                    if (items[prevIndex]) {
                      items[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                  }
                }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-all group"
              >
                <Plus className="text-stone-400 group-hover:rotate-90 transition-transform duration-500" size={20} strokeWidth={1} />
              </button>

              <div className="flex gap-3">
                {items.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 transition-all duration-700 rounded-full ${i === activeIndex ? 'w-10 bg-luxury-dark' : 'w-2 bg-stone-200'}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => {
                  const nextIndex = Math.min(items.length - 1, activeIndex + 1);
                  if (carouselRef.current) {
                    const elements = carouselRef.current.children;
                    if (elements[nextIndex]) {
                      elements[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                  }
                }}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-all group"
              >
                <ArrowRight className="text-stone-400 group-hover:translate-x-1 transition-transform" size={20} strokeWidth={1} />
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 md:py-48 bg-luxury-beige/30 px-6 md:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-24 md:gap-20">
            <motion.div 
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: luxuryEase }}
              className="w-full md:w-1/2 aspect-[3/4] md:aspect-[4/5] bg-white p-3 md:p-5 rounded-[32px] md:rounded-[40px] shadow-2xl group relative"
            >
              <div className="relative w-full h-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-luxury-cream">
                {/* Editorial Typography Overlay */}
                <div className="absolute top-8 md:top-10 inset-x-0 z-20 flex flex-col items-center pointer-events-none">
                  <span className="text-[8px] md:text-[10px] tracking-[0.5em] uppercase text-stone-400 mb-2 md:mb-4 font-light">The Manifesto</span>
                  <h3 className="text-5xl md:text-8xl font-serif text-stone-800/20 tracking-tighter mix-blend-multiply">CRAFT</h3>
                </div>

                <video 
                  ref={founderVideoRef}
                  controls
                  loop 
                  playsInline 
                  preload="auto"
                  className="w-full h-full object-cover transition-all duration-[3s] ease-out grayscale-[0.1] group-hover:scale-105"
                  style={{ transition: 'opacity 0.7s ease, transform 3s ease' }}
                >
                  <source src="/designer.mp4#t=7" type="video/mp4" />
                </video>

                {/* Decorative Bottom Icon */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-10 h-10 rounded-full border border-stone-200 flex flex-col items-center justify-center gap-1 backdrop-blur-sm bg-white/10 group-hover:border-stone-400 transition-colors duration-700">
                    <div className="w-4 h-[0.5px] bg-stone-400" />
                    <div className="w-4 h-[0.5px] bg-stone-400" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-10">
              <SectionHeading title="Identity & Craft" subtitle="The Founder" />
              <div className="space-y-8 text-stone-600 leading-relaxed font-light text-lg md:text-xl max-w-xl">
                <p>
                  Founded on the spirit of Psalm 118:23 — <span className="italic">"This is the Lord's doing; it is marvelous in our eyes"</span> — MADE BY YNK stands at the intersection of spiritual vision and meticulous craftsmanship.
                </p>
                <p>
                  Based in the heart of Lagos, we believe that every garment is a vessel for identity. Our atelier is not just a workspace, but a sanctuary where dreams are stitched into reality.
                </p>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="pt-12 signature"
              >
                <span className="text-4xl font-serif italic text-stone-400">Made by YNK</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="py-24 md:py-48 bg-luxury-cream relative overflow-x-hidden">
          {/* Subtle Accent Glows */}
          <div className="absolute top-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-luxury-gold/10 rounded-full blur-[80px] md:blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          
          <div className="max-w-[1920px] mx-auto relative px-4 md:px-20 overflow-x-hidden">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 gap-8">
              <div className="max-w-xl">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 bg-luxury-gold rounded-full" />
                  ))}
                </div>
                <h2 className="text-3xl md:text-6xl font-serif tracking-tight leading-tight">What our clients<br/><span className="italic opacity-60">say about us</span></h2>
              </div>
              <div className="hidden md:flex gap-16 text-[10px] tracking-[0.4em] uppercase text-stone-400 font-light">
                <div className="flex flex-col gap-2">
                  <span className="text-2xl font-serif text-stone-900 italic tracking-tighter">1200+</span>
                  <span>Reviews</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-2xl font-serif text-stone-900 italic tracking-tighter">10k+</span>
                  <span>Clients</span>
                </div>
              </div>
            </div>

            {/* Testimonials Layout: Carousel on Mobile, Grid on Tablet/Desktop */}
            <div className="relative">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                
                {/* Review Card Component Logic (Repeat for 3 reviews) */}
                {[
                  { id: "01", name: "Adunni O.", handle: "@adunni_luxury", text: "The bridal gown exceeded every dream I had. It wasn't just a dress; it was a manifestation of my personality. The attention to detail and the way it fit me was absolutely peerless. I felt like a queen on my special day, and I can't thank YNK enough for her vision and craftsmanship." },
                  { id: "02", name: "Boluwatife S.", handle: "@bolu_styles", text: "Precision, elegance, and soul. YNK doesn't just design, she transforms. A truly premium Lagos experience that rivals anything I've seen in London or Paris. The bespoke suit fits like a second skin, and the fabric quality is simply out of this world." },
                  { id: "03", name: "Prince D.", handle: "@dp_bespoke", text: "The attention to detail in my bespoke suit was peerless. Hands down the best atelier service in West Africa. From the first consultation to the final fitting, the process was professional, luxurious, and deeply personal. They truly understand the art of tailoring." }
                ].map((review, i) => (
                  <TestimonialCard key={i} {...review} />
                ))}
              </div>
            </div>

            {/* Mobile Stats (Visible only on small screens) */}
            <div className="flex md:hidden justify-between mt-16 pt-12 border-t border-stone-200">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-serif text-stone-900 italic tracking-tighter">1200+</span>
                <span className="text-[8px] tracking-[0.3em] uppercase text-stone-400">Reviews</span>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className="text-2xl font-serif text-stone-900 italic tracking-tighter">10,000+</span>
                <span className="text-[8px] tracking-[0.3em] uppercase text-stone-400">Happy Clients</span>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-24 md:py-48 px-6 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: luxuryEase }}
            className="max-w-5xl mx-auto bg-luxury-beige/50 p-12 md:p-32 text-center rounded-[30px] md:rounded-[40px] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-stone-400/20 to-transparent" />
            
            <span className="text-[10px] tracking-[0.6em] uppercase text-stone-400 mb-10 block font-light">Exclusivity Awaits</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-12 tracking-tight">Virtual Consultation</h2>
            <p className="text-stone-500 mb-16 max-w-xl mx-auto text-lg md:text-xl leading-relaxed font-light italic">
              Secure your private session with our designer to discuss your vision. Availability is strictly limited.
            </p>
            
            <div className="flex flex-col items-center gap-12">
              <LuxuryButton 
                href="https://wa.me/+2348184287848"
                className="rounded-none bg-luxury-dark text-white shadow-2xl"
              >
                Book My Consultation
              </LuxuryButton>
              
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }}
                transition={{ delay: 0.8, duration: 1.2 }}
                className="flex flex-col md:flex-row items-center gap-6 md:gap-12 text-[9px] tracking-[0.5em] uppercase text-stone-500 font-light"
              >
                <div className="flex items-center gap-3"><Clock size={12} strokeWidth={1} /> Monday - Friday</div>
                <div className="hidden md:block h-4 w-px bg-stone-300" />
                <div className="flex items-center gap-3"><MapPin size={12} strokeWidth={1} /> 09:00 - 18:00 WAT</div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Newsletter */}
        <section className="py-32 md:py-48 border-t border-stone-100 px-6 bg-stone-50/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeInUp}>
              <h3 className="text-4xl md:text-5xl font-serif mb-12 italic tracking-tight text-luxury-dark/90">The Editorial Subscription</h3>
              <p className="text-stone-400 text-[9px] tracking-[0.6em] uppercase mb-20 font-light">Curated visions & inner-circle access</p>
              
              <form className="flex flex-col sm:flex-row gap-16 max-w-2xl mx-auto items-end" onSubmit={(e) => e.preventDefault()}>
                <div className="flex-grow relative group w-full">
                  <input 
                    type="email" 
                    placeholder=" " 
                    className="w-full bg-transparent border-b border-stone-200 px-0 py-5 text-stone-600 focus:outline-none focus:border-luxury-dark transition-all duration-[1000ms] font-light text-base tracking-wide peer"
                  />
                  <label className="absolute left-0 top-5 text-stone-300 text-[10px] tracking-[0.5em] uppercase transition-all duration-700 pointer-events-none peer-focus:-top-6 peer-focus:text-[9px] peer-focus:text-luxury-dark peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[9px]">
                    Email Address
                  </label>
                </div>
                
                <motion.button 
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-16 py-6 bg-luxury-dark text-white text-[9px] tracking-[0.6em] uppercase hover:bg-stone-800 transition-all duration-1000 shadow-2xl flex-shrink-0"
                >
                  Subscribe
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-luxury-cream pt-32 pb-20 px-8 md:px-20 border-t border-stone-100">
          <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between gap-24">
            <div className="max-w-md">
              <h4 className="text-4xl font-serif mb-10 tracking-tight italic text-luxury-dark/90">MADE BY YNK</h4>
              <p className="text-stone-400 text-base mb-12 leading-relaxed font-light">
                An artisan atelier specializing in bespoke bridal and luxury signature pieces. 
                Dedicated to the manifestation of dreams through the medium of divine craftsmanship.
              </p>
              <div className="flex flex-wrap gap-10">
                {['Instagram', 'WhatsApp', 'Enquiries'].map((social) => (
                  <motion.a 
                    key={social}
                    whileHover={{ y: -2, opacity: 0.6 }} 
                    href="#" 
                    className="text-luxury-dark text-[10px] tracking-[0.4em] uppercase pb-2 border-b border-luxury-dark/20 hover:border-luxury-dark transition-all duration-700"
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
              <div>
                <span className="text-[10px] tracking-[0.6em] uppercase text-luxury-dark/40 block mb-12 font-light">Mailing Address</span>
                <div className="flex items-start gap-4 text-stone-500 text-xs leading-loose font-light">
                  <MapPin size={14} strokeWidth={1} className="mt-1" />
                  <p className="tracking-[0.1em]">Atelier Lagos<br />Lagos, Nigeria<br />Available Globally</p>
                </div>
              </div>
              
              <div>
                <span className="text-[10px] tracking-[0.6em] uppercase text-luxury-dark/40 block mb-12 font-light">Directory</span>
                <ul className="space-y-6 text-stone-500 text-[10px] tracking-[0.5em] uppercase font-light">
                  {['Manifesto', 'The Collections', 'The Designer', 'Legal Notice'].map((item) => (
                    <li key={item}>
                      <motion.a 
                        whileHover={{ x: 5 }} 
                        href={`#${item.toLowerCase().replace(' ', '')}`} 
                        className="hover:text-luxury-dark transition-all duration-500"
                      >
                        {item}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-32 pt-12 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <p className="text-[9px] tracking-[0.8em] uppercase text-stone-400 font-light italic">© 2026 MADE BY YNK / BESPOKE ARTISTRY</p>
            <div className="flex items-center gap-6 text-[9px] tracking-[0.4em] uppercase text-stone-500/60 font-light">
              <span>You dream, we create</span>
              <div className="w-2 h-[0.5px] bg-stone-300" />
              <span className="italic">Divine Craftsmanship</span>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
};

// --- Main App ---

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
      ) : (
        <MainContent key="content" />
      )}
    </AnimatePresence>
  );
}
