import jwtDecode from "jwt-decode";

interface DecodedToken {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
}

export const getUserIdFromToken = (token: string): string | null => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };