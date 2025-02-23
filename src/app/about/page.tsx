'use client';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';

export default function ScrollEffect() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollY / windowHeight, 1);
      setScale(1 - progress);
    }, 16);

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div 
        className="h-screen bg-cover bg-center bg-no-repeat relative brightness-95 saturate-20"
        style={{ backgroundImage: "url('images/protestcollage.jpeg')" }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-4/5 h-4/5 border-round shadow-md bg-white transition-transform rounded-sm brightness-100 duration-300 pointer-events-none"
          style={{ 
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center'
          }}
        />
        <div 
        className='flex flex-row justify-center items-center h-screen bg-cover bg-center bg-no-repeat'
        >
            
        </div>
      </div>

      <div 
        className="h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('images/another-image.jpeg')" }}
      />
    </div>
  );
}