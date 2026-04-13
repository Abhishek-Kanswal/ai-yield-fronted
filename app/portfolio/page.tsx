import React from 'react';
import { ChevronDown, Copy } from 'lucide-react';

export default function Page() {
  return (
    // min-h-screen and bg-gray-50 set up the light mode background
    // flex, justify-center, and pt-16 position the content in the middle-top
    <div className="min-h-screen bg-gray-50 flex justify-center pt-16 font-sans">
      
      {/* Main UI Container */}
      <div className="flex flex-col gap-3">
        
        {/* Wallet Address Row */}
        <div className="flex items-center gap-2 text-gray-900 text-xl font-medium cursor-pointer hover:bg-gray-200 p-2 rounded-xl transition-colors -ml-2 w-max">
          <span>0xd5077...E7874</span>
          
          {/* Lucide Dropdown Chevron */}
          <ChevronDown 
            size={20} 
            strokeWidth={2.5} 
            className="text-gray-600 ml-1" 
          />
          
          {/* Lucide Copy Icon */}
          <Copy 
            size={18} 
            strokeWidth={2} 
            className="text-gray-600 ml-2 hover:text-gray-900 transition-colors" 
          />
        </div>

        {/* Avatar & Balance Row */}
        <div className="flex items-center gap-4 pl-1">
          
          {/* CSS-generated Pixel Art Avatar Placeholder */}
          <div className="w-16 h-16 rounded-[14px] overflow-hidden grid grid-cols-3 grid-rows-3 border border-gray-200 shadow-sm flex-shrink-0">
            <div className="bg-fuchsia-600"></div>
            <div className="bg-purple-700"></div>
            <div className="bg-fuchsia-600"></div>
            <div className="bg-green-500"></div>
            <div className="bg-purple-800"></div>
            <div className="bg-green-500"></div>
            <div className="bg-fuchsia-500"></div>
            <div className="bg-green-600"></div>
            <div className="bg-fuchsia-500"></div>
          </div>

          {/* Balance Amount */}
          <div className="text-6xl font-bold text-gray-900 tracking-tight flex items-baseline">
            $1<span className="text-gray-500 font-semibold">.42</span>
          </div>
          
        </div>
      </div>
      
    </div>
  );
}