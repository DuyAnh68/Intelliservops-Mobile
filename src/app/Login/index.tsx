import LoginModal from "@/src/components/Modal/LoginModal";
import { useAuthStore } from "@/src/stores/Auth/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const smartHomeImage = require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg");

export default function LoginScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleLogin = async (email: string, password: string) => {
    setIsLoggingIn(true);
    try {
      // Use "user" as default actorType for mobile app login
      const success = await login(email, password, "user");
      if (success) {
        setModalVisible(false);
        router.replace("/");
      } else {
        Alert.alert("Lỗi", "Email hoặc mật khẩu không chính xác.");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <Image
        source={smartHomeImage}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={3}
      />
      <View style={styles.overlay} />

      {/* Branding */}
      <View style={styles.branding}>
        <View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={48} color="#fff" />
        </View>
        <Text style={styles.appName}>IntelliServOps</Text>
        <Text style={styles.tagline}>Smart Service Management</Text>

        {/* Login Button */}
        {!modalVisible && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="log-in-outline"
              size={22}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.loginButtonText}>Đăng Nhập</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Login Modal */}
      <LoginModal
        visible={modalVisible}
        onClose={handleClose}
        onLogin={handleLogin}
        onSignUp={() => {
          // TODO: Navigate to sign up
        }}
        onForgotPassword={() => {
          // TODO: Navigate to forgot password
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(26, 26, 46, 0.5)",
  },
  branding: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "rgba(0, 122, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 40,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
