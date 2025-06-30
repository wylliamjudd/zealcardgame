import React from 'react';
import VideoHero from './VideoHero';
import Forum from './Forum';
import AudioPlaylist from './AudioPlaylist';
import CardGridPane from './CardGridPane';
import TabletopSection from './TabletopSection';
import KickstarterSection from './KickstarterSection';
import VolumeControl from './VolumeControl';
import { useMainLayoutContext } from '../layouts/MainLayout';

// Flat list of viewpanes, each with an id for anchor navigation
const panes = [
  { id: 'cataclysm', component: <VideoHero /> },
  { id: 'kickstarter', component: <KickstarterSection /> },
  { id: 'forum', component: <Forum /> },
  { id: 'cards', component: <CardGridPane /> },
  { id: 'tabletop', component: <TabletopSection /> },
  { id: 'playlist', component: <AudioPlaylist /> },
];

const Home: React.FC = () => {
  // Get section refs from MainLayout context
  const { sectionRefs } = useMainLayoutContext();

  return (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
      {panes.map((pane, index) => (
        <section 
          id={pane.id} 
          key={pane.id} 
          className="snap-start"
          ref={sectionRefs[index]}
        >
          {pane.component}
        </section>
      ))}
      <div className="fixed bottom-5 right-5 z-50">
        <VolumeControl />
      </div>
    </div>
  );
};
export default Home;
