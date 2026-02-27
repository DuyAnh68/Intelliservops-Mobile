import { Platform, ViewStyle } from "react-native";

interface ShadowOptions {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}

/**
 * Cross-platform shadow utility
 * Returns appropriate shadow styles for iOS, Android, and Web
 */
export const createShadow = ({
  color = "#000",
  offsetX = 0,
  offsetY = 4,
  opacity = 0.2,
  radius = 8,
  elevation = 6,
}: ShadowOptions = {}): ViewStyle => {
  if (Platform.OS === "web") {
    // Web uses boxShadow
    const rgba = hexToRgba(color, opacity);
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px ${rgba}`,
    } as ViewStyle;
  }

  if (Platform.OS === "android") {
    // Android uses elevation only
    return {
      elevation,
    };
  }

  // iOS uses shadow* props
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
  };
};

/**
 * Convert hex color to rgba string
 */
const hexToRgba = (hex: string, alpha: number): string => {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Parse hex values
  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Pre-defined shadow presets
export const shadows = {
  sm: createShadow({ offsetY: 1, radius: 2, opacity: 0.1, elevation: 2 }),
  md: createShadow({ offsetY: 2, radius: 4, opacity: 0.15, elevation: 4 }),
  lg: createShadow({ offsetY: 4, radius: 8, opacity: 0.2, elevation: 6 }),
  xl: createShadow({ offsetY: 8, radius: 16, opacity: 0.25, elevation: 8 }),

  // Button shadows
  button: (color: string = "#007AFF") =>
    createShadow({ color, offsetY: 4, radius: 8, opacity: 0.3, elevation: 6 }),

  // Card shadows
  card: createShadow({ offsetY: 4, radius: 8, opacity: 0.1, elevation: 4 }),
};
