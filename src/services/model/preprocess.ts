import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
const jpeg = require('jpeg-js');

export async function preprocessImage(imageUri: string) {
  try {
    console.log('--- PREPROCESS START ---');

    // Step 1: Resize keeping aspect ratio, fitting within 640x640
    const resized = await ImageResizer.createResizedImage(
      imageUri,
      640,
      640,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {mode: 'contain', onlyScaleDown: false},
    );

    const uri = resized.uri.startsWith('file://')
      ? resized.uri
      : `file://${resized.uri}`;

    console.log('Resized size:', resized.width, 'x', resized.height);

    // Step 2: Decode JPEG
    const base64 = await RNFS.readFile(uri, 'base64');
    const jpegBytes = Buffer.from(base64, 'base64');
    const decoded = jpeg.decode(jpegBytes, {
      useTArray: true,
      formatAsRGBA: true,
    });

    const {data, width, height} = decoded;
    console.log('Decoded size:', width, 'x', height);

    // Step 3: Place into 640x640 tensor with letterbox padding
    const input = new Float32Array(640 * 640 * 3);
    input.fill(0); // black padding

    // Clamp dimensions to max 640 to avoid out-of-bounds
    const copyWidth = Math.min(width, 640);
    const copyHeight = Math.min(height, 640);

    // Center the image
    const xOffset = Math.floor((640 - copyWidth) / 2);
    const yOffset = Math.floor((640 - copyHeight) / 2);

    console.log('Copy dims:', copyWidth, 'x', copyHeight);
    console.log('Offsets:', {xOffset, yOffset});

    for (let y = 0; y < copyHeight; y++) {
      for (let x = 0; x < copyWidth; x++) {
        const srcIdx = (y * width + x) * 4;
        const dstX = x + xOffset;
        const dstY = y + yOffset;
        const dstIdx = (dstY * 640 + dstX) * 3;

        input[dstIdx] = data[srcIdx] / 255.0;
        input[dstIdx + 1] = data[srcIdx + 1] / 255.0;
        input[dstIdx + 2] = data[srcIdx + 2] / 255.0;
      }
    }

    // Sample from center of image to verify non-zero
    const centerIdx = (320 * 640 + 320) * 3;
    console.log('Center pixel RGB:', input[centerIdx], input[centerIdx + 1], input[centerIdx + 2]);

    const samples = Array.from(input.slice(
      (yOffset * 640 + xOffset) * 3,
      (yOffset * 640 + xOffset) * 3 + 10,
    ));
    console.log('First fish pixel values:', samples);
    console.log('Tensor length:', input.length);
    console.log('--- PREPROCESS END ---');

    return {
      inputTensor: input,
      width: 640,
      height: 640,
      xOffset,
      yOffset,
      contentWidth: copyWidth,
      contentHeight: copyHeight,
    };
  } catch (err) {
    console.error('Preprocess error:', err);
    throw err;
  }
}