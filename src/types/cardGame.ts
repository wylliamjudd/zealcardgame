/**
 * Defines the possible rarities for a card.
 * Based on examples from the 'card_master' table schema.
 */
export type CardRarity = 'common' | 'rare' | 'mythic';

/**
 * Represents a player's deck.
 * Corresponds to the 'deck' table in the database.
 */
export interface Deck {
  deck_id: number;
  profile_id: string; // Foreign key to profiles.id (uuid)
  name: string;
  created_at?: string; // ISO 8601 date string, optional due to DEFAULT CURRENT_TIMESTAMP
}

/**
 * Represents a unique card definition (master copy).
 * Corresponds to the 'public.card_master' table in the database.
 */
export interface CardMaster {
  card_master_id: number;
  parent_id?: number | null; // Self-referential: for card variants/evolutions. Nullable.
  name: string;
  global_id: string; // Unique identifier for the card, e.g., across different versions/prints.
  decoration_id?: number | null; // Foreign key to card_decoration.card_decoration_id. Nullable.
  rarity: CardRarity;
  created_at?: string; // ISO 8601 date string, optional due to DEFAULT CURRENT_TIMESTAMP
}

/**
 * Represents an instance of a card within a specific deck.
 * This is effectively a join table entry linking a 'deck' to a 'card_master'.
 * Corresponds to the 'card' table in the database.
 */
export interface Card {
  card_id: number;
  deck_id: number; // Foreign key to deck.deck_id
  card_master_id: number; // Foreign key to card_master.card_master_id
  created_at?: string; // ISO 8601 date string, optional due to DEFAULT CURRENT_TIMESTAMP
}

/**
 * Defines the possible media types for a card.
 * Based on the 'card_media' table's 'media_type' check constraint.
 */
export type CardMediaType = 'image' | 'video' | 'animated_gif' | 'audio' | 'other';

/**
 * Represents media associated with a card.
 * Corresponds to the 'public.card_media' table in the database.
 */
export interface CardMedia {
  media_id: number;
  card_id: number; // Foreign key to card.card_id
  url: string;
  media_type: CardMediaType;
  isdefault?: boolean | null;
  isthumbnail?: boolean | null;
  display_order?: number | null;
  alt_text?: string | null;
  created_at?: string; // ISO 8601 date string, optional due to DEFAULT CURRENT_TIMESTAMP
  updated_at?: string; // ISO 8601 date string, optional due to DEFAULT CURRENT_TIMESTAMP
}

/**
 * Represents a card decoration.
 * Corresponds to the 'public.card_decoration' table in the database.
 */
export interface CardDecoration {
  card_decoration_id: number;
  name: string;
  description?: string | null;
  url?: string | null; // URL for the decoration image or asset
}
