'use client'
import BackgroundComponent from "../components/background";
import { PageContent } from "../components/pagecontent";


export default function Home() {
  return (
    <PageContent>
      <div className="h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('images/background2.png')" }}>
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <BackgroundComponent
            floatingImages={[
              {
                id: "1",
                image: "/images/trumpbernie.png",
                link: "https://www.instagram.com/berniesanders/p/DBZCJ2DuK8N/",
                initialPosition: { x: "10%", y: "10%" },
              }, 
              {
                id: "2",
                image: "/images/trumpmusk.png",
                link: "https://www.techpolicy.press/elon-musk-endorses-donald-trump-following-shooting-at-campaign-rally/",
                initialPosition: { x: "5%", y: "70%" },
              },
              {
                id: "3",
                image: "/images/trumpcorona.png",
                link: "https://github.com/copilot/c/70808783-d15b-49c6-9d9c-a653176f5da6",
                initialPosition: { x: "70%", y: "65%" },
              },
              {
                id: "4",
                image: "/images/trumpchuck.png",
                link: "https://www.instagram.com/chuckschumer/p/C1xvu3ZxKFy/",
                initialPosition: { x: "30%", y: "33%" },
              },
              {
                id: "5",
                image: "/images/trumpreddit.png",
                link: "https://www.reddit.com/r/trumptweets/comments/1ivwmzd/22225_donnie_and_melania_host_the_governors_for/",
                initialPosition: { x: "80%", y: "20%" },
              },
              {
                id: "6",
                image: "/images/trumpkamala.png",
                link: "https://www.instagram.com/kamalaharris/p/C6Z7lkrs9MS/",
                initialPosition: { x: "50%", y: "60%" },
              },
              {
                id: "7",
                image: "/images/trumpmailin.png",
                link: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.washingtonpost.com%2Fpolitics%2F2020%2F05%2F29%2Fno-twitter-did-not-violate-trumps-freedom-speech%2F&psig=AOvVaw0z4DFBQPbzdZhEntOsmsiM&ust=1740368868988000&source=images&cd=vfe&opi=89978449&ved=0CBUQjhxqFwoTCIi81drx2IsDFQAAAAAdAAAAABAS",
                initialPosition: { x: "60%", y: "10%" },
              },
              {
                id: "8",
                image: "/images/trumpminneapolis.png",
                link: "https://www.theguardian.com/technology/2020/may/29/twitter-hides-donald-trump-tweet-glorifying-violence",
                initialPosition: { x: "25%", y: "80%" },
              }
            ]}
          />
        </div>

        {/* Content with higher z-index */}
        <div className="absolute inset-x-0 bottom-[40%] flex flex-col items-center" style={{ zIndex: 10 }}>
          <div className="bg-teal-500 px-12 py-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <h1 className="text-white text-4xl font-bold text-center">
              Global Media Tracker
            </h1>
          </div>
          <div className="text-white text-lg text-center mt-6 flex flex-col gap-2">
            <p>A all-in-one source for tracking global media trends and sentiments</p>
            <p>regarding American executive actions.</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center" style={{ zIndex: 10 }}>
          <div className="flex flex-row gap-8">
            <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg w-64 
                          border border-white border-opacity-70
                          shadow-[0_0_15px_rgba(255,255,255,0.5)]
                          transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]">
              <h3 className="text-white text-xl font-bold text-center">DS Technology</h3>
              <p className="text-white text-center mt-2">Using Data Science, ML, and NLP processing for accurate results </p>
            </div>

            <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg w-64
                          border border-white border-opacity-70 h-40
                          shadow-[0_0_15px_rgba(255,255,255,0.5)]
                          transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]">
              <h3 className="text-white text-xl font-semibold text-center">Reactive Media</h3>
              <p className="text-white text-center mt-2">Scraping the most relevant social media data off of Reddit web spaces </p>
            </div>

            <div className="bg-black bg-opacity-50 p-6 rounded-lg shadow-lg w-64
                          border border-white border-opacity-70
                          shadow-[0_0_15px_rgba(255,255,255,0.5)]
                          transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.7)]">
              <h3 className="text-white text-xl font-semibold text-center">Sentiment Analysis</h3>
              <p className="text-white text-center mt-2">Processing human opinion through computational analysis training</p>
            </div>
          </div>
        </div>

      </div>
      <div className="h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('images/background2.png')" }}>
      
      
      </div>
    </PageContent>
  );
}