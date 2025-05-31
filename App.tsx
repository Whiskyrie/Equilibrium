import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";

type AppState = "loading" | "onboarding" | "dashboard" | "meditation";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>("loading");
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (hasSeenOnboarding) {
        // ✅ Usuário já viu onboarding - vai direto para Dashboard
        setCurrentScreen("dashboard");
        setIsFirstTime(false);
      } else {
        // ✅ Primeira vez - mostra onboarding
        setCurrentScreen("onboarding");
        setIsFirstTime(true);
      }
    } catch (error) {
      // Fallback: mostra onboarding se houver erro
      console.log("Erro ao verificar AsyncStorage:", error);
      setCurrentScreen("onboarding");
      setIsFirstTime(true);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // ✅ Marca que usuário já viu onboarding
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setCurrentScreen("dashboard");
      setIsFirstTime(false);
    } catch (error) {
      console.log("Erro ao salvar estado do onboarding:", error);
      setCurrentScreen("dashboard"); // Continua mesmo com erro
      setIsFirstTime(false);
    }
  };

  const navigateToScreen = (screen: AppState) => {
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "loading":
        // TODO: Adicionar splash screen aqui
        return null;

      case "onboarding":
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            isFirstTime={isFirstTime} // ✅ USANDO isFirstTime
          />
        );

      case "dashboard":
        // TODO: Criar DashboardScreen
        console.log("Navegando para Dashboard - Primeira vez:", isFirstTime); // ✅ USANDO isFirstTime
        return (
          <OnboardingScreen onComplete={() => navigateToScreen("onboarding")} />
        );

      case "meditation":
        // TODO: Criar MeditationScreen
        return (
          <OnboardingScreen onComplete={() => navigateToScreen("onboarding")} />
        );

      default:
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            isFirstTime={isFirstTime} // ✅ USANDO isFirstTime
          />
        );
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      {renderCurrentScreen()}
    </>
  );
}
