"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Send,
  Navigation,
  MessageCircle,
  X
} from "lucide-react";


// Web Audio API Temple Chime Synthesizer
function playAuspiciousChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + index * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.1 + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.1);
      osc.stop(ctx.currentTime + index * 0.1 + 2.6);
    });
  } catch (e) {
    console.error("Audio playback error", e);
  }
}

interface Blessing {
  id: string;
  name: string;
  message: string;
  time: string;
}

export default function EarPiercingInvitation() {
  // State
  const [hasWished, setHasWished] = useState(false);
  const [wishCount, setWishCount] = useState(108);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showBlessingModal, setShowBlessingModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [blessingsList, setBlessingsList] = useState<Blessing[]>([
    {
      id: "1",
      name: "அப்பா & அம்மா",
      message: "எங்கள் பூர்ணிகா செல்லம் நோய் நொடியின்றி நீடூழி வாழ ஆசீர்வதிக்கிறோம்! ❤️",
      time: "10 mins ago"
    },
    {
      id: "2",
      name: "தாத்தா & பாட்டி",
      message: "ஸ்ரீ பெரியாண்டவர் அருளால் பூர்ணிகா எல்லா செல்வமும் பெற்று வாழ்க! 🌸",
      time: "25 mins ago"
    }
  ]);
  const [copied, setCopied] = useState(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const video2Ref = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Background Nadaswaram Music Autoplay Effect
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch((err) => {
          console.log("Autoplay blocked by browser policy, waiting for user touch:", err);
        });
      }
    };

    playAudio();

    // Auto-resume audio on first user touch/click anywhere on page
    const handleFirstTouch = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => { });
      }
    };

    window.addEventListener("click", handleFirstTouch, { once: true });
    window.addEventListener("touchstart", handleFirstTouch, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstTouch);
      window.removeEventListener("touchstart", handleFirstTouch);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        });
      }
    }
  };

  // Countdown to 16 August 2026, 10:30 AM
  useEffect(() => {
    const targetDate = new Date("2026-08-16T10:30:00+05:30").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle Wish Click
  const handleWish = () => {
    const nextState = !hasWished;
    setHasWished(nextState);

    // Ensure background Nadaswaram music is playing on Wish click
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => { });
    }

    if (nextState) {
      setWishCount((prev) => prev + 1);
      playAuspiciousChime();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ["#F59E0B", "#FCD34D", "#EF4444", "#F472B6", "#10B981"]
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 50,
          origin: { x: 0 },
          colors: ["#F59E0B", "#FCD34D", "#FFFFFF"]
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 50,
          origin: { x: 1 },
          colors: ["#F59E0B", "#FCD34D", "#FFFFFF"]
        });
      }, 200);
    }
  };


  // Submit Blessing
  const handleAddBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    const newBlessing: Blessing = {
      id: Date.now().toString(),
      name: guestName.trim(),
      message: guestMessage.trim(),
      time: "இப்பொழுது"
    };

    setBlessingsList([newBlessing, ...blessingsList]);
    setGuestName("");
    setGuestMessage("");
    setShowBlessingModal(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#F59E0B", "#FCD34D"]
    });
  };

  // Share
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "காாதணி விழா அழைப்பிதழ் | ஜ வி பூர்ணிகா",
          text: "திரு க ஜெயராஜ் & திருமதி விஷாலி அவர்களின் அன்பு மகள் ஜ வி பூர்ணிகாவின் காது குத்தும் விழா அழைப்பிதழ்",
          url: window.location.href
        })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    "ஜ வி பூர்ணிகா காது குத்தும் விழா"
  )}&dates=20260816T050000Z/20260816T063000Z&details=${encodeURIComponent(
    "திரு க ஜெயராஜ் & திருமதி விஷாலி அவர்களின் அன்பு மகள் ஜ வி பூர்ணிகாவின் காாதணி விழா அழைப்பிதழ்"
  )}&location=${encodeURIComponent(
    "ஸ்ரீ பெரியாண்டவர் பெரிய நாயகி திரு கோவில், கீழ்குமாரமங்கலம், கடலூர்"
  )}`;

  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Sri Periyandavar Periya Nayagi Thirukovil, Keezhkumaramangalam, Cuddalore");

  return (
    <div className="relative h-screen h-[100dvh] w-full flex flex-col items-center justify-between text-amber-50 selection:bg-amber-500 selection:text-black overflow-hidden font-sans p-2 sm:p-4">

      {/* Automatic Background Nadaswaram Audio Player */}
      <audio
        ref={audioRef}
        src="/Mangala-Vadhyam-Nadaswaram.mp3"
        autoPlay
        loop
        playsInline
      />

      {/* Single Background Video (secene_2.mp4 - 100% Clear Visibility) */}
      <div className="fixed inset-0 w-full h-full -z-20 overflow-hidden bg-black">
        <video
          ref={video2Ref}
          src="/secene_2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-100 scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none" />
      </div>

      {/* Floating Petals Effect on Wish */}
      {hasWished && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute text-lg animate-[flowerFall_6s_linear_infinite]"
              style={{
                left: `${(i * 8.5) % 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + (i % 3)}s`
              }}
            >
              {i % 3 === 0 ? "🌸" : i % 3 === 1 ? "✨" : "🌼"}
            </div>
          ))}
        </div>
      )}

      {/* TOP HEADER CONTROLS (Compact Mobile Bar) */}
      <header className="w-full max-w-md z-30 flex items-center justify-between pt-1 px-1 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="bg-black/65 hover:bg-black/80 border border-amber-400/40 backdrop-blur-md rounded-full p-1.5 text-amber-200 transition shadow-md"
            title="Share Invitation"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-center gap-1.5">


          <button
            onClick={toggleMusic}
            className="bg-black/65 hover:bg-black/80 border border-amber-400/40 backdrop-blur-md rounded-full px-2.5 py-1 text-xs text-amber-200 transition shadow-md flex items-center gap-1 font-semibold"
            title="Toggle Nadaswaram Music"
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-amber-400/70" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* SINGLE SCREEN MAIN CONTENT (Scales to 100vh) */}
      <main className="w-full max-w-md flex-1 z-20 flex flex-col justify-evenly items-center text-center my-auto py-1 px-1 overflow-hidden">

        {/* Divine Invocation & Event Title */}
        <div className="flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-1.5 bg-black/60 border border-amber-400/50 backdrop-blur-md rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-bold text-amber-200 shadow-md">
            <span>🪔</span>
            <span className="tracking-wider">ஸ்ரீ பெரியாண்டவர் துணை</span>
            <span>🪔</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold gold-text-gradient font-custom-1 tracking-wide py-0.5 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
            காாதணி விழா அழைப்பிதழ்
          </h1>
        </div>

        {/* Parents & Daughter Tag */}
        <div className="space-y-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
          <p className="text-amber-100 text-xs sm:text-sm font-bold">
            <span>திரு க ஜெயராஜ்</span> &amp; <span>திருமதி விஷாலி</span>
          </p>
          <p className="text-amber-200/90 text-[11px] font-medium">அவர்களின் அன்பு மகள்</p>
        </div>

        {/* Child's Name Badge */}
        <div className="relative group my-0.5">
          <div className="relative bg-black/75 backdrop-blur-md border border-amber-400/60 px-5 py-1.5 rounded-xl shadow-xl">
            <h2 className="text-lg sm:text-xl font-black text-amber-100 tracking-wider flex items-center justify-center gap-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span>✨</span>
              <span className="gold-text-gradient">ஜ வி பூர்ணிகா</span>
              <span>✨</span>
            </h2>
          </div>
        </div>

        {/* CENTERPIECE: Arch / Dome Frame (Matches user reference image) */}
        <div className="relative my-1 flex flex-col items-center shrink-0">

          {/* Arch Frame Container: Perfect Arch Dome Top (rounded-t-full) with Crimson Outer Ring */}
          <div className="relative w-64 h-76 sm:w-52 sm:h-64 rounded-t-full rounded-b-2xl p-1.5 bg-[#800000] border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.6)] overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-105">

            {/* Inner Gold Rim & Maroon Inner Line */}
            <div className="w-full h-full rounded-t-full rounded-b-xl p-1 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 border border-[#800000] overflow-hidden relative">
              <div className="w-full h-full rounded-t-full rounded-b-lg overflow-hidden relative bg-amber-950">

                {/* Initial Baby Image (p1.png) */}
                <div
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${hasWished ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                >
                  <Image
                    src="/p1.png"
                    alt="Baby Poornika (Initial)"
                    fill
                    sizes="208px"
                    className="object-cover rounded-t-full rounded-b-lg"
                    priority
                  />
                </div>

                {/* Ear Ring Baby Image (p2.png) */}
                <div
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${hasWished ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    }`}
                >
                  <Image
                    src="/p2.png"
                    alt="Baby Poornika with Ear Rings"
                    fill
                    sizes="208px"
                    className="object-cover rounded-t-full rounded-b-lg"
                    priority
                  />
                </div>

              </div>
            </div>
          </div>




          {/* WISH BUTTON */}
          <div className="mt-2 flex flex-col items-center gap-1">
            <button
              onClick={handleWish}
              className={`relative group px-6 py-2 rounded-full font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-2xl flex items-center gap-2 ${hasWished
                ? "bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 text-white shadow-emerald-500/40 hover:brightness-110 ring-2 ring-emerald-300/60"
                : "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 shadow-amber-500/60 hover:scale-105 ring-3 ring-yellow-400/40 animate-bounce"
                }`}
            >

              <span>
                {hasWished ? "நன்றி" : "🙌🏻"}
              </span>
            </button>
          </div>
        </div>

        {/* Short Invitation Wording */}
        <p className="text-amber-100 text-[11px] sm:text-xs leading-tight max-w-xs font-semibold px-1 drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
          காது குத்தும் விழாவில் கலந்துகொண்டு பூர்ணிகாவை ஆசீர்வதிக்குமாறு அன்புடன் கேட்டு கொள்கிறோம்.
        </p>

        {/* EVENT DETAILS GRID (Compact Mobile Cards) */}
        <div className="w-full grid grid-cols-2 gap-2 mt-1 text-left">

          {/* Date & Time Pill */}
          <div className="bg-black/65 border border-amber-400/40 backdrop-blur-md rounded-xl p-2 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <Calendar className="w-3 h-3 text-amber-400" />
                <span>தேதி &amp; நேரம்</span>
              </div>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] text-amber-200 bg-amber-500/30 px-1.5 py-0.2 rounded border border-amber-400/40 font-semibold"
              >
                + கேலண்டர்
              </a>
            </div>
            <div className="mt-1">
              <div className="text-xs sm:text-sm font-black text-amber-100">16 ஆகஸ்ட் 2026</div>
              <div className="text-[10px] text-amber-300/90 font-medium">காலை 10:30 - 12:00 PM</div>
              <div className="text-[9px] text-amber-200/80 flex items-center gap-0.5 mt-0.5">
                <Utensils className="w-2.5 h-2.5 text-amber-400" /> விருந்து: 12 PM முதல்
              </div>
            </div>
          </div>

          {/* Venue & Location Pill */}
          <div className="bg-black/65 border border-amber-400/40 backdrop-blur-md rounded-xl p-2 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-300 font-bold text-[11px]">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>இடம் (Venue)</span>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-xs"
              >
                <Navigation className="w-2.5 h-2.5" /> Maps
              </a>
            </div>
            <div className="mt-1">
              <div className="text-xs font-bold text-amber-100 leading-tight">
                ஸ்ரீ பெரியாண்டவர் திருக்கோவில்
              </div>
              <div className="text-[10px] text-amber-200/90 font-medium mt-0.5">கீழ்குமாரமங்கலம், கடலூர்</div>
            </div>
          </div>
        </div>

        {/* COUNTDOWN TIMER STRIP */}
        <div className="w-full mt-1 flex items-center justify-center gap-2">
          <span className="text-[10px] text-amber-300 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            ⏳ விழா ஆரம்பிக்க:
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { label: "நாட்கள்", val: timeLeft.days },
              { label: "மணி", val: timeLeft.hours },
              { label: "நிமிடம்", val: timeLeft.minutes },
              { label: "நொடி", val: timeLeft.seconds }
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-black/70 border border-amber-400/40 rounded-lg px-2 py-0.5 flex items-baseline gap-0.5 shadow-md"
              >
                <span className="text-xs font-black text-amber-200">{String(unit.val).padStart(2, "0")}</span>
                <span className="text-[8px] text-amber-400">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-md z-20 text-center text-[10px] text-amber-200/80 font-semibold pb-1 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        ✨ ஜெயராஜ் &amp; விஷாலி குடும்பத்தினரின் காாதணி விழா அழைப்பு ✨
      </footer>


    </div>
  );
}
