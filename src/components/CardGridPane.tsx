import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { Deck, Card, CardMaster, CardMasterMedia } from '../types/cardGame';
import { useAuth } from '../contexts/AuthContext';

interface CardDecoration {
  card_decoration_id: number;
  url: string;
}

interface CardGridItem {
  card: Card;
  cardMaster: CardMaster;
  cardFrontUrl: string | null;
  cardBackUrl: string | null;
}

const DEMO_DECK_ID = 1;

const CardGridPane = (): React.ReactElement => {
  const { session } = useAuth();
  const [cards, setCards] = useState<CardGridItem[]>([]);
  const [selected, setSelected] = useState<CardGridItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching cards for deck_id:', DEMO_DECK_ID);
        const cardsRes = await fetch(`https://rbteemjcyxumpnotsfrz.functions.supabase.co/cards?deck_id=${DEMO_DECK_ID}`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': session && session.access_token ? `Bearer ${session.access_token}` : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Response status:', cardsRes.status);
        
        if (!cardsRes.ok) {
          const errorText = await cardsRes.text();
          console.error('Failed to fetch cards:', errorText);
          throw new Error(`Failed to fetch cards: ${cardsRes.status} ${errorText}`);
        }
        
        const result = await cardsRes.json();
        console.log('API Response:', result);
        
        const { cards = [], card_masters = [], card_decorations = [], card_master_media = [] } = result || {};
        console.log('Parsed data:', { 
          cardsCount: cards.length, 
          mastersCount: card_masters.length, 
          decorationsCount: card_decorations.length, 
          mediaCount: card_master_media.length 
        });

        if (cards.length && card_masters.length) {
          const items: CardGridItem[] = cards.map((card: Card) => {
            const master = card_masters.find((m: CardMaster) => m.card_master_id === card.card_master_id)!;
            console.log('Master:', master);
            console.log('Card decorations:', card_decorations);
            const backUrl = master.card_decoration_id
              ? card_decorations.find((d: CardDecoration) => d.card_decoration_id === master.card_decoration_id)?.url || 'https://media.zealtcg.com/card/zeal-card-back.png'
              : 'https://media.zealtcg.com/card/zeal-card-back.png';
            const frontUrl = card_master_media.find((m: CardMasterMedia) => m.card_master_id === card.card_master_id && m.media_type === 'image')?.url || null;
            return { card, cardMaster: master, cardFrontUrl: frontUrl, cardBackUrl: backUrl };
          });
          console.log('Processed card items:', items);
          setCards(items);
        } else {
          console.log('No cards or masters found');
          setCards([]);
        }
      } catch (e) {
        console.error('Error fetching cards:', e);
        setCards([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <section className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center snap-start bg-black p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500 mb-6 md:mb-8 text-center">
        Card Collection
      </h2>
      <div className="w-full max-w-7xl bg-neutral-900/70 border border-emerald-700/50 shadow-xl shadow-emerald-500/20 rounded-lg p-4 md:p-6">
        {loading ? (
          <div className="text-emerald-300 text-lg text-center py-8">Loading cards...</div>
        ) : cards.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <div className="text-2xl text-emerald-200 font-semibold mb-2">No cards found in this deck.</div>
            <div className="text-emerald-400">Try selecting a different deck or check back later.</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 justify-items-center w-full">
            {cards.map((item: CardGridItem, idx: number) => (
              <div
                key={item.card.card_id}
                className="relative cursor-pointer aspect-[2.5/3.5] w-28 sm:w-36 md:w-44 bg-neutral-800 rounded-lg shadow-lg hover:scale-105 transition-transform border-2 border-emerald-700/30 hover:border-emerald-500 hover:shadow-emerald-500/20"
                onClick={() => setSelected(item)}
              >
                <img
                  src={item.cardFrontUrl || ''}
                  alt={item.cardMaster.name}
                  className="w-full h-full object-cover rounded-lg"
                  style={{ aspectRatio: '2.5/3.5' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="p-4 max-w-md mx-auto bg-neutral-900 border border-emerald-700/50 rounded-lg">
            <img
              src={selected.cardFrontUrl || ''}
              alt={selected.cardMaster.name}
              className="w-full object-cover rounded-lg mb-4 border border-emerald-700/30"
              style={{ aspectRatio: '2.5/3.5' }}
            />
            <div className="text-xl font-bold mb-2 text-emerald-200">{selected.cardMaster.name}</div>
            <div className="mb-1 text-emerald-300"><span className="font-semibold text-emerald-200">Rarity:</span> {selected.cardMaster.rarity}</div>
            <div className="mb-1 text-emerald-300"><span className="font-semibold text-emerald-200">Global ID:</span> {selected.cardMaster.global_id}</div>
            <button
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default CardGridPane;
