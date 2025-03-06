
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.48.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // Get request body
    const body = await req.json()
    const { user_id, api_key } = body

    // Validate request parameters
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'user_id is required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check provided API key against expected value
    const expectedApiKey = Deno.env.get('MEMBER_VALIDATION_API_KEY')
    if (!expectedApiKey || api_key !== expectedApiKey) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Query the profile to check if user type is 'member'
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('user_type')
      .eq('id', user_id)
      .single()

    if (error) {
      console.error('Database query error:', error)
      return new Response(JSON.stringify({ error: 'Failed to validate user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Return verification result
    if (!data) {
      return new Response(JSON.stringify({ 
        valid: false,
        message: 'User not found'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const isMember = data.user_type === 'member'
    
    return new Response(JSON.stringify({
      valid: isMember,
      user_type: data.user_type,
      message: isMember ? 'Valid member' : 'User is not a member'
    }), {
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error in validate-member function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
