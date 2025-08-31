import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FoodOrderingScreen from './src/screens/FoodOrderingScreen/FoodOrderingScreen';
import IngredientDetails from './src/screens/IngredientDetails/IngredientDetails';

export type Ingredient = {
  id?: string;
  name: string;
  description: string;
  price: number | string;
  image: string;
  type: 'veg' | 'non-veg';
  shelfLife: string;
  storage: string;
};

export type RootStackParamList = {
  FoodOrdering: undefined;
  IngredientDetails: { 
    ingredient: Ingredient;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="FoodOrdering" component={FoodOrderingScreen} />
          <Stack.Screen 
            name="IngredientDetails" 
            component={IngredientDetails} 
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
