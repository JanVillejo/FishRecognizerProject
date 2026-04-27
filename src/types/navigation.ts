import {RecognitionResult} from './model';

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