'use client';

import { useState } from 'react';

export default function Page() {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {/* Counter display */}
      <div className="text-6xl font-bold text-white mb-16">
        {count.toLocaleString()}
      </div>

      {/* Clickable circle */}
      <button
        onClick={() => setCount(count + 1)}
        className="w-48 h-48 rounded-full bg-blue-500 hover:bg-blue-400 
                   flex items-center justify-center text-white text-2xl
                   transform transition-transform duration-100 active:scale-95
                   focus:outline-none shadow-lg hover:shadow-xl
                   animate-pulse hover:animate-none"
      >
        Click me!
      </button>
    </div>
  );
}
