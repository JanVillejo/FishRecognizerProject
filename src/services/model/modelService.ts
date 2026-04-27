//modelService
import {loadTensorflowModel} from 'react-native-fast-tflite';
import {preprocessImage} from './preprocess';
import {decodeYoloOutput} from './postprocess';
import RNFS from 'react-native-fs';

let model: any = null;

export async function getModel() {
  if (!model) {
    try {
      console.log('Loading TFLite model...');

      const destPath = `${RNFS.DocumentDirectoryPath}/best_float32.tflite`;
      const exists = await RNFS.exists(destPath);

      if (!exists) {
        console.log('Copying model from assets...');
        await RNFS.copyFileAssets('best_float32.tflite', destPath);
        console.log('Model copied successfully');
      }

      model = await loadTensorflowModel({
        url: `file://${destPath}`,
      });

      console.log('TFLite model loaded successfully');
    } catch (e) {
      console.error('Model loading failed:', e);
      model = null;
      throw e;
    }
  }

  return model;
}

export async function runFishRecognition(imageUri: string) {
  try {
    console.log('Running recognition for:', imageUri);

    const tflite = await getModel();
    const prep = await preprocessImage(imageUri);

    if (!prep.inputTensor || prep.inputTensor.length === 0) {
      throw new Error('Invalid input tensor from preprocessor');
    }

    console.log('Input tensor length:', prep.inputTensor.length, '| expected:', 640 * 640 * 3);
    console.log('Input first 20 values:', JSON.stringify(Array.from(prep.inputTensor.slice(0, 20))));

    const outputs = tflite.runSync([prep.inputTensor]);

    if (!outputs || outputs.length === 0) {
      throw new Error('Model returned empty output');
    }

    console.log('Output count:', outputs.length);
    console.log('Output[0] type:', outputs[0]?.constructor?.name);
    console.log('Output[0] length:', outputs[0]?.length);

    const sample = Array.from(outputs[0]?.slice(0, 20) || []);
    console.log('Output[0] first 20 values:', JSON.stringify(sample));

    const detections = decodeYoloOutput(outputs);

    console.log('Final detections:', detections.length);

    if (!detections || detections.length === 0) {
      return {
        status: 'unidentified' as const,
        imageUri,
        reason: 'No confident detection found.',
      };
    }

    const best = detections.sort((a, b) => b.score - a.score)[0];

    console.log('Best detection:', best);

    return {
      status: 'identified' as const,
      imageUri,
      species: best.label,
      confidence: best.confidence,
      detection: {
        ...best,
        confidence: best.confidence,
      },
    };
  } catch (error) {
    console.error('Inference error:', error);

    return {
      status: 'unidentified' as const,
      imageUri,
      reason: 'Inference error occurred.',
    };
  }
}