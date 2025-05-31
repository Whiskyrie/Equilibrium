import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";

type AppState = "onboarding" | "dashboard" | "meditation";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppState>("onboarding");

  const navigateToScreen = (screen: AppState) => {
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "onboarding":
        return (
          <OnboardingScreen onComplete={() => navigateToScreen("dashboard")} />
        );

      case "dashboard":
        return (
          <OnboardingScreen onComplete={() => navigateToScreen("onboarding")} />
        );

      case "meditation":
        return (
          <OnboardingScreen onComplete={() => navigateToScreen("onboarding")} />
        );

      default:
        return (
          <OnboardingScreen onComplete={() => navigateToScreen("dashboard")} />
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
