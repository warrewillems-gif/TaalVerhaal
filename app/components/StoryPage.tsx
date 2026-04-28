import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { stories } from "../data/stories";
import { ArrowLeft } from "lucide-react";

interface TrackState {
  active: boolean;
  progress: number;
  playing: boolean;
}

const storyThemes = [
  {
    // Vosje Bakt Brood — warm sandy/beige
    pageBg: "linear-gradient(160deg, #fdf6e3 0%, #faecd0 100%)",
    blob1: "rgba(217,119,6,0.18)",
    blob2: "rgba(251,191,36,0.15)",
    cardBorder: "#d97706",
    cardShadow: "rgba(217,119,6,0.3)",
    tagBg: "#fef9c3",
    tagColor: "#92400e",
    progressBorder: "#fbbf24",
    dotColor: "#d97706",
    lockedBorder: "#e5c88a",
    lockedBg: "rgba(254,249,195,0.6)",
  },
  {
    // Pingu op het Strand — ocean sky blue & sandy
    pageBg: "linear-gradient(160deg, #e0f7fa 0%, #e8f4ff 60%, #fff9e6 100%)",
    blob1: "rgba(56,189,248,0.22)",
    blob2: "rgba(251,191,36,0.18)",
    cardBorder: "#38bdf8",
    cardShadow: "rgba(56,189,248,0.35)",
    tagBg: "#e0f2fe",
    tagColor: "#0369a1",
    progressBorder: "#38bdf8",
    dotColor: "#0ea5e9",
    lockedBorder: "#bae6fd",
    lockedBg: "rgba(224,242,254,0.7)",
  },
];

function TrackIcon({ icon, size = 36 }: { icon: string; size?: number }) {
  const isImage = icon.length > 8 || icon.includes("/") || icon.includes(".");
  if (isImage) {
    return (
      <img
        src={icon}
        alt=""
        style={{ width: size, height: size, objectFit: "contain", display: "block" }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.7 }}>{icon}</span>;
}

export function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const story = stories.find((s) => s.id === id);
  const storyIndex = stories.findIndex((s) => s.id === id);
  const theme = storyThemes[storyIndex] ?? storyThemes[0];

  const [trackStates, setTrackStates] = useState<TrackState[]>(
    () => story?.tracks.map(() => ({ active: false, progress: 0, playing: false })) ?? []
  );
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Keyboard shortcuts: press a track's keyBinding to activate it
  useEffect(() => {
    if (!story) return;
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Space key stops the currently playing audio
      if (e.key === " ") {
        e.preventDefault();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.ontimeupdate = null;
          audioRef.current.onended = null;
          audioRef.current.onerror = null;
          audioRef.current = null;
        }
        setTrackStates((prev) =>
          prev.map((t) => ({ ...t, playing: false, active: false, progress: 0 }))
        );
        return;
      }

      const index = story!.tracks.findIndex(
        (t) => t.keyBinding.toLowerCase() === e.key.toLowerCase()
      );
      if (index !== -1) {
        handleTrackClick(index);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [story, trackStates]);

  if (!story) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-gray-600"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        Verhaal niet gevonden.
      </div>
    );
  }

  function handleTrackClick(index: number) {
    if (story!.tracks[index].disabled) return;

    const state = trackStates[index];

    // Toggle play / pause when clicking the already-active chapter
    if (state.active && audioRef.current) {
      if (state.playing) {
        audioRef.current.pause();
        setTrackStates((prev) =>
          prev.map((t, i) => (i === index ? { ...t, playing: false } : t))
        );
      } else {
        audioRef.current.play().catch(() => {
          // Browser may block autoplay; silently ignore
        });
        setTrackStates((prev) =>
          prev.map((t, i) => (i === index ? { ...t, playing: true } : t))
        );
      }
      return;
    }

    // Stop and discard the currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.ontimeupdate = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    // Mark the new track as active immediately
    setTrackStates((prev) =>
      prev.map((t, i) => ({
        active: i === index,
        progress: i === index ? 0 : t.progress,
        playing: i === index,
      }))
    );

    const audio = new Audio(story!.tracks[index].audioSrc);
    audioRef.current = audio;

    audio.ontimeupdate = () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      setTrackStates((prev) =>
        prev.map((t, i) => (i === index ? { ...t, progress } : t))
      );
    };

    audio.onended = () => {
      setTrackStates((prev) =>
        prev.map((t, i) => (i === index ? { ...t, progress: 100, playing: false } : t))
      );
    };

    audio.onerror = () => {
      // Audio file not found or failed to load — reset without crashing
      setTrackStates((prev) =>
        prev.map((t, i) => (i === index ? { ...t, active: false, playing: false, progress: 0 } : t))
      );
    };

    audio.play().catch(() => {
      // Browser blocked autoplay or file unavailable
      setTrackStates((prev) =>
        prev.map((t, i) => (i === index ? { ...t, active: false, playing: false, progress: 0 } : t))
      );
    });
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: theme.pageBg, fontFamily: "'Nunito', sans-serif" }}
    >
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl"
          style={{ background: theme.blob1 }}
        />
        <div
          className="absolute bottom-10 -left-16 w-72 h-72 rounded-full blur-3xl"
          style={{ background: theme.blob2 }}
        />
      </div>

      {/* Header */}
      <header className="relative px-6 pt-8 pb-4">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            style={{ fontWeight: 700, fontSize: "0.9rem" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Terug
          </button>
        </div>
      </header>

      <div className="relative max-w-xl mx-auto px-6 pb-20">
        {/* Story hero card */}
        <div
          className="rounded-3xl overflow-hidden mb-8 mt-4"
          style={{
            background: "#fff",
            border: `3px solid ${theme.cardBorder}`,
            boxShadow: `0 6px 0 ${theme.cardShadow}`,
          }}
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover"
              style={storyIndex === 0 ? { objectPosition: "center 25%" } : {}}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  storyIndex === 0
                    ? "linear-gradient(to top, rgba(253,246,227,0.92) 0%, transparent 55%)"
                    : "linear-gradient(to top, rgba(224,242,254,0.9) 0%, transparent 60%)",
              }}
            />
            <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow">
              {story.emoji}
            </div>
          </div>
          <div className="px-6 py-4">
            <div
              className="inline-block px-3 py-1 rounded-full mb-2"
              style={{
                background: theme.tagBg,
                color: theme.tagColor,
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              {story.language}
            </div>
            <h1 className="text-gray-800" style={{ fontWeight: 900, fontSize: "1.6rem", lineHeight: 1.2 }}>
              {story.title}
            </h1>
            {story.titleArabic && (
              <p
                className="text-gray-400 mt-0.5"
                style={{ fontWeight: 600, fontSize: "1rem", direction: "rtl" }}
              >
                {story.titleArabic}
              </p>
            )}
            {story.titleSecondary && (
              <p
                className="text-gray-400 mt-0.5"
                style={{ fontWeight: 700, fontSize: "1rem" }}
              >
                {story.titleSecondary}
              </p>
            )}
            <p className="text-gray-400 mt-1" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              {story.subtitle}
            </p>
          </div>
        </div>

        {/* Section label */}
        <p
          className="text-gray-400 mb-4 px-1"
          style={{ fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          🎧 Kies een hoofdstuk
        </p>

        {/* Tracks */}
        <div className="flex flex-col gap-5">
          {story.tracks.map((track, index) => {
            const state = trackStates[index];
            const isPlaying = state?.playing;
            const progress = state?.progress ?? 0;
            const isActive = state?.active;
            const isDone = !isPlaying && progress === 100;

            // Playing: full opacity. Paused-but-active: slightly dimmed. Inactive: very dimmed.
            const buttonOpacity = isPlaying ? 1 : isActive && !isDone ? 0.75 : 0.42;

            return (
              <div key={track.id}>
                {/* Button + duration row */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTrackClick(index)}
                    className="flex items-center gap-3 rounded-2xl border-2 select-none"
                    style={{
                      minWidth: "240px",
                      padding: "12px 18px",
                      cursor: "pointer",
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      color: "#fff",
                      background: isActive ? track.activeBg : track.color,
                      borderColor: isActive ? track.activeBg : track.color,
                      boxShadow: isActive ? "none" : `0 5px 0 ${track.activeShadow}`,
                      transform: isActive ? "translateY(3px)" : "none",
                      opacity: buttonOpacity,
                      transition: "opacity 0.35s ease, transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        background: "rgba(255,255,255,0.25)",
                      }}
                    >
                      <TrackIcon icon={track.icon} size={32} />
                    </div>
                    <span>{track.title}</span>
                  </button>

                  {/* Duration when not active */}
                  {!isActive && !isDone && (
                    <span className="text-gray-400 flex-shrink-0" style={{ fontWeight: 700, fontSize: "0.82rem", opacity: buttonOpacity, transition: "opacity 0.35s ease" }}>
                      {track.duration}
                    </span>
                  )}
                </div>

                {/* Progress panel */}
                {(isActive || isDone) && (
                  <div
                    className="mt-3 rounded-2xl px-4 py-3"
                    style={{
                      background: "#fff",
                      border: `2px solid ${isActive ? theme.progressBorder : "#e5e7eb"}`,
                      boxShadow: "0 3px 0 rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-500" style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                        {isPlaying ? "▶️ Bezig…" : isDone ? "✅ Klaar!" : isActive ? "⏸️ Gepauzeerd" : ""}
                      </span>
                      <span className="text-gray-400" style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                        {track.duration}
                      </span>
                    </div>

                    {/* Big chunky progress bar */}
                    <div className="h-5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${track.progressColor}`}
                        style={{
                          width: `${progress}%`,
                          transition: isPlaying ? "width 80ms linear" : "width 0.4s ease",
                        }}
                      />
                    </div>

                    {/* Bouncing dots when playing */}
                    {isPlaying && (
                      <div className="flex items-end justify-center gap-1 mt-3" style={{ height: "22px" }}>
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-2 rounded-full"
                            style={{
                              background: theme.dotColor,
                              animation: `bounce 0.7s ease-in-out ${i * 0.12}s infinite alternate`,
                              height: "8px",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Locked notice — hidden since all chapters are now unlocked */}
      </div>

      <style>{`
        @keyframes bounce {
          from { height: 6px; opacity: 0.6; }
          to { height: 20px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}