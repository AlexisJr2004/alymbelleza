import type { SVGProps } from 'react';

const paths = {
  calendar: 'M4 5h16v17H4V5Zm3-3v6m10-6v6M4 11h16M8 15h2m4 0h2m-8 4h2',
  logout: 'M9 3H3v18h6m5-15 6 6-6 6m-8-6h13',
  settings: 'M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z',
  edit: 'm15 4 5 5M3 21l5-1L21 7l-5-5L3 15v6Z',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 16h12l1-16M10 10v8m4-8v8',
  pause: 'M8 5v14M16 5v14',
  play: 'm7 3 14 9-14 9V3Z',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  chevron: 'm9 5 7 7-7 7',
  down: 'm6 9 6 6 6-6',
  search: 'm21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
  user: 'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  bag: 'M5 7h14l2 14H3L5 7Zm3 2V5a4 4 0 0 1 8 0v4',
  cart: 'M2 3h3l3 13h11l3-10H6M10 20h.01M18 20h.01',
  truck: 'M1 4h13v13H1V4Zm13 5h5l4 5v3h-9M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0m13 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  shield: 'm12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6l9-4Zm-5 9 3 3 7-7',
  headset: 'M3 14v-3a9 9 0 0 1 18 0v3M3 12h3v8H3a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Zm18 0h-3v8h3a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-2 8c0 2-3 3-7 3',
  leaf: 'M20 3C8 1 1 7 5 15c8 5 15-2 15-12ZM3 22 15 9',
  diamond: 'M5 3h14l4 6-11 13L1 9l4-6Zm-4 6h22M8 3l-2 6 6 13 6-13-2-6',
  lock: 'M5 10h14v12H5V10Zm3 0V6a4 4 0 0 1 8 0v4m-4 5v3',
  award: 'm8 16-1 7 5-3 5 3-1-7M20 9A8 8 0 1 1 4 9a8 8 0 0 1 16 0',
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'm5 5 14 14M19 5 5 19',
  mail: 'M2 4h20v16H2V4Zm0 0 10 9L22 4',
  sparkle: 'm12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
} as const;

export type StoreIconName = keyof typeof paths;

export default function StoreIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: StoreIconName }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}

export function BeautyBrand() {
  return <span className="bb-brand">
    <svg viewBox="0 0 48 48" width="43" height="43" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M24 44C10 40 3 31 3 21c12 0 20 8 21 23Zm0 0c14-4 21-13 21-23-12 0-20 8-21 23Zm0 0C13 33 13 18 24 5c11 13 11 28 0 39ZM17 26 10 12c8 1 13 6 14 12m7 2 7-14c-8 1-13 6-14 12M24 5V1" />
    </svg>
    <span><span className="bb-brand-name">Bella <em>Beauty</em></span><span className="bb-brand-tagline">TU BELLEZA, NUESTRA PASIÓN</span></span>
  </span>;
}
