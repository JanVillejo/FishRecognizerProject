//AppNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootStackParamList} from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import PreviewScreen from '../screens/PreviewScreen';
import LoadingScreen from '../screens/LoadingScreen';
import ResultScreen from '../screens/ResultScreen';
import UnidentifiedScreen from '../screens/UnidentifiedScreen';
import HistoryScreen from '../screens/HistoryScreen';
import {COLORS} from '../themes/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="Unidentified" component={UnidentifiedScreen} />

        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            headerShown: true,
            title: 'History',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: COLORS.background,
            },
            headerShadowVisible: false,
            headerTintColor: COLORS.primary,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}