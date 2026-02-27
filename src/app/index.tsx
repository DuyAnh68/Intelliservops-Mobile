import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useAuthStore } from "@/src/stores/Auth/AuthStore";

/**
 * Trang chính sau khi đăng nhập.
 */
export default function Index() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Redirect to Login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }

  const handleLogout = async () => {
    await logout();
    router.replace("/Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trang chủ</Text>
      <Text style={styles.subtitle}>Chào mừng {user?.email}!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
