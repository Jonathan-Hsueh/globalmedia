'use client';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';

const TEAM_MEMBERS = [
  { name: 'Jonathan Hsueh', img: 'biojonathan.jpg' },
  { name: 'Gabriel Kung', img: 'biogabe.png' },
  { name: 'Chase Brewer', img: 'biochase.png' },
  { name: 'Wavy Yang', img: 'biowavy.png' },
  { name: 'Noah Ruderman', img: 'bionoah.png' }
];

type IndexType = 0 | 1 | 2 | 3 | 4;
const roleMappings: Record<IndexType, string> = {
  0: 'Lead Designer',
  1: 'Backend Developer',
  2: 'Data Scientist/Engineer',
  3: 'NLP Engineer',
  4: 'Data Scientist/Engineer'
};

const linkMappings: Record<IndexType, string> = {
  0: 'https://www.linkedin.com/in/jonathan-c-hsueh/',
  1: 'https://www.linkedin.com/in/gabriel-kung-a0b506235/',
  2: 'https://www.linkedin.com/in/chase-brewer-47514a347/',
  3: 'https://www.linkedin.com/in/wavy-yang-6170a9253/',
  4: 'https://www.linkedin.com/in/noah-ruderman-8905b832b/'
};

export default function ScrollEffect() {
  const [scale, setScale] = useState(1);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionHeight = windowHeight - 64;
      const progress = Math.min(scrollY / sectionHeight * 0.9, 1);
      
      setScale(1 - progress);
      setSlideIn(scrollY > sectionHeight * 0.6);
    }, 16);

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="mt-16">

      <div 
        className="h-[calc(100vh-4rem)] bg-cover bg-center bg-no-repeat relative brightness-95 saturate-20"
        style={{ backgroundImage: "url('images/protestcollage.jpeg')" }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-4/5 h-4/5 border-round shadow-md bg-white transition-transform rounded-sm brightness-100 duration-300 pointer-events-none"
          style={{ 
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: 'center'
          }}
        >
          <div className="flex h-full w-full p-8 gap-6 transform scale-100">
            <div 
              className="w-1/2 h-full bg-gray-100 rounded-sm overflow-hidden transition-transform duration-300"
              style={{ transform: `scale(${scale})` }}
            >
              <img 
                src="/images/globalmedialogo.png" 
                alt="Global Media Archive" 
                className="w-full h-full object-cover"
              />
            </div>

            <div 
              className="flex-1 flex flex-col justify-center transition-transform duration-300"
              style={{ transform: `scale(${scale})` }}
            >
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Global Media Movement
              </h1>
              <div className="overflow-auto pr-4">
                <p className="text-gray-600 text-lg leading-relaxed">
                  This is a picture of President Donald Trump&apos;s fist pump-moment   
                  after the assassination attempt, overlayed with images from an  
                  anti-Trump protest in New York. No matter what side of the political
                  isle or where your opinions lie, it&apos;s become increasingly clear that   
                  Donald Trump is a polarizing figure. The ideas of justice and 
                  equality blur. How do people view the president? How do opinions 
                  change in the face of groundbreaking legislation and the rise
                  of political polarizations? This project is our attempt to 
                  understand, &ldquo;Understanding is the bridge between confusion and clarity,&rdquo; 
                  and to know the truth, a premium commodity in today&apos;s nation. 
                  We must pop the bubble of comfortability and see the world for what it is.
                  As Rodney King once said, &ldquo;Can we all get along?&rdquo; – Jonathan Hsueh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div 
        className="h-screen bg-cover bg-center bg-no-repeat bg-[#2E5077] relative overflow-hidden"
        style={{ backgroundImage: "url('images/another-image.jpeg')" }}
      >
        <div
          className={`absolute right-0 top-1/2 w-screen h-[80vh] bg-white/95 backdrop-blur-sm transform transition-all duration-500 ease-out shadow-xl p-8 ${
            slideIn ? 'translate-y-[-50%] translate-x-0' : 'translate-y-[-50%] translate-x-full'
          }`}
        >
          <div className="flex h-full gap-8">
            <div className="w-1/3 flex flex-col justify-center pr-8 border-r border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-[#2E5077]">
                About Our Team
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                We are a network of visual storytellers and archival researchers 
                dedicated to understanding reality for what it really is.
              </p>
              <div className="mt-auto">
                <div className="flex justify-between text-sm text-gray-500">
                  <div>
                    <p className="font-medium">Established</p>
                    <p>2025</p>
                  </div>
                  <div>
                    <p className="font-medium">Members</p>
                    <p>5+</p>
                  </div>
                  <div>
                    <p className="font-medium">Archives</p>
                    <p>36+ hrs</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-2/3 overflow-x-auto pb-4">
              <div className="flex gap-6 h-full items-center">
              {TEAM_MEMBERS.map((member, index) => {
    const typedIndex = index as IndexType;
    return (
      <div 
        key={index}
        className="relative group flex-shrink-0 w-96 h-full bg-gray-100 rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
        onClick={() => window.open(linkMappings[typedIndex], '_blank')}
      >
        <img 
          src={`/images/${member.img}`} 
          alt={member.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 text-white text-center">
          <p className="text-lg font-medium truncate">{member.name}</p>
          <p className="text-sm opacity-90">
            {roleMappings[typedIndex]}
          </p>
        </div>
      </div>
    );
  })}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
}