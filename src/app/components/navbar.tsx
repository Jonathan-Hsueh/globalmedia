"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const tabs = ["Home", "Sentiment", "Graphs", "About"];

  const getLinkClasses = (path: string) => {
    const baseTailwind =
      "px-3 py-2 rounded-md text-sm font-bold transition-colors duration-300";
    return pathname === path
      ? `${baseTailwind} bg-gray-700 text-white`
      : `${baseTailwind} text-gray-700 hover:bg-gray-700 hover:text-white`;
  };

  return (
    <nav className="bg-white fixed top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo and Navigation Links */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Your logo or brand */}
            </div>
            <div className="hidden md:block font-bold">
              <div className="ml-10 flex items-baseline space-x-4">
                {tabs.map((tab) => {
                  const path = `/${tab.toLowerCase()}`;
                  return (
                    <Link key={tab} href={path} className={getLinkClasses(path)}>
                      {tab}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Right section: Search input */}
          <div className="flex items-center">
            
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
