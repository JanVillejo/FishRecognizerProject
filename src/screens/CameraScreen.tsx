import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export default function CameraScreen({navigation}: Props) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused();

  const [hasPermission, setHasPermission] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  // ✅ Request camera permission with popup style when screen is focused
  useFocusEffect(
    useCallback(() => {
      const requestPermission = async () => {
        try {
          const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'FishRecognizer needs camera access to identify fish.',
              buttonPositive: 'Allow',
              buttonNegative: 'Deny',
            },
          );
          const granted = result === PermissionsAndroid.RESULTS.GRANTED;
          console.log('Camera permission:', result, '| granted:', granted);
          setHasPermission(granted);
        } catch (e) {
          console.warn('Permission error:', e);
          setHasPermission(false);
        }
      };

      requestPermission();
    }, []),
  );

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || !cameraReady || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePhoto({flash});
      const uri = photo.path.startsWith('file://')
        ? photo.path
        : `file://${photo.path}`;
      console.log('Captured:', uri);
      navigation.navigate('Preview', {imageUri: uri});
    } catch (e) {
      console.error('Capture error:', e);
      Alert.alert('Error', 'Failed to capture image');
    } finally {
      setIsCapturing(false);
    }
  }, [cameraReady, isCapturing, flash, navigation]);

  const handlePickFromGallery = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          );
        } else {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          );
        }
      }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 1,
      });

      if (result.didCancel) return;

      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) {
        Alert.alert('No image selected', 'Please choose another image.');
        return;
      }

      navigation.navigate('Preview', {imageUri});
    } catch (error) {
      console.error('Gallery picker failed:', error);
      Alert.alert('Gallery Error', 'Unable to select image.');
    }
  }, [navigation]);

  const handleFlashToggle = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  // 🚫 No camera device found
  if (!device) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>No camera found</Text>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickFromGallery}>
          <Text style={styles.galleryButtonText}>Open Gallery Instead</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 🚫 Permission not granted
  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera permission needed</Text>
        <Text style={styles.permissionText}>
          Please allow camera access to capture fish images.
        </Text>

        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handlePickFromGallery}>
          <Text style={styles.galleryButtonText}>Open Gallery Instead</Text>
        </TouchableOpacity>

        {/* ✅ New button to open app settings */}
        <TouchableOpacity
          style={[styles.galleryButton, {marginTop: 12}]}
          onPress={() => Linking.openSettings()}>
          <Text style={styles.galleryButtonText}>Open App Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused && hasPermission}
        photo={true}
        onInitialized={() => {
          console.log('Camera initialized');
          setCameraReady(true);
        }}
        onError={error => {
          console.error('Camera error:', error);
          Alert.alert('Camera Error', 'Unable to start camera.');
        }}
      />

      {!cameraReady && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Starting camera...</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={handlePickFromGallery}>
          <Image
            source={require('../assets/images/gallery.png')}
            style={styles.galleryIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureOuter, isCapturing && styles.captureDisabled]}
          onPress={handleCapture}
          disabled={isCapturing}>
          <View style={styles.captureInner} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sideButton,
            flash === 'on' && styles.flashButtonActive,
          ]}
          onPress={handleFlashToggle}>
          <Text style={styles.flashIcon}>⚡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    color: '#CFCFCF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
  },
  galleryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  galleryButtonText: {
    color: '#123A8C',
    fontWeight: '700',
  },
  backButton: {
    position: 'absolute',
    top: 46,
    left: 18,
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
  bottomControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 42,
  },
  sideButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1D1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryIcon: {
    width: 26,
    height: 26,
    tintColor: '#FFFFFF',
  },
  captureOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  captureDisabled: {
    opacity: 0.4,
  },
  flashIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  flashButtonActive: {
    backgroundColor: '#123A8C',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});