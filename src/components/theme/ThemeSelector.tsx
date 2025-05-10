'use client';
import { useState } from 'react';

import { BackgroundTheme, useTheme } from '@/context/ThemeContext';

const themes: { id: BackgroundTheme; name: string; icon: string }[] = [
  {
    id: 'bubbles',
    name: 'Bubbles',
    icon: '🫧',
  },
  {
    id: 'particles',
    name: 'Particles',
    icon: '✨',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    icon: '🌈',
  },
  {
    id: 'waves',
    name: 'Waves',
    icon: '🌊',
  },
  {
    id: 'confetti',
    name: 'Confetti',
    icon: '🎉',
  },
];

export function ThemeSelector() {
  const { backgroundTheme, setBackgroundTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating theme selector button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-lg hover:scale-105 transition-transform"
        aria-label="Change background theme"
      >
        {themes.find(theme => theme.id === backgroundTheme)?.icon || '🎨'}
      </button>

      {/* Theme selection panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-3 w-52 transition-all">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">Select Background</h3>

          <div className="space-y-1">
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setBackgroundTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center space-x-2 transition-colors
                  ${
                    backgroundTheme === theme.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
              >
                <span className="text-xl">{theme.icon}</span>
                <span>{theme.name}</span>
                {backgroundTheme === theme.id && (
                  <svg
                    className="w-4 h-4 ml-auto text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
