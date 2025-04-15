import CryptoJS from "crypto-js";

export const createUserSession = (
  user: any, 
  profile: any, 
  userMetadata: any
) => {
  // Store user metadata directly in localStorage
  localStorage.setItem('user_metadata', JSON.stringify(userMetadata));

  // Also keep the encrypted session for backward compatibility
  const encryptedSession = CryptoJS.AES.encrypt(JSON.stringify({
    user: {
      ...user,
      user_metadata: userMetadata
    },
    profile: profile || {
      id: user.id,
      email: user.email,
      user_type: 'member'
    }
  }), 'secret-key').toString();
  
  localStorage.setItem('session', encryptedSession);
};
