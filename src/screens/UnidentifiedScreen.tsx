//UnidentifiedScreen
import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {COLORS} from '../themes/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Unidentified'>;

export default function UnidentifiedScreen({navigation, route}: Props) {
  const {result} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <Image source={{uri: result.imageUri}} style={styles.image} />

      <View style={styles.card}>
        <Text style={styles.smallLabel}>Result</Text>
        <Text style={styles.title}>Fish Not Identified</Text>

        <Text style={styles.subtitle}>
          Please try another photo with better lighting, a clearer fish view, or
          less background clutter.
        </Text>

        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>Reason</Text>
          <Text style={styles.reasonText}>
            {result.reason || 'The fish could not be confidently recognized.'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Tips for a better result</Text>

        <View style={styles.tipBox}>
          <Text style={styles.tipText}>• Keep the fish centered in the frame</Text>
          <Text style={styles.tipText}>• Use brighter lighting</Text>
          <Text style={styles.tipText}>• Avoid blurry or distant photos</Text>
          <Text style={styles.tipText}>• Try a clear side view of the fish</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backButton: {
    position: 'absolute',
    top: 46,
    left: 18,
    zIndex: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
  },
  image: {
    width: '100%',
    height: '48%',
    resizeMode: 'cover',
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 22,
  },
  smallLabel: {
    fontSize: 11,
    color: '#2F6FED',
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F1F1F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4C5A73',
    marginBottom: 14,
  },
  reasonBox: {
    backgroundColor: '#F3F6FB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  reasonLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2F6FED',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4C5A73',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2F6FED',
    marginBottom: 6,
  },
  tipBox: {
    marginBottom: 16,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 21,
    color: '#4C5A73',
  },
  primaryButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  homeText: {
    color: '#7E8CA6',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
});