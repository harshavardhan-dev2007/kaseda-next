"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SuccessPage() {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(500);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const res = await fetch("/api/member-count");
        if (res.ok) {
          const data = await res.json();
          setMemberCount(data.count);
          if (data.limit) setLimit(data.limit);
        }
      } catch (err) {
        console.error("Failed to fetch member count", err);
      }
    };
    fetchMemberCount();
  }, []);

  const progress = memberCount === null ? 0 : Math.min(100, (memberCount / limit) * 100);
  const remaining = memberCount === null ? "..." : Math.max(0, limit - memberCount);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative font-sans selection:bg-white selection:text-black">
      {/* Structural Thin Grid Lines */}
      <div className="hidden lg:block absolute left-[8%] right-[8%] top-0 bottom-0 border-l border-r border-zinc-900/60 pointer-events-none z-[1]" />

      {/* Navigation Header */}
      <header className="w-full border-b border-zinc-900/80 py-6 px-6 md:px-12 lg:px-24 flex items-center justify-between relative z-20 bg-black/70 backdrop-blur-md">
        <Link href="/" className="flex items-center select-none cursor-pointer">
          <Image
            src="/kaseda-logo.svg"
            alt="KASEDA Logo"
            width={120}
            height={60}
            priority
            className="object-contain invert h-[28px] w-auto md:h-[36px]"
          />
        </Link>
        <Link
          href="/"
          className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white cursor-pointer select-none font-medium"
        >
          Return Home
        </Link>
      </header>

      {/* Success Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative z-10 w-full max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 block mb-6 font-semibold">
            WELCOME TO THE FOUNDING COMMUNITY
          </span>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
            Registration <span className="font-serif italic text-zinc-300">Confirmed</span>
          </h1>

          <div className="text-zinc-400 text-sm leading-relaxed font-light space-y-6 mb-16">
            <p className="text-lg text-zinc-200">
              You are now one of the first KASEDA members.
            </p>
            <p>
              Your exclusive launch coupon will be delivered to your WhatsApp when KASEDA officially launches on 20 July 2026.
            </p>
          </div>

          {/* Member Number & Progress */}
          <div className="border border-zinc-900 bg-zinc-950 p-8 md:p-12 text-left rounded-none mb-12">
            <div className="mb-8 pb-8 border-b border-zinc-900 flex justify-between items-end">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-2 font-semibold">YOUR STATUS</span>
                <span className="text-3xl md:text-4xl font-serif italic text-white tracking-widest">
                  MEMBER #{memberCount === null ? "..." : memberCount}
                </span>
              </div>
            </div>

            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-4 font-semibold">FOUNDING MEMBER SPOTS CLAIMED</span>
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl md:text-5xl font-extralight text-white leading-none tracking-tight">
                {memberCount === null ? "--" : memberCount}
              </span>
              <span className="text-xl md:text-2xl font-light text-zinc-600 ml-2">/ {limit}</span>
            </div>
            
            <div className="h-[2px] w-full bg-zinc-900 mb-4 relative">
              <div 
                className="h-full bg-white absolute top-0 left-0 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 block mt-4 font-medium">
              {remaining} SPOTS REMAINING
            </span>
          </div>

          {/* Benefits */}
          <div className="mb-16 text-left max-w-sm mx-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block mb-6 font-semibold text-center">YOUR BENEFITS</span>
            <ul className="space-y-4 list-none pl-0">
              {[
                "Secret Launch Coupon",
                "Early Access To Collections",
                "Exclusive Product Drops",
                "Founding Member Benefits",
                "Launch Day Surprises"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center text-zinc-300 text-sm font-light">
                  <span className="text-white mr-4">✓</span> {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-white text-black uppercase tracking-widest text-[11px] font-bold py-4 px-8 border border-white hover:bg-zinc-200 cursor-pointer select-none rounded-none text-center"
            >
              Follow KASEDA On Instagram
            </a>
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-transparent text-white uppercase tracking-widest text-[11px] font-bold py-4 px-8 border border-zinc-600 hover:bg-white hover:text-black cursor-pointer select-none rounded-none text-center"
            >
              Join WhatsApp Community
            </a>
            <Link
              href="/"
              className="w-full text-zinc-500 uppercase tracking-widest text-[10px] font-semibold py-4 hover:text-white cursor-pointer select-none text-center mt-4"
            >
              Back To Homepage
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
