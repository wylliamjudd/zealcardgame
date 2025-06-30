import React, { useState } from 'react';

const archetypes = [
  {
    id: 'inquisitor',
    name: 'Inquisitor',
    summary: 'A divine enforcer using faith to hunt heretics and demons, combining martial skill, divine magic, and investigative abilities.',
    description: `Core Features:\n- Divine Invocation: Bolster allies with effects like Wrath (+damage), Justice (+attack), Healing Light (heal over time).\n- Stern Gaze: +2 to Intimidation/Insight, uncover lies or weaknesses.\n- Spellcasting: Divine spells using Wisdom, focused on radiant damage, banishment, and truth.\nPaths:\n- Oath of Wrath: Focus on combat and radiant damage (Divine Strike, Light of Retribution).\n- Oath of Faith: Inspire allies with light and resilience (Words of Faith, Light of Salvation).\n- Oath of Salvation: Heal and purify at personal cost (Redeeming Touch, Martyr’s Grace).`,
    image: '/archetypes/inquisitor.png',
    paths: [
      'Oath of Wrath',
      'Oath of Faith',
      'Oath of Salvation',
    ],
    narrative: `Eldric’s class, emphasizing his redemption arc and leadership against the rift’s horrors.`
  },
  {
    id: 'dreadnought',
    name: 'Dreadnought Fighter',
    summary: 'A towering warrior wielding a spectral blade, combining brute strength, supernatural endurance, and spectral power.',
    description: `Core Features:\n- Spectral Blade: Summon a two-handed blade (2d8 slashing, +1 armor defense), enhances at higher levels.\n- Unyielding Stance: Gain resistance to nonmagical damage, protect allies, advantage vs. being moved/prone.\n- Spectral Surge: Enhance attacks with effects like Fearful Strike, Draining Strike, Knockback Strike.\nPaths:\n- Path of the Abyssal Vanguard\n- Path of the Iron Bastion\n- Path of the Phantom Reaper\n- Path of the Forgemaster\n- Path of the Gravebound Sentinel\n- Path of the Riftbreaker`,
    image: '/archetypes/dreadnought.png',
    paths: [
      'Path of the Abyssal Vanguard',
      'Path of the Iron Bastion',
      'Path of the Phantom Reaper',
      'Path of the Forgemaster',
      'Path of the Gravebound Sentinel',
      'Path of the Riftbreaker',
    ],
    narrative: `Thane’s class, emphasizing his protective instincts and combat prowess against rift threats.`
  },
  {
    id: 'nightripper',
    name: 'Night Ripper Rogue',
    summary: 'A stealthy predator wielding Night Rippers (enchanted daggers), focusing on precision, stealth, and terror.',
    description: `Core Features:\n- Night Rippers: Summon daggers (1d6 piercing, mark prey for +1d6 necrotic damage), enhance at higher levels.\n- Sneak Attack: Deal extra damage (1d6, scaling to 10d6) with advantage or ally proximity.\n- Shadow Step: Teleport 30 ft. in dim light/darkness, gain advantage on next attack.\nPaths:\n- Path of the Shadow Stalker\n- Path of the Spectral Assassin\n- Path of the Mist Wraith`,
    image: '/archetypes/nightripper.png',
    paths: [
      'Path of the Shadow Stalker',
      'Path of the Spectral Assassin',
      'Path of the Mist Wraith',
    ],
    narrative: `Alaric’s class, emphasizing his stealth and precision in uncovering and combating threats like Errol.`
  },
  {
    id: 'sanguimancer',
    name: 'Sanguimancer',
    summary: 'A forbidden blood mage using blood as a reagent, focusing on vitality, sacrifice, and manipulation.',
    description: `Core Features:\n- Blood Reagent: Cast spells using Blood Points (level + Constitution modifier), each point deals 1d4 necrotic damage.\n- Vital Siphon: Regain Blood Points by siphoning vitality from defeated enemies or willing creatures.\n- Spellcasting: Sanguimancy spells using Charisma, focused on necrotic damage, healing, and control.\nPaths:\n- Path of the Blood Reaver\n- Path of the Vein Weaver\n- Path of the Crimson Healer`,
    image: '/archetypes/sanguimancer.png',
    paths: [
      'Path of the Blood Reaver',
      'Path of the Vein Weaver',
      'Path of the Crimson Healer',
    ],
    narrative: `Introduces a new blood-based magic system, fitting Greywick’s theme of forbidden power, potentially used by allies or enemies.`
  }
];

const ArchetypesSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState(archetypes[0].id);
  const selected = archetypes.find(a => a.id === selectedId);

  return (
    <section className="w-full h-full min-h-0 flex-1 bg-gradient-to-r from-indigo-900 via-indigo-950 to-neutral-950 rounded-xl shadow flex flex-row overflow-hidden">
      {/* Archetype List */}
      <aside className="flex flex-col gap-3 py-6 px-2 w-[320px] min-w-[220px] bg-indigo-950/80 border-r border-indigo-900 h-full min-h-0">
        <h2 className="text-xl font-bold mb-2 text-indigo-200 pl-2">Archetypes</h2>
        {archetypes.map(item => (
          <button
            key={item.id}
            className={`text-left px-3 py-2 rounded-lg transition-colors border border-transparent hover:bg-indigo-800/60 hover:border-indigo-400 ${selectedId === item.id ? 'bg-indigo-900/80 border-indigo-400 text-indigo-100 shadow' : 'text-indigo-300'}`}
            onClick={() => setSelectedId(item.id)}
          >
            <div className="font-semibold text-lg">{item.name}</div>
            <div className="text-xs text-indigo-300">{item.paths.join(', ')}</div>
          </button>
        ))}
      </aside>
      {/* Archetype Detail */}
      <main className="flex-1 min-w-0 p-8 overflow-y-auto h-full min-h-0 flex flex-row gap-8">
        {/* Description */}
        <div className="flex-1 min-w-0">
          <h3 className="text-3xl font-bold mb-2 text-indigo-200">{selected?.name}</h3>
          <p className="text-indigo-300 mb-4">{selected?.summary}</p>
          <pre className="whitespace-pre-wrap text-indigo-100 bg-indigo-950/40 p-4 rounded-lg mb-4 text-sm">{selected?.description}</pre>
          <div className="text-indigo-400 italic">{selected?.narrative}</div>
        </div>
        {/* Image */}
        <div className="w-64 h-64 flex items-center justify-center bg-indigo-950/60 rounded-xl shadow-lg border border-indigo-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected?.image || '/archetypes/placeholder.png'}
            alt={selected?.name}
            className="object-contain max-h-56 max-w-full rounded-lg shadow"
            onError={e => { (e.target as HTMLImageElement).src = '/archetypes/placeholder.png'; }}
          />
        </div>
      </main>
    </section>
  );
};

export default ArchetypesSection;
