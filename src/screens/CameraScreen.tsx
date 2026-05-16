import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Camera, useCameraDevice, useCameraPermission} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
=======
// ✅ No Vision Camera, no Nitro, no JSI binding issues.
//    launchCamera opens the system camera app directly — works on all Android
//    devices including MediaTek-based ones like Galaxy A12.
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
>>>>>>> 71e7b45 (Updated and fixed release version)
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {logger} from '../services/utils/logger';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export default function CameraScreen({navigation}: Props) {
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const isFocused = useIsFocused();

  const {hasPermission, requestPermission} = useCameraPermission();
  const [cameraReady, setCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isCameraActive, setIsCameraActive] = useState(false);

  // ✅ Request permission when screen is focused or on mount
  React.useEffect(() => {
    if (!hasPermission) {
      logger.log('Requesting camera permission...');
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // ✅ Delayed camera activation to prevent "Fatal Camera Error" on mount
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isFocused && hasPermission) {
      // Small delay to ensure native layer is ready
      timeout = setTimeout(() => {
        logger.log('Activating camera session...');
        setIsCameraActive(true);
      }, 500);
    } else {
      setIsCameraActive(false);
      setCameraReady(false);
    }
    return () => clearTimeout(timeout);
  }, [isFocused, hasPermission]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  // ✅ Request permission then immediately launch camera —
  //    user goes straight into the native camera app with live preview.
  //    They never see the dark placeholder screen.
  useEffect(() => {
    const requestAndLaunch = async () => {
      try {
        if (Platform.OS === 'android') {
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
          setPermissionGranted(granted);
          setPermissionChecked(true);

          if (granted) {
            // Small delay to let the screen finish mounting before launching
            setTimeout(() => handleCapture(), 300);
          }
        } else {
          setPermissionGranted(true);
          setPermissionChecked(true);
          setTimeout(() => handleCapture(), 300);
        }
      } catch (e) {
        logger.warn('Permission error:', e);
        setPermissionGranted(false);
        setPermissionChecked(true);
      }
    };

    requestAndLaunch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePhoto({flash});
      const uri = photo.path.startsWith('file://')
        ? photo.path
        : `file://${photo.path}`;
      logger.log('Captured:', uri);
      navigation.navigate('Preview', {imageUri: uri});
    } catch (e) {
      logger.error('Capture error:', e);
      Alert.alert('Error', 'Failed to capture image');
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: false,
      });

      if (result.didCancel) return;

      if (result.errorCode) {
        logger.error('Camera error:', result.errorCode, result.errorMessage);
        Alert.alert(
          'Camera Error',
          result.errorMessage ?? 'Failed to open camera.',
        );
        return;
      }

      const imageUri = result.assets?.[0]?.uri;
      if (!imageUri) {
        Alert.alert('No image captured', 'Please try again.');
        return;
      }

      logger.log('Captured:', imageUri);
      navigation.navigate('Preview', {imageUri});
    } catch (e) {
      logger.error('Capture error:', e);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, navigation]);

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
      logger.error('Gallery picker failed:', error);
      Alert.alert('Gallery Error', 'Unable to select image.');
    }
  }, [navigation]);

  // Still checking permission
  if (!permissionChecked) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.statusText}>Checking camera access...</Text>
      </View>
    );
  }

  // Permission denied
  if (!permissionGranted) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionTitle}>Camera permission needed</Text>
        <Text style={styles.permissionText}>
          Please allow camera access to capture fish images.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handlePickFromGallery}>
          <Text style={styles.primaryButtonText}>Open Gallery Instead</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, {marginTop: 12}]}
          onPress={() => Linking.openSettings()}>
          <Text style={styles.primaryButtonText}>Open App Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Permission granted — show capture UI
  //    No camera preview needed since launchCamera opens the system camera app.
  //    The UI here is just the entry point before the system camera launches.
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        photo={true}
        audio={false}
        onInitialized={() => {
          logger.log('Camera initialized successfully');
          setCameraReady(true);
        }}
        onError={error => {
          logger.error('Camera runtime error:', error.code, error.message);
          Alert.alert('Camera Error', `Unable to start camera: ${error.message}`);
        }}
      />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dark background with fish icon as visual context */}
      <View style={styles.previewPlaceholder}>
        <ActivityIndicator size="large" color="#FFFFFF" style={{marginBottom: 20}} />
        <Text style={styles.placeholderText}>
          Opening camera...
        </Text>
      </View>

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      {/* Bottom controls */}
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
          {isCapturing ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <View style={styles.captureInner} />
          )}
        </TouchableOpacity>

        {/* Empty view to keep layout balanced */}
        <View style={styles.sideButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  statusText: {
    color: '#CFCFCF',
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
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
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
  },
  primaryButtonText: {
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
});
