import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  BackHandler,
} from "react-native";
import { Heart, Leaf, ChartLine } from "phosphor-react-native";
import { Colors } from "../styles/colors";
import { AppDimensions } from "../constants/dimensions";
import { CustomButton } from "../components/CustomButton";

const { width } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
  isFirstTime?: boolean;
}

interface OnboardingPage {
  title: string;
  subtitle: string;
  IconComponent: any;
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
    IconComponent: ChartLine, // ✅ PHOSPHOR CORRETO
    iconColor: Colors.primary,
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  isFirstTime = true,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // ✨ ANIMAÇÕES PREMIUM
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const iconFloatAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // 🎭 ANIMAÇÃO DE ENTRADA ELABORADA
  useEffect(() => {
    animatePageEntry();
  }, [currentPage]);

  const animatePageEntry = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.elastic(1)),
        useNativeDriver: true,
      }),
    ]).start();

    // 🌊 ANIMAÇÃO FLUTUANTE CONTÍNUA DO ÍCONE
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloatAnim, {
          toValue: 10,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(iconFloatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // 🔙 TRATAMENTO DE BOTÃO VOLTAR ANDROID
  useEffect(() => {
    const backAction = () => {
      if (currentPage === 0) {
        Alert.alert(
          "Sair do Onboarding?",
          "Você pode continuar de onde parou depois.",
          [
            { text: "Continuar", style: "cancel" },
            {
              text: "Sair",
              style: "destructive",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      } else {
        handlePrevious();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [currentPage]);

  // 📱 SUPORTE A DIFERENTES TAMANHOS DE TELA
  const getResponsiveValues = () => {
    const { isSmall, isMedium } = AppDimensions.screen;

    return {
      iconSize: isSmall ? width * 0.25 : isMedium ? width * 0.3 : width * 0.35,
      titleSize: isSmall ? 22 : isMedium ? 26 : 30,
      spacing: isSmall ? 16 : isMedium ? 24 : 32,
    };
  };

  // 🔄 RETRY AUTOMÁTICO EM CASO DE ERRO
  const handleCompleteWithRetry = async (retries = 3) => {
    try {
      await onComplete();
    } catch (error) {
      if (retries > 0) {
        console.log(`Tentativa falhou, restam ${retries} tentativas`);
        setTimeout(() => handleCompleteWithRetry(retries - 1), 1000);
      } else {
        Alert.alert(
          "Erro de Conexão",
          "Não foi possível salvar seu progresso. Deseja tentar novamente?",
          [
            {
              text: "Tentar Novamente",
              onPress: () => handleCompleteWithRetry(3),
            },
            { text: "Continuar Mesmo Assim", onPress: () => onComplete() },
          ]
        );
      }
    }
  };

  // 🎉 CELEBRAÇÃO FINAL APENAS PARA PRIMEIRA VEZ
  const handleFinalStep = () => {
    if (isFirstTime) {
      setShowCelebration(true);

      // 🎊 ANIMAÇÃO DE CONFETE
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.bounce),
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 500,
          delay: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowCelebration(false);
        handleCompleteWithRetry();
      });
    } else {
      handleCompleteWithRetry();
    }
  };

  const handleNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      flatListRef.current?.scrollToIndex({ index: nextPage, animated: true });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      flatListRef.current?.scrollToIndex({ index: prevPage, animated: true });
    }
  };

  // 🌟 COMPONENTE DE CELEBRAÇÃO
  const renderCelebration = () => {
    if (!showCelebration) return null;

    return (
      <Animated.View
        style={[
          styles.celebrationContainer,
          {
            opacity: confettiAnim,
            transform: [
              {
                scale: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.celebrationText}>🎉</Text>
        <Text style={styles.celebrationMessage}>
          Parabéns! Sua jornada de bem-estar começou!
        </Text>
      </Animated.View>
    );
  };

  const renderPage = ({
    item,
    index,
  }: {
    item: OnboardingPage;
    index: number;
  }) => {
    const { IconComponent, title, subtitle, iconColor } = item;
    const responsive = getResponsiveValues();

    return (
      <Animated.View
        style={[
          styles.pageContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: `${iconColor}15` },
            {
              transform: [{ translateY: iconFloatAnim }],
            },
          ]}
        >
          <IconComponent size={responsive.iconSize} color={iconColor} />
        </Animated.View>

        <Text style={[styles.title, { fontSize: responsive.titleSize }]}>
          {title}
        </Text>

        <Text style={styles.subtitle}>{subtitle}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* REMOVEMOS OS INDICADORES DE PROGRESSO DO TOPO */}

      <FlatList
        ref={flatListRef}
        data={onboardingPages}
        renderItem={renderPage}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.flatList}
      />

      {/* 🌟 INDICADORES DE PROGRESSO AGORA ACIMA DOS BOTÕES */}
      <View style={styles.progressContainer}>
        {onboardingPages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index === currentPage ? Colors.primary : Colors.accent.muted,
                width: index === currentPage ? 24 : 8, // ✅ Dot ativo é mais largo
                opacity: index === currentPage ? 1 : 0.4, // ✅ Dots inativos mais sutis
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {currentPage > 0 && (
          <CustomButton
            title="Voltar"
            onPress={handlePrevious}
            variant="tertiary"
            size="medium"
          />
        )}

        <CustomButton
          title={
            currentPage === onboardingPages.length - 1
              ? "Começar Jornada"
              : "Próximo"
          }
          onPress={
            currentPage === onboardingPages.length - 1
              ? handleFinalStep
              : handleNext
          }
          variant="primary"
          size="medium"
          fullWidth={currentPage === 0}
        />
      </View>

      {renderCelebration()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: AppDimensions.spacing.md, // ✅ Espaçamento reduzido
    gap: AppDimensions.spacing.sm,
    // ✅ Não está mais no topo
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
    // ✅ width definida dinamicamente no componente
    // ✅ Transição suave entre estados será feita via Animated
  },
  flatList: {
    flex: 1,
  },
  pageContainer: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: AppDimensions.spacing.xl,
  },
  iconContainer: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: AppDimensions.spacing.xl,
    // ✅ SOMBRA PADRONIZADA - igual ao IllustrationView
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    backgroundColor: "white", // ✅ Garante contraste com os ícones
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
    marginBottom: AppDimensions.spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.accent.muted,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: AppDimensions.spacing.md,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: AppDimensions.spacing.xl,
    paddingBottom: AppDimensions.spacing.xl,
    gap: AppDimensions.spacing.md,
    // ✅ Agora vem depois dos indicadores de progresso
  },
  celebrationContainer: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    marginHorizontal: AppDimensions.spacing.xl,
    padding: AppDimensions.spacing.xl,
    borderRadius: AppDimensions.radius.large,
    // 🌟 SOMBRA DE CELEBRAÇÃO AJUSTADA
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 }, // Reduzido de 8 para 6
    shadowOpacity: 0.15, // Reduzido de 0.2 para 0.15
    shadowRadius: 12, // Reduzido de 16 para 12
    elevation: 10, // Reduzido de 12 para 10
  },
  celebrationText: {
    fontSize: 48,
    marginBottom: AppDimensions.spacing.md,
  },
  celebrationMessage: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
});
