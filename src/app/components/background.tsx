'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface BackgroundComponentProps {
    floatingImages: Array<{
        id: string;
        image: string; // Use StaticImageData for imported images
        link: string;
        initialPosition: { x: string; y: string };
    }>;
}

const BackgroundComponent: React.FC<BackgroundComponentProps> = ({
    floatingImages,
}) => {
    return (
        <div>
            {floatingImages.map((floatingImage) => (
                <a
                    key={floatingImage.id}
                    href={floatingImage.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out transform hover:scale-110"
                    style={{
                        top: floatingImage.initialPosition.y,
                        left: floatingImage.initialPosition.x,
                        animation: 'float 6s ease-in-out infinite',
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
            ))}

            <style jsx global>{`
                @keyframes float {
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