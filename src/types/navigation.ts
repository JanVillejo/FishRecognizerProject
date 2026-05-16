import {Detection} from '../services/model/postprocess';

export type RecognitionResult =
  | {
      status: 'identified';
      imageUri: string;
      species: string;
      confidence: number;
      // ✅ All detections from the model, sorted by confidence descending
      detections: Detection[];
      // Primary detection for bounding box overlay
      detection: Detection;
    }
  | {
      status: 'unidentified';
      imageUri: string;
      reason: string;
    };

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Preview: {imageUri: string};
  Loading: {imageUri: string};
  Result: {
    result: Extract<RecognitionResult, {status: 'identified'}>;
  };
  Unidentified: {
    result: Extract<RecognitionResult, {status: 'unidentified'}>;
  };
  History: undefined;
};
