'use client'

/**
 * AR / 3D viewer using <model-viewer> (a web component).
 * Loaded dynamically (SSR off) because it's a custom element.
 *
 * HONEST MODE: shows a rotating 3D model on screen and, on supported mobile
 * browsers, launches AR Quick Look (iOS) / Scene Viewer (Android) to place the
 * piece in the user's space. Requires a real .glb/.gltf asset per product —
 * until models are supplied we show an honest empty state.
 */
export function ArViewer({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card text-center text-muted-foreground">
        <span className="text-primary"><RingGlyph /></span>
        <p className="max-w-xs px-6 text-sm">
          3D &amp; AR previews arrive as we add 3D models for each piece. Meanwhile, try the
          photo preview below — or visit our Multan showroom to try pieces on for real.
        </p>
      </div>
    )
  }

  return (
    <model-viewer
      src={src}
      alt={alt}
      auto-rotate
      rotation-per-second="30deg"
      camera-controls
      shadow-intensity="1"
      ar
      ar-modes="webxr scene-viewer quick-look"
      environment-image="neutral"
      style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '0.75rem', background: 'hsl(var(--card))' }}
    >
      <button
        slot="ar-button"
        className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
      >
        View in your space
      </button>
    </model-viewer>
  )
}

function RingGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
      <circle cx="12" cy="15.5" r="5.5" />
      <path d="M12 3.5 L15.7 7.2 L12 11 L8.3 7.2 Z" />
      <path d="M12 3.5 L12 11 M8.3 7.2 L15.7 7.2" />
    </svg>
  )
}
