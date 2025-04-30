'use client';
import dynamic from 'next/dynamic';

// Dynamically import the ParticlesBackground with no SSR
const ParticlesBackground = dynamic(() => import('./ParticlesBackground'), {
  ssr: false,
});

export default function BackgroundWrapper() {
  return <ParticlesBackground />;
}
