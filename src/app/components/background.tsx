'use client';
import React from 'react';
import Image from 'next/image';
import randomOutput from '../utilities/PlusOrMinus';

interface BackgroundComponentProps {
  floatingImages: Array<{
    id: string;
    image: string;
    link: string;
    initialPosition: { x: string; y: string };
  }>;
}

const BackgroundComponent: React.FC<BackgroundComponentProps> = ({ floatingImages }) => {
  // Add a safety check for undefined floatingImages
  if (!floatingImages) {
    return null; // or return a loading state or default content
  }

  return (
    <div>
      {Array.isArray(floatingImages) && floatingImages.map((floatingImage) => {
        const animationName = randomOutput() ? 'floatUp' : 'floatDown';
        return (
          <a
            key={floatingImage.id}
            href={floatingImage.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute opacity-40 hover:opacity-100 transition-all duration-300 ease-in-out transform hover:scale-110"
            style={{
              top: floatingImage.initialPosition.y,
              left: floatingImage.initialPosition.x,
              animation: `${animationName} 6s ease-in-out infinite`,
            }}
          >
            <Image
              src={floatingImage.image}
              alt="Floating Image"
              width={150}
              height={150}
              className="rounded-lg shadow-lg object-cover filter drop-shadow-lg"
            />
          </a>
        );
      })}

      <style jsx global>{`
        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes floatDown {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundComponent;