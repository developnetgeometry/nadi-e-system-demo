
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
    const { ic_number, api_key } = body

    // Validate request parameters
    if (!ic_number) {
      return new Response(JSON.stringify({ error: 'IC number is required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check provided API key against expected value
    const expectedApiKey = Deno.env.get('MEMBER_VALIDATION_API_KEY')
    if (!expectedApiKey || api_key !== expectedApiKey) {
      return new Response(JSON.stringify({ error: 'Invalid API key' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log(`Attempting to validate user with IC number: ${ic_number}`)
    
    // Query the profile to check if a user with the provided IC number exists and is a member
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, user_type')
      .eq('ic_number', ic_number)
      .single()

    if (profileError) {
      console.error('Database query error:', profileError)
      
      // Check if error is "No rows found"
      if (profileError.code === 'PGRST116') {
        return new Response(JSON.stringify({ 
          valid: false,
          message: 'User with this IC number not found'
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify({ error: 'Failed to validate user' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Return verification result
    const isMember = profileData.user_type === 'member'
    
    return new Response(JSON.stringify({
      valid: isMember,
      user_id: profileData.id,
      user_type: profileData.user_type,
      message: isMember ? 'Valid member' : 'User is not a member'
    }), {
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error in validate-member function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
