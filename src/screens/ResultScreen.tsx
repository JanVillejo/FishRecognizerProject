import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import {COLORS} from '../themes/colors';
import DetectionBoxOverlay from '../components/DetectionBoxOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_HEIGHT = SCREEN_WIDTH * 1.15;

function formatConfidence(value: number | undefined | null) {
  if (value == null) return 'N/A';
  const normalized = value <= 1 ? value * 100 : value;
  return `${normalized.toFixed(0)}%`;
}

function prettifyLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getLocalInfo(species: string) {
  switch (species.toLowerCase()) {
    case 'barongoy':
      return 'Barongoy with a long, pointed snout are locally known as "Swasid".';
    case 'barunday':
      return 'Young Barunday are locally known as "Mangsi".';
    case 'borot':
      return 'Borot with a slender silver body, large eye, and a pointed snout is actually called "Borot-tibol".';
    case 'buraw':
      return 'No additional local information available.';
    case 'tamarong':
      return 'Tamarong with a long and beautifully curved tail are commonly recognized by local fishers.';
    case 'tikab':
      return 'Young Tikab are locally known as "Sipi-sipi".';
    default:
      return 'No additional local information available.';
  }
}

function getLocalName(species: string) {
  switch (species.toLowerCase()) {
    case 'barongoy':
      return 'Swasid';
    case 'barunday':
      return 'Mangsi';
    case 'borot':
      return 'Borot-tibol';
    case 'buraw':
      return 'N/A';
    case 'tamarong':
      return 'Tamarong';
    case 'tikab':
      return 'Sipi-sipi';
    default:
      return 'N/A';
  }
}

function getPeakSeason(species: string) {
  switch (species.toLowerCase()) {
    case 'barongoy':
      return 'March - May';
    case 'barunday':
      return 'June - August';
    case 'borot':
      return 'Year-round';
    case 'buraw':
      return 'April - June';
    case 'tamarong':
      return 'July - September';
    case 'tikab':
      return 'July - September';
    default:
      return 'N/A';
  }
}

export default function ResultScreen({navigation, route}: Props) {
  const {result} = route.params;

  const speciesName = prettifyLabel(result.species);
  const confidenceText = formatConfidence(result.confidence);
  const localInfo = getLocalInfo(result.species);
  const localName = getLocalName(result.species);
  const peakSeason = getPeakSeason(result.species);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Camera')}>
        <Text style={styles.backText}>‹</Text>
      </TouchableOpacity>

      <View style={styles.imageWrapper}>
        <Image source={{uri: result.imageUri}} style={styles.image} />

        {result.detection && (
          <DetectionBoxOverlay
            detections={[result.detection]}
            imageWidth={640}
            imageHeight={640}
            displayWidth={SCREEN_WIDTH}
            displayHeight={IMAGE_HEIGHT}
          />
        )}
      </View>

      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.smallLabel}>Local Name:</Text>
        <Text style={styles.speciesTitle}>{speciesName}</Text>

        <View style={styles.infoRow}>
          <View style={styles.confidenceBlock}>
            <View style={styles.infoLabelRow}>
              <Text style={styles.infoIcon}>✦</Text>
              <Text style={styles.infoLabel}> Confidence</Text>
            </View>
            <Text style={styles.confidenceValue}>{confidenceText}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.localBlock}>
            <View style={styles.infoLabelRow}>
              <Text style={styles.infoIcon}>❧</Text>
              <Text style={styles.infoLabel}> Peak Season</Text>
            </View>
            <Text style={styles.peakValue}>{peakSeason}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Additional Fact:</Text>
        <Text style={styles.description}>{localInfo}</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.wrongText}>Wrong identification? Retake</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.scanAgainButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.scanAgainButtonText}>Take Another Photo</Text>
        </TouchableOpacity>
      </ScrollView>
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
  imageWrapper: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#000000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
  },
  smallLabel: {
    fontSize: 11,
    color: '#2F6FED',
    fontWeight: '700',
    marginBottom: 4,
  },
  speciesTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F1F1F',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  confidenceBlock: {
    flex: 1,
  },
  localBlock: {
    flex: 1,
    paddingLeft: 16,
  },
  separator: {
    width: 1,
    height: 56,
    backgroundColor: '#E1E6EF',
    marginTop: 4,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    fontSize: 10,
    color: '#7E8CA6',
  },
  infoLabel: {
    fontSize: 11,
    color: '#7E8CA6',
  },
  confidenceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1F1F1F',
  },
  peakValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1F1F',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2F6FED',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4C5A73',
    marginBottom: 16,
  },
  wrongText: {
    fontSize: 12,
    color: '#7E8CA6',
    textAlign: 'center',
    marginBottom: 12,
  },
  scanAgainButton: {
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  scanAgainButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
});