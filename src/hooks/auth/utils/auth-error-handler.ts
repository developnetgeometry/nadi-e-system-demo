
export const handleAuthError = (error: any): string => {
  let errorMessage = "An unexpected error occurred. Please try again.";
  
  if (error.message.includes("Invalid login credentials")) {
    errorMessage = "Invalid email or password. Please try again.";
  } else if (error.message.includes("Email not confirmed")) {
    errorMessage = "Please verify your email before logging in.";
  } else if (error.message.includes("User not found")) {
    errorMessage = "No account found with this email. Please sign up.";
  }

  return errorMessage;
};
