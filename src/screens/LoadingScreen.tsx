import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {runFishRecognition} from '../services/model/modelService';

type Props = NativeStackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({navigation, route}: Props) {
  const {imageUri} = route.params;

  useEffect(() => {
    let mounted = true;

    async function runInference() {
      try {
        const result = await runFishRecognition(imageUri);
        if (!mounted) return;

        if (result.status === 'identified') {
          navigation.replace('Result', {
            result: {
              status: 'identified' as const,
              imageUri: result.imageUri,
              species: result.species,
              confidence: result.confidence ?? 0,
              detection: result.detection,
            },
          });
        } else {
          navigation.replace('Unidentified', {
            result: {
              status: 'unidentified' as const,
              imageUri: result.imageUri,
              reason: (result as any).reason || 'No fish detected.',
            },
          });
        }
      } catch (error) {
        console.error('Recognition failed:', error);
        if (!mounted) return;
        navigation.replace('Unidentified', {
          result: {
            status: 'unidentified' as const,
            imageUri,
            reason: 'Inference error occurred.',
          },
        });
      }
    }

    runInference();

    return () => {
      mounted = false;
    };
  }, [navigation, imageUri]);

  return (
    <View style={styles.container}>
      {/* Background image with reduced opacity */}
      <Image
        source={{uri: imageUri}}
        style={styles.backgroundImage}
        blurRadius={2}
      />

      {/* Dark overlay to dim the image */}
      <View style={styles.overlay} />

      {/* Centered loading content */}
      <SafeAreaView style={styles.content}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.title}>Identifying Species...</Text>
        <Text style={styles.subtitle}>Please wait</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    opacity: 0.45,  // ← lowered opacity to dim the image
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // ← dark overlay on top
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});