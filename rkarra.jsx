import React, { useEffect, useState, useRef } from "react";

// Root App with sidebar nav + theme toggle
export default function App() {
  const [page, setPage] = useState("sammy");
  const [activePost, setActivePost] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? "bg-neutral-900 text-neutral-100" : "bg-white text-neutral-800"}`}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-52 flex flex-col justify-between py-8 px-6">
        <nav className="space-y-2 text-sm tracking-tight">
          {[
            { id: "sammy", label: "sammy" },
            { id: "build", label: "build" },
            { id: "book", label: "book" },
            { id: "blog", label: "blog" },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setActivePost(null);
              }}
              className={`block font-light transition text-left w-full ${page === item.id ? "text-blue-600" : "text-neutral-700 dark:text-neutral-200 hover:text-blue-500"}`}
            >
              <div className="flex flex-col items-start">
                <span className="text-neutral-400 text-xs mb-0.5">{String(i + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
        {/* Footer links (contact lives here, not in the menu) */}
        <div className="space-y-0.5 text-sm text-neutral-400">
          {["twitter", "cosmos", "substack", "contact"].map((l) => (
            <a
              key={l}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (l === "contact") setPage("contact");
              }}
              className="block hover:text-neutral-600"
            >
              {l}
            </a>
          ))}
        </div>
      </aside>

      {/* Content area occupies the left half */}
      <main className="ml-44 w-1/2 px-10 py-20 text-base leading-relaxed relative overflow-hidden">
        <div className="max-w-2xl w-full">
          {page === "sammy" && <SammyPage darkMode={darkMode} />}
          {page === "build" && <BuildPage />}
          {page === "book" && <BookPage />}
          {page === "blog" && <BlogPage setActivePost={setActivePost} activePost={activePost} />}
          {page === "contact" && <ContactPage setPage={setPage} />}
        </div>

        {/* Theme toggle (text only) */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className={`fixed bottom-6 right-8 text-xs cursor-pointer transition ${darkMode ? "text-neutral-300 hover:text-neutral-100" : "text-neutral-500 hover:text-neutral-800"}`}
          aria-label="toggle theme"
        >
          {darkMode ? "light" : "dark"}
        </div>
      </main>
    </div>
  );
}

// =============== Pages ===============
function SammyPage({ darkMode }) {
  // subtle animated grainy circle on the right side
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      // occupy the right half only for the grain effect
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      canvas.width = Math.max(1, Math.floor(vw));
      canvas.height = Math.max(1, Math.floor(vh));
    }
    resize();

    let raf;
    const draw = () => {
      const { width: w, height: h } = canvas;
      // bail if not ready
      if (!w || !h) {
        raf = requestAnimationFrame(draw);
        return;
      }
      // clear
      ctx.clearRect(0, 0, w, h);

      // create a radial gradient center-right
      const cx = Math.floor(w * 0.72);
      const cy = Math.floor(h * 0.55);
      const r = Math.floor(Math.min(w, h) * 0.25);
      const g = ctx.createRadialGradient(cx, cy, 1, cx, cy, r);
      // light/dark tones
      if (darkMode) {
        g.addColorStop(0, "rgba(255,255,255,0.18)");
        g.addColorStop(1, "rgba(255,255,255,0)");
      } else {
        g.addColorStop(0, "rgba(0,0,0,0.18)");
        g.addColorStop(1, "rgba(0,0,0,0)");
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // add grain
      const tile = 64;
      const off = new OffscreenCanvas(tile, tile);
      const octx = off.getContext("2d");
      const img = octx.createImageData(tile, tile);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 255;
        img.data[i] = v; // r
        img.data[i + 1] = v; // g
        img.data[i + 2] = v; // b
        img.data[i + 3] = 32; // a
      }
      octx.putImageData(img, 0, 0);
      // pattern and composite inside circle
      const pat = ctx.createPattern(off, "repeat");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = pat;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <section className="pl-4 relative">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />
      <p>
        these days i spend my time thinking about the {" "}
        <a href="#next-project" className="font-semibold underline underline-offset-2 hover:text-neutral-500">next project</a> to build. previously, i cofounded {" "}
        <a href="https://www.parasight.ca" className="font-semibold underline underline-offset-2 hover:text-neutral-500">ParaSight</a>, a computational microscope for diagnosing malaria at 50x cost and time savings.
      </p>
      <p className="mt-4">
        outside of my current role as a quant developer at a small fund, i enjoy reading (tech, healthcare, and psychology), eating yummy {" "}
        <a href="#burgers" className="font-semibold underline underline-offset-2 hover:text-neutral-500">burgers</a>, and just playing.
      </p>
      <p className="mt-4">i grew up in london (ontario), studied engineering/business in canada, and am now working and living in toronto.</p>
      <p className="mt-4">currently, i am most looking forward to the day i ride motorcycles. my favourite anime is Akira.</p>
    </section>
  );
}

function BuildPage() {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    let abort = new AbortController();
    async function fetchQuote() {
      try {
        const res = await fetch("https://api.quotable.io/random", { signal: abort.signal });
        const data = await res.json();
        setQuote({ content: data.content, author: data.author });
      } catch {
        // sandbox fallback
        setQuote({ content: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" });
      }
    }
    fetchQuote();
    return () => abort.abort();
  }, []);

  return (
    <section className="pl-4">
      <p>i am a builder at heart, here is some of my work and some of the things i am working on.</p>
      {quote && <p className="italic mt-3">“{quote.content}” — {quote.author}</p>}
      <div className="mt-8 border-t border-neutral-200 pt-6 space-y-6">
        <div>
          <p className="font-medium">
            <a href="https://www.parasight.ca" className="no-underline text-inherit hover:text-neutral-500 inline-flex items-center gap-1">
              ParaSight <span className="text-neutral-500 text-sm align-middle" aria-hidden>↗</span>
            </a>
          </p>
          <p className="text-neutral-500 text-sm">computational malaria diagnostic tool</p>
        </div>
        <div>
          <p className="font-medium">
            <a href="#something-new" className="no-underline text-inherit hover:text-neutral-500 inline-flex items-center gap-1">
              Something New <span className="text-neutral-500 text-sm align-middle" aria-hidden>↗</span>
            </a>
          </p>
          <p className="text-neutral-500 text-sm">building...</p>
        </div>
      </div>
    </section>
  );
}

function BookPage() {
  const books = [
    { title: "Why Greatness Cannot Be Planned: The Myth of the Objective", link: "#greatness" },
    { title: "Getting More: How You Can Negotiate to Succeed in Work and Life", link: "#getting-more" },
    { title: "Crime and Punishment", link: "#crime-punishment" },
    { title: "When Breath Becomes Air", link: "#breath-air" },
    { title: "Boom: Bubbles and the End of Stagnation", link: "#boom-bubbles" },
    { title: "No Longer Human", link: "#no-longer-human" },
    { title: "Flow: The Psychology of Optimal Experience", link: "#flow" },
    { title: "The Basic Laws of Human Stupidity", link: "#stupidity" },
    { title: "The AI & Healthcare Opportunity", link: "#ai-healthcare" },
    { title: "Software 2.0", link: "#software-2" },
    { title: "Situational Awareness", link: "#situational-awareness" },
    { title: "The Bitter Lesson", link: "#bitter-lesson" },
  ];

  return (
    <section className="pl-4">
      <p>things i have read that i thought were worth saving.</p>
      <p className="mt-4 italic">
        currently reading: {" "}
        <a href="#multimodal-medical-reasoning" className="underline underline-offset-4 hover:text-neutral-500">
          a paper on multimodal medical reasoning
        </a>
      </p>
      <div className="mt-6 border-t border-neutral-200 pt-6 space-y-3">
        {books.map((book, i) => (
          <p key={i} className="before:content-['*'] before:mr-2 before:text-black">
            <a href={book.link} className="no-underline text-inherit hover:text-neutral-500">
              {book.title}
            </a>
          </p>
        ))}
      </div>
    </section>
  );
}

function BlogPage({ setActivePost, activePost }) {
  const posts = [
    { title: "fabricated serendipity revisited", date: "Oct 19, 2025", content: "" },
    {
      title: "fabricated serendipity",
      date: "Aug 24, 2025",
      content:
        `i used to just accept the fact that some people were "luckier" than me...\n\nthis is a sample body for preview.`,
    },
  ];

  if (activePost) {
    return (
      <section className="pl-4 animate-[fadeIn_0.8s_ease-out]">
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
        <h2 className="text-xl font-semibold hover:text-neutral-500 transition-colors duration-200">{activePost.title}</h2>
        <p className="text-neutral-500 text-sm mt-1">{activePost.date}</p>
        <div className="border-t border-neutral-200 mt-4 pt-4 whitespace-pre-line leading-relaxed hover:text-neutral-500 transition-colors duration-200">{activePost.content}</div>
        <button onClick={() => setActivePost(null)} className="mt-8 text-neutral-600 hover:text-neutral-500">← Back to blog</button>
      </section>
    );
  }

  return (
    <section className="pl-4 animate-[fadeIn_1s_ease-out]">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
      <p>my inner thoughts written down.</p>
      <div className="mt-6 border-t border-neutral-200 pt-6 space-y-4">
        {posts.map((post) => (
          <div key={post.title} onClick={() => setActivePost(post)} className="flex justify-between cursor-pointer duration-300 hover:text-neutral-500">
            <span>{post.title}</span>
            <span className="text-neutral-500 text-sm">{post.date}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactPage({ setPage }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <section className="pl-4 w-full flex flex-col items-center justify-center min-h-screen text-center animate-[fadeIn_0.8s_ease-out]">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
      <div className="flex flex-col items-center space-y-3">
        <p className="text-base text-neutral-600 dark:text-neutral-300">sfarnum1132 [at] gmail [dot] com</p>
        <button onClick={() => setPage("sammy")} className="text-neutral-600 hover:text-neutral-500 text-sm">home</button>
      </div>
    </section>
  );
}

// =============== Simple smoke tests (console only) ===============
(function smoke() {
  try {
    console.assert(typeof SammyPage === "function", "SammyPage missing");
    console.assert(typeof BuildPage === "function", "BuildPage missing");
    console.assert(typeof BookPage === "function", "BookPage missing");
    console.assert(typeof BlogPage === "function", "BlogPage missing");
    console.assert(typeof ContactPage === "function", "ContactPage missing");
    console.log("[SmokeTests] PASS — core components present.");
  } catch (e) {
    console.warn("[SmokeTests] FAIL", e);
  }
})();
