import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {getHistory, HistoryItem} from '../storage/historyStorage';

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getHistory();
        setHistory(data);
      };

      load();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={item => item.id}
        contentContainerStyle={history.length === 0 ? styles.emptyContainer : styles.listContent}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.imageUri}} style={styles.image} />
            <View style={styles.meta}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.confidence}>
                {(item.confidence * 100).toFixed(2)}%
              </Text>
              <Text style={styles.date}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No history yet.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#E5E7EB',
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#111827',
  },
  confidence: {
    color: '#4B5563',
    marginTop: 2,
  },
  date: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 12,
  },
  empty: {
    fontSize: 16,
    color: '#6B7280',
  },
});