import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {getModel} from './src/services/model/modelService';

export default function App() {
  useEffect(() => {
    const preload = async () => {
      try {
        console.log('App mounted — starting model preload...');
        await getModel();
        console.log('Model preload complete — app ready');
      } catch (e) {
        // Silently fail — model will load on first recognition attempt
        console.warn('Model preload skipped:', e);
      }
    };

    preload();
  }, []);

  return <AppNavigator />;
}