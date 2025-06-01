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
import { LineChart } from "react-native-gifted-charts";
import {
  FlowerLotus,
  TrendUp,
  Gear,
  ChartLine,
  CalendarDots,
  Heart,
  House,
  Users,
  User,
  Pulse,
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyXEyes,
  SmileyWink,
  Fire,
  Clock,
  Target,
  Sparkle,
  Brain,
  Leaf,
  ArrowUp,
  Medal,
  Lightning,
  CheckCircle,
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

// 📊 Dados do humor da semana para Gifted Charts (Gráfico de Área)
const moodChartData = [
  {
    value: 3.2,
    label: "Seg",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "3.2",
  },
  {
    value: 4.1,
    label: "Ter",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "4.1",
  },
  {
    value: 2.8,
    label: "Qua",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "2.8",
  },
  {
    value: 2.1,
    label: "Qui",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "2.1",
  },
  {
    value: 4.8,
    label: "Sex",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "4.8",
  },
  {
    value: 3.9,
    label: "Sáb",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "3.9",
  },
  {
    value: 4.2,
    label: "Dom",
    labelTextStyle: { color: "#64748B", fontSize: 11 },
    dataPointText: "4.2",
    showDataPoint: true,
    dataPointColor: Colors.primary,
    dataPointRadius: 8,
  },
];

// 😊 Opções de humor com ícones Phosphor
const moodOptions = [
  {
    id: 1,
    icon: SmileyXEyes,
    label: "Awful",
    color: "#FEE2E2",
    textColor: "#DC2626",
    iconColor: "#DC2626",
  },
  {
    id: 2,
    icon: SmileySad,
    label: "Bad",
    color: "#FED7AA",
    textColor: "#EA580C",
    iconColor: "#EA580C",
  },
  {
    id: 3,
    icon: SmileyMeh,
    label: "Okay",
    color: "#FEF3C7",
    textColor: "#D97706",
    iconColor: "#D97706",
  },
  {
    id: 4,
    icon: Smiley,
    label: "Good",
    color: "#D1FAE5",
    textColor: "#059669",
    iconColor: "#059669",
  },
  {
    id: 5,
    icon: SmileyWink,
    label: "Great",
    color: "#DBEAFE",
    textColor: "#2563EB",
    iconColor: "#2563EB",
  },
];

// 🏆 Dados de insights com cores específicas nos gradientes
const wellnessInsights = [
  {
    id: 1,
    icon: Fire,
    iconColor: "#FFFFFF",
    gradientColors: ["#FF6B6B", "#FF8E8E"] as const,
    title: "Meditation Streak",
    value: "5",
    unit: "Days",
    subtitle: "Personal best!",
    progress: 0.7,
    trend: "+2 from last week",
    trendIcon: ArrowUp,
    trendColor: "#FFFFFF",
  },
  {
    id: 2,
    icon: Target,
    iconColor: "#FFFFFF",
    gradientColors: ["#4ECDC4", "#44B8AC"] as const,
    title: "Weekly Goal",
    value: "4",
    unit: "/ 7 Days",
    subtitle: "Almost there",
    progress: 0.57,
    trend: "57% complete",
    trendIcon: TrendUp,
    trendColor: "#FFFFFF",
  },
  {
    id: 3,
    icon: Clock,
    iconColor: "#FFFFFF",
    gradientColors: ["#667EEA", "#764BA2"] as const,
    title: "Total Time",
    value: "45",
    unit: "minutes",
    subtitle: "This week",
    progress: 0.9,
    trend: "+15 min from last week",
    trendIcon: ArrowUp,
    trendColor: "#FFFFFF",
  },
  {
    id: 4,
    icon: Medal,
    iconColor: "#FFFFFF",
    gradientColors: ["#F093FB", "#F5576C"] as const,
    title: "Achievements",
    value: "3",
    unit: "unlocked",
    subtitle: "Keep going!",
    progress: 0.6,
    trend: "2 more to unlock",
    trendIcon: Lightning,
    trendColor: "#FFFFFF",
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  userName = "Usuário",
  onNavigate,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnims = useRef(
    wellnessInsights.map(() => new Animated.Value(0))
  ).current;

  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animar as barras de progresso
    progressAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: wellnessInsights[index].progress,
        duration: 1000,
        delay: 600 + index * 100,
        useNativeDriver: false,
      }).start();
    });
  }, []);

  // 📊 Componente do Gráfico de Área com Gifted Charts
  const MoodChart: React.FC = () => {
    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={moodChartData}
          width={width - AppDimensions.spacing.xl * 4}
          height={180} // Aumentado de 140 para 180
          spacing={42}
          initialSpacing={20}
          endSpacing={20}
          adjustToWidth
          hideAxesAndRules
          hideYAxisText
          xAxisLabelTextStyle={{
            color: "#64748B",
            fontSize: 12,
            fontWeight: "600",
          }}
          // 🎨 CONFIGURAÇÃO DE CORES DO GRÁFICO
          color={Colors.primary}
          thickness={3}
          // 🎨 ÁREA PREENCHIDA (GRADIENTE)
          areaChart
          startFillColor={Colors.primary}
          endFillColor="rgba(34, 111, 156, 0.05)"
          startOpacity={0.6}
          endOpacity={0.1}
          // 🎨 CURVA SUAVE
          curved
          // 🎨 PONTOS DE DADOS
          dataPointsRadius={6}
          dataPointsWidth={2}
          dataPointsColor1={Colors.primary}
          // 🎨 INTERATIVIDADE
          focusEnabled
          showDataPointOnFocus
          showStripOnFocus
          showTextOnFocus
          stripColor={Colors.primary}
          stripOpacity={0.3}
          stripWidth={2}
          stripHeight={180}
          // 🎨 CONFIGURAÇÃO DO POINTER
          pointerConfig={{
            pointerStripHeight: 180,
            pointerStripColor: Colors.primary,
            pointerStripWidth: 2,
            strokeDashArray: [2, 5],
            pointerColor: Colors.primary,
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 120,
            activatePointersOnLongPress: false,
            autoAdjustPointerLabelPosition: true,
            pointerLabelComponent: (items: any) => {
              return (
                <View style={styles.pointerLabel}>
                  <Text style={styles.pointerLabelText}>
                    {items[0]?.value?.toFixed(1) || "0"}
                  </Text>
                </View>
              );
            },
          }}
          // 🎨 TEXTO DOS PONTOS
          textShiftY={-10}
          textShiftX={-10}
          textFontSize={11}
          textColor="#1F2937"
        />
      </View>
    );
  };

  // 😊 Seletor de Humor
  const MoodSelector: React.FC = () => {
    return (
      <View style={styles.moodSelectorContainer}>
        <View style={styles.moodQuestionHeader}>
          <Brain size={24} color={Colors.primary} weight="duotone" />
          <Text style={styles.moodQuestion}>How are you feeling?</Text>
        </View>

        <View style={styles.moodGrid}>
          {moodOptions.map((mood) => {
            const IconComponent = mood.icon;
            return (
              <Pressable
                key={mood.id}
                style={[
                  styles.moodOption,
                  { backgroundColor: mood.color },
                  selectedMood === mood.id && styles.moodOptionSelected,
                ]}
                onPress={() => {
                  setSelectedMood(mood.id);
                  EQHaptics.gentle();
                }}
              >
                <IconComponent
                  size={32}
                  color={mood.iconColor}
                  weight="duotone"
                />
                <Text style={[styles.moodLabel, { color: mood.textColor }]}>
                  {mood.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  // 🏆 Cards de Insight com Gradientes Específicos
  const WellnessInsights: React.FC = () => {
    return (
      <View style={styles.insightContainer}>
        <View style={styles.insightHeader}>
          <Sparkle size={24} color={Colors.primary} weight="duotone" />
          <Text style={styles.insightTitle}>Wellness Insights</Text>
        </View>

        <View style={styles.insightGrid}>
          {wellnessInsights.map((insight, index) => {
            const IconComponent = insight.icon;
            const TrendIconComponent = insight.trendIcon;

            return (
              <Animated.View
                key={insight.id}
                style={[
                  styles.insightCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 20],
                          outputRange: [0, 20 + index * 10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={insight.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.insightCardGradient}
                >
                  {/* Header do Card */}
                  <View style={styles.insightCardHeader}>
                    <View style={styles.insightIconContainer}>
                      <IconComponent
                        size={24}
                        color={insight.iconColor}
                        weight="duotone"
                      />
                    </View>
                    <View style={styles.insightCardInfo}>
                      <Text style={styles.insightCardTitle}>
                        {insight.title}
                      </Text>
                      <Text style={styles.insightCardSubtitle}>
                        {insight.subtitle}
                      </Text>
                    </View>
                  </View>

                  {/* Valor Principal */}
                  <View style={styles.insightValueContainer}>
                    <Text style={styles.insightMainValue}>{insight.value}</Text>
                    <Text style={styles.insightValueUnit}>{insight.unit}</Text>
                  </View>

                  {/* Barra de Progresso */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <Animated.View
                        style={[
                          styles.progressFill,
                          {
                            width: progressAnims[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: ["0%", "100%"],
                            }),
                            transform: [
                              {
                                scaleX: progressAnims[index],
                              },
                            ],
                          },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Trend Footer */}
                  <View style={styles.insightFooter}>
                    <View style={styles.trendContainer}>
                      <TrendIconComponent
                        size={14}
                        color={insight.trendColor}
                        weight="bold"
                      />
                      <Text
                        style={[
                          styles.trendText,
                          { color: insight.trendColor },
                        ]}
                      >
                        {insight.trend}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>
      </View>
    );
  };

  // 🚀 Quick Actions
  const QuickActions: React.FC = () => {
    const quickActions = [
      {
        icon: FlowerLotus,
        label: "Meditate",
        color: "#226F9C",
        bgColor: "rgba(34, 111, 156, 0.1)",
      },
      {
        icon: Heart,
        label: "Breathe",
        color: "#DC2626",
        bgColor: "rgba(220, 38, 38, 0.1)",
      },
      {
        icon: Leaf,
        label: "Nature",
        color: "#059669",
        bgColor: "rgba(5, 150, 105, 0.1)",
      },
      {
        icon: Pulse,
        label: "Track",
        color: "#D97706",
        bgColor: "rgba(217, 119, 6, 0.1)",
      },
    ];

    return (
      <View style={styles.quickActionsContainer}>
        <View style={styles.quickActionsHeader}>
          <Target size={20} color="#1F2937" weight="duotone" />
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        </View>

        <View style={styles.quickActionsList}>
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Pressable
                key={index}
                style={[
                  styles.quickActionItem,
                  { backgroundColor: action.bgColor },
                ]}
                onPress={() => {
                  EQHaptics.gentle();
                }}
              >
                <IconComponent
                  size={24}
                  color={action.color}
                  weight="duotone"
                />
                <Text
                  style={[styles.quickActionLabel, { color: action.color }]}
                >
                  {action.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <Heart size={28} color={Colors.primary} weight="duotone" />
          <Text style={styles.headerTitle}>My Wellbeing</Text>
        </View>
        <Pressable style={styles.settingsButton}>
          <Gear size={24} color="#1F2937" weight="light" />
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <QuickActions />
        </Animated.View>

        {/* Mood Tracker Card com Gráfico de Área */}
        <Animated.View
          style={[
            styles.moodTrackerCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <ChartLine size={24} color={Colors.primary} weight="duotone" />
            <Text style={styles.cardTitle}>Mood Tracker</Text>
          </View>

          <View style={styles.moodTrendContainer}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendLabel}>Mood Trend</Text>
              <Text style={styles.trendPeriod}>Last 7 Days</Text>
            </View>

            <View style={styles.averageContainer}>
              <Text style={styles.averageLabel}>Average: </Text>
              <Text style={styles.averageValue}>3.5</Text>
              <View style={styles.trendIndicator}>
                <TrendUp size={16} color="#059669" weight="bold" />
                <Text style={styles.trendPercentage}>10%</Text>
              </View>
            </View>

            <MoodChart />
          </View>
        </Animated.View>

        {/* Mood Selector */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <MoodSelector />
        </Animated.View>

        {/* Wellness Insights */}
        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <WellnessInsights />
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <View style={styles.navIconActive}>
            <House size={20} color="#FFFFFF" weight="duotone" />
          </View>
          <Text style={styles.navLabelActive}>Home</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <ChartLine size={24} color="#94A3B8" weight="light" />
          <Text style={styles.navLabel}>Track</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Users size={24} color="#94A3B8" weight="light" />
          <Text style={styles.navLabel}>Community</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <User size={24} color="#94A3B8" weight="light" />
          <Text style={styles.navLabel}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// Estilos com melhorias
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: AppDimensions.spacing.xl,
    paddingTop: AppDimensions.spacing.lg,
    paddingBottom: AppDimensions.spacing.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: FontWeights.bold,
    color: "#1F2937",
  },

  settingsButton: {
    padding: AppDimensions.spacing.sm,
    borderRadius: AppDimensions.radius.medium,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: AppDimensions.spacing.xl,
    paddingBottom: 100, // Aumentado para dar mais espaço no bottom
  },

  sectionContainer: {
    marginBottom: AppDimensions.spacing.xl, // Aumentado de lg para xl
  },

  // Quick Actions
  quickActionsContainer: {
    marginBottom: AppDimensions.spacing.lg,
  },

  quickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.md,
  },

  quickActionsTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
    color: "#1F2937",
  },

  quickActionsList: {
    flexDirection: "row",
    gap: AppDimensions.spacing.sm,
  },

  quickActionItem: {
    flex: 1,
    padding: AppDimensions.spacing.md,
    borderRadius: AppDimensions.radius.large,
    alignItems: "center",
    gap: AppDimensions.spacing.xs,
  },

  quickActionLabel: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    textAlign: "center",
  },

  // Mood Tracker Card
  moodTrackerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.xl,
    marginBottom: AppDimensions.spacing.xl, // Aumentado
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.lg,
  },

  cardTitle: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: "#1F2937",
  },

  moodTrendContainer: {
    marginBottom: AppDimensions.spacing.md,
  },

  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: AppDimensions.spacing.sm,
  },

  trendLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    color: "#1F2937",
  },

  trendPeriod: {
    fontSize: FontSizes.caption,
    color: "#64748B",
  },

  averageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: AppDimensions.spacing.xl, // Aumentado
  },

  averageLabel: {
    fontSize: 32,
    fontWeight: FontWeights.normal,
    color: "#1F2937",
  },

  averageValue: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },

  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: AppDimensions.spacing.sm,
    backgroundColor: "rgba(5, 150, 105, 0.1)",
    paddingHorizontal: AppDimensions.spacing.sm,
    paddingVertical: 4,
    borderRadius: AppDimensions.radius.small,
  },

  trendPercentage: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
    color: "#059669",
  },

  // 📊 CHART CONTAINER
  chartContainer: {
    height: 200, // Aumentado de 160 para 200
    marginBottom: AppDimensions.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: AppDimensions.spacing.xs,
  },

  // 🎯 POINTER LABEL
  pointerLabel: {
    backgroundColor: Colors.primary,
    paddingHorizontal: AppDimensions.spacing.md,
    paddingVertical: 8,
    borderRadius: AppDimensions.radius.medium,
    shadowColor: "rgba(0, 0, 0, 0.15)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },

  pointerLabelText: {
    color: "#FFFFFF",
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },

  // Mood Selector
  moodSelectorContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.xl,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },

  moodQuestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.lg,
  },

  moodQuestion: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: "#1F2937",
  },

  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: AppDimensions.spacing.sm,
  },

  moodOption: {
    width:
      (width -
        AppDimensions.spacing.xl * 2 -
        AppDimensions.spacing.sm * 2 -
        AppDimensions.spacing.xl * 2) /
      2,
    height: 90,
    borderRadius: AppDimensions.radius.large,
    justifyContent: "center",
    alignItems: "center",
    gap: AppDimensions.spacing.xs,
    borderWidth: 2,
    borderColor: "transparent",
  },

  moodOptionSelected: {
    borderColor: Colors.primary,
    transform: [{ scale: 0.98 }],
  },

  moodLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
  },

  // Wellness Insights
  insightContainer: {
    marginBottom: AppDimensions.spacing.xl,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.lg,
  },

  insightTitle: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: "#1F2937",
  },

  insightGrid: {
    gap: AppDimensions.spacing.md,
  },

  // Cards de Insight
  insightCard: {
    borderRadius: AppDimensions.radius.large,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.12)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },

  insightCardGradient: {
    padding: AppDimensions.spacing.lg,
    minHeight: 140,
  },

  insightCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: AppDimensions.spacing.md,
  },

  insightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: AppDimensions.spacing.md,
  },

  insightCardInfo: {
    flex: 1,
  },

  insightCardTitle: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    color: "#FFFFFF",
    marginBottom: 2,
  },

  insightCardSubtitle: {
    fontSize: FontSizes.small,
    color: "rgba(255, 255, 255, 0.85)",
  },

  insightValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: AppDimensions.spacing.md,
  },

  insightMainValue: {
    fontSize: 36,
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
    lineHeight: 40,
  },

  insightValueUnit: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: "rgba(255, 255, 255, 0.9)",
    marginLeft: AppDimensions.spacing.xs,
  },

  progressContainer: {
    marginBottom: AppDimensions.spacing.sm,
  },

  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    transformOrigin: "left center",
  },

  insightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: AppDimensions.spacing.sm,
    paddingVertical: 4,
    borderRadius: AppDimensions.radius.small,
  },

  trendText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: AppDimensions.spacing.md,
    paddingHorizontal: AppDimensions.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  navIconActive: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },

  navLabelActive: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },

  navLabel: {
    fontSize: FontSizes.small,
    color: "#94A3B8",
  },
});
