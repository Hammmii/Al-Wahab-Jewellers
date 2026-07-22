import type { DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * Minimal JSX type for the <model-viewer> web component from @google/model-viewer.
 * Only the attributes we use are declared; the rest pass through as strings.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        alt?: string
        'auto-rotate'?: boolean
        'rotation-per-second'?: string
        'camera-controls'?: boolean
        'shadow-intensity'?: string
        ar?: boolean
        'ar-modes'?: string
        'environment-image'?: string
      }
    }
  }
}

export {}
