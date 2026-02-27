import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * AppProvider - Layout chung bọc toàn bộ app
 *
 * Chứa các provider/context dùng chung:
 * - SafeAreaProvider
 * - StatusBar config
 *
 * Thêm provider mới vào đây (ThemeProvider, QueryClientProvider, v.v.)
 */
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {children}
    </SafeAreaProvider>
  );
}
