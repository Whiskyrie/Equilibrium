import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FlowerLotus, TrendUp, Wind, FirstAidKit } from "phosphor-react-native";
import { Colors } from "../styles/colors";
import { FontSizes, FontWeights } from "../styles/typography";
import { AppDimensions } from "../constants/dimensions";
import { EQHaptics } from "../constants/feedback";

// ✅ DEFINIR O TIPO AppState LOCALMENTE OU IMPORTAR
type AppState = "loading" | "onboarding" | "dashboard" | "meditation";

interface DashboardScreenProps {
  userName?: string;
  onNavigate: (screen: AppState, params?: any) => void; // ✅ USANDO AppState
}

// 🎨 PALETAS INDIVIDUALIZADAS POR CARD
interface CardColorPalette {
  gradientStart: string;
  gradientEnd: string;
  iconColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonBg?: string;
  buttonBorder?: string;
  buttonText?: string;
}

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  colors: CardColorPalette;
  onPress: () => void;
  isPrimary?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName = "Usuário",
  onNavigate,
}) => {
  // 📅 DATA ATUAL FORMATADA (sem emoji)
  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return today.toLocaleDateString("pt-BR", options);
  };

  // 🎨 DEFINIÇÃO DE PALETAS HARMONIOSAS POR CARD
  const cardPalettes = {
    meditation: {
      gradientStart: "rgba(102, 126, 234, 0.15)", // Roxo suave
      gradientEnd: "rgba(118, 75, 162, 0.10)", // Roxo mais escuro
      iconColor: "#6366F1", // Indigo vibrante
      titleColor: "#374151", // Cinza escuro
      subtitleColor: "#6B7280", // Cinza médio
      buttonBg: "rgba(99, 102, 241, 0.12)",
      buttonBorder: "rgba(99, 102, 241, 0.25)",
      buttonText: "#6366F1",
    },

    progress: {
      gradientStart: "rgba(34, 197, 94, 0.12)", // Verde suave
      gradientEnd: "rgba(21, 128, 61, 0.08)", // Verde escuro
      iconColor: "#059669", // Verde esmeralda
      titleColor: "#374151",
      subtitleColor: "#6B7280",
    },

    breathing: {
      gradientStart: "rgba(56, 189, 248, 0.12)", // Azul céu suave
      gradientEnd: "rgba(14, 165, 233, 0.08)", // Azul mais profundo
      iconColor: "#0EA5E9", // Azul céu
      titleColor: "#374151",
      subtitleColor: "#6B7280",
    },

    sos: {
      gradientStart: "rgba(251, 146, 60, 0.15)", // Laranja suave
      gradientEnd: "rgba(234, 88, 12, 0.10)", // Laranja mais quente
      iconColor: "#EA580C", // Laranja vibrante
      titleColor: "#374151",
      subtitleColor: "#6B7280",
      buttonBg: "rgba(234, 88, 12, 0.12)",
      buttonBorder: "rgba(234, 88, 12, 0.25)",
      buttonText: "#EA580C",
    },
  };

  // 🎴 CARDS COM PALETAS INDIVIDUALIZADAS
  const dashboardCards: DashboardCard[] = [
    {
      id: "daily-session",
      title: "Sessão Diária",
      subtitle: "15 min • Mindfulness",
      icon: FlowerLotus,
      colors: cardPalettes.meditation,
      isPrimary: true,
      onPress: () => {
        EQHaptics.primary();
        onNavigate("meditation", {
          type: "mindfulness",
          duration: 15,
        });
      },
    },
    {
      id: "progress",
      title: "Seu Progresso",
      subtitle: "7 dias seguidos",
      icon: TrendUp,
      colors: cardPalettes.progress,
      onPress: () => {
        EQHaptics.gentle();
        onNavigate("dashboard");
      },
    },
    {
      id: "breathing",
      title: "Respiração Rápida",
      subtitle: "3 min para se acalmar",
      icon: Wind,
      colors: cardPalettes.breathing,
      onPress: () => {
        EQHaptics.gentle();
        onNavigate("meditation", {
          type: "breathing",
          duration: 3,
        });
      },
    },
    {
      id: "sos",
      title: "Ajuda Imediata",
      subtitle: "Para momentos difíceis",
      icon: FirstAidKit,
      colors: cardPalettes.sos,
      onPress: () => {
        EQHaptics.primary();
        onNavigate("dashboard");
      },
    },
  ];

  // 🎴 COMPONENTE DE CARD COM CORES INDIVIDUALIZADAS
  const DashboardCard: React.FC<{ card: DashboardCard }> = ({ card }) => {
    const scaleAnim = new Animated.Value(1);
    const iconSize = card.isPrimary ? 32 : 28;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const IconComponent = card.icon;

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          style={[styles.card, card.isPrimary && styles.primaryCard]}
          onPress={card.onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`${card.title}: ${card.subtitle}`}
        >
          {/* ✅ GRADIENTE COM CORES ESPECÍFICAS DO CARD */}
          <LinearGradient
            colors={[card.colors.gradientStart, card.colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.cardGradient,
              card.isPrimary && styles.primaryCardGradient,
            ]}
          >
            {/* ✅ ÍCONE COM COR ESPECÍFICA DO CARD */}
            <IconComponent
              size={iconSize}
              color={card.colors.iconColor}
              weight="duotone"
              style={styles.cardIcon}
            />

            {/* ✅ TÍTULO COM COR ESPECÍFICA DO CARD */}
            <Text
              style={[
                styles.cardTitle,
                { color: card.colors.titleColor },
                card.isPrimary && styles.primaryCardTitle,
              ]}
            >
              {card.title}
            </Text>

            {/* ✅ SUBTÍTULO COM COR ESPECÍFICA DO CARD */}
            <Text
              style={[
                styles.cardSubtitle,
                { color: card.colors.subtitleColor },
                card.isPrimary && styles.primaryCardSubtitle,
              ]}
            >
              {card.subtitle}
            </Text>

            {/* ✅ BOTÃO PRIMARY COM CORES ESPECÍFICAS */}
            {card.isPrimary && card.colors.buttonBg && (
              <View
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: card.colors.buttonBg,
                    borderColor: card.colors.buttonBorder,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: card.colors.buttonText },
                  ]}
                >
                  COMEÇAR AGORA
                </Text>
              </View>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ✅ HEADER LIMPO - SEM EMOJIS */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {userName}</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>
      </View>

      {/* CARDS VERTICAIS COM GRADIENTES */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} card={card} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    paddingHorizontal: AppDimensions.spacing.xl,
    paddingTop: AppDimensions.spacing.xl, // ✅ MAIS ESPAÇO NO TOPO
    paddingBottom: AppDimensions.spacing.lg, // ✅ ESPAÇO GENEROSO PARA CARDS
  },

  greeting: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: AppDimensions.spacing.xs,
    // ✅ MESMA SOMBRA SUTIL PARA CONTINUIDADE
    textShadowColor: "rgba(34, 111, 156, 0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  date: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.normal,
    color: Colors.accent.muted,
    textTransform: "capitalize", // ✅ Primeira letra maiúscula
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: AppDimensions.spacing.xl,
    paddingBottom: AppDimensions.spacing.xl,
  },

  card: {
    borderRadius: AppDimensions.radius.large,
    marginBottom: AppDimensions.spacing.md,
    overflow: "hidden", // ✅ IMPORTANTE para gradiente não vazar

    // ✅ SOMBRA MAIS SUTIL PARA GRADIENTES
    shadowColor: "rgba(0, 0, 0, 0.04)", // Sombra mais neutra
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4, // Reduzido para Android
  },

  primaryCard: {
    marginBottom: AppDimensions.spacing.lg,
  },

  cardGradient: {
    padding: AppDimensions.spacing.lg,
    minHeight: 100, // Altura mínima para cards normais
  },

  primaryCardGradient: {
    minHeight: 140, // Altura maior para card principal
  },

  cardIcon: {
    marginBottom: AppDimensions.spacing.sm,
  },

  cardTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
    marginBottom: AppDimensions.spacing.xs,
  },

  primaryCardTitle: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
  },

  cardSubtitle: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.normal,
  },

  primaryCardSubtitle: {
    fontSize: FontSizes.body,
    marginBottom: AppDimensions.spacing.md,
  },

  primaryButton: {
    borderRadius: AppDimensions.radius.medium,
    paddingVertical: AppDimensions.spacing.sm,
    paddingHorizontal: AppDimensions.spacing.md,
    alignSelf: "flex-start",
    borderWidth: 1,
  },

  primaryButtonText: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.5,
  },
});
