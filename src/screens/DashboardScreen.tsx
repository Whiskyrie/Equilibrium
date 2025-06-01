import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  FlowerLotus,
  TrendUp,
  Wind,
  FirstAidKit,
  Fire,
  Crown,
  Star,
} from "phosphor-react-native";
import { Colors } from "../styles/colors";
import { FontSizes, FontWeights } from "../styles/typography";
import { AppDimensions } from "../constants/dimensions";
import { EQHaptics } from "../constants/feedback";

const { width } = Dimensions.get("window");

type AppState = "loading" | "onboarding" | "dashboard" | "meditation";

interface DashboardScreenProps {
  userName?: string;
  onNavigate: (screen: AppState, params?: any) => void;
}

// 🎨 PALETAS MAIS HARMONIOSAS
interface CardColorPalette {
  gradientStart: string;
  gradientEnd: string;
  iconColor: string;
  titleColor: string;
  subtitleColor: string;
  progressBg: string;
  progressFill: string;
  badgeBg?: string;
  badgeText?: string;
  buttonBg?: string;
  buttonBorder?: string;
  buttonText?: string;
}

interface CardProgress {
  current: number;
  total: number;
  label: string;
}

interface CardBadge {
  text: string;
  type: "streak" | "recommended" | "new" | "popular";
}

interface DashboardCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  colors: CardColorPalette;
  progress?: CardProgress;
  badge?: CardBadge;
  onPress: () => void;
  isPrimary?: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName = "Usuário",
  onNavigate,
}) => {
  // 🎭 ANIMAÇÕES MAIS SUTIS
  const headerAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // 📊 ESTADO PARA PROGRESS BARS
  const [streakDays] = useState(7);
  const [weekProgress] = useState(0.7);
  const [totalMinutes] = useState(105);

  useEffect(() => {
    // 🎬 ANIMAÇÕES SUAVES DE ENTRADA
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // 📅 DATA ATUAL FORMATADA
  const getCurrentDate = (): string => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    return today.toLocaleDateString("pt-BR", options);
  };

  // 🎨 PALETAS MAIS HARMONIOSAS
  const cardPalettes = {
    meditation: {
      gradientStart: "rgba(129, 140, 248, 0.20)",
      gradientEnd: "rgba(99, 102, 241, 0.12)",
      iconColor: "#6366F1",
      titleColor: "#1F2937",
      subtitleColor: "#6B7280",
      progressBg: "rgba(99, 102, 241, 0.12)",
      progressFill: "#6366F1",
      badgeBg: "rgba(99, 102, 241, 0.12)",
      badgeText: "#6366F1",
      buttonBg: "rgba(99, 102, 241, 0.12)",
      buttonBorder: "rgba(99, 102, 241, 0.25)",
      buttonText: "#6366F1",
    },

    progress: {
      gradientStart: "rgba(52, 211, 153, 0.18)",
      gradientEnd: "rgba(16, 185, 129, 0.10)",
      iconColor: "#10B981",
      titleColor: "#1F2937",
      subtitleColor: "#6B7280",
      progressBg: "rgba(16, 185, 129, 0.12)",
      progressFill: "#10B981",
      badgeBg: "rgba(16, 185, 129, 0.12)",
      badgeText: "#10B981",
    },

    breathing: {
      gradientStart: "rgba(56, 189, 248, 0.18)",
      gradientEnd: "rgba(14, 165, 233, 0.10)",
      iconColor: "#0EA5E9",
      titleColor: "#1F2937",
      subtitleColor: "#6B7280",
      progressBg: "rgba(14, 165, 233, 0.12)",
      progressFill: "#0EA5E9",
    },

    sos: {
      gradientStart: "rgba(251, 146, 60, 0.18)",
      gradientEnd: "rgba(249, 115, 22, 0.10)",
      iconColor: "#F97316",
      titleColor: "#1F2937",
      subtitleColor: "#6B7280",
      progressBg: "rgba(249, 115, 22, 0.12)",
      progressFill: "#F97316",
      badgeBg: "rgba(249, 115, 22, 0.12)",
      badgeText: "#F97316",
    },
  };

  // 🎴 CARDS ORGANIZADOS
  const dashboardCards: DashboardCard[] = [
    {
      id: "daily-session",
      title: "Sessão Diária",
      subtitle: "15 min • Mindfulness",
      icon: FlowerLotus,
      colors: cardPalettes.meditation,
      progress: {
        current: 7,
        total: 10,
        label: "desta semana",
      },
      badge: {
        text: "Recomendado",
        type: "recommended",
      },
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
      subtitle: `${totalMinutes} min esta semana`,
      icon: TrendUp,
      colors: cardPalettes.progress,
      progress: {
        current: streakDays,
        total: 14,
        label: "dias seguidos",
      },
      badge: {
        text: `${streakDays} dias`,
        type: "streak",
      },
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
      progress: {
        current: 3,
        total: 5,
        label: "hoje",
      },
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
      badge: {
        text: "Sempre aqui",
        type: "new",
      },
      onPress: () => {
        EQHaptics.primary();
        onNavigate("dashboard");
      },
    },
  ];

  // 🏷️ COMPONENTE DE BADGE
  const CardBadge: React.FC<{ badge: CardBadge; colors: CardColorPalette }> = ({
    badge,
    colors,
  }) => {
    const getBadgeIcon = () => {
      switch (badge.type) {
        case "streak":
          return <Fire size={10} color={colors.badgeText} weight="fill" />;
        case "recommended":
          return <Star size={10} color={colors.badgeText} weight="fill" />;
        case "new":
          return <Crown size={10} color={colors.badgeText} weight="fill" />;
        default:
          return null;
      }
    };

    return (
      <View style={[styles.badge, { backgroundColor: colors.badgeBg }]}>
        {getBadgeIcon()}
        <Text style={[styles.badgeText, { color: colors.badgeText }]}>
          {badge.text}
        </Text>
      </View>
    );
  };

  // 📊 COMPONENTE DE PROGRESS BAR
  const ProgressBar: React.FC<{
    progress: CardProgress;
    colors: CardColorPalette;
  }> = ({ progress, colors }) => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", `${(progress.current / progress.total) * 100}%`],
    });

    return (
      <View style={styles.progressContainer}>
        <Text style={[styles.progressLabel, { color: colors.subtitleColor }]}>
          {progress.current}/{progress.total} {progress.label}
        </Text>
        <View
          style={[styles.progressTrack, { backgroundColor: colors.progressBg }]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.progressFill,
                width: progressWidth,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  // 🎴 COMPONENTE DE CARD REFINADO E ORGANIZADO
  const DashboardCard: React.FC<{ card: DashboardCard }> = ({ card }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // ✨ PROPORÇÃO SUTIL - PRIMARY APENAS 10% MAIOR
    const iconSize = card.isPrimary ? 30 : 28;

    // 🎭 ANIMAÇÕES SUTIS E RÁPIDAS
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 8,
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
          <LinearGradient
            colors={[card.colors.gradientStart, card.colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.cardGradient,
              card.isPrimary && styles.primaryCardGradient,
            ]}
          >
            {/* 🏷️ BADGE NO TOPO */}
            {card.badge && (
              <View style={styles.badgeContainer}>
                <CardBadge badge={card.badge} colors={card.colors} />
              </View>
            )}

            {/* ✨ ÍCONE */}
            <View style={styles.iconContainer}>
              <IconComponent
                size={iconSize}
                color={card.colors.iconColor}
                weight="duotone"
              />
            </View>

            <Text
              style={[
                styles.cardTitle,
                { color: card.colors.titleColor },
                card.isPrimary && styles.primaryCardTitle,
              ]}
            >
              {card.title}
            </Text>

            <Text
              style={[
                styles.cardSubtitle,
                { color: card.colors.subtitleColor },
                card.isPrimary && styles.primaryCardSubtitle,
              ]}
            >
              {card.subtitle}
            </Text>

            {/* 📊 PROGRESS BAR */}
            {card.progress && (
              <ProgressBar progress={card.progress} colors={card.colors} />
            )}

            {/* 🎯 BOTÃO PRIMARY */}
            {card.isPrimary && (
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
      {/* 🎭 HEADER CLEAN */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.greeting}>Olá, {userName}</Text>
        <Text style={styles.date}>{getCurrentDate()}</Text>

        {/* ✨ PROGRESS SUTIL */}
        <View style={styles.weekProgressContainer}>
          <Text style={styles.weekProgressLabel}>Semana 2/4</Text>
          <View style={styles.weekProgressTrack}>
            <Animated.View
              style={[
                styles.weekProgressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", `${weekProgress * 100}%`],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>

      {/* 🎴 CARDS ORGANIZADOS */}
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
    paddingTop: AppDimensions.spacing.xl,
    paddingBottom: AppDimensions.spacing.lg,
  },

  greeting: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.text,
    marginBottom: AppDimensions.spacing.xs,
    textShadowColor: "rgba(34, 111, 156, 0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  date: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.normal,
    color: Colors.accent.muted,
    textTransform: "capitalize",
    marginBottom: AppDimensions.spacing.md,
  },

  // ✨ CLEAN EVOLUTION - PROGRESS SUTIL
  weekProgressContainer: {
    marginTop: AppDimensions.spacing.sm,
  },

  weekProgressLabel: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.medium,
    color: Colors.accent.muted,
    marginBottom: AppDimensions.spacing.xs,
  },

  weekProgressTrack: {
    height: 3,
    backgroundColor: "rgba(34, 111, 156, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },

  weekProgressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: AppDimensions.spacing.xl,
    paddingBottom: AppDimensions.spacing.xl,
  },

  // 🎴 CARDS ORGANIZADOS E CONSISTENTES
  card: {
    borderRadius: AppDimensions.radius.large,
    marginBottom: AppDimensions.spacing.md,
    overflow: "hidden",

    // 🌟 SOMBRA SUTIL E CONSISTENTE
    shadowColor: "rgba(0, 0, 0, 0.06)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },

  primaryCard: {
    marginBottom: AppDimensions.spacing.lg,
    // ✨ SOMBRA LEVEMENTE MAIOR PARA PRIMARY
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },

  cardGradient: {
    padding: AppDimensions.spacing.lg,
    minHeight: 110, // ✅ ALTURA CONSISTENTE
  },

  primaryCardGradient: {
    minHeight: 130, // ✅ APENAS 18% MAIOR (MAIS SUTIL)
    paddingVertical: AppDimensions.spacing.lg,
    paddingHorizontal: AppDimensions.spacing.lg,
  },

  // 🏷️ BADGE MENOR E MAIS SUTIL
  badgeContainer: {
    position: "absolute",
    top: AppDimensions.spacing.sm,
    right: AppDimensions.spacing.sm,
    zIndex: 10,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: AppDimensions.spacing.xs,
    paddingVertical: 4,
    borderRadius: AppDimensions.radius.small,
    gap: 3,
  },

  badgeText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
  },

  // ✨ ICON CONTAINER
  iconContainer: {
    marginBottom: AppDimensions.spacing.sm,
  },

  cardTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
    marginBottom: AppDimensions.spacing.xs,
  },

  primaryCardTitle: {
    fontSize: FontSizes.title, // ✅ MESMA DIFERENÇA SUTIL
    fontWeight: FontWeights.bold,
  },

  cardSubtitle: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.normal,
    marginBottom: AppDimensions.spacing.sm,
  },

  primaryCardSubtitle: {
    fontSize: FontSizes.body,
    marginBottom: AppDimensions.spacing.md,
  },

  // 📊 PROGRESS BAR MAIS SUTIL
  progressContainer: {
    marginTop: AppDimensions.spacing.xs,
    marginBottom: AppDimensions.spacing.sm,
  },

  progressLabel: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    marginBottom: AppDimensions.spacing.xs,
  },

  progressTrack: {
    height: 4, // ✅ MAIS FINO
    borderRadius: 2,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
  },

  // 🎯 PRIMARY BUTTON
  primaryButton: {
    borderRadius: AppDimensions.radius.medium,
    paddingVertical: AppDimensions.spacing.sm,
    paddingHorizontal: AppDimensions.spacing.md,
    alignSelf: "flex-start",
    borderWidth: 1,
    marginTop: AppDimensions.spacing.xs,
  },

  primaryButtonText: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    letterSpacing: 0.3,
  },
});
