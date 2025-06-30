import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardMaster, CardMasterMedia } from '../types/cardGame';

interface CardDecoration {
  card_decoration_id: number;
  url: string;
}

interface DeckCard {
  card: Card;
  cardMaster: CardMaster;
  cardFrontUrl: string | null;
  cardBackUrl: string | null;
}

interface DraggedCard {
  card: DeckCard;
  x: number;
  y: number;
  isFlipped: boolean;
}

const PLAYER_DECK_ID = 1;
const OPPONENT_DECK_ID = 2;
const CARD_WIDTH = 100;
const CARD_HEIGHT = 140;
// Mobile card dimensions will be calculated dynamically based on screen width

const TabletopSection: React.FC = () => {
  const { session } = useAuth();
  const [deck, setDeck] = useState<DeckCard[]>([]);
  const [discardPile, setDiscardPile] = useState<DeckCard[]>([]);
  const [bases, setBases] = useState<(DeckCard | null)[]>(Array(6).fill(null));
  const [draggedCard, setDraggedCard] = useState<DraggedCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCards, setAllCards] = useState<DeckCard[]>([]);
  
  // Opponent state
  const [opponentDeck, setOpponentDeck] = useState<DeckCard[]>([]);
  const [opponentDiscardPile, setOpponentDiscardPile] = useState<DeckCard[]>([]);
  const [opponentBases, setOpponentBases] = useState<(DeckCard | null)[]>(Array(6).fill(null));
  const [allOpponentCards, setAllOpponentCards] = useState<DeckCard[]>([]);
  
  // Animation state
  const [animatingOpponentCard, setAnimatingOpponentCard] = useState<{card: DeckCard, targetBase: number} | null>(null);
  
  // Debug state
  const [showDebug, setShowDebug] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCardWidth, setMobileCardWidth] = useState(60);
  const [mobileCardHeight, setMobileCardHeight] = useState(84);

  // Check for mobile view and calculate card dimensions
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      
      // Calculate card size to fit 6 cards with 2% margins on mobile
      if (width < 640) {
        // Total width = 100% - 2% left margin - 2% right margin = 96%
        // Space for gaps = 5 gaps * 2% = 10%
        // Space for cards = 96% - 10% = 86%
        // Each card width = 86% / 6 cards = 14.33%
        const cardWidth = Math.floor(width * 0.1433);
        const cardHeight = Math.floor(cardWidth * 1.4); // Maintain aspect ratio
        setMobileCardWidth(cardWidth);
        setMobileCardHeight(cardHeight);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      setLoading(true);
      try {
        // Fetch player deck
        const playerResponse = await fetch(`https://rbteemjcyxumpnotsfrz.functions.supabase.co/cards?deck_id=${PLAYER_DECK_ID}`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (!playerResponse.ok) {
          throw new Error(`Failed to fetch player cards: ${playerResponse.status}`);
        }

        const playerResult = await playerResponse.json();
        const { cards: playerCards = [], card_masters = [], card_decorations = [], card_master_media = [] } = playerResult || {};

        if (playerCards.length && card_masters.length) {
          console.log('Card decorations:', card_decorations);
          const deckCards: DeckCard[] = playerCards.map((card: Card) => {
            const master = card_masters.find((m: CardMaster) => m.card_master_id === card.card_master_id)!;
            console.log('Master:', master);
            const backUrl = master.card_decoration_id
              ? card_decorations.find((d: CardDecoration) => d.card_decoration_id === master.card_decoration_id)?.url || 'https://media.zealtcg.com/card/zeal-card-back.png'
              : 'https://media.zealtcg.com/card/zeal-card-back.png';
            const frontUrl = card_master_media.find((m: CardMasterMedia) => 
              m.card_master_id === card.card_master_id && m.media_type === 'image'
            )?.url || null;
            return { card, cardMaster: master, cardFrontUrl: frontUrl, cardBackUrl: backUrl };
          });

          // Log first card's back URL for debugging
          console.log('First card back URL:', deckCards[0]?.cardBackUrl);
          console.log('All deck cards:', deckCards);
          
          // Store all cards for reset functionality
          setAllCards(deckCards);
          
          // Shuffle the deck
          const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
          setDeck(shuffled);
        }

        // Fetch opponent deck
        const opponentResponse = await fetch(`https://rbteemjcyxumpnotsfrz.functions.supabase.co/cards?deck_id=${OPPONENT_DECK_ID}`, {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (opponentResponse.ok) {
          const opponentResult = await opponentResponse.json();
          const { cards: opponentCards = [], card_masters: oppMasters = [], card_decorations: oppDecorations = [], card_master_media: oppMedia = [] } = opponentResult || {};

          if (opponentCards.length && oppMasters.length) {
            const oppDeckCards: DeckCard[] = opponentCards.map((card: Card) => {
              const master = oppMasters.find((m: CardMaster) => m.card_master_id === card.card_master_id)!;
              const backUrl = master.card_decoration_id
                ? oppDecorations.find((d: CardDecoration) => d.card_decoration_id === master.card_decoration_id)?.url || 'https://media.zealtcg.com/card/zeal-card-back.png'
                : 'https://media.zealtcg.com/card/zeal-card-back.png';
              const frontUrl = oppMedia.find((m: CardMasterMedia) => 
                m.card_master_id === card.card_master_id && m.media_type === 'image'
              )?.url || null;
              return { card, cardMaster: master, cardFrontUrl: frontUrl, cardBackUrl: backUrl };
            });

            setAllOpponentCards(oppDeckCards);
            const shuffledOpp = [...oppDeckCards].sort(() => Math.random() - 0.5);
            setOpponentDeck(shuffledOpp);
          }
        }
      } catch (error) {
        console.error('Error fetching decks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [session]);

  const handleReset = () => {
    // Cancel any dragging
    setDraggedCard(null);
    
    // Shuffle all cards back into the deck
    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    
    // Clear discard pile and bases
    setDiscardPile([]);
    setBases(Array(6).fill(null));
    
    // Reset opponent
    const shuffledOpp = [...allOpponentCards].sort(() => Math.random() - 0.5);
    setOpponentDeck(shuffledOpp);
    setOpponentDiscardPile([]);
    setOpponentBases(Array(6).fill(null));
  };

  const handleDeckStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (deck.length === 0 || draggedCard) return;
    e.preventDefault();

    console.log('Deck size before drag:', deck.length);
    const topCard = deck[0];
    const newDeck = deck.slice(1);
    setDeck(newDeck);
    console.log('Deck size after drag:', newDeck.length);

    // Start dragging the card
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      // Get coordinates from either mouse or touch event
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      setDraggedCard({
        card: topCard,
        x: clientX - rect.left,
        y: clientY - rect.top,
        isFlipped: true // Start flipped immediately
      });
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedCard || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Get coordinates from either mouse or touch event
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDraggedCard({
      ...draggedCard,
      x: clientX - rect.left,
      y: clientY - rect.top
    });
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggedCard || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Get coordinates from either mouse or touch event
    // For touch end, we need to use changedTouches instead of touches
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Check if dropped on a base
    const baseWidth = isMobile ? mobileCardWidth : CARD_WIDTH;
    const baseHeight = isMobile ? mobileCardHeight : CARD_HEIGHT;
    const gap = isMobile ? 8 : 12;
    
    // Determine layout based on screen size
    const isTablet = window.innerWidth < 1024;
    const cols = isTablet && !isMobile ? 3 : 6;
    const rows = isTablet && !isMobile ? 2 : 1;
    
    // Calculate positioning
    // Calculate positioning with percentage-based gaps on mobile
    let totalWidth, baseStartX;
    if (isMobile) {
      // Mobile: 2% margins, 2% gaps between cards
      totalWidth = rect.width * 0.96; // 96% of screen width
      baseStartX = rect.width * 0.02; // 2% left margin
    } else {
      totalWidth = cols * baseWidth + (cols - 1) * gap;
      baseStartX = rect.width / 2 - totalWidth / 2;
    }
    const totalHeight = rows * baseHeight + (rows - 1) * gap;
    const baseStartY = isMobile ? rect.height * 0.7 - baseHeight : rect.height - 128 - totalHeight; // 30% from bottom on mobile

    // Add some tolerance for easier dropping
    const tolerance = 20;

    for (let i = 0; i < 6; i++) {
      let baseX, currentBaseY;
      if (isMobile) {
        // Mobile: simplified calculation to match centered flexbox
        const containerPadding = rect.width * 0.02; // 2% padding on each side
        const gapWidth = rect.width * 0.02; // 2% gap between cards
        const availableWidth = rect.width - (2 * containerPadding); // Total width minus padding
        const totalGapsWidth = gapWidth * 5; // 5 gaps between 6 cards
        const totalCardsWidth = baseWidth * 6;
        const totalContentWidth = totalCardsWidth + totalGapsWidth;
        const startOffset = (availableWidth - totalContentWidth) / 2; // Center the content
        
        baseX = containerPadding + startOffset + i * (baseWidth + gapWidth);
        currentBaseY = baseStartY;
      } else {
        const col = i % cols;
        const row = Math.floor(i / cols);
        baseX = baseStartX + col * (baseWidth + gap);
        currentBaseY = baseStartY + row * (baseHeight + gap);
      }

      // Check with tolerance
      if (x >= baseX - tolerance && x <= baseX + baseWidth + tolerance && 
          y >= currentBaseY - tolerance && y <= currentBaseY + baseHeight + tolerance &&
          !bases[i]) {
        const newBases = [...bases];
        newBases[i] = draggedCard.card;
        setBases(newBases);
        setDraggedCard(null);
        
        // Trigger opponent card animation - reversed position
        const opponentPosition = 5 - i; // Reverse the position (0->5, 1->4, 2->3, 3->2, 4->1, 5->0)
        if (opponentDeck.length > 0 && !opponentBases[opponentPosition]) {
          const opponentCard = opponentDeck[0];
          setOpponentDeck(opponentDeck.slice(1));
          setAnimatingOpponentCard({ card: opponentCard, targetBase: opponentPosition });
          
          // After animation completes, place the card
          setTimeout(() => {
            const newOppBases = [...opponentBases];
            newOppBases[opponentPosition] = opponentCard;
            setOpponentBases(newOppBases);
            setAnimatingOpponentCard(null);
          }, 1000);
        }
        
        return;
      }
    }

    // Check if dropped on discard pile
    const discardX = isMobile ? rect.width * 0.9 - baseWidth : rect.width - 120; // 10% right margin on mobile
    const discardY = isMobile ? rect.height - 16 - baseHeight : rect.height - 128 - CARD_HEIGHT; // Adjusted for mobile
    if (x >= discardX - tolerance && x <= discardX + baseWidth + tolerance && 
        y >= discardY - tolerance && y <= discardY + baseHeight + tolerance) {
      setDiscardPile([draggedCard.card, ...discardPile]);
      setDraggedCard(null);
      return;
    }

    // Return card to deck if not dropped anywhere valid
    console.log('Returning card to deck. Current deck size:', deck.length);
    setDeck([draggedCard.card, ...deck]);
    console.log('New deck size will be:', deck.length + 1);
    setDraggedCard(null);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading deck...</div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      className={`${isMobile ? 'h-[calc(100vh-64px)]' : 'min-h-screen'} bg-gradient-to-b from-gray-900 to-black relative overflow-hidden cursor-pointer touch-none`}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <h2 className={`absolute top-8 ${isMobile ? 'left-4' : 'left-1/2 transform -translate-x-1/2'} text-4xl font-bold text-white z-10`}>
        {isMobile ? 'Tabletop' : 'Virtual Tabletop'}
      </h2>
      
      {/* Debug toggle button - Hidden on mobile */}
      {!isMobile && (
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="absolute top-8 left-8 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors z-10"
        >
          {showDebug ? 'Hide' : 'Show'} Metrics
        </button>
      )}
      
      {/* Debug info */}
      {showDebug && (
        <div className="absolute top-20 left-8 text-white text-sm space-y-1 z-10 bg-black/50 p-3 rounded">
          <div>Player Total Cards: {allCards.length}</div>
          <div>Cards in Deck: {deck.length}</div>
          <div>Cards in Bases: {bases.filter(b => b !== null).length}</div>
          <div>Cards in Discard: {discardPile.length}</div>
          <div>Currently Dragging: {draggedCard ? 1 : 0}</div>
          <div className="font-bold">Total in Play: {deck.length + bases.filter(b => b !== null).length + discardPile.length + (draggedCard ? 1 : 0)}</div>
        </div>
      )}

      {/* Reset button */}
      <button
        onClick={handleReset}
        className="absolute top-8 right-8 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-colors z-10"
      >
        Reset Deck
      </button>

      {/* OPPONENT AREA - Everything upside down */}
      
      {/* Opponent Deck (on right, upside down) - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute right-20 top-32 transform rotate-180">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-2 text-center">Opp Deck ({opponentDeck.length})</div>
          <div className={`relative`} style={{ width: `${isMobile ? mobileCardWidth : CARD_WIDTH}px`, height: `${isMobile ? mobileCardHeight : CARD_HEIGHT}px` }}>
            {opponentDeck.length > 0 ? (
              <>
                {/* Stack effect */}
                {opponentDeck.length > 2 && (
                  <div className="absolute inset-0 bg-gray-800 rounded-lg transform translate-x-2 translate-y-2" />
                )}
                {opponentDeck.length > 1 && (
                  <div className="absolute inset-0 bg-gray-700 rounded-lg transform translate-x-1 translate-y-1" />
                )}
                <div className="relative w-full h-full bg-purple-900 rounded-lg">
                  <img 
                    src={opponentDeck[0].cardBackUrl || 'https://media.zealtcg.com/card/zeal-card-back.png'}
                    alt="Opponent card back"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-xs">Empty</span>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Opponent Discard (on left, upside down) - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute left-20 top-32 transform rotate-180">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-2 text-center">Opp Discard ({opponentDiscardPile.length})</div>
          <div className={`relative`} style={{ width: `${isMobile ? mobileCardWidth : CARD_WIDTH}px`, height: `${isMobile ? mobileCardHeight : CARD_HEIGHT}px` }}>
            {opponentDiscardPile.length > 0 ? (
              <>
                {/* Stack effect for discard pile */}
                {opponentDiscardPile.slice(1, 3).map((_, idx) => (
                  <div 
                    key={idx}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      transform: `translate(${(idx + 1) * 2}px, ${(idx + 1) * 2}px)`,
                      opacity: 0.5 - idx * 0.2
                    }}
                  >
                    <img 
                      src={opponentDiscardPile[idx + 1]?.cardFrontUrl || '/card-front-default.png'}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                <img 
                  src={opponentDiscardPile[0].cardFrontUrl || '/card-front-default.png'}
                  alt={opponentDiscardPile[0].cardMaster.name}
                  className="relative w-full h-full object-cover rounded-lg shadow-xl z-10"
                />
              </>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-xs">Empty</span>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Opponent Base zones (upside down) - positioned to fit between deck and discard */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 rotate-180 ${isMobile ? 'top-[21%] w-full px-[2%]' : 'top-32'}`}>
        <div className={`flex justify-center ${isMobile ? 'gap-[2%]' : 'gap-3'}`}>
          {opponentBases.map((card, index) => {
            const cardWidth = isMobile ? mobileCardWidth : CARD_WIDTH;
            const cardHeight = isMobile ? mobileCardHeight : CARD_HEIGHT;
            return (
              <div 
                key={index}
                className={`border-2 border-dashed rounded-lg ${isMobile ? 'p-1' : 'p-2'} flex items-center justify-center flex-shrink-0 transition-all ${
                  draggedCard && !card ? 'border-red-400 bg-red-900/20' : 'border-gray-600'
                }`}
                style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
              >
                {card ? (
                  <img 
                    src={card.cardFrontUrl || '/card-front-default.png'}
                    alt={card.cardMaster.name}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Base {index + 1}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deck - Repositioned on mobile */}
      <div 
        className={`absolute ${isMobile ? 'left-[10%] bottom-4' : 'left-20 bottom-32'}`}
      >
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 hover:border-gray-400 transition-colors touch-none">
          <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-2 text-center`}>Deck ({deck.length})</div>
          <div 
            className={`relative ${deck.length > 0 ? 'cursor-pointer' : ''}`} 
            style={{ width: `${isMobile ? mobileCardWidth : CARD_WIDTH}px`, height: `${isMobile ? mobileCardHeight : CARD_HEIGHT}px` }}
            onMouseDown={deck.length > 0 ? handleDeckStart : undefined}
            onTouchStart={deck.length > 0 ? handleDeckStart : undefined}
          >
            {deck.length > 0 ? (
              <>
                {/* Stack effect */}
                {deck.length > 2 && (
                  <div className="absolute inset-0 bg-gray-800 rounded-lg transform translate-x-2 translate-y-2 pointer-events-none" />
                )}
                {deck.length > 1 && (
                  <div className="absolute inset-0 bg-gray-700 rounded-lg transform translate-x-1 translate-y-1 pointer-events-none" />
                )}
                <div className="relative w-full h-full bg-purple-900 rounded-lg">
                  <img 
                    src={deck[0].cardBackUrl || 'https://media.zealtcg.com/card/zeal-card-back.png'}
                    alt="Card back"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
                    onError={(e) => {
                      console.error('Failed to load card back image:', e);
                      console.log('Attempted URL:', deck[0].cardBackUrl);
                    }}
                    onLoad={() => {
                      console.log('Card back image loaded successfully:', deck[0].cardBackUrl);
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-xs">Empty</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Base zones - positioned higher on mobile */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 ${isMobile ? 'bottom-[30%] w-full px-[2%]' : 'bottom-32'}`}>
        <div className={`flex justify-center ${isMobile ? 'gap-[2%]' : 'gap-3'}`}>
          {bases.map((card, index) => {
            const cardWidth = isMobile ? mobileCardWidth : CARD_WIDTH;
            const cardHeight = isMobile ? mobileCardHeight : CARD_HEIGHT;
            return (
              <div 
                key={index}
                className={`border-2 border-dashed rounded-lg ${isMobile ? 'p-1' : 'p-2'} flex items-center justify-center flex-shrink-0 transition-all ${
                  draggedCard && !card ? 'border-emerald-400 bg-emerald-900/20' : 'border-gray-600'
                }`}
                style={{ width: `${cardWidth}px`, height: `${cardHeight}px` }}
              >
                {card ? (
                  <img 
                    src={card.cardFrontUrl || '/card-front-default.png'}
                    alt={card.cardMaster.name}
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                ) : (
                  <div className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>Base {index + 1}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Discard pile - Repositioned on mobile */}
      <div className={`absolute ${isMobile ? 'right-[10%] bottom-4' : 'right-20 bottom-32'}`}>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
          <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-2 text-center`}>Discard ({discardPile.length})</div>
          <div className={`relative`} style={{ width: `${isMobile ? mobileCardWidth : CARD_WIDTH}px`, height: `${isMobile ? mobileCardHeight : CARD_HEIGHT}px` }}>
            {discardPile.length > 0 ? (
              <>
                {/* Stack effect for discard pile */}
                {discardPile.slice(1, 3).map((_, idx) => (
                  <div 
                    key={idx}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      transform: `translate(${(idx + 1) * 2}px, ${(idx + 1) * 2}px)`,
                      opacity: 0.5 - idx * 0.2
                    }}
                  >
                    <img 
                      src={discardPile[idx + 1]?.cardFrontUrl || '/card-front-default.png'}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
                <img 
                  src={discardPile[0].cardFrontUrl || '/card-front-default.png'}
                  alt={discardPile[0].cardMaster.name}
                  className="relative w-full h-full object-cover rounded-lg shadow-xl z-10"
                />
              </>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 text-xs">Empty</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dragged card */}
      <AnimatePresence>
        {draggedCard && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: draggedCard.x - (isMobile ? mobileCardWidth : CARD_WIDTH) / 2,
              top: draggedCard.y - (isMobile ? mobileCardHeight : CARD_HEIGHT) / 2,
              width: isMobile ? mobileCardWidth : CARD_WIDTH,
              height: isMobile ? mobileCardHeight : CARD_HEIGHT
            }}
            initial={{ scale: 1 }}
            animate={{ 
              scale: 1.1
            }}
            transition={{ 
              scale: { duration: 0.2 }
            }}
          >
            <img 
              src={draggedCard.card.cardFrontUrl || '/card-front-default.png'}
              alt={draggedCard.card.cardMaster.name}
              className="w-full h-full object-cover rounded-lg shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated opponent card */}
      <AnimatePresence>
        {animatingOpponentCard && (
          <motion.div
            className="absolute pointer-events-none z-50"
            initial={{ 
              right: isMobile ? 'auto' : 120,
              left: isMobile ? '75%' : 'auto',
              x: isMobile ? '50%' : 0,
              top: isMobile ? window.innerHeight * 0.21 : 172,
              rotate: 180,
              scale: 1
            }}
            animate={{ 
              left: `50%`,
              top: isMobile ? window.innerHeight * 0.21 : 172,
              x: isMobile 
                ? `calc(-50% + ${((5 - animatingOpponentCard.targetBase) - 2.5) * (mobileCardWidth + window.innerWidth * 0.02)}px)`
                : `calc(-50% + ${((5 - animatingOpponentCard.targetBase) - 2.5) * 112}px)`,
              rotate: 180,
              scale: 1.1
            }}
            exit={{ 
              scale: 1,
              transition: { duration: 0.2 }
            }}
            transition={{ 
              duration: 1,
              ease: "easeInOut"
            }}
            style={{
              width: isMobile ? mobileCardWidth : CARD_WIDTH,
              height: isMobile ? mobileCardHeight : CARD_HEIGHT
            }}
          >
            <motion.div
              initial={{ rotateY: 0 }}
              animate={{ rotateY: 180 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformStyle: 'preserve-3d', width: '100%', height: '100%' }}
            >
              {/* Card back */}
              <img 
                src={animatingOpponentCard.card.cardBackUrl || 'https://media.zealtcg.com/card/zeal-card-back.png'}
                alt="Card back"
                className="absolute w-full h-full object-cover rounded-lg shadow-2xl"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(0deg)'
                }}
              />
              {/* Card front */}
              <img 
                src={animatingOpponentCard.card.cardFrontUrl || '/card-front-default.png'}
                alt={animatingOpponentCard.card.cardMaster.name}
                className="absolute w-full h-full object-cover rounded-lg shadow-2xl"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TabletopSection;