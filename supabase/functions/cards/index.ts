// supabase/functions/cards/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // Set CORS headers for all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Check for authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), { 
      status: 401,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  const url = new URL(req.url);
  const deck_id = url.searchParams.get("deck_id");
  if (!deck_id) {
    return new Response(JSON.stringify({ error: "deck_id is required" }), { 
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing Supabase env vars" }), { 
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }

  // Use Supabase JS client with service role key for admin access
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Fetch cards for the deck (try both table name variations)
  let cards = [];
  let cardsError = null;
  
  // Try 'card' table first (matches type definition)
  const { data: cardsData1, error: cardsError1 } = await supabase
    .from('card')
    .select('*')
    .eq('deck_id', deck_id);
  
  if (cardsError1) {
    // Try 'cards' table as fallback
    const { data: cardsData2, error: cardsError2 } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deck_id);
    
    if (cardsError2) {
      return new Response(JSON.stringify({ 
        error: `Both card table queries failed: ${cardsError1.message} | ${cardsError2.message}` 
      }), { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    cards = cardsData2 || [];
  } else {
    cards = cardsData1 || [];
  }

  // Get unique card_master_ids from cards
  const cardMasterIds = cards.map((c: any) => c.card_master_id);
  const uniqueCardMasterIds = Array.from(new Set(cardMasterIds));

  // Fetch card_masters (try both table name variations)
  let card_masters = [];
  if (uniqueCardMasterIds.length > 0) {
    const { data: masters1, error: mastersError1 } = await supabase
      .from('card_master')
      .select('*')
      .in('card_master_id', uniqueCardMasterIds);
    
    if (mastersError1) {
      const { data: masters2, error: mastersError2 } = await supabase
        .from('card_masters')
        .select('*')
        .in('card_master_id', uniqueCardMasterIds);
      
      if (mastersError2) {
        return new Response(JSON.stringify({ 
          error: `Both card_master table queries failed: ${mastersError1.message} | ${mastersError2.message}` 
        }), { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      card_masters = masters2 || [];
    } else {
      card_masters = masters1 || [];
    }
  }

  // Get unique decoration_ids from card_masters (using card_decoration_id per cardTypes.ts)
  const decorationIds = Array.from(new Set(card_masters.map((m: any) => m.card_decoration_id).filter(Boolean)));

  // Fetch card_decorations (try both table name variations)
  let card_decorations = [];
  if (decorationIds.length > 0) {
    const { data: decorations1, error: decorationsError1 } = await supabase
      .from('card_decoration')
      .select('*')
      .in('card_decoration_id', decorationIds);
    
    if (decorationsError1) {
      const { data: decorations2, error: decorationsError2 } = await supabase
        .from('card_decorations')
        .select('*')
        .in('card_decoration_id', decorationIds);
      
      if (decorationsError2) {
        return new Response(JSON.stringify({ 
          error: `Both card_decoration table queries failed: ${decorationsError1.message} | ${decorationsError2.message}` 
        }), { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      card_decorations = decorations2 || [];
    } else {
      card_decorations = decorations1 || [];
    }
  }

  // Fetch card media (try both table name variations)
  let card_master_media = [];
  if (uniqueCardMasterIds.length > 0) {
    const { data: media1, error: mediaError1 } = await supabase
      .from('card_media')
      .select('*')
      .in('card_master_id', uniqueCardMasterIds);
    
    if (mediaError1) {
      const { data: media2, error: mediaError2 } = await supabase
        .from('card_master_media')
        .select('*')
        .in('card_master_id', uniqueCardMasterIds);
      
      if (mediaError2) {
        return new Response(JSON.stringify({ 
          error: `Both card_media table queries failed: ${mediaError1.message} | ${mediaError2.message}` 
        }), { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }
      card_master_media = media2 || [];
    } else {
      card_master_media = media1 || [];
    }
  }

  return new Response(
    JSON.stringify({
      cards,
      card_masters,
      card_decorations,
      card_master_media,
      debug: {
        deck_id,
        cardsCount: cards.length,
        mastersCount: card_masters.length,
        decorationsCount: card_decorations.length,
        mediaCount: card_master_media.length,
        cardMasterIds: uniqueCardMasterIds,
        decorationIds
      }
    }),
    { 
      status: 200, 
      headers: { 
        ...corsHeaders,
        "Content-Type": "application/json"
      } 
    }
  );
});
