import { useNavigate } from "react-router";
import { stories } from "../data/stories";

// Imported figma:asset URLs can resolve to various prefixes;
// reliably distinguish them from emoji by checking for path-like characters.
function isImageUrl(str: string): boolean {
  return str.length > 8 || str.includes("/") || str.includes(".");
}

const cardStyles = [
  {
    border: "#d97706",
    shadow: "rgba(217,119,6,0.35)",
    tagBg: "#fef9c3",
    tagColor: "#92400e",
    btnGradient: "linear-gradient(135deg, #f97316, #facc15)",
    btnShadow: "#c2640a",
  },
  {
    border: "#38bdf8",
    shadow: "rgba(56,189,248,0.35)",
    tagBg: "#e0f2fe",
    tagColor: "#0369a1",
    btnGradient: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
    btnShadow: "#0284c7",
  },
];

export function Overview() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #fff9e6 0%, #fef0fb 50%, #e8f4ff 100%)",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-yellow-200/50 blur-3xl" />
        <div className="absolute top-40 -right-20 w-64 h-64 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative px-6 pt-8 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
            style={{ background: "linear-gradient(135deg, #f97316, #ec4899)" }}
          >
            📚
          </div>
          <div>
            <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "#1f2937" }}>
              TaalVerhaal
            </span>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af" }}>
              Leer talen via verhalen!
            </p>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative max-w-2xl mx-auto px-6 pt-10 pb-6 text-center">
        <div className="text-5xl mb-4">🌍✨</div>
        <h1
          className="text-gray-800 mb-3"
          style={{ fontWeight: 900, fontSize: "2.2rem", lineHeight: 1.2 }}
        >
          Kies jouw verhaal!
        </h1>
        <p className="text-gray-500" style={{ fontWeight: 600, fontSize: "1.05rem" }}>
          Kies een boek en begin met luisteren. Super leuk! 🎉
        </p>
      </div>

      {/* Story Cards */}
      <div className="relative max-w-2xl mx-auto px-6 pb-20">
        <div className="flex flex-col gap-6">
          {stories.map((story, idx) => {
            const style = cardStyles[idx];
            return (
              <button
                key={story.id}
                onClick={() => navigate(`/story/${story.id}`)}
                className="group w-full text-left rounded-3xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                style={{
                  background: "#fff",
                  border: `3px solid ${style.border}`,
                  boxShadow: `0 6px 0 ${style.shadow}`,
                }}
              >
                {/* Image area */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: "center top" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        idx === 0
                          ? "linear-gradient(to top, rgba(255,237,153,0.75) 0%, transparent 55%)"
                          : "linear-gradient(to top, rgba(186,230,253,0.85) 0%, transparent 60%)",
                    }}
                  />
                  {/* Emoji badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-lg">
                    {story.emoji}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5">
                  <div
                    className="inline-block px-3 py-1 rounded-full mb-3"
                    style={{
                      background: style.tagBg,
                      color: style.tagColor,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                    }}
                  >
                    {story.language}
                  </div>

                  <h2
                    className="text-gray-800 mb-0.5"
                    style={{ fontWeight: 900, fontSize: "1.4rem" }}
                  >
                    {story.title}
                  </h2>

                  {/* Arabic subtitle for story 1 */}
                  {story.titleArabic && (
                    <p
                      className="text-gray-400 mb-2"
                      style={{ fontSize: "1rem", fontWeight: 600, direction: "rtl" }}
                    >
                      {story.titleArabic}
                    </p>
                  )}

                  {/* Secondary title for story 2 */}
                  {story.titleSecondary && (
                    <p
                      className="text-gray-400 mb-2"
                      style={{ fontSize: "1rem", fontWeight: 700 }}
                    >
                      {story.titleSecondary}
                    </p>
                  )}

                  <p className="text-gray-400 mb-2" style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    {story.subtitle}
                  </p>
                  <p className="text-gray-400 mb-5" style={{ fontWeight: 600, fontSize: "0.88rem", lineHeight: 1.5 }}>
                    {story.description}
                  </p>

                  {/* Chapter icons preview */}
                  <div className="flex items-center gap-2 mb-5">
                    {story.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
                        style={{
                          background: "#f9fafb",
                          border: "2px solid #f3f4f6",
                        }}
                      >
                        {isImageUrl(track.icon) ? (
                          <img src={track.icon} alt="" className="w-7 h-7 object-contain" />
                        ) : (
                          <span style={{ fontSize: "1.2rem" }}>{track.icon}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className="w-full py-3 rounded-2xl text-white text-center transition-all duration-200 group-hover:brightness-105"
                    style={{
                      background: style.btnGradient,
                      fontWeight: 800,
                      fontSize: "1rem",
                      boxShadow: `0 4px 0 ${style.btnShadow}`,
                    }}
                  >
                    Laten we gaan! 🚀
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}