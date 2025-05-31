import { Platform, Vibration } from "react-native";

// ✅ IMPORT SEGURO COM TRY/CATCH
let HapticFeedback: any = null;

try {
  HapticFeedback = require("react-native-haptic-feedback").default;
} catch (error) {
  console.log("📱 Haptic Feedback não disponível, usando vibração nativa");
}

// Configuração global para Equilibrium
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// ✅ FUNÇÃO FALLBACK PARA VIBRAÇÃO NATIVA
const fallbackVibration = (duration: number | number[] = 50) => {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    Vibration.vibrate(duration);
  }
};

export const EQHaptics = {
  // Para botões principais (CTA)
  primary: () => {
    if (HapticFeedback) {
      try {
        HapticFeedback.trigger("impactMedium", hapticOptions);
      } catch (error) {
        console.log("Haptic feedback falhou, usando vibração");
        fallbackVibration(100);
      }
    } else {
      fallbackVibration(100);
    }
  },

  // Para interações suaves (cards, toggles)
  gentle: () => {
    if (HapticFeedback) {
      try {
        HapticFeedback.trigger("impactLight", hapticOptions);
      } catch (error) {
        console.log("Haptic feedback falhou, usando vibração");
        fallbackVibration(50);
      }
    } else {
      fallbackVibration(50);
    }
  },

  // Para confirmações importantes
  success: () => {
    if (HapticFeedback) {
      try {
        HapticFeedback.trigger("notificationSuccess", hapticOptions);
      } catch (error) {
        console.log("Haptic feedback falhou, usando vibração");
        fallbackVibration([50, 100, 50]);
      }
    } else {
      // Padrão de vibração para sucesso
      Vibration.vibrate([50, 100, 50]);
    }
  },

  // Para alertas (usar com parcimônia em saúde mental)
  warning: () => {
    if (HapticFeedback) {
      try {
        HapticFeedback.trigger("notificationWarning", hapticOptions);
      } catch (error) {
        console.log("Haptic feedback falhou, usando vibração");
        fallbackVibration([100, 50, 100]);
      }
    } else {
      // Padrão de vibração para warning
      Vibration.vibrate([100, 50, 100]);
    }
  },
};

// ✅ FUNÇÃO PARA VERIFICAR DISPONIBILIDADE
export const isHapticFeedbackAvailable = (): boolean => {
  return HapticFeedback !== null;
};
