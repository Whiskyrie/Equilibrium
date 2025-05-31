/**
 * 🧭 TIPOS DE NAVEGAÇÃO EQUILIBRIUM
 * Type Safety para navegação entre telas
 *
 * APLICAÇÃO DE PRINCÍPIOS IHC:
 * - Lei de Jakob: Estrutura de navegação familiar
 * - Lei de Tesler: Complexidade gerenciada pelo sistema
 * - Consistência: Tipos previnem erros de navegação
 */

/**
 * 📱 DEFINIÇÃO DAS TELAS PRINCIPAIS
 * Estrutura hierárquica da aplicação
 */
export type RootStackParamList = {
  // 🎯 ONBOARDING FLOW
  Onboarding: undefined; // Primeira experiência

  // 📊 MAIN APP FLOW
  Dashboard: undefined; // Tela principal
  MeditationSession: {
    // Sessão de meditação
    type: MeditationType;
    duration?: number;
    backgroundSound?: string;
  };

  // 📈 PROGRESS & PROFILE
  ProgressScreen: undefined; // Acompanhamento do progresso
  ProfileScreen: undefined; // Configurações do usuário

  // 🎵 MEDITATION FLOWS
  MeditationList: {
    // Lista de meditações
    category?: MeditationCategory;
  };
  MeditationDetails: {
    // Detalhes da meditação
    meditationId: string;
    title: string;
  };

  // ⚙️ SETTINGS & SUPPORT
  SettingsScreen: undefined; // Configurações gerais
  AboutScreen: undefined; // Sobre o app
  HelpScreen: undefined; // Ajuda e suporte
};

/**
 * 🧘 TIPOS DE MEDITAÇÃO
 * Baseados em práticas científicamente validadas
 */
export type MeditationType =
  | "mindfulness" // Atenção plena - reduz ansiedade
  | "breathing" // Respiração - regula sistema nervoso
  | "body-scan" // Varredura corporal - reduz tensão
  | "loving-kindness" // Bondade amorosa - aumenta empatia
  | "visualization" // Visualização - melhora foco
  | "movement" // Movimento consciente - integra corpo/mente
  | "sleep" // Meditação para dormir - melhora qualidade do sono
  | "custom"; // Sessão personalizada

/**
 * 📂 CATEGORIAS DE MEDITAÇÃO
 * Organização intuitiva baseada em necessidades do usuário
 */
export type MeditationCategory =
  | "beginner" // Iniciante - primeiros passos
  | "stress-relief" // Alívio do stress - foco em relaxamento
  | "anxiety" // Ansiedade - técnicas específicas
  | "sleep" // Sono - meditações noturnas
  | "focus" // Concentração - melhora produtividade
  | "relationships" // Relacionamentos - empatia e conexão
  | "self-compassion" // Autocompaixão - gentileza consigo
  | "advanced"; // Avançado - práticas profundas

/**
 * ⏱️ DURAÇÃO DAS SESSÕES
 * Opções baseadas em research sobre atenção sustentada
 */
export type MeditationDuration =
  | 3 // Micro-meditação - pausas rápidas
  | 5 // Curta - ideal para iniciantes
  | 10 // Padrão - equilibrio entre eficácia e praticidade
  | 15 // Média - aprofundamento moderado
  | 20 // Longa - prática mais profunda
  | 30 // Extendida - sessões avançadas
  | 45 // Muito longa - retiros ou práticas intensas
  | 60; // Hora completa - práticas especiais

/**
 * 🎵 SONS AMBIENTE
 * Baseados em pesquisa sobre efeitos dos sons na meditação
 */
export type BackgroundSound =
  | "silence" // Silêncio - foco puro
  | "nature-rain" // Chuva - mascaramento de ruído
  | "nature-ocean" // Oceano - ondas relaxantes
  | "nature-forest" // Floresta - conexão com natureza
  | "singing-bowls" // Tigelas tibetanas - frequências harmônicas
  | "white-noise" // Ruído branco - concentração
  | "binaural-alpha" // Batidas binaurais alpha (8-13 Hz)
  | "binaural-theta" // Batidas binaurais theta (4-8 Hz)
  | "custom"; // Som personalizado

/**
 * 📊 DADOS DO PROGRESSO
 * Métricas para acompanhamento científico
 */
export interface ProgressData {
  // 📈 ESTATÍSTICAS GERAIS
  totalSessions: number; // Total de sessões completas
  totalMinutes: number; // Tempo total meditado
  currentStreak: number; // Sequência atual de dias
  longestStreak: number; // Maior sequência alcançada

  // 📅 DADOS TEMPORAIS
  sessionsThisWeek: number; // Sessões da semana atual
  sessionsThisMonth: number; // Sessões do mês atual
  averageSessionLength: number; // Duração média das sessões

  // 🎯 PREFERÊNCIAS IDENTIFICADAS
  favoriteType: MeditationType; // Tipo mais praticado
  favoriteTime: "morning" | "afternoon" | "evening" | "night";
  favoriteDuration: MeditationDuration; // Duração preferida

  // 📊 DADOS DE BEM-ESTAR (FUTURO)
  moodBefore?: 1 | 2 | 3 | 4 | 5; // Humor antes da sessão
  moodAfter?: 1 | 2 | 3 | 4 | 5; // Humor após a sessão
  stressLevel?: 1 | 2 | 3 | 4 | 5; // Nível de stress reportado
  sleepQuality?: 1 | 2 | 3 | 4 | 5; // Qualidade do sono
}

/**
 * ⚙️ CONFIGURAÇÕES DO USUÁRIO
 * Personalização baseada em princípios de UX
 */
export interface UserSettings {
  // 🔔 NOTIFICAÇÕES (Lei de Postel - tolerância)
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    reminderTime: string; // HH:MM format
    streakReminder: boolean;
    weeklyProgress: boolean;
  };

  // 🎨 PREFERÊNCIAS VISUAIS
  theme: "light" | "dark" | "auto"; // Tema da interface
  reduceMotion: boolean; // Acessibilidade - reduz animações
  fontSize: "small" | "medium" | "large"; // Tamanho da fonte

  // 🔊 PREFERÊNCIAS DE ÁUDIO
  defaultVolume: number; // 0-100
  soundEnabled: boolean; // Sons de UI
  hapticFeedback: boolean; // Feedback tátil

  // 📱 PREFERÊNCIAS DE SESSÃO
  defaultDuration: MeditationDuration; // Duração padrão
  defaultBackgroundSound: BackgroundSound; // Som padrão
  autoStartTimer: boolean; // Inicia timer automaticamente

  // 📊 PRIVACIDADE E DADOS
  collectAnalytics: boolean; // Coleta de dados de uso
  shareProgress: boolean; // Compartilhamento opcional
  dataRetention: "1month" | "6months" | "1year" | "forever";
}

/**
 * 🎯 PARÂMETROS DE NAVEGAÇÃO COM TYPE SAFETY
 * Garante que os parâmetros corretos sejam passados entre telas
 */
export interface NavigationProps<T extends keyof RootStackParamList> {
  route: {
    params: RootStackParamList[T];
  };
  navigation: {
    navigate: <K extends keyof RootStackParamList>(
      screen: K,
      params?: RootStackParamList[K]
    ) => void;
    goBack: () => void;
    replace: <K extends keyof RootStackParamList>(
      screen: K,
      params?: RootStackParamList[K]
    ) => void;
  };
}

/**
 * 📱 ESTADOS DA APLICAÇÃO
 * Gerenciamento de estado global
 */
export interface AppState {
  // 🔄 ESTADO DE NAVEGAÇÃO
  currentScreen: keyof RootStackParamList;
  isOnboardingComplete: boolean;

  // 👤 ESTADO DO USUÁRIO
  userSettings: UserSettings;
  progressData: ProgressData;

  // 🧘 ESTADO DA SESSÃO ATUAL
  currentSession?: {
    type: MeditationType;
    startTime: number; // Timestamp
    duration: MeditationDuration;
    backgroundSound: BackgroundSound;
    isActive: boolean;
    isPaused: boolean;
    timeElapsed: number; // Segundos
  };

  // 🔄 ESTADOS DE LOADING E ERROR (Lei de Postel)
  isLoading: boolean;
  error?: {
    message: string;
    code?: string;
    recoverable: boolean;
  };
}

/**
 * 🎯 AÇÕES DE NAVEGAÇÃO
 * Actions do tipo Redux/Context para navegação
 */
export type NavigationAction =
  | {
      type: "NAVIGATE_TO_SCREEN";
      payload: { screen: keyof RootStackParamList; params?: any };
    }
  | { type: "GO_BACK" }
  | { type: "COMPLETE_ONBOARDING" }
  | {
      type: "START_MEDITATION_SESSION";
      payload: { type: MeditationType; duration: MeditationDuration };
    }
  | { type: "END_MEDITATION_SESSION" }
  | { type: "PAUSE_MEDITATION_SESSION" }
  | { type: "RESUME_MEDITATION_SESSION" }
  | { type: "UPDATE_USER_SETTINGS"; payload: Partial<UserSettings> }
  | { type: "UPDATE_PROGRESS_DATA"; payload: Partial<ProgressData> }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_ERROR";
      payload: { message: string; code?: string; recoverable: boolean };
    }
  | { type: "CLEAR_ERROR" };

/**
 * 🛡️ TYPE GUARDS E VALIDAÇÕES
 * Funções para validação de tipos em runtime
 */
export const isMeditationType = (value: string): value is MeditationType => {
  return [
    "mindfulness",
    "breathing",
    "body-scan",
    "loving-kindness",
    "visualization",
    "movement",
    "sleep",
    "custom",
  ].includes(value);
};

export const isMeditationDuration = (
  value: number
): value is MeditationDuration => {
  return [3, 5, 10, 15, 20, 30, 45, 60].includes(value);
};

export const isValidMeditationParams = (
  params: any
): params is RootStackParamList["MeditationSession"] => {
  return (
    params &&
    typeof params === "object" &&
    isMeditationType(params.type) &&
    (!params.duration || isMeditationDuration(params.duration))
  );
};

/**
 * 📊 ANÁLISE COMPARATIVA - ESTRUTURA DE NAVEGAÇÃO
 *
 * 🆚 HEADSPACE:
 * ✅ Nossa estrutura mais simples (menos confusão)
 * ✅ Type safety (eles usam JavaScript)
 * ❌ Eles têm mais conteúdo/categorias
 *
 * 🆚 CALM:
 * ✅ Nossa navegação mais linear (Lei de Tesler)
 * ✅ Parâmetros tipados (reduz bugs)
 * ❌ Eles têm onboarding mais elaborado
 *
 * 🆚 INSIGHT TIMER:
 * ✅ Nossa estrutura mais organizada
 * ✅ Melhor gerenciamento de estado
 * ❌ Eles têm mais funcionalidades sociais
 *
 * 🏆 VANTAGENS DA NOSSA ABORDAGEM:
 * ✅ Type Safety completo - menos bugs
 * ✅ Estrutura escalável - fácil adicionar telas
 * ✅ Estado centralizado - consistência
 * ✅ Parâmetros validados - robustez
 * ✅ Foco em saúde mental - menos distrações
 *
 * 🎯 APLICAÇÃO DE LEIS DE UX:
 * ✅ Lei de Jakob: Estrutura familiar de tabs/stack
 * ✅ Lei de Hick-Hyman: Máximo 5 opções principais
 * ✅ Lei de Tesler: Complexidade escondida nos tipos
 * ✅ Lei de Postel: Tolerância a erros com validações
 */

/**
 * 🔄 HOOKS PERSONALIZADOS (FUTURO)
 * Para facilitar uso da navegação tipada
 */
export interface NavigationHooks {
  useTypedNavigation: () => NavigationProps<any>["navigation"];
  useCurrentRoute: () => keyof RootStackParamList;
  useMeditationSession: () => AppState["currentSession"];
  useUserProgress: () => ProgressData;
}

/**
 * 📝 NOTAS DE IMPLEMENTAÇÃO:
 *
 * 1. ESCALABILIDADE:
 *    - Adicionar novas telas é simples (RootStackParamList)
 *    - Tipos automaticamente propagam mudanças
 *    - Refatoração segura com TypeScript
 *
 * 2. MANUTENÇÃO:
 *    - Centralização de todos os tipos
 *    - Documentação inline
 *    - Validações em runtime quando necessário
 *
 * 3. PERFORMANCE:
 *    - Tipos não afetam bundle final
 *    - Apenas desenvolvimento tem overhead
 *    - Previne bugs caros em produção
 */
