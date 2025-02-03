// Follow Deno and Supabase Edge Function conventions
interface Request {
  method: string;
}

interface ResponseInit {
  headers?: Record<string, string>;
  status?: number;
}

class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {}
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export default async function handler(req: Request) {
  console.log('Edge Function: get-mapbox-token called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN')
    console.log('Retrieved Mapbox token:', token ? 'Token exists' : 'Token missing');
    
    if (!token) {
      console.error('MAPBOX_PUBLIC_TOKEN is not set in Edge Function secrets');
      throw new Error('MAPBOX_PUBLIC_TOKEN is not set')
    }

    return new Response(
      JSON.stringify({ token }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    console.error('Error in get-mapbox-token:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
}