import React from 'react';
const logo = "https://media.zealtcg.com/assets/logoZeal.png";
const manorBg='https://media.zealtcg.com/bg/ZealMainBackground.png';
const logoWhite = "https://media.zealtcg.com/assets/logoZealWhite.png";

const VideoHero: React.FC = () => {
  return (
    <div className="relative h-[calc(100vh+4rem)] w-full flex items-center justify-center overflow-hidden">
      {/* Manor background image */}
      <img
        src={manorBg}
        alt="Zeal TCG background"
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{objectPosition: 'center'}}
        draggable={false}
      />
      {/* <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/video-bg.mp4" // Place your video in public/
        autoPlay
        loop
        muted
        playsInline
      /> */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <img src={logo} alt="Game Logo" className="w-64 h-64 md:w-96 md:h-96 xl:w-[32rem] xl:h-[32rem] object-contain drop-shadow-lg" />
      </div>
      <div className="absolute inset-0 bg-black/40 z-5" />
    </div>
  );
};

export default VideoHero;
