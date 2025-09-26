import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme';
import { useUIStore } from '@/store/ui.store';
import { ToastType } from '@/api/types';

const { width: screenWidth } = Dimensions.get('window');

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        backgroundColor: theme.colors.success,
        icon: 'checkmark-circle' as const,
        iconColor: theme.colors.white,
      };
    case 'error':
      return {
        backgroundColor: theme.colors.error,
        icon: 'close-circle' as const,
        iconColor: theme.colors.white,
      };
    case 'warning':
      return {
        backgroundColor: theme.colors.warning,
        icon: 'warning' as const,
        iconColor: theme.colors.white,
      };
    case 'info':
      return {
        backgroundColor: theme.colors.info,
        icon: 'information-circle' as const,
        iconColor: theme.colors.white,
      };
    default:
      return {
        backgroundColor: theme.colors.primary,
        icon: 'information-circle' as const,
        iconColor: theme.colors.white,
      };
  }
};

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useUIStore();

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  };
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Show animation
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto hide
    const timer = setTimeout(() => {
      hideToast();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide(toast.id);
    });
  };

  const config = getToastConfig(toast.type);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.toastContent}
        onPress={hideToast}
        activeOpacity={0.8}
      >
        <Ionicons
          name={config.icon}
          size={20}
          color={config.iconColor}
          style={styles.icon}
        />
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={16} color={config.iconColor} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1000,
  },
  toast: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.medium,
  },
  closeButton: {
    marginLeft: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
});
