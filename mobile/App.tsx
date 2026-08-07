import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ShoppingCart, Home, Compass, User, Phone } from 'react-native-svg';
import React from 'react';
import { StyleSheet } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CatalogStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ef4444',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="CatalogList"
        component={CatalogScreen}
        options={{ title: 'Shop Toys' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen
        name="ProductDetailFromHome"
        component={ProductDetailScreen}
        options={{ headerShown: true, title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fcd34d',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="CartList"
        component={CartScreen}
        options={{ title: 'My Cart' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ef4444',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Stack.Screen
        name="AboutList"
        component={AboutScreen}
        options={{ title: 'About Us' }}
      />
      <Stack.Screen
        name="ContactList"
        component={ContactScreen}
        options={{ title: 'Contact Us' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#ef4444',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#e5e7eb',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
              marginTop: 4,
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <Home width={24} height={24} fill={color} stroke={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Shop"
            component={CatalogStack}
            options={{
              tabBarLabel: 'Shop',
              tabBarIcon: ({ color }) => (
                <Compass width={24} height={24} fill={color} stroke={color} />
              ),
            }}
          />
          <Tab.Screen
            name="MyCart"
            component={CartStack}
            options={{
              tabBarLabel: 'Cart',
              tabBarIcon: ({ color }) => (
                <ShoppingCart width={24} height={24} fill={color} stroke={color} />
              ),
            }}
          />
          <Tab.Screen
            name="More"
            component={MoreStack}
            options={{
              tabBarLabel: 'More',
              tabBarIcon: ({ color }) => (
                <Phone width={24} height={24} fill={color} stroke={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
