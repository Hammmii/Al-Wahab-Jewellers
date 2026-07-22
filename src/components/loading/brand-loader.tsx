/**
 * Premium brand loader — a faceted gold seal that draws itself, then the
 * brand wordmark fades in. Used as the route loading state (app/loading.tsx)
 * and the first-visit intro. Server-renderable (no client effects needed:
 * everything is CSS-driven so it works during SSR).
 */

export function BrandLoader({ fullScreen = true }: { fullScreen?: boolean }) {
  return (
    <div
      className={`bg-hero-pattern flex items-center justify-center ${
        fullScreen ? 'fixed inset-0 z-[100]' : 'min-h-[60vh]'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Faceted gold seal that draws on load */}
        <svg
          viewBox="0 0 100 100"
          className="h-16 w-16 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M50,4 L80,22 L92,50 L80,78 L50,96 L20,78 L8,50 L20,22 Z"
            className="loader-draw"
          />
          <path d="M50,4 L50,96 M8,50 L92,50" strokeWidth="0.75" opacity="0.45" className="loader-draw loader-draw-delay" />
          <text x="50" y="60" textAnchor="middle" fontFamily="var(--font-headline), serif" fontSize="32" fill="currentColor" stroke="none" className="loader-fade">
            AW
          </text>
        </svg>

        <div className="loader-fade loader-fade-delay text-center">
          <p className="font-urdu text-2xl text-gold-shimmer">الوَہاب جیولرز</p>
          <p className="mt-1 font-headline text-sm uppercase tracking-luxury text-muted-foreground">
            Al-Wahab Jewellers
          </p>
        </div>

        {/* Thin gold progress shimmer */}
        <div className="h-px w-32 overflow-hidden bg-border">
          <span className="block h-full w-1/2 bg-primary loader-progress" />
        </div>
      </div>

      <style>{`
        @keyframes loaderDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes loaderFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderProgress {
          0% { transform: translateX(-110%); }
          100% { transform: translateX(220%); }
        }
        .loader-draw {
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          animation: loaderDraw 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .loader-draw-delay { animation-delay: 0.15s; }
        .loader-fade {
          opacity: 0;
          animation: loaderFade 0.6s ease forwards;
        }
        .loader-fade-delay { animation-delay: 0.55s; }
        .loader-progress {
          animation: loaderProgress 1.1s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .loader-draw { stroke-dashoffset: 0; animation: none; }
          .loader-fade { opacity: 1; animation: none; }
          .loader-progress { animation: none; }
        }
      `}</style>
    </div>
  )
}
