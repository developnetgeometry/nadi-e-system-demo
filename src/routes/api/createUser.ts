
// This file will help with routing the API request to the Supabase function

import { supabase } from "@/lib/supabase";

export async function createUser(requestData: any) {
  // Get the Supabase URL from the client
  const supabaseUrl = supabase.supabaseUrl;
  
  // Construct the function URL
  const functionUrl = `${supabaseUrl}/functions/v1/create-user`;
  
  // Get auth token for authorization
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Call the Supabase function
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });
  
  if (!response.ok) {
    let errorMessage = 'Failed to create user';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (jsonError) {
      errorMessage = `${errorMessage}: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  
  return await response.json();
}
