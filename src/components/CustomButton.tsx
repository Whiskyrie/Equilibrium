import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "../styles/colors";
import { AppDimensions } from "../constants/dimensions";

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  fullWidth = false,
  testID,
}) => {
  const getButtonColors = () => {
    switch (variant) {
      case "primary":
        return {
          background: disabled ? Colors.ui.buttonDisabled : Colors.primary,
          text: "#FFFFFF",
          pressed: Colors.ui.buttonPressed,
        };
      case "secondary":
        return {
          background: disabled ? Colors.ui.buttonDisabled : Colors.secondary,
          text: "#FFFFFF",
          pressed: "#6BB0B0",
        };
      case "tertiary":
        return {
          background: "transparent",
          text: disabled ? Colors.accent.muted : Colors.primary,
          pressed: "rgba(74, 144, 184, 0.1)",
        };
      default:
        return {
          background: Colors.primary,
          text: "#FFFFFF",
          pressed: Colors.ui.buttonPressed,
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    const colors = getButtonColors();

    switch (size) {
      case "small":
        return {
          button: {
            backgroundColor: colors.background,
            height: AppDimensions.touch.minimum,
            paddingHorizontal: AppDimensions.spacing.md,
            borderRadius: AppDimensions.radius.medium,
            minWidth: AppDimensions.touch.minimum,
          },
          text: {
            fontSize: AppDimensions.text.caption,
            color: colors.text,
          },
        };

      case "large":
        return {
          button: {
            backgroundColor: colors.background,
            height: AppDimensions.touch.comfortable,
            paddingHorizontal: AppDimensions.spacing.lg,
            borderRadius: AppDimensions.radius.large,
            minWidth: AppDimensions.touch.comfortable,
          },
          text: {
            fontSize: AppDimensions.text.subtitle,
            color: colors.text,
          },
        };

      default:
        return {
          button: {
            backgroundColor: colors.background,
            height: AppDimensions.touch.primary,
            paddingHorizontal: AppDimensions.spacing.md,
            borderRadius: AppDimensions.radius.medium,
            minWidth: AppDimensions.touch.primary,
          },
          text: {
            fontSize: AppDimensions.text.body,
            color: colors.text,
          },
        };
    }
  };

  const colors = getButtonColors();
  const sizeStyles = getSizeStyles();
  const shouldHaveShadow = variant !== "tertiary" && !disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        !shouldHaveShadow && styles.noShadow,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      testID={testID}
      accessible={true}
      accessibilityLabel={title}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, sizeStyles.text]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    // 🌟 SOMBRA DOS BOTÕES AJUSTADA - mais sutil e profissional
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2, // Mantido baixo para sutileza
    },
    shadowOpacity: 0.08, // Reduzido de 0.1 para 0.08
    shadowRadius: 3, // Reduzido de 4 para 3
    elevation: 2, // Reduzido de 3 para 2
    marginVertical: AppDimensions.spacing.xs,
  },

  noShadow: {
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  text: {
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },

  fullWidth: {
    width: "100%",
  },

  disabled: {
    opacity: 0.6,
    shadowOpacity: 0,
    elevation: 0,
  },
});
