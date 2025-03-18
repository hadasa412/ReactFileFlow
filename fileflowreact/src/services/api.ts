// src/services/api.ts

const API_URL = 'https://your-api-url.com'; // הכנס את ה-API URL שלך

// פונקציה לשליחת בקשת התחברות
export const loginUser = async (data: { email: string, password: string }) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// ניתן להוסיף פונקציות אחרות לאינטראקציה עם ה-API כמו "הרשמה", "העלאת קבצים" וכו'.
