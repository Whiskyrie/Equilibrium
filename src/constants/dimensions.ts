/**
 * 📏 DIMENSÕES EQUILIBRIUM - BASEADAS EM IHC
 * Aplicação da Lei de Fitts + Guidelines de Acessibilidade
 *
 * REFERÊNCIAS:
 * - Fitts' Law: Paul Fitts (1954) - "The Information Capacity of the Human Motor System"
 * - Touch Targets: Apple HIG (2023) - 44pt minimum
 * - Android Material: Google (2023) - 48dp minimum
 * - WCAG 2.1: W3C - 44x44px minimum for touch targets
 */

import { Dimensions, Platform } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const AppDimensions = {
  // 📱 DIMENSÕES DA TELA
  screen: {
    width: screenWidth,
    height: screenHeight,
    isSmall: screenWidth < 375, // iPhone SE, Androids pequenos
    isMedium: screenWidth >= 375 && screenWidth < 414, // iPhone padrão
    isLarge: screenWidth >= 414, // iPhone Plus, Android grandes
  },

  // 👆 LEI DE FITTS - ÁREA DE TOQUE MÍNIMA
  touch: {
    /**
     * PESQUISA CIENTÍFICA - Lei de Fitts:
     * Tempo = a + b × log₂(D/W + 1)
     * D = distância ao alvo
     * W = largura do alvo
     *
     * CONCLUSÃO: Alvos maiores = menos tempo para tocar
     * MÍNIMO CIENTÍFICO: 44x44px (Apple) / 48x48dp (Google)
     */
    minimum: 44, // 44x44px - padrão internacional
    comfortable: 56, // 56x56px - mais confortável
    primary: 48, // Botões principais
    secondary: 44, // Botões secundários
    icon: 24, // Ícones dentro de áreas toqueis

    // 🎯 ÁREAS DE FÁCIL ALCANCE (baseado em ergonomia mobile)
    easyReach: {
      // Polegar direito em tela de 6" (pesquisa Steven Hoober, 2013)
      bottom: screenHeight * 0.25, // 25% inferior - muito fácil
      middle: screenHeight * 0.5, // 50% meio - fácil
      top: screenHeight * 0.75, // 75% superior - difícil
    },
  },

  // 📝 TIPOGRAFIA - HIERARQUIA VISUAL
  text: {
    /**
     * ESCALA TIPOGRÁFICA BASEADA EM LEGIBILIDADE
     * Referência: Oliver Reichenstein (2006) - "Web Design is 95% Typography"
     * Contraste mínimo: 4.5:1 (WCAG AA)
     */
    hero: 32, // Título principal - chamada atenção
    title: 24, // Títulos de seção
    subtitle: 18, // Subtítulos
    body: 16, // Texto principal - tamanho ótimo para leitura mobile
    caption: 14, // Legendas, metadados
    small: 12, // Textos pequenos (use com moderação)

    lineHeight: {
      tight: 1.2, // Títulos
      normal: 1.5, // Corpo do texto
      loose: 1.8, // Textos longos
    },
  },

  // 🎨 ESPAÇAMENTO - GESTALT PROXIMIDADE
  spacing: {
    /**
     * SISTEMA DE 8px - PADRÃO DA INDÚSTRIA
     * Baseado em: Google Material Design + Apple HIG
     * Facilita alinhamento e consistency visual
     */
    xs: 4, // 4px - espaçamento mínimo
    sm: 8, // 8px - espaçamento padrão
    md: 16, // 16px - entre elementos relacionados (GESTALT PROXIMIDADE)
    lg: 24, // 24px - entre grupos de elementos
    xl: 32, // 32px - entre seções principais
    xxl: 48, // 48px - espaçamento de respiração

    // 🧠 APLICAÇÃO DE GESTALT - PROXIMIDADE
    related: 8, // Elementos fortemente relacionados (título + subtítulo)
    group: 16, // Elementos do mesmo grupo (botões de ação)
    section: 32, // Entre seções diferentes (hero + form)
  },

  // 🔄 BORDAS E CANTOS - GESTALT FECHAMENTO
  radius: {
    /**
     * PSICOLOGIA DAS FORMAS:
     * - Cantos arredondados = mais amigável, menos agressivo
     * - Referência: Bar & Neta (2006) - "Humans prefer curved visual objects"
     */
    small: 4, // Elementos pequenos (tags, badges)
    medium: 8, // Botões, inputs
    large: 12, // Cards principais
    full: 999, // Elementos circulares (avatars, FABs)
  },

  // 🎯 NAVEGAÇÃO - LEI DE JAKOB (PADRÕES FAMILIARES)
  navigation: {
    /**
     * PADRÕES ESTABELECIDOS (Lei de Jakob):
     * Usuários preferem interfaces similares às que já conhecem
     */
    tabBarHeight: Platform.OS === "ios" ? 83 : 56, // iOS vs Android padrão
    headerHeight: Platform.OS === "ios" ? 44 : 56, // Navigation header
    statusBarHeight: Platform.OS === "ios" ? 20 : 24, // Status bar
  },

  // 📊 ANÁLISE COMPARATIVA - CONCORRENTES
  competitive: {
    /**
     * HEADSPACE:
     * ✅ Botões grandes (52px) - boa aplicação Lei de Fitts
     * ❌ Muito espaçamento (pode desperdiçar tela)
     *
     * CALM:
     * ✅ Tipografia clara (16px corpo)
     * ❌ Botões pequenos demais (40px) - abaixo do recomendado
     *
     * INSIGHT TIMER:
     * ✅ Boa hierarquia visual
     * ❌ Interface muito densa - pouco espaço respirável
     *
     * 🎯 NOSSA ABORDAGEM:
     * ✅ Mínimo 44px para todos os elementos toqueis
     * ✅ Espaçamento baseado em Gestalt
     * ✅ Tipografia otimizada para leitura
     * ✅ Balance entre densidade e respiração
     */
  },
};

/**
 * 🎯 FUNÇÕES UTILITÁRIAS PARA IHC
 */
export const getResponsiveSize = (
  small: number,
  medium: number,
  large: number
): number => {
  if (AppDimensions.screen.isSmall) return small;
  if (AppDimensions.screen.isMedium) return medium;
  return large;
};

export const isEasyReach = (yPosition: number): boolean => {
  return yPosition >= AppDimensions.touch.easyReach.bottom;
};

/**
 * 📱 SAFE AREAS PARA DIFERENTES DISPOSITIVOS
 * Considera notch, home indicator, etc.
 */
export const SafeAreas = {
  top: Platform.OS === "ios" ? 44 : 0,
  bottom: Platform.OS === "ios" ? 34 : 0, // Home indicator iPhone X+
};
