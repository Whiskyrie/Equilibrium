import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, ChartLine, Leaf } from "phosphor-react-native";
import { CustomButton } from "../components/CustomButton";
import { Colors } from "../styles/colors";
import { AppDimensions } from "../constants/dimensions";
import { TextStyles } from "../styles/typography";

const { width } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface OnboardingPage {
  title: string;
  subtitle: string;
  IconComponent: React.ComponentType<any>;
  iconColor: string;
}

const onboardingPages: OnboardingPage[] = [
  {
    title: "Bem-vindo ao Equilibrium",
    subtitle:
      "Sua jornada para o bem-estar mental começa aqui. Descubra ferramentas simples para equilíbrio e tranquilidade.",
    IconComponent: Heart,
    iconColor: Colors.secondary,
  },
  {
    title: "Meditações Personalizadas",
    subtitle:
      "Escolha entre diferentes tipos de meditação para atender às suas necessidades diárias.",
    IconComponent: Leaf,
    iconColor: "#27AE60",
  },
  {
    title: "Acompanhe Seu Progresso",
    subtitle:
      "Registre sua jornada e veja como pequenos passos levam a grandes mudanças.",
    IconComponent: ChartLine,
    iconColor: Colors.primary,
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // ✨ ANIMAÇÕES PARA TRANSIÇÕES SUAVES
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  // ✨ ANIMAÇÃO DO ÍCONE QUANDO MUDA DE TELA
  useEffect(() => {
    Animated.sequence([
      Animated.timing(iconScaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(iconScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < onboardingPages.length - 1) {
      // Animação de saída suave
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        setCurrentIndex(currentIndex + 1);

        // Animação de entrada
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      // Animação similar para voltar
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
        setCurrentIndex(currentIndex - 1);

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const renderItem = ({ item }: { item: OnboardingPage }) => (
    <Animated.View
      style={[
        styles.pageContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.heroSection}>
        {/* ✨ NOVO: Círculo com ícone do Phosphor */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: iconScaleAnim }],
            },
          ]}
        >
          <View
            style={[styles.iconCircle, { backgroundColor: item.iconColor }]}
          >
            <item.IconComponent size={80} color="#FFFFFF" weight="light" />
          </View>
        </Animated.View>
      </View>
      <View style={styles.textSection}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </Animated.View>
  );

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background}
        translucent={false}
      />
      <LinearGradient
        colors={[Colors.background, "#EBF4F8"]}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <FlatList
            ref={flatListRef}
            data={onboardingPages}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            style={styles.flatList}
          />

          {/* ✨ PAGINAÇÃO MELHORADA (mantida) */}
          <View style={styles.pagination}>
            {onboardingPages.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  index === currentIndex && styles.activeDot,
                  {
                    transform: [
                      {
                        scale: index === currentIndex ? 1 : 0.8,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* ✨ LAYOUT DE BOTÕES */}
          <View style={styles.ctaSection}>
            <View
              style={[
                styles.buttonContainer,
                currentIndex === 0 && styles.singleButtonContainer,
              ]}
            >
              {currentIndex > 0 && (
                <View style={styles.backButtonContainer}>
                  <CustomButton
                    title="Voltar"
                    onPress={handleBack}
                    variant="tertiary"
                    size="medium"
                    fullWidth={false}
                    testID="onboarding-back-button"
                  />
                </View>
              )}
              <View
                style={[
                  styles.nextButtonContainer,
                  currentIndex === 0 && styles.fullWidthButton,
                ]}
              >
                <CustomButton
                  title={
                    currentIndex === onboardingPages.length - 1
                      ? "Começar Jornada"
                      : "Próximo"
                  }
                  onPress={handleNext}
                  variant="primary"
                  size="medium"
                  fullWidth={true}
                  testID="onboarding-next-button"
                />
              </View>
            </View>
            <Text style={styles.disclaimer}>
              Gratuito • Sem cadastro obrigatório • Dados seguros
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: AppDimensions.spacing.lg,
    paddingTop: AppDimensions.spacing.md,
    paddingBottom: AppDimensions.spacing.sm,
  },
  progressContainer: {
    alignItems: "center",
    gap: AppDimensions.spacing.xs,
  },
  progressBar: {
    width: "60%",
    height: 3,
    backgroundColor: Colors.accent.muted,
    borderRadius: AppDimensions.radius.small,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: AppDimensions.radius.small,
  },
  progressText: {
    ...TextStyles.caption,
    color: Colors.accent.muted,
    fontSize: 11,
  },
  flatList: {
    flex: 1,
  },
  pageContainer: {
    width: width,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: AppDimensions.spacing.lg,
    paddingVertical: AppDimensions.spacing.lg, // ✨ Mais espaço vertical
  },
  heroSection: {
    flex: 2.5, // ✨ Mais espaço para o ícone
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  textSection: {
    flex: 1.2, // ✨ Proporção ajustada
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: AppDimensions.spacing.sm,
  },
  ctaSection: {
    width: "100%",
    alignItems: "center",
    padding: AppDimensions.spacing.lg,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: AppDimensions.spacing.md,
    alignItems: "center",
  },
  singleButtonContainer: {
    justifyContent: "center",
  },
  backButtonContainer: {
    flex: 0.4, // 40% do espaço
    marginRight: AppDimensions.spacing.sm,
  },
  nextButtonContainer: {
    flex: 0.6, // 60% do espaço para o botão principal
  },
  fullWidthButton: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: AppDimensions.spacing.lg,
    paddingVertical: AppDimensions.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent.muted,
    marginHorizontal: 6, // ✨ Mais espaço entre dots
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 20, // ✨ Mais largo quando ativo
    height: 8,
    borderRadius: 4,
  },
  title: {
    ...TextStyles.heroTitle,
    marginBottom: AppDimensions.spacing.md,
    textAlign: "center",
    lineHeight: AppDimensions.text.hero * 1.1, // ✨ Melhor espaçamento de linha
  },
  subtitle: {
    ...TextStyles.bodySecondary,
    textAlign: "center",
    lineHeight: AppDimensions.text.body * 1.4, // ✨ Mais respiração no texto
    marginBottom: AppDimensions.spacing.lg,
    paddingHorizontal: AppDimensions.spacing.xs, // ✨ Padding interno
  },
  disclaimer: {
    ...TextStyles.caption,
    textAlign: "center",
    marginTop: AppDimensions.spacing.md,
    opacity: 0.7, // ✨ Menos opacidade para ser mais sutil
    paddingHorizontal: AppDimensions.spacing.md,
  },
  // ✨ NOVOS ESTILOS PARA ÍCONOS
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
