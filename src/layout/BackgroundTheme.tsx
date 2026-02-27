import { StyleSheet, View } from "react-native";

export const BACKGROUND_COLORS = {
  primary: "#0F2027",
  secondary: "#203A43",
  tertiary: "#2C5364",
  accentCyan: "#00D4FF",
  accentBlue: "#007AFF",
};

export const BACKGROUND_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLORS.primary,
  },
  backgroundLayer1: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKGROUND_COLORS.primary,
  },
  backgroundLayer2: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(32, 58, 67, 0.5)`,
  },
  backgroundLayer3: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(44, 83, 100, 0.3)`,
  },
  decorativeCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0, 212, 255, 0.1)",
    top: -100,
    right: -100,
    pointerEvents: "none",
  },
  decorativeCircle2: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    bottom: 100,
    left: -80,
    pointerEvents: "none",
  },
  decorativeCircle3: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(71, 230, 215, 0.06)",
    bottom: -50,
    right: 50,
    pointerEvents: "none",
  },
});

interface BackgroundThemeProps {
  children?: React.ReactNode;
}

export function BackgroundTheme({ children }: BackgroundThemeProps) {
  return (
    <View style={BACKGROUND_STYLES.container}>
      <View style={BACKGROUND_STYLES.backgroundLayer1} />
      <View style={BACKGROUND_STYLES.backgroundLayer2} />
      <View style={BACKGROUND_STYLES.backgroundLayer3} />
      <View style={BACKGROUND_STYLES.decorativeCircle1} />
      <View style={BACKGROUND_STYLES.decorativeCircle2} />
      <View style={BACKGROUND_STYLES.decorativeCircle3} />
      {children}
    </View>
  );
}
