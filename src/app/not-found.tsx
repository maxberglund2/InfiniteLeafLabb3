"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: "#18230F" }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #27391C 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #1F7D53 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-2xl text-center relative z-10 p-8">
        {/* Decorative leaf icons */}
        <div className="text-8xl mb-6 animate-bounce">🍃</div>

        <h1
          className="text-8xl md:text-9xl font-extrabold text-white mb-4 tracking-wider"
          style={{ lineHeight: 1 }}
        >
          404
        </h1>

        <div className="h-1 w-24 bg-emerald mx-auto mb-6" />

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-wider">
          PATH NOT FOUND
        </h2>

        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg mx-auto">
          The page you're looking for has drifted away like leaves in the wind.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <button className="px-8 py-4 bg-linear-to-r from-jade to-emerald hover:from-emerald hover:to-jade text-white font-bold text-sm tracking-wider transition-all duration-300 transform hover:scale-105 rounded-lg shadow-lg">
              RETURN HOME
            </button>
          </Link>
          <Link href="#menu">
            <button className="px-8 py-4 text-white font-medium text-sm tracking-wider border-2 border-jade/50 hover:border-emerald hover:bg-emerald/10 transition-all duration-300 rounded-lg">
              VIEW MENU
            </button>
          </Link>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-jade/30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-jade/30" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-jade/30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-jade/30" />
      </div>
    </div>
  );
}
