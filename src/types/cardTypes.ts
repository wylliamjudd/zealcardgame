// Auto-generated from _documentation/CardSchema.txt
// Types for Zeal TCG card and deck schema

export interface Deck {
  deck_id: number;
  profile_id: string; // uuid
  name: string;
  created_at: string | null;
}

export interface CardMaster {
  card_master_id: number;
  parent_id: number | null;
  name: string;
  global_id: string;
  card_decoration_id: number | null;
  rarity: string;
  created_at: string | null;
}

export type CardRarity = string; // You may want to replace with union type if known

export interface CardMasterMedia {
  media_id: number;
  card_master_id: number;
  url: string;
  media_type: 'image' | 'video' | 'animated_gif' | 'audio' | 'other';
  isdefault: boolean | null;
  isthumbnail: boolean | null;
  display_order: number | null;
  alt_text: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Card {
  card_id: number;
  deck_id: number;
  card_master_id: number;
  created_at: string | null;
}

export interface CardDecoration {
  card_decoration_id: number;
  name: string;
  description: string | null;
  url: string | null;
}

export interface CardPlaymat {
  id: number;
  created_at: string;
  profile_id: string | null; // uuid
  url: string | null;
}
