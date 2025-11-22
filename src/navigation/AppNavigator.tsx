import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { theme } from '@/theme';
import { AuthStackParamList, AppStackParamList, MainTabParamList } from './types';

// Auth screens
import { LoginScreen } from '@/screens/Auth/LoginScreen';
import { SignupScreen } from '@/screens/Auth/SignupScreen';

// Evaluation screens
import { MyEvaluationsScreen } from '@/screens/Evaluations/MyEvaluationsScreen';
import { NewEvaluationScreen } from '@/screens/Evaluations/NewEvaluationScreen';
import { EvaluationDetailScreen } from '@/screens/Evaluations/EvaluationDetailScreen';

// Report screens
import { ReportViewerScreen } from '@/screens/Reports/ReportViewerScreen';

// Account screens
import { ProfileScreen } from '@/screens/Account/ProfileScreen';

// Loading screen
import { LoadingSpinner } from '@/components/LoadingSpinner';

const AuthStack = createStackNavigator<AuthStackParamList>();
const AppStack = createStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack Component
const AuthStackComponent = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Evaluations') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'NewEvaluation') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarStyle: {
          height: theme.layout.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: theme.spacing.sm,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Evaluations"
        component={MyEvaluationsScreen}
        options={{
          title: 'Minhas Avaliações',
        }}
      />
      <Tab.Screen
        name="NewEvaluation"
        component={NewEvaluationScreen}
        options={{
          title: 'Nova Avaliação',
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileScreen}
        options={{
          title: 'Conta',
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Stack Component
const AppStackComponent = () => (
  <AppStack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <AppStack.Screen name="MainTabs" component={MainTabs} />
    <AppStack.Screen
      name="EvaluationDetail"
      component={EvaluationDetailScreen}
      options={{
        headerShown: true,
        title: 'Detalhes da Avaliação',
        headerBackTitleVisible: false,
      }}
    />
    <AppStack.Screen
      name="ReportViewer"
      component={ReportViewerScreen}
      options={{
        headerShown: true,
        title: 'Laudo',
        headerBackTitleVisible: false,
      }}
    />
  </AppStack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const { isLoading, isAuthenticated, isHydrated } = useAuthStore();

  // Show loading while hydrating or during auth operations
  if (!isHydrated || isLoading) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStackComponent /> : <AuthStackComponent />}
    </NavigationContainer>
  );
};
