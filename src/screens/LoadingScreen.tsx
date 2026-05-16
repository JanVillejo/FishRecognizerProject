import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
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
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    async function runInference() {
      try {
        if (!imageUri || typeof imageUri !== 'string') {
          throw new Error('Invalid image URI passed to LoadingScreen');
        }

        const result = await runFishRecognition(imageUri);

        if (!mountedRef.current) return;

        if (!result || typeof result !== 'object') {
          throw new Error('runFishRecognition returned a non-object result');
        }

        if (result.status === 'identified') {
          navigation.replace('Result', {
            result: {
              status: 'identified' as const,
              imageUri: result.imageUri ?? imageUri,
              species: result.species,
              confidence: typeof result.confidence === 'number' ? result.confidence : 0,
              // ✅ Pass all detections through to ResultScreen
              detections: result.detections ?? [],
              detection: result.detection,
            },
          });
        } else {
          navigation.replace('Unidentified', {
            result: {
              status: 'unidentified' as const,
              imageUri: result.imageUri ?? imageUri,
              reason:
                typeof (result as any).reason === 'string'
                  ? (result as any).reason
                  : 'No fish detected.',
            },
          });
        }
      } catch (error) {
        console.error('Recognition failed:', error);
        if (!mountedRef.current) return;
        navigation.replace('Unidentified', {
          result: {
            status: 'unidentified' as const,
            imageUri,
            reason: 'An error occurred during identification. Please try again.',
          },
        });
      }
    }

    runInference();

    return () => {
      mountedRef.current = false;
    };
  }, [navigation, imageUri]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Image
        source={{uri: imageUri}}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.title}>Identifying Species...</Text>
        <Text style={styles.subtitle}>Please wait</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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