import { useAuthStore } from "@/src/stores/Auth/AuthStore";
import { Redirect } from "expo-router";

/**
 * Root index - redirects based on auth state
 */
export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }

  return <Redirect href="/(tabs)/index" />;
}
