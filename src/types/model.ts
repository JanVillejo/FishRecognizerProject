//model.ts
import {Detection} from '../services/model/postprocess';

export type IdentifiedRecognitionResult = {
  status: 'identified';
  imageUri: string;
  species: string;
  confidence: number;
  detection: Detection;
};

export type UnidentifiedRecognitionResult = {
  status: 'unidentified';
  imageUri: string;
  reason: string;
};

export type RecognitionResult =
  | IdentifiedRecognitionResult
  | UnidentifiedRecognitionResult;