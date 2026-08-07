import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_KEY = 'cart_session_id';

export async function getSessionId(): Promise<string> {
  let sessionId = await AsyncStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function formatPrice(price: number): string {
  return `₹${price.toFixed(2)}`;
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
}
