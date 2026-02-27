import LoginModal from "@/src/components/Modal/LoginModal";
import { useAuthStore } from "@/src/stores/Auth/AuthStore";
import { createShadow } from "@/src/utils/shadow";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

Dimensions.get("window");
const smartHomeImage = require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg");

export default function LoginScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const [scaleAnim] = useState(new Animated.Value(1));
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleLogin = async (email: string, password: string) => {
    try {
      // Use "user" as default actorType for mobile app login
      const success = await login(email, password, "user");
      if (success) {
        setModalVisible(false);
        // Always go to Welcome page after login
        router.replace("/Welcome");
      } else {
        Alert.alert("Lỗi", "Email hoặc mật khẩu không chính xác.");
      }
    } catch {
      Alert.alert("Lỗi", "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleLoginButtonPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setModalVisible(true);
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
          <Ionicons name="home-outline" size={48} color="#fff" />
        </View>
        <Text style={styles.appName}>IntelliServOps</Text>
        <Text style={styles.tagline}>Smart Service Management</Text>

        {/* Login Button */}
        {!modalVisible && (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
            }}
          >
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLoginButtonPress}
              activeOpacity={0.9}
            >
              <Ionicons
                name="log-in-outline"
                size={24}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.loginButtonText}>Đăng Nhập</Text>
            </TouchableOpacity>
          </Animated.View>
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
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 48,
    ...createShadow({
      color: "#007AFF",
      offsetY: 8,
      opacity: 0.4,
      radius: 12,
      elevation: 8,
    }),
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
