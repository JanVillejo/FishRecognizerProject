//DetectionBoxOverlay
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Detection} from '../services/model/postprocess';

type Props = {
  detections: Detection[];
  imageWidth: number;
  imageHeight: number;
  displayWidth: number;
  displayHeight: number;
};

export default function DetectionBoxOverlay({
  detections,
  imageWidth,
  imageHeight,
  displayWidth,
  displayHeight,
}: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {detections.map((det, index) => {
        // Coordinates are normalized 0-1, scale to display size
        const left = det.x * displayWidth;
        const top = det.y * displayHeight;
        const width = det.width * displayWidth;
        const height = det.height * displayHeight;

        return (
          <View
            key={index}
            style={[styles.box, {left, top, width, height}]}>
            <Text style={styles.label}>
              {det.label} {((det.confidence ?? det.score) * 100).toFixed(1)}%
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#22C55E',
    borderRadius: 4,
  },
  label: {
    position: 'absolute',
    top: -20,
    left: 0,
    backgroundColor: '#22C55E',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 3,
  },
});