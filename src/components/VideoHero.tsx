import React from 'react';
const logo = "/logoZeal.png";
const manorBg='https://media.zealtcg.com/bg/ZealMainBackground.png';

const VideoHero: React.FC = () => {
  return (
    <div className="relative h-[calc(100vh+4rem)] w-full flex items-center justify-center overflow-hidden">
      {/* Manor background image */}
      <img
        src={manorBg}
        alt="Zeal Cardgame background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{objectPosition: 'center'}}
        draggable={false}
      />
      <img src={logo} alt="Zeal" className="z-10 w-1/2 animate-fadeUp" />
      <div className="absolute inset-0 bg-black/40 z-5 animate-fadeUp" />
    </div>
  );
};

export default VideoHero;
