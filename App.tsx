import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { DashboardScreen } from "./src/screens/DashboardScreen"; // ✅ ADICIONAR IMPORT

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
        setCurrentScreen("dashboard"); // ✅ VAI DIRETO PARA DASHBOARD
        setIsFirstTime(false);
      } else {
        setCurrentScreen("onboarding");
        setIsFirstTime(true);
      }
    } catch (error) {
      console.log("Erro ao verificar AsyncStorage:", error);
      setCurrentScreen("onboarding");
      setIsFirstTime(true);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      setCurrentScreen("dashboard"); // ✅ NAVEGA PARA DASHBOARD
      setIsFirstTime(false);
    } catch (error) {
      console.log("Erro ao salvar estado do onboarding:", error);
      setCurrentScreen("dashboard"); // ✅ MESMO COM ERRO, VAI PARA DASHBOARD
      setIsFirstTime(false);
    }
  };

  const navigateToScreen = (screen: AppState, params?: any) => {
    console.log(`Navegando para: ${screen}`, params);
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "loading":
        return null;

      case "onboarding":
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete} // ✅ CONECTADO
            isFirstTime={isFirstTime}
          />
        );

      case "dashboard":
        return (
          <DashboardScreen
            userName="Maria" // ✅ PODE SER DINÂMICO FUTURAMENTE
            onNavigate={navigateToScreen}
          />
        );

      case "meditation":
        // TODO: Implementar MeditationSessionScreen
        return (
          <DashboardScreen userName="Maria" onNavigate={navigateToScreen} />
        );

      default:
        return (
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            isFirstTime={isFirstTime}
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
