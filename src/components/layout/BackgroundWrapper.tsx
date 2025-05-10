'use client';
import dynamic from 'next/dynamic';

// Dynamically import the ParticlesBackground with no SSR
const ParticlesBackground = dynamic(() => import('./ParticlesBackground'), {
  ssr: false,
});

export function BackgroundWrapper() {
  return <ParticlesBackground />;
}
