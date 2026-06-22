"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Configurable Launch Date: July 20, 2026, at 12:00 AM IST (Asia/Kolkata)
const LAUNCH_DATE = "2026-07-20T00:00:00+05:30";

export default function ComingSoon() {
  const [isMounted, setIsMounted] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setIsMounted(true);
    
    const calculateTimeLeft = () => {
      const difference = +new Date(LAUNCH_DATE) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference <= 0) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return newTimeLeft;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg("Full Name must be at least 2 characters.");
      return;
    }

    const cleanPhone = whatsappNumber.replace(/\s+/g, "");
    if (!whatsappNumber.trim() || !/^\+?[0-9\-]{10,15}$/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid WhatsApp Number (10-15 digits).");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid Email Address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          whatsappNumber: whatsappNumber.trim(),
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit. Please try again.");
      }

      setSuccessMsg(
        "Welcome to the Founding Community. Your exclusive KASEDA launch coupon will be delivered to your WhatsApp before our official launch on 20 July 2026."
      );
      setFullName("");
      setWhatsappNumber("");
      setEmail("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative font-sans selection:bg-white selection:text-black">
      
      {/* Structural Thin Grid Lines — Signature luxury editorial design */}
      <div className="hidden lg:block absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-zinc-900/60 pointer-events-none" />

      {/* Navigation Header */}
      <header className="w-full border-b border-zinc-900 py-6 px-6 md:px-12 lg:px-24 flex items-center justify-between relative z-10 bg-black">
        <Link href="/" className="flex items-center select-none cursor-pointer">
          <Image
            src="/kaseda-logo.png"
            alt="KASEDA Logo"
            width={72}
            height={36}
            priority
            className="object-contain invert h-[28px] w-auto md:h-[36px]"
          />
        </Link>
        <div className="flex items-center gap-8">
          <button 
            onClick={() => scrollToSection("story")} 
            className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white cursor-pointer select-none font-medium"
          >
            Our Story
          </button>
          <button 
            onClick={() => scrollToSection("early-access")} 
            className="text-[10px] uppercase tracking-widest bg-white text-black px-5 py-2 font-semibold cursor-pointer select-none hover:bg-zinc-200"
          >
            Get Access
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 lg:py-36 relative z-10 max-w-4xl mx-auto w-full">
        {/* Prominently Centered Logo */}
        <div className="mb-14 md:mb-20 flex justify-center w-full">
          <Image
            src="/kaseda-logo.png"
            alt="KASEDA — Kalam Se Kapada"
            width={480}
            height={240}
            priority
            className="object-contain invert w-[280px] h-[140px] md:w-[480px] md:h-[240px]"
          />
        </div>

        {/* Small Label */}
        <span className="text-[11px] uppercase tracking-[0.45em] text-zinc-500 block mb-6 font-semibold">
          FROM KALAM TO KAPADA
        </span>

        {/* Headline — DM Sans with Fraunces Italic Accent */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none mb-10">
          Wear <span className="font-serif italic font-light text-zinc-200">Confidence</span>.<br />
          Wear <span className="font-serif italic font-normal text-white">KASEDA</span>.
        </h1>

        {/* Supporting Text */}
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-14 font-light">
          Premium streetwear and everyday essentials designed for those who believe fashion is a form of self-expression.
        </p>

        {/* CTA Actions */}
        {isExpired ? (
          <div className="flex flex-col items-center gap-6">
            <span className="text-zinc-350 font-serif italic text-xl tracking-widest block font-light">
              KASEDA Has Officially Launched
            </span>
            <button
              onClick={() => scrollToSection("collection-preview")}
              className="bg-white text-black uppercase tracking-widest text-[11px] font-bold py-4 px-8 border border-white hover:bg-black hover:text-white cursor-pointer select-none rounded-none"
            >
              Explore The Collection
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md mx-auto">
            <button
              onClick={() => scrollToSection("early-access")}
              className="bg-white text-black uppercase tracking-widest text-[11px] font-bold py-4 px-8 border border-white hover:bg-black hover:text-white cursor-pointer select-none rounded-none"
            >
              Join The Founding Community
            </button>
            <button
              onClick={() => scrollToSection("story")}
              className="bg-black text-white uppercase tracking-widest text-[11px] font-bold py-4 px-8 border border-zinc-800 hover:border-white cursor-pointer select-none rounded-none"
            >
              Learn Our Story
            </button>
          </div>
        )}
      </main>

      {/* Brand Story Section */}
      <section id="story" className="border-t border-zinc-900 bg-black py-24 px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          <div className="md:col-span-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-3 font-semibold">OUR BRAND STORY</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">
              From <span className="font-serif italic">Kalam</span><br />To <span className="font-serif italic">Kapada</span>
            </h2>
          </div>
          <div className="md:col-span-2 text-zinc-400 text-sm md:text-base leading-relaxed space-y-6 font-light">
            <p>
              KASEDA was born from a simple idea: expression should not stay locked away on paper. It should be worn out in the world, taking physical form.
            </p>
            <p>
              Inspired by the creative journey from <strong className="text-white font-medium">Kalam</strong> (the pen that captures raw raw imagination) to <strong className="text-white font-medium">Kapada</strong> (the premium fabric that displays identity), KASEDA transforms raw creativity, confidence, and individuality into everyday streetwear.
            </p>
            <p className="border-l border-zinc-800 pl-6 italic text-zinc-300 font-serif text-lg font-light leading-relaxed">
              Every design decision is built on confidence, simplicity, and premium quality. Every piece is designed to help you wear your story.
            </p>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      {!isExpired && (
        <section className="border-t border-zinc-900 bg-zinc-950 py-24 px-6 md:px-12 lg:px-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block mb-4 font-semibold">THE CHRONOLOGY</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-14">
              Launching <span className="font-serif italic font-light text-zinc-400">Soon</span>
            </h2>
            
            {/* Static countdown format - strictly updates numeric content instantly */}
            {isMounted ? (
              <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
                <div className="border border-zinc-900 bg-black p-5 md:p-8 rounded-none">
                  <span className="text-3xl md:text-5xl block text-white font-light tracking-tight">{String(timeLeft.days).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mt-3 font-semibold">Days</span>
                </div>
                <div className="border border-zinc-900 bg-black p-5 md:p-8 rounded-none">
                  <span className="text-3xl md:text-5xl block text-white font-light tracking-tight">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mt-3 font-semibold">Hours</span>
                </div>
                <div className="border border-zinc-900 bg-black p-5 md:p-8 rounded-none">
                  <span className="text-3xl md:text-5xl block text-white font-light tracking-tight">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mt-3 font-semibold">Minutes</span>
                </div>
                <div className="border border-zinc-900 bg-black p-5 md:p-8 rounded-none">
                  <span className="text-3xl md:text-5xl block text-white font-light tracking-tight">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mt-3 font-semibold">Seconds</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-zinc-900 bg-black p-5 md:p-8 rounded-none">
                    <span className="text-3xl md:text-5xl block text-zinc-800 font-light tracking-tight">--</span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-600 block mt-3 font-semibold">...</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Founding Members & Registration Form Section */}
      <section id="early-access" className="border-t border-zinc-900 bg-black py-24 px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          
          {/* Founding Members Card */}
          <div className="border border-zinc-900 bg-zinc-950 p-8 md:p-12 flex flex-col justify-between rounded-none">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-6 font-semibold">FOUNDING BENCHMARK</span>
              <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
                Founding <span className="font-serif italic text-zinc-300">Members</span>
              </h3>
              <div className="text-zinc-400 text-sm leading-relaxed mb-8 font-light space-y-3">
                <p>KASEDA officially launches on 20 July 2026.</p>
                <p>Join the Founding Community before launch day and receive your exclusive launch coupon.</p>
                <p className="text-white font-medium text-xs uppercase tracking-wide">Early access registration closes when the countdown reaches zero.</p>
              </div>
            </div>
            
            <div className="border-t border-zinc-900 pt-6">
              <span className="text-6xl md:text-7xl font-extralight text-white block leading-none">250+</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mt-3 font-semibold">Active Founding Members</span>
            </div>
          </div>

          {/* Registration Form */}
          <div className="border border-zinc-900 p-8 md:p-12 flex flex-col justify-center rounded-none bg-black">
            <h3 className="text-2xl font-light tracking-tight mb-6">
              Request <span className="font-serif italic text-zinc-350">Early Access</span>
            </h3>
            
            {successMsg ? (
              <div className="border border-zinc-850 p-6 bg-zinc-950 text-left rounded-none">
                <span className="text-white block font-serif italic text-lg mb-2">Welcome to the Founding Community.</span>
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  Your exclusive KASEDA launch coupon will be delivered to your WhatsApp before our official launch on 20 July 2026.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="fullName" className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-950 border border-zinc-900 px-4 py-3 text-sm focus:border-white focus:outline-none placeholder-zinc-700 text-white rounded-none"
                  />
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-zinc-950 border border-zinc-900 px-4 py-3 text-sm focus:border-white focus:outline-none placeholder-zinc-700 text-white rounded-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-[10px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. hello@kaseda.co"
                    className="w-full bg-zinc-950 border border-zinc-900 px-4 py-3 text-sm focus:border-white focus:outline-none placeholder-zinc-700 text-white rounded-none"
                  />
                </div>

                {errorMsg && (
                  <p className="text-red-400 text-xs font-sans tracking-wide">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black uppercase tracking-widest text-xs font-bold py-4 hover:bg-zinc-200 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-650 border border-white hover:border-zinc-200 rounded-none"
                >
                  {isSubmitting ? "Securing Entry..." : "Reserve My Secret Launch Coupon"}
                </button>

                <span className="text-[9px] uppercase tracking-widest text-zinc-600 text-center block mt-3 font-medium">
                  Only Founding Members receive the secret launch coupon on WhatsApp.
                </span>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Why Join Early Section */}
      <section className="border-t border-zinc-900 bg-zinc-950 py-24 px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-2 text-center font-semibold">PRIVILEGES</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-center mb-16">
            Why Join <span className="font-serif italic">Early?</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Secret Launch Coupon", desc: "Delivered straight to WhatsApp on launch day." },
              { title: "Early Access", desc: "Browse and secure new collections before public release." },
              { title: "Exclusive Drops", desc: "Access members-only apparel editions and monograms." },
              { title: "Founding Member Benefits", desc: "Guaranteed lifetime privileges and status." },
              { title: "Launch Day Surprises", desc: "Randomly selected founding members receive custom products." }
            ].map((benefit, index) => (
              <div key={index} className="border border-zinc-900 bg-black p-6 flex flex-col justify-between min-h-[170px] rounded-none">
                <div className="flex items-start justify-between">
                  <span className="text-zinc-400 text-xs">✓</span>
                  <span className="font-serif italic text-xs text-zinc-600">0{index + 1}</span>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-white font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-zinc-500 text-[10px] leading-relaxed font-light">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Preview Section */}
      <section id="collection-preview" className="border-t border-zinc-900 bg-black py-24 px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-2 font-semibold">THE PREVIEW</span>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight">
                The Inaugural <span className="font-serif italic text-zinc-350">Silhouettes</span>
              </h2>
            </div>
            <p className="text-zinc-500 text-xs md:text-sm tracking-wide max-w-xs mt-4 md:mt-0 leading-relaxed font-light">
              A curated preview of our launch templates. Monochrome photography focused on posture, structure, and quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                name: "OVERSIZED STREETWEAR",
                image: "/oversized_streetwear.png",
                desc: "Boxy cuts and heavyweight cottons designed to hold structural posture."
              },
              {
                id: 2,
                name: "PREMIUM BASICS",
                image: "/premium_basics.png",
                desc: "Clean construction, fine details, and timeless everyday neutral shapes."
              },
              {
                id: 3,
                name: "EVERYDAY ESSENTIALS",
                image: "/everyday_essentials.png",
                desc: "Minimal accessories and core layers designed for ultimate utility and expression."
              }
            ].map((collection) => (
              <div key={collection.id} className="border border-zinc-900 bg-zinc-950 flex flex-col rounded-none">
                <div className="relative aspect-[3/4] w-full bg-zinc-900">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale"
                  />
                </div>
                <div className="p-6 border-t border-zinc-900">
                  <h3 className="font-serif italic text-base tracking-widest text-white mb-2">{collection.name}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-light">{collection.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="border-t border-zinc-900 bg-zinc-950 py-28 px-6 md:px-12 lg:px-24 relative z-10 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block mb-6 font-semibold">THE MOVEMENT</span>
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
            More Than <span className="font-serif italic font-light text-zinc-300">Clothing</span>.
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-12 font-light">
            KASEDA is building a community of people who believe confidence begins with self-expression. Join before launch and be part of the story from the very beginning.
          </p>
          <button
            onClick={() => scrollToSection("early-access")}
            className="bg-white text-black uppercase tracking-widest text-xs font-bold py-4 px-8 border border-white hover:bg-black hover:text-white cursor-pointer select-none rounded-none"
          >
            Secure Your Founding Spot
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-16 px-6 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Footer Logo */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="block select-none mb-2">
              <Image
                src="/kaseda-logo.png"
                alt="KASEDA Logo"
                width={100}
                height={50}
                className="object-contain invert h-[50px] w-auto"
              />
            </Link>
            <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-500 font-semibold">KALAM SE KAPADA</span>
          </div>

          {/* Social / Contact Links */}
          <div className="flex flex-col sm:flex-row gap-8 items-center text-center sm:text-left">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-650 block mb-2 font-semibold">Connect</span>
              <div className="space-y-1">
                <a href="#" className="text-xs text-zinc-400 hover:text-white block font-light">Instagram</a>
                <a href="#" className="text-xs text-zinc-400 hover:text-white block font-light">WhatsApp Business</a>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-zinc-650 block mb-2 font-semibold">Inquiries</span>
              <a href="mailto:hello@kaseda.co" className="text-xs text-zinc-400 hover:text-white block font-light">hello@kaseda.co</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <span className="text-[9px] uppercase tracking-widest text-zinc-650 block font-medium">
              &copy; {new Date().getFullYear()} KASEDA. All Rights Reserved.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
