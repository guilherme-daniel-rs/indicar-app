import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/auth.store';
import { theme } from '@/theme';

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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
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
        height: theme.layout.tabBarHeight,
        paddingBottom: theme.spacing.sm,
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

// Main App Stack
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen
      name="EvaluationDetail"
      component={EvaluationDetailScreen}
      options={{
        headerShown: true,
        title: 'Detalhes da Avaliação',
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="ReportViewer"
      component={ReportViewerScreen}
      options={{
        headerShown: true,
        title: 'Laudo',
        headerBackTitleVisible: false,
      }}
    />
  </Stack.Navigator>
);

export const AppNavigator: React.FC = () => {
  const { isLoading } = useAuthStore();
  
  // Temporariamente forçando autenticação para testar o app
  const isAuthenticated = true;

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Carregando..." />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
