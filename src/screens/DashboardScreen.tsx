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
// ✅ NOVA IMPORTAÇÃO - React Native Reanimated Carousel
import Carousel from "react-native-reanimated-carousel";
import {
  Brain,
  CheckCircle,
  SmileyXEyes,
  SmileySad,
  SmileyMeh,
  Smiley,
  SmileyWink,
  Fire,
  Target,
  Clock,
  Medal,
  ArrowUp,
  TrendUp,
  Lightning,
  FlowerLotus,
  Heart,
  Leaf,
  Pulse,
  Gear,
  House,
  ChartLine,
  User,
  Bell,
} from "phosphor-react-native";

// Assumindo que estes imports existem - ajuste conforme sua estrutura
import { Colors } from "../styles/colors";
import { AppDimensions } from "../constants/dimensions";
import { FontSizes, FontWeights } from "../styles/typography";
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

// 😊 Opções de humor com ícones Phosphor (dados atualizados)
const moodOptions = [
  {
    id: 1,
    icon: SmileyXEyes,
    label: "Awful",
    emoji: "😵",
    color: "#FEE2E2",
    textColor: "#DC2626",
    iconColor: "#DC2626",
    gradientColors: ["#FEE2E2", "#FECACA"] as const,
  },
  {
    id: 2,
    icon: SmileySad,
    label: "Bad",
    emoji: "😔",
    color: "#FED7AA",
    textColor: "#EA580C",
    iconColor: "#EA580C",
    gradientColors: ["#FED7AA", "#FDBA74"] as const,
  },
  {
    id: 3,
    icon: SmileyMeh,
    label: "Okay",
    emoji: "😐",
    color: "#FEF3C7",
    textColor: "#D97706",
    iconColor: "#D97706",
    gradientColors: ["#FEF3C7", "#FDE68A"] as const,
  },
  {
    id: 4,
    icon: Smiley,
    label: "Good",
    emoji: "😊",
    color: "#D1FAE5",
    textColor: "#059669",
    iconColor: "#059669",
    gradientColors: ["#D1FAE5", "#A7F3D0"] as const,
  },
  {
    id: 5,
    icon: SmileyWink,
    label: "Great",
    emoji: "😄",
    color: "#DBEAFE",
    textColor: "#2563EB",
    iconColor: "#2563EB",
    gradientColors: ["#DBEAFE", "#BFDBFE"] as const,
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
  const [autoScrollInsightsActive, setAutoScrollInsightsActive] =
    useState(true);
  const [autoScrollMoodActive, setAutoScrollMoodActive] = useState(true);
  const insightsCarouselRef = useRef<any>(null);
  const moodCarouselRef = useRef<any>(null);
  const insightsAutoScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const moodAutoScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 0,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 12,
        bounciness: 0,
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

  // Auto-scroll para insights
  useEffect(() => {
    if (autoScrollInsightsActive && insightsCarouselRef.current) {
      const interval = setInterval(() => {
        insightsCarouselRef.current?.next();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [autoScrollInsightsActive]);

  // Auto-scroll para humor
  useEffect(() => {
    if (autoScrollMoodActive && moodCarouselRef.current) {
      const interval = setInterval(() => {
        moodCarouselRef.current?.next();
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [autoScrollMoodActive]);

  const handleInsightCarouselTouch = () => {
    setAutoScrollInsightsActive(false);
    if (insightsAutoScrollTimeout.current)
      clearTimeout(insightsAutoScrollTimeout.current);
    insightsAutoScrollTimeout.current = setTimeout(() => {
      setAutoScrollInsightsActive(true);
    }, 5000);
  };

  const handleMoodCarouselTouch = () => {
    setAutoScrollMoodActive(false);
    if (moodAutoScrollTimeout.current)
      clearTimeout(moodAutoScrollTimeout.current);
    moodAutoScrollTimeout.current = setTimeout(() => {
      setAutoScrollMoodActive(true);
    }, 5000);
  };

  // 📊 Componente do Gráfico de Área com Gifted Charts
  const MoodChart: React.FC = () => {
    return (
      <View style={styles.chartContainer}>
        <LineChart
          data={moodChartData}
          width={width - 80}
          height={160}
          spacing={40}
          color={Colors.primary}
          thickness={3}
          startFillColor="rgba(34, 111, 156, 0.3)"
          endFillColor="rgba(34, 111, 156, 0.05)"
          startOpacity={1}
          endOpacity={0.3}
          initialSpacing={0}
          noOfSections={5}
          maxValue={5}
          yAxisColor="transparent"
          xAxisColor="transparent"
          hideDataPoints={false}
          dataPointsColor={Colors.primary}
          dataPointsRadius={4}
          hideRules
          curved
          areaChart
        />
      </View>
    );
  };

  // 😊 Seletor de Humor ATUALIZADO
  const MoodSelector: React.FC = () => {
    const renderMoodItem = ({ item, index }: { item: any; index: number }) => {
      const IconComponent = item.icon;
      const isSelected = selectedMood === item.id;

      return (
        <Pressable
          style={[
            styles.moodCarouselItem,
            isSelected && styles.moodCarouselItemSelected,
          ]}
          onPress={() => {
            setSelectedMood(item.id);
            EQHaptics.gentle(); // Haptic feedback habilitado
          }}
        >
          <LinearGradient
            colors={item.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.moodItemGradient,
              isSelected && styles.moodItemGradientSelected,
            ]}
          >
            <View style={styles.moodIconContainer}>
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <IconComponent
                size={28}
                color={item.iconColor}
                weight={isSelected ? "duotone" : "light"}
              />
            </View>
            <Text
              style={[
                styles.moodCarouselLabel,
                { color: item.textColor },
                isSelected && styles.moodCarouselLabelSelected,
              ]}
            >
              {item.label}
            </Text>
          </LinearGradient>
        </Pressable>
      );
    };

    return (
      <View style={styles.moodSelectorContainer}>
        <View style={styles.moodQuestionHeader}>
          <Brain size={20} color={Colors.primary} weight="duotone" />
          <Text style={styles.moodQuestion}>How are you feeling today?</Text>
        </View>

        <View style={styles.moodCarouselWrapper}>
          <Carousel
            ref={moodCarouselRef}
            loop={true}
            width={120}
            height={130}
            data={moodOptions}
            scrollAnimationDuration={300}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.85,
              parallaxScrollingOffset: 80,
            }}
            autoPlay={autoScrollMoodActive}
            autoPlayInterval={3500}
            renderItem={renderMoodItem}
            style={styles.moodCarousel}
            onScrollEnd={handleMoodCarouselTouch}
          />
        </View>

        {selectedMood && (
          <Animated.View style={styles.moodSelectedFeedback}>
            <CheckCircle size={16} color={Colors.primary} weight="duotone" />
            <Text style={styles.moodSelectedText}>
              Feeling{" "}
              {moodOptions
                .find((m) => m.id === selectedMood)
                ?.label.toLowerCase()}{" "}
              today
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  // 🏆 Cards de Insight - Carrossel Infinito
  const WellnessInsights: React.FC = () => {
    const renderInsightCard = ({
      item,
      index,
    }: {
      item: any;
      index: number;
    }) => {
      const IconComponent = item.icon;
      const TrendIconComponent = item.trendIcon;

      return (
        <View style={styles.insightCard}>
          <LinearGradient
            colors={item.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.insightCardGradient}
          >
            <View style={styles.insightCardHeader}>
              <View style={styles.insightIconContainer}>
                <IconComponent
                  size={24}
                  color={item.iconColor}
                  weight="duotone"
                />
              </View>
              <View style={styles.insightCardInfo}>
                <Text style={styles.insightCardTitle}>{item.title}</Text>
                <Text style={styles.insightCardSubtitle}>{item.subtitle}</Text>
              </View>
            </View>

            <View style={styles.insightValueContainer}>
              <Text style={styles.insightMainValue}>{item.value}</Text>
              <Text style={styles.insightValueUnit}>{item.unit}</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnims[index]?.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0%", `${item.progress * 100}%`],
                      }),
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.insightFooter}>
              <View style={styles.trendContainer}>
                <TrendIconComponent
                  size={12}
                  color={item.trendColor}
                  weight="bold"
                />
                <Text style={[styles.trendText, { color: item.trendColor }]}>
                  {item.trend}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    };

    return (
      <View style={styles.insightContainer}>
        <View style={styles.insightHeader}>
          <Fire size={24} color={Colors.primary} weight="duotone" />
          <Text style={styles.insightTitle}>Wellness Insights</Text>
        </View>

        <View style={styles.insightCarouselWrapper}>
          <Carousel
            ref={insightsCarouselRef}
            loop
            width={width * 0.75} // 75% da largura da tela
            height={180}
            data={wellnessInsights}
            scrollAnimationDuration={500}
            autoPlay={autoScrollInsightsActive}
            autoPlayInterval={3000}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            renderItem={renderInsightCard}
            onScrollEnd={handleInsightCarouselTouch}
            style={styles.insightCarousel}
          />
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
          <Lightning size={20} color={Colors.primary} weight="duotone" />
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
                  if (action.label === "Meditate") {
                    onNavigate("meditation");
                  }
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
          <Text style={styles.headerTitle}>Hello, {userName}!</Text>
        </View>
        <Pressable style={styles.settingsButton}>
          <Gear size={24} color="#64748B" weight="light" />
        </Pressable>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20 }]}
      >
        <QuickActions />

        <View style={styles.sectionSpacer} />

        <View style={styles.moodTrackerCard}>
          <View style={styles.cardHeader}>
            <ChartLine size={24} color={Colors.primary} weight="duotone" />
            <Text style={styles.cardTitle}>Mood Tracking</Text>
          </View>

          <View style={styles.moodTrendContainer}>
            <View style={styles.trendHeader}>
              <Text style={styles.trendLabel}>Weekly Average</Text>
              <Text style={styles.trendPeriod}>Last 7 days</Text>
            </View>
            <View style={styles.averageContainer}>
              <Text style={styles.averageLabel}>Your mood: </Text>
              <Text style={styles.averageValue}>3.6</Text>
              <View style={styles.trendIndicator}>
                <ArrowUp size={12} color="#059669" weight="bold" />
                <Text style={styles.trendPercentage}>12%</Text>
              </View>
            </View>
          </View>

          <MoodChart />
        </View>

        <View style={styles.sectionSpacer} />

        {/* Mood Selector ATUALIZADO */}
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

        <View style={styles.sectionSpacer} />

        <WellnessInsights />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem}>
          <View style={styles.navIconActive}>
            <House size={20} color="#FFFFFF" weight="duotone" />
          </View>
          <Text style={styles.navLabelActive}>Home</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <ChartLine size={20} color="#94A3B8" weight="light" />
          <Text style={styles.navLabel}>Analytics</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <Bell size={20} color="#94A3B8" weight="light" />
          <Text style={styles.navLabel}>Reminders</Text>
        </Pressable>

        <Pressable style={styles.navItem}>
          <User size={20} color="#94A3B8" weight="light" />
          <Text style={styles.navLabel}>Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// ✅ ESTILOS ATUALIZADOS
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
    paddingVertical: AppDimensions.spacing.lg,
  },

  headerLeft: {
    flex: 1,
  },

  headerTitle: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: "#1F2937",
  },

  settingsButton: {
    padding: AppDimensions.spacing.sm,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: AppDimensions.spacing.xl,
  },

  sectionContainer: {
    marginBottom: 0,
  },

  sectionSpacer: {
    height: 20,
  },

  bottomSpacer: {
    height: AppDimensions.spacing.xl * 2,
  },

  // Quick Actions
  quickActionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.lg,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
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
    gap: AppDimensions.spacing.md,
  },

  quickActionItem: {
    flex: 1,
    alignItems: "center",
    padding: AppDimensions.spacing.md,
    borderRadius: AppDimensions.radius.medium,
    gap: AppDimensions.spacing.xs,
  },

  quickActionLabel: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
  },

  // Mood Tracker Card
  moodTrackerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.lg,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.lg,
  },

  cardTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
    color: "#1F2937",
  },

  moodTrendContainer: {
    marginBottom: AppDimensions.spacing.lg,
  },

  trendHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: AppDimensions.spacing.sm,
  },

  trendLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: "#374151",
  },

  trendPeriod: {
    fontSize: FontSizes.small,
    color: "#6B7280",
  },

  averageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.xs,
  },

  averageLabel: {
    fontSize: FontSizes.body,
    color: "#6B7280",
  },

  averageValue: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },

  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(5, 150, 105, 0.1)",
    paddingHorizontal: AppDimensions.spacing.xs,
    paddingVertical: 2,
    borderRadius: AppDimensions.radius.small,
  },

  trendPercentage: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    color: "#059669",
  },

  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: AppDimensions.spacing.md,
  },

  // Mood Selector - ATUALIZADO
  moodSelectorContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.lg,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },

  moodQuestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.md,
  },

  moodQuestion: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
    color: "#1F2937",
  },

  moodCarouselWrapper: {
    marginHorizontal: -AppDimensions.spacing.lg,
    marginBottom: AppDimensions.spacing.md,
    height: 150,
    marginTop: 16,
    paddingHorizontal: 10,
  },

  moodCarousel: {
    width: width,
    height: 130,
  },

  moodCarouselItem: {
    width: 110,
    height: 110,
    marginHorizontal: 5, // Espaçamento horizontal de 10px total
    justifyContent: "center",
    alignItems: "center",
  },

  moodCarouselItemSelected: {
    transform: [{ scale: 1.1 }], // Scale aumentado para 1.1
  },

  moodItemGradient: {
    flex: 1,
    borderRadius: AppDimensions.radius.large,
    justifyContent: "center",
    alignItems: "center",
    padding: AppDimensions.spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
    width: "100%",
    height: "100%",
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },

  moodItemGradientSelected: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },

  moodIconContainer: {
    alignItems: "center",
    gap: 4,
  },

  moodEmoji: {
    fontSize: 24,
  },

  moodCarouselLabel: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    textAlign: "center",
    marginTop: 4,
  },

  moodCarouselLabelSelected: {
    fontWeight: FontWeights.semibold,
  },

  moodSelectedFeedback: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: AppDimensions.spacing.xs,
    backgroundColor: "rgba(34, 111, 156, 0.1)",
    paddingHorizontal: AppDimensions.spacing.md,
    paddingVertical: AppDimensions.spacing.xs,
    borderRadius: AppDimensions.radius.medium,
  },

  moodSelectedText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
    color: Colors.primary,
  },

  // Wellness Insights - CARROSSEL INFINITO
  insightContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.lg,
    shadowColor: "rgba(0, 0, 0, 0.08)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
  },

  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: AppDimensions.spacing.sm,
    marginBottom: AppDimensions.spacing.lg,
  },

  insightTitle: {
    fontSize: FontSizes.subtitle,
    fontWeight: FontWeights.semibold,
    color: "#1F2937",
  },

  insightCarouselWrapper: {
    marginHorizontal: -AppDimensions.spacing.lg,
  },

  insightCarousel: {
    width: width,
    height: 180,
  },

  insightCard: {
    width: width * 0.75, // 75% da largura da tela
    height: 160,
    paddingHorizontal: AppDimensions.spacing.sm,
  },

  insightCardGradient: {
    flex: 1,
    borderRadius: AppDimensions.radius.large,
    padding: AppDimensions.spacing.lg,
    justifyContent: "space-between",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },

  insightCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: AppDimensions.spacing.sm,
  },

  insightIconContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: AppDimensions.spacing.sm,
    borderRadius: AppDimensions.radius.medium,
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
    color: "rgba(255, 255, 255, 0.9)",
  },

  insightValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },

  insightMainValue: {
    fontSize: 32,
    fontWeight: FontWeights.bold,
    color: "#FFFFFF",
  },

  insightValueUnit: {
    fontSize: FontSizes.body,
    color: "rgba(255, 255, 255, 0.9)",
  },

  progressContainer: {
    marginVertical: AppDimensions.spacing.xs,
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
  },

  insightFooter: {
    alignItems: "flex-start",
  },

  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  trendText: {
    fontSize: FontSizes.small,
    fontWeight: FontWeights.medium,
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: AppDimensions.spacing.lg,
    paddingVertical: AppDimensions.spacing.md,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "rgba(0, 0, 0, 0.05)",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    gap: AppDimensions.spacing.xs,
  },

  navIconActive: {
    backgroundColor: Colors.primary,
    padding: AppDimensions.spacing.xs,
    borderRadius: AppDimensions.radius.small,
  },

  navLabel: {
    fontSize: FontSizes.caption,
    color: "#94A3B8",
  },

  navLabelActive: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
});
