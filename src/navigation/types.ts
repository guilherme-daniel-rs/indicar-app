import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Evaluations: undefined;
  NewEvaluation: undefined;
  Account: undefined;
};

// App Stack
export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EvaluationDetail: {
    evaluationId: number;
  };
  ReportViewer: {
    fileUrl: string;
  };
};

// Root Stack (combines all)
export type RootStackParamList = AuthStackParamList & AppStackParamList;

// Screen Props
export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;
export type SignupScreenProps = StackScreenProps<AuthStackParamList, 'Signup'>;
export type MyEvaluationsScreenProps = StackScreenProps<MainTabParamList, 'Evaluations'>;
export type NewEvaluationScreenProps = StackScreenProps<MainTabParamList, 'NewEvaluation'>;
export type ProfileScreenProps = StackScreenProps<MainTabParamList, 'Account'>;
export type EvaluationDetailScreenProps = StackScreenProps<AppStackParamList, 'EvaluationDetail'>;
export type ReportViewerScreenProps = StackScreenProps<AppStackParamList, 'ReportViewer'>;

// Navigation Props
export type AuthNavigationProp = LoginScreenProps['navigation'];
export type MainTabNavigationProp = MyEvaluationsScreenProps['navigation'];
export type AppStackNavigationProp = EvaluationDetailScreenProps['navigation'];

// Combined navigation types for screens that need to navigate to app stack
export type CombinedNavigationProp = MainTabNavigationProp & AppStackNavigationProp;
