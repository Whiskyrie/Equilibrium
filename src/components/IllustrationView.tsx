import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  ViewStyle,
  ImageSourcePropType,
} from "react-native";
import { Colors } from "../styles/colors";
import { AppDimensions } from "../constants/dimensions";

const { width } = Dimensions.get("window");

interface IllustrationViewProps {
  size?: number; // Tamanho personalizado (padrão: 60% da tela)
  animationDelay?: number; // Delay da animação (ms)
  showIcon?: boolean; // Mostrar ícone interno
  iconContent?: string; // Conteúdo do ícone (emoji ou texto)
  backgroundColor?: string; // Cor de fundo personalizada
  style?: ViewStyle; // Estilos adicionais
  testID?: string; // Para testes automatizados
  imageSource?: ImageSourcePropType; // 🆕 NOVA PROP: Fonte da imagem (logo)
  useImage?: boolean; // 🆕 NOVA PROP: Usar imagem em vez de ícone
}

/**
 * 🎨 COMPONENTE PRINCIPAL - ILUSTRAÇÃO MEDITATIVA
 * Representa tranquilidade, equilíbrio e bem-estar mental
 */
export const IllustrationView: React.FC<IllustrationViewProps> = ({
  size = width * 0.4, // 60% da largura da tela por padrão
  animationDelay = 200,
  showIcon = true,
  iconContent = "🧘‍♀️",
  backgroundColor = Colors.secondary,
  style,
  testID = "illustration-view",
  imageSource, // 🆕 Fonte da imagem (sua logo)
  useImage = false, // 🆕 Por padrão usa ícone
}) => {
  // 🔄 ANIMAÇÕES PARA VIDA E ENGAJAMENTO
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 🎬 SEQUÊNCIA DE ENTRADA - GESTALT CONTINUIDADE
    const enterSequence = Animated.sequence([
      // Delay inicial
      Animated.delay(animationDelay),

      // Entrada suave com fade + scale
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Delay antes da pulsação
      Animated.delay(500),
    ]);

    enterSequence.start(() => {
      // 💓 PULSAÇÃO SUTIL CONTÍNUA
      // Cria sensação de "respiração" e vida
      startPulseAnimation();
    });
  }, [animationDelay]);

  /**
   * 💓 ANIMAÇÃO DE PULSAÇÃO RESPIRATÓRIA
   * Simula respiração tranquila para transmitir calma
   */
  const startPulseAnimation = () => {
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05, // Expansão sutil (5%)
        duration: 2000, // 2 segundos inspiração
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1, // Retorno ao tamanho original
        duration: 2000, // 2 segundos expiração
        useNativeDriver: true,
      }),
    ]);

    // Loop infinito para respiração contínua
    Animated.loop(pulseSequence).start();
  };

  /**
   * 📐 CÁLCULOS DINÂMICOS DE TAMANHO
   * Responsividade baseada em proporções matemáticas
   */
  const containerSize = size;
  const circleSize = containerSize;
  const innerCircleSize = containerSize * 0.85; // ✅ AUMENTADO de 0.75 para 0.85
  const iconSize = containerSize * 0.15; // 15% para proporção harmoniosa
  const shadowOffset = containerSize * 0.02; // Sombra proporcional

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: containerSize,
          height: containerSize,
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { scale: pulseAnim }, // Pulsação sobreposta
          ],
        },
        style,
      ]}
      testID={testID}
      accessible={true}
      accessibilityLabel="Ilustração de meditação"
      accessibilityHint="Elemento visual decorativo representando tranquilidade"
    >
      {/* 
        🟢 CÍRCULO EXTERNO - GESTALT FECHAMENTO
        Forma geométrica perfeita transmite completude
      */}
      <View
        style={[
          styles.outerCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: backgroundColor,
            // GESTALT - FIGURA/FUNDO: Sombra para destacar
            shadowOffset: {
              width: 0,
              height: shadowOffset,
            },
            shadowRadius: shadowOffset * 2,
            elevation: shadowOffset,
          },
        ]}
      >
        {/* 
          ⚪ CÍRCULO INTERNO - GESTALT PROXIMIDADE
          Agrupa com círculo externo como unidade visual
        */}
        <View
          style={[
            styles.innerCircle,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: innerCircleSize / 2,
            },
          ]}
        >
          {/* 
            🎭 CONTEÚDO CENTRAL - IMAGEM OU ÍCONE
            Centralização perfeita no eixo horizontal e vertical
          */}
          {useImage && imageSource ? (
            // 🖼️ SUA LOGO/IMAGEM - MAIOR E SEM CONTORNO VERDE
            <Image
              source={imageSource}
              style={[
                styles.logoImage,
                {
                  width: innerCircleSize * 0.8, // ✅ AUMENTADO de 0.6 para 0.8
                  height: innerCircleSize * 0.8,
                },
              ]}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel="Logo do Equilibrium"
            />
          ) : (
            // 🎭 ÍCONE EMOJI (fallback)
            showIcon && (
              <Text
                style={[
                  styles.iconText,
                  {
                    fontSize: iconSize,
                  },
                ]}
                accessible={false} // Decorativo, não precisa ser lido
              >
                {iconContent}
              </Text>
            )
          )}
        </View>
      </View>

      {/* 
        ✨ ELEMENTOS DECORATIVOS OPCIONAIS
        Podem ser adicionados para variações da ilustração
      */}
      <View style={styles.decorativeElements}>
        {/* Futuros: partículas, ondas, etc. */}
      </View>
    </Animated.View>
  );
};

/**
 * 🎨 ESTILOS - APLICAÇÃO VISUAL DOS PRINCÍPIOS
 */
const styles = StyleSheet.create({
  container: {
    // GESTALT - SIMETRIA: Centralização em ambos os eixos
    justifyContent: "center",
    alignItems: "center",
    // Área responsiva para diferentes tamanhos
  },

  outerCircle: {
    // GESTALT - FECHAMENTO: Forma circular completa
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background, // ✅ MUDADO: fundo branco em vez de verde

    // GESTALT - FIGURA/FUNDO: Destaque visual
    shadowColor: Colors.primary, // Sombra azul harmoniosa
    shadowOpacity: 0.15, // Sutil, não agressiva

    // Compatibilidade Android
    elevation: 8,
  },

  innerCircle: {
    // GESTALT - PROXIMIDADE: Relacionado ao círculo externo
    backgroundColor: Colors.background, // ✅ MANTIDO: Branco nuvem para respiração
    justifyContent: "center",
    alignItems: "center",

    // ✅ REMOVIDO: borderWidth que criava contorno verde
    // Sem borda para logo ficar limpa
  },

  iconText: {
    // GESTALT - SIMETRIA: Centralização perfeita do ícone
    textAlign: "center",

    // Otimização de renderização
    includeFontPadding: false, // Android
    textAlignVertical: "center", // Android
  },

  logoImage: {
    // 🆕 ESTILO PARA SUA LOGO
    // GESTALT - SIMETRIA: Centralização perfeita da imagem
    alignSelf: "center",

    // Otimização de renderização
    backgroundColor: "transparent",
  },

  decorativeElements: {
    // Container para futuros elementos decorativos
    position: "absolute",
    width: "100%",
    height: "100%",
    // Por enquanto vazio, preparado para expansão
  },
});

/**
 * 🎨 VARIAÇÕES DO COMPONENTE
 * Diferentes contextos de uso mantendo consistência visual
 */

// 🧘 Para Onboarding - COM SUA LOGO (E FALLBACK)
export const OnboardingIllustration: React.FC = () => {
  // 🛡️ TENTAR CARREGAR LOGO, SE NÃO EXISTIR USA EMOJI
  let logoSource;
  let hasLogo = false;

  try {
    logoSource = require("../../assets/icon.png");
    hasLogo = true;
  } catch (error) {
    console.log("📷 Logo não encontrada, usando emoji como fallback");
    hasLogo = false;
  }

  return (
    <IllustrationView
      size={width * 0.65} // ✅ AUMENTADO de 0.6 para 0.65 (logo maior)
      useImage={hasLogo} // Usa imagem se logo existir
      imageSource={hasLogo ? logoSource : undefined}
      iconContent="🧘‍♀️" // Fallback emoji
      animationDelay={300}
      backgroundColor={Colors.background} // ✅ MUDADO: fundo branco
      testID="onboarding-illustration"
    />
  );
};

// 📊 Para Dashboard (menor)
export const DashboardIllustration: React.FC = () => (
  <IllustrationView
    size={width * 0.3} // 30% da tela
    iconContent="✨"
    animationDelay={100}
    backgroundColor={Colors.primary}
    testID="dashboard-illustration"
  />
);

// 🧘 Para Sessão de Meditação (grande)
export const MeditationIllustration: React.FC<{ isActive: boolean }> = ({
  isActive,
}) => (
  <IllustrationView
    size={width * 0.7} // 70% da tela
    iconContent={isActive ? "🧘‍♀️" : "⏸️"}
    animationDelay={0} // Imediato
    backgroundColor={isActive ? Colors.secondary : Colors.accent.muted}
    testID="meditation-illustration"
  />
);

// 🎯 Para Success/Completion
export const SuccessIllustration: React.FC = () => (
  <IllustrationView
    iconContent="🎉"
    animationDelay={200}
    backgroundColor={Colors.accent.success}
    testID="success-illustration"
  />
);

export interface FutureEnhancements {
  gradientBackground?: boolean;
  particleAnimation?: boolean;
  rippleEffect?: boolean;

  hapticFeedback?: boolean;
  soundEffect?: string;

  onPress?: () => void;
  longPressActions?: boolean;

  progressValue?: number;
  moodColor?: string;
  timeOfDay?: "morning" | "afternoon" | "evening";
}
