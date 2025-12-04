// navigation/AppStack.js
import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AddEditScreen from "../screens/AddEditScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DetailsScreen from "../screens/DetailsScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for main app screens
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Custom back button component
function BackButton({ navigation }) {
  return (
    <TouchableOpacity 
      onPress={() => navigation.goBack()}
      style={styles.backButton}
    >
      <Icon name="arrow-back" size={24} color="#6366f1" />
    </TouchableOpacity>
  );
}

// Main Stack Navigator
export default function AppStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth Screens - No header, no tabs */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      
      {/* Main App - With bottom tabs */}
      <Stack.Screen 
        name="Dashboard" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      
      {/* Modal/Detail Screens - With back button, no tabs */}
      <Stack.Screen 
        name="AddEdit" 
        component={AddEditScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '',
          headerLeft: () => <BackButton navigation={navigation} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
          },
          headerShadowVisible: false,
          presentation: 'card',
        })}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Task Details',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#1f2937',
          },
          headerLeft: () => <BackButton navigation={navigation} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#f3f4f6',
          },
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingVertical: 8,
  },
});