import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'fish_detection_history';

export type HistoryItem = {
  id: string;
  imageUri: string;
  label: string;
  confidence: number;
  timestamp: number;
};

export async function saveToHistory(item: HistoryItem) {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history: HistoryItem[] = existing ? JSON.parse(existing) : [];

    history.unshift(item);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving history:', e);
  }
}

export async function getHistory(): Promise<HistoryItem[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error getting history:', e);
    return [];
  }
}

export async function clearHistory() {
  await AsyncStorage.removeItem(HISTORY_KEY);
}