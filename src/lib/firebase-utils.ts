export function parseFirebaseError(error: any): string {
  if (error && error.code) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Email is already in use.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/weak-password":
        return "Password is too weak.";
      case "auth/invalid-credential":
        return "Invalid credentials.";
      default:
        return "An unknown error occurred.";
    }
  }
  return "An unknown error occurred.";
}
