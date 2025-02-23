'use client'
import BackgroundComponent from "../components/background";
import Image from "next/image";
import { PageContent } from "../components/pagecontent";


export default function Home() {
  return (
    <PageContent>
  <div className="h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('images/frontbackground.png')" }}>
  <div className="absolute inset-x-0 bottom-1/3 flex justify-center">
      <div className="bg-teal-500 px-12 py-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
        <h1 className="text-white text-4xl font-bold text-center">
          Global Media Design
        </h1>
      </div>
    </div>
      
      <BackgroundComponent
        floatingImages={[
          {
            id: "1",
            image: "/images/protrump3.png", // Public path
            link: "https://www.reddit.com/r/DonaldTrumpNewss/comments/1iuzku4/breaking_americanborn_citizenship_requirement_for/",
            initialPosition: { x: "10%", y: "10%" },
          }, 
          {
            id: "2",
            image: "/images/frontbackground.png", // Public path
            link: "https://github.com/copilot/c/70808783-d15b-49c6-9d9c-a653176f5da6",
            initialPosition: { x: "50%", y: "30%" },
          },
          {
            id: "3",
            image: "/images/frontbackground.png", // Public path
            link: "https://github.com/copilot/c/70808783-d15b-49c6-9d9c-a653176f5da6",
            initialPosition: { x: "20%", y: "90%" },
          }
        ]}
      />
    </div>

    
    </PageContent>

  );
}