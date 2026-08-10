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


// Web Audio API Temple Chime Synthesizer (Lite Soft Volume)
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
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + index * 0.1 + 0.03); // Soft lite volume
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

// Native IndexedDB + localStorage Asset Caching System
const DB_NAME = "poornika_assets_db";
const STORE_NAME = "media_blobs";

function openAssetCacheDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject("IndexedDB not available");
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getCachedBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openAssetCacheDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

async function setCachedBlob(key: string, blob: Blob): Promise<void> {
  try {
    const db = await openAssetCacheDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(blob, key);
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (e) {
    // Fail silently if quota exceeded
  }
}

interface Blessing {
  id: string;
  name: string;
  message: string;
  time: string;
}

// Helper: Fetch binary blob with byte progress tracking
async function fetchWithProgress(
  url: string,
  onProgress: (receivedBytes: number, totalBytes: number) => void
): Promise<Blob> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);

  const contentLength = res.headers.get("content-length");
  const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

  if (!res.body || !totalBytes) {
    const blob = await res.blob();
    onProgress(blob.size, blob.size);
    return blob;
  }

  const reader = res.body.getReader();
  let receivedBytes = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    receivedBytes += value.length;
    onProgress(receivedBytes, totalBytes);
  }

  return new Blob(chunks as BlobPart[]);
}

export default function EarPiercingInvitation() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // Dynamic Asset URLs (Initial default network paths, updated to Blob Object URLs on cache hit)
  const [assetUrls, setAssetUrls] = useState({
    p1: `${basePath}/p1.png`,
    p2: `${basePath}/p2.png`,
    video: `${basePath}/secene_1.mp4`,
    audio: `${basePath}/Mangala-Vadhyam-Nadaswaram.mp3`
  });

  // Preloader State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

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

  // Staged Asset Downloading (Media FIRST -> Images SECOND -> Reveal Page) & Local Storage Reuse
  useEffect(() => {
    let isMounted = true;

    async function loadAssetsStaged() {
      const defaultP1 = `${basePath}/p1.png`;
      const defaultP2 = `${basePath}/p2.png`;
      const defaultVideo = `${basePath}/secene_1.mp4`;
      const defaultAudio = `${basePath}/Mangala-Vadhyam-Nadaswaram.mp3`;

      const isCachedInLocalStorage =
        typeof window !== "undefined" &&
        localStorage.getItem("poornika_assets_cached_v3") === "true";

      // 1. Check local storage / IndexedDB cache first
      if (isCachedInLocalStorage) {
        const [videoBlob, audioBlob, p1Blob, p2Blob] = await Promise.all([
          getCachedBlob("secene_1.mp4"),
          getCachedBlob("Mangala-Vadhyam-Nadaswaram.mp3"),
          getCachedBlob("p1.png"),
          getCachedBlob("p2.png")
        ]);

        if (videoBlob && audioBlob && p1Blob && p2Blob && isMounted) {
          setAssetUrls({
            video: URL.createObjectURL(videoBlob),
            audio: URL.createObjectURL(audioBlob),
            p1: URL.createObjectURL(p1Blob),
            p2: URL.createObjectURL(p2Blob)
          });
          setLoadingProgress(100);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => setIsLoading(false), 300);
          }, 150);
          return;
        }
      }

      // 2. First load or missing files: Staged network download
      try {
        let videoBytes = 0;
        let audioBytes = 0;
        let p1Bytes = 0;
        let p2Bytes = 0;

        // Estimated weights: Video ~12MB (60%), Audio ~4MB (20%), Images ~4MB (20%)
        const EST_VIDEO_TOTAL = 12500000;
        const EST_AUDIO_TOTAL = 4000000;
        const EST_P1_TOTAL = 2100000;
        const EST_P2_TOTAL = 2000000;
        const TOTAL_EST = EST_VIDEO_TOTAL + EST_AUDIO_TOTAL + EST_P1_TOTAL + EST_P2_TOTAL;

        const calcProgress = () => {
          const loadedSum = videoBytes + audioBytes + p1Bytes + p2Bytes;
          return Math.min(Math.round((loadedSum / TOTAL_EST) * 100), 99);
        };

        // STAGE 1: Download Large Media Files FIRST (secene_1.mp4 & Mangala-Vadhyam-Nadaswaram.mp3)
        const [videoBlob, audioBlob] = await Promise.all([
          fetchWithProgress(defaultVideo, (rec, tot) => {
            videoBytes = rec;
            if (isMounted) setLoadingProgress(calcProgress());
          }).then(async (blob) => {
            await setCachedBlob("secene_1.mp4", blob);
            return blob;
          }),
          fetchWithProgress(defaultAudio, (rec, tot) => {
            audioBytes = rec;
            if (isMounted) setLoadingProgress(calcProgress());
          }).then(async (blob) => {
            await setCachedBlob("Mangala-Vadhyam-Nadaswaram.mp3", blob);
            return blob;
          })
        ]);

        // STAGE 2: Download Image Files NEXT (p1.png & p2.png)
        const [p1Blob, p2Blob] = await Promise.all([
          fetchWithProgress(defaultP1, (rec, tot) => {
            p1Bytes = rec;
            if (isMounted) setLoadingProgress(calcProgress());
          }).then(async (blob) => {
            await setCachedBlob("p1.png", blob);
            return blob;
          }),
          fetchWithProgress(defaultP2, (rec, tot) => {
            p2Bytes = rec;
            if (isMounted) setLoadingProgress(calcProgress());
          }).then(async (blob) => {
            await setCachedBlob("p2.png", blob);
            return blob;
          })
        ]);

        // STAGE 3: All assets loaded -> Store flag & reveal app seamlessly
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("poornika_assets_cached_v3", "true");
          } catch (e) { }
        }

        if (isMounted) {
          setAssetUrls({
            video: URL.createObjectURL(videoBlob),
            audio: URL.createObjectURL(audioBlob),
            p1: URL.createObjectURL(p1Blob),
            p2: URL.createObjectURL(p2Blob)
          });
          setLoadingProgress(100);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => setIsLoading(false), 400);
          }, 200);
        }
      } catch (err) {
        // Fallback gracefully on network error
        if (isMounted) {
          setLoadingProgress(100);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => setIsLoading(false), 300);
          }, 200);
        }
      }
    }

    loadAssetsStaged();

    return () => {
      isMounted = false;
    };
  }, [basePath]);

  // Background Nadaswaram Music & Mobile Video Autoplay Effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Lite volume (20%)
    }

    const playVideosAndAudio = () => {
      // Force play videos for mobile browsers
      const videoElements = document.querySelectorAll("video");
      videoElements.forEach((vid) => {
        vid.muted = true;
        vid.setAttribute("muted", "");
        vid.setAttribute("playsinline", "");
        vid.play().catch(() => { });
      });

      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.2; // Lite volume
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch((err) => {
          console.log("Autoplay waiting for user touch:", err);
        });
      }
    };

    playVideosAndAudio();

    // Auto-resume video & audio on first user touch/click/scroll anywhere on page (essential for iOS/Android battery saver)
    const handleUserInteraction = () => {
      playVideosAndAudio();
    };

    window.addEventListener("touchstart", handleUserInteraction, { passive: true });
    window.addEventListener("touchend", handleUserInteraction, { passive: true });
    window.addEventListener("click", handleUserInteraction, { passive: true });
    window.addEventListener("scroll", handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("touchend", handleUserInteraction);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.volume = 0.2; // Lite volume
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



  const mapsUrl =
    "https://maps.app.goo.gl/ZjvbQTxL5djhuXxR9";

  return (
    <div className="relative min-h-screen h-[100dvh] w-full flex items-center justify-center bg-black overflow-hidden text-amber-50 selection:bg-amber-500 selection:text-black font-sans">

      {/* PRELOADER SCREEN */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0703] text-amber-100 transition-opacity duration-700 ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
          <div className="flex flex-col items-center gap-4 p-6 max-w-sm text-center">
            {/* Diya Glow Icon */}
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-b from-amber-500/20 to-yellow-600/10 border border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.4)] animate-pulse">
              <span className="text-4xl">🪔</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-300 tracking-widest uppercase">
                ஸ்ரீ பெரியாண்டவர் துணை
              </div>
              <h2 className="text-lg font-black gold-text-gradient">
                ஜ வி பூர்ணிகா காதணி விழா
              </h2>
              <p className="text-[11px] text-amber-200/70 font-medium">
                அழைப்பிதழ் தயார் செய்யப்படுகிறது...
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-48 h-2 bg-amber-950/80 rounded-full border border-amber-500/30 overflow-hidden shadow-inner mt-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-[10px] text-amber-400 font-bold tracking-wider">
              {loadingProgress}%
            </div>
          </div>
        </div>
      )}

      {/* Automatic Background Nadaswaram Audio Player */}
      <audio
        ref={audioRef}
        src={assetUrls.audio}
        autoPlay
        loop
        playsInline
      />

      {/* Ambient Blurred Background Video for Large Screen Desktop View */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden hidden sm:block pointer-events-none">
        <video
          ref={(el) => { if (el) el.muted = true; }}
          src={assetUrls.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* VERTICAL VIEW CONTAINER (Centered 9:16 Mobile Aspect Frame on Desktop) */}
      <div className="relative z-10 w-full max-w-[440px] h-[100dvh] min-h-[100dvh] sm:min-h-0 sm:h-auto sm:max-h-[96vh] sm:aspect-[9/16] flex flex-col justify-between items-center p-2 sm:p-4 overflow-hidden sm:rounded-[2.5rem] sm:border-2 sm:border-amber-400/50 sm:shadow-[0_0_70px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.35)] bg-black">

        {/* Main Background Video Inside Vertical Container */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            ref={(el) => {
              (video2Ref as any).current = el;
              if (el) {
                el.muted = true;
                el.play().catch(() => { });
              }
            }}
            src={assetUrls.video}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-100 scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 pointer-events-none z-0" />
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
        <header className="w-full max-w-md z-30 flex items-center justify-between pt-0.5 px-1 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="bg-black/65 hover:bg-black/80 border border-amber-400/40 backdrop-blur-md rounded-full p-1.5 text-amber-200 transition shadow-md"
              title="Share Invitation"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-black/60 border border-amber-400/50 backdrop-blur-md rounded-full px-3 py-0.5 text-[10px] sm:text-xs font-bold text-amber-200 shadow-md">
            <span>🪔</span>
            <span className="tracking-wider">ஸ்ரீ பெரியாண்டவர் துணை</span>
            <span>🪔</span>
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
        <main className="w-full max-w-md flex-1 z-20 flex flex-col justify-evenly items-center text-center my-auto py-0.5 px-1 overflow-hidden">

          {/* Divine Invocation & Event Title */}
          <div className="flex flex-col items-center gap-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold gold-text-gradient font-custom-1 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              காதணி விழா அழைப்பிதழ்
            </h1>
          </div>

          {/* Parents & Daughter Tag */}
          <div className="space-y-0.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
            <p className="text-amber-100 text-[11px] sm:text-sm font-bold">
              <span>திரு ஜெயராஜ்</span> &amp; <span>திருமதி விஷாலி</span>
            </p>
            <p className="text-amber-200/90 text-[10px] sm:text-[11px] font-medium">அவர்களின் அன்பு மகள்</p>
          </div>

          {/* Child's Name Badge */}
          <div className="relative group my-0.5">
            <div className="relative bg-black/75 backdrop-blur-md border border-amber-400/60 px-4 py-1 rounded-lg shadow-xl">
              <h2 className="text-base sm:text-lg font-black text-amber-100 tracking-wider flex items-center justify-center gap-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                <span>✨</span>
                <span className="gold-text-gradient">ஜெ வி பூர்ணிகா</span>
                <span>✨</span>
              </h2>
            </div>
          </div>

          {/* CENTERPIECE: Arch / Dome Frame (Matches user reference image) */}
          <div className="relative my-0.5 flex flex-col items-center shrink-0">

            {/* Arch Frame Container: Perfect Arch Dome Top (rounded-t-full) with Crimson Outer Ring */}
            <div className="relative w-48 h-56 sm:w-52 sm:h-64 rounded-t-full rounded-b-2xl p-1 bg-[#800000] border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] overflow-hidden flex items-center justify-center transition-transform duration-500 hover:scale-105">

              {/* Inner Gold Rim & Maroon Inner Line */}
              <div className="w-full h-full rounded-t-full rounded-b-xl p-1 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-600 border border-[#800000] overflow-hidden relative">
                <div className={`arch w-full h-full rounded-t-full rounded-b-lg overflow-hidden relative bg-amber-950 ${hasWished ? "blessed" : ""}`}>

                  {/* Initial Baby Image (p1.png) */}
                  <div
                    className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${hasWished ? "opacity-0 scale-95" : "opacity-100 scale-100"
                      }`}
                  >
                    <Image
                      src={assetUrls.p1}
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
                      src={assetUrls.p2}
                      alt="Baby Poornika with Ear Rings"
                      fill
                      sizes="208px"
                      className="object-cover rounded-t-full rounded-b-lg"
                      priority
                    />
                  </div>

                  {/* Right Earring */}
                  <div className="earring right" id="earR">
                    <svg viewBox="0 0 20 34" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="jimGoldRight" cx="35%" cy="30%" r="75%">
                          <stop offset="0%" stopColor="#FCEBA8" />
                          <stop offset="55%" stopColor="#E8BB4E" />
                          <stop offset="100%" stopColor="#B8860B" />
                        </radialGradient>
                      </defs>
                      <circle cx="10" cy="3" r="2.6" fill="url(#jimGoldRight)" stroke="#8a6200" strokeWidth="0.5" />
                      <path d="M10 5.5 L10 8.5" stroke="#C99A2E" strokeWidth="1.4" strokeLinecap="round" />
                      <path
                        d="M10 8 C6.3 8 4.3 12 4.3 15.3 C4.3 18.1 6.8 19.7 10 19.7 C13.2 19.7 15.7 18.1 15.7 15.3 C15.7 12 13.7 8 10 8 Z"
                        fill="url(#jimGoldRight)"
                        stroke="#8a6200"
                        strokeWidth="0.6"
                      />
                      <path d="M6.6 14.2 C7.7 15.3 12.3 15.3 13.4 14.2" fill="none" stroke="#8a6200" strokeWidth="0.5" opacity="0.7" />
                      <path d="M5.6 11.6 C7.2 9.6 12.8 9.6 14.4 11.6" fill="none" stroke="#fff6d8" strokeWidth="0.5" opacity="0.6" />
                      <ellipse cx="10" cy="19.7" rx="5.7" ry="1.3" fill="#C99A2E" stroke="#8a6200" strokeWidth="0.4" />
                      <path d="M10 21 L10 23.2" stroke="#8a6200" strokeWidth="0.8" />
                      <circle cx="10" cy="25.2" r="2.1" fill="#9C1F3D" stroke="#6b0f22" strokeWidth="0.4" />
                      <circle cx="9.3" cy="24.5" r="0.6" fill="#e59aab" opacity="0.8" />
                    </svg>
                  </div>

                  {/* Left Earring */}
                  <div className="earring left-half" id="earL">
                    <svg viewBox="0 0 20 34" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="jimGoldLeft" cx="35%" cy="30%" r="75%">
                          <stop offset="0%" stopColor="#FCEBA8" />
                          <stop offset="55%" stopColor="#E8BB4E" />
                          <stop offset="100%" stopColor="#B8860B" />
                        </radialGradient>
                      </defs>
                      <circle cx="10" cy="3" r="2.6" fill="url(#jimGoldLeft)" stroke="#8a6200" strokeWidth="0.5" />
                      <path d="M10 5.5 L10 8.5" stroke="#C99A2E" strokeWidth="1.4" strokeLinecap="round" />
                      <path
                        d="M10 8 C6.3 8 4.3 12 4.3 15.3 C4.3 18.1 6.8 19.7 10 19.7 C13.2 19.7 15.7 18.1 15.7 15.3 C15.7 12 13.7 8 10 8 Z"
                        fill="url(#jimGoldLeft)"
                        stroke="#8a6200"
                        strokeWidth="0.6"
                      />
                      <path d="M6.6 14.2 C7.7 15.3 12.3 15.3 13.4 14.2" fill="none" stroke="#8a6200" strokeWidth="0.5" opacity="0.7" />
                      <path d="M5.6 11.6 C7.2 9.6 12.8 9.6 14.4 11.6" fill="none" stroke="#fff6d8" strokeWidth="0.5" opacity="0.6" />
                      <ellipse cx="10" cy="19.7" rx="5.7" ry="1.3" fill="#C99A2E" stroke="#8a6200" strokeWidth="0.4" />
                      <path d="M10 21 L10 23.2" stroke="#8a6200" strokeWidth="0.8" />
                      <circle cx="10" cy="25.2" r="2.1" fill="#9C1F3D" stroke="#6b0f22" strokeWidth="0.4" />
                      <circle cx="9.3" cy="24.5" r="0.6" fill="#e59aab" opacity="0.8" />
                    </svg>
                  </div>

                </div>
              </div>
            </div>

            {/* WISH BUTTON */}
            <div className="mt-1 flex flex-col items-center gap-0.5">
              <button
                onClick={handleWish}
                className={`relative group px-5 py-1 rounded-full font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-1.5 ${hasWished
                  ? "text-white hover:brightness-110 animate-bounce"
                  : "text-amber-950 hover:scale-105 animate-bounce"
                  }`}
              >
                <span>
                  {hasWished ? "🌸 நன்றி 🌸" : <span className="text-xl">🙌🏻</span>}
                </span>
              </button>
            </div>
          </div>

          {/* Short Invitation Wording */}
          <p className="text-amber-100 text-[10px] sm:text-xs leading-tight max-w-xs font-semibold px-1 drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            காது குத்தும் விழாவில் கலந்துகொண்டு பூர்ணிகாவை ஆசீர்வதிக்குமாறு அன்புடன் கேட்டு கொள்கிறோம்.
          </p>

          {/* EVENT DETAILS GRID (Compact Mobile Cards) */}
          <div className="w-full grid grid-cols-2 gap-1.5 mt-0.5 text-left">

            {/* Date & Time Pill */}
            <div className="bg-black/65 border border-amber-400/40 backdrop-blur-md rounded-xl p-1.5 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-300 font-bold text-[10px]">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>தேதி &amp; நேரம்</span>
                </div>
              </div>
              <div className="mt-0.5">
                <div className="text-[11px] sm:text-xs font-black text-amber-100">16 ஆகஸ்ட் 2026</div>
                <div className="text-[9px] text-amber-300/90 font-medium">காலை 10:30 - 12:00 PM</div>
              </div>
            </div>

            {/* Venue & Location Pill */}
            <div className="bg-black/65 border border-amber-400/40 backdrop-blur-md rounded-xl p-1.5 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-300 font-bold text-[10px]">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>இடம் (Venue)</span>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8.5px] bg-gradient-to-r from-amber-500 to-yellow-500 text-amber-950 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shadow-xs"
                >
                  <Navigation className="w-2.5 h-2.5" /> Maps
                </a>
              </div>
              <div className="mt-0.5">
                <div className="text-[10.5px] sm:text-xs font-bold text-amber-100 leading-tight">
                  ஸ்ரீ பெரியாண்டவர் திருக்கோவில்
                </div>
                <div className="text-[9px] text-amber-200/90 font-medium mt-0.2">கீழ்குமாரமங்கலம், கடலூர்</div>
              </div>
            </div>
          </div>

          {/* COUNTDOWN TIMER STRIP */}
          <div className="w-full mt-0.5 flex items-center justify-center gap-1.5">
            <span className="text-[9.5px] text-amber-300 font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              ⏳ விழா ஆரம்பிக்க:
            </span>
            <div className="flex items-center gap-1">
              {[
                { label: "நாட்கள்", val: timeLeft.days },
                { label: "மணி", val: timeLeft.hours },
                { label: "நிமிடம்", val: timeLeft.minutes },
                { label: "நொடி", val: timeLeft.seconds }
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="bg-black/70 border border-amber-400/40 rounded-lg px-1.5 py-0.2 flex items-baseline gap-0.5 shadow-md"
                >
                  <span className="text-[11px] font-black text-amber-200">{String(unit.val).padStart(2, "0")}</span>
                  <span className="text-[7.5px] text-amber-400">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* FOOTER */}
        <footer className="w-full max-w-md z-20 text-center text-[9px] sm:text-[10px] text-amber-200/80 font-semibold pb-0.5 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          ✨ ஜெயராஜ் &amp; விஷாலி குடும்பத்தினரின் காதணி விழா அழைப்பு ✨
        </footer>

      </div>
    </div>
  );
}
