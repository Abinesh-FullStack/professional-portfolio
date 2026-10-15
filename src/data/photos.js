// The two supplied photographs (optimised copies of the originals in
// src/assets/images/originals/). Format conversion only — no retouching or cropping.
import p1Webp from '../assets/images/photo-1.webp'
import p1WebpSm from '../assets/images/photo-1-544.webp'
import p1Png from '../assets/images/photo-1.png'
import p2Webp from '../assets/images/photo-2.webp'
import p2WebpSm from '../assets/images/photo-2-640.webp'
import p2Jpg from '../assets/images/photo-2.jpg'

export const PHOTOS = {
  // Photo 1 — transparent cut-out: hero portrait and the start of the scroll story.
  photo1: {
    webp: `${p1WebpSm} 544w, ${p1Webp} 816w`,
    fallback: p1Png,
    w: 816,
    h: 1224,
    alt: 'Abinesh V in a black suit, white shirt and striped tie',
  },
  // Photo 2 — office portrait: revealed as Photo 1 arrives on the right (Experience).
  photo2: {
    webp: `${p2WebpSm} 640w, ${p2Webp} 1024w`,
    fallback: p2Jpg,
    w: 1024,
    h: 1536,
    alt: 'Abinesh V in a pinstripe suit, leaning on a marble counter in a bright office',
    index: '02',
    label: 'Experience — Abinesh V',
  },
}
