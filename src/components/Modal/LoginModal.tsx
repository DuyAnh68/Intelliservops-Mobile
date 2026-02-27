import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Animated,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { createShadow } from "@/src/utils/shadow";

const { width } = Dimensions.get("window");

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
}

export default function LoginModal({
  visible,
  onClose,
  onLogin,
  onSignUp,
  onForgotPassword,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError("Email không hợp lệ");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (text && text.length < 6) {
      setPasswordError("Mật khẩu tối thiểu 6 ký tự");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = () => {
    let valid = true;
    if (!email) {
      setEmailError("Vui lòng nhập email");
      valid = false;
    }
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      valid = false;
    }
    if (emailError || passwordError) {
      valid = false;
    }
    if (valid) {
      onLogin(email, password);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.handle} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Logo / Title */}
              <View style={styles.titleSection}>
                <View style={styles.logoContainer}>
                  <Ionicons name="shield-checkmark" size={40} color="#007AFF" />
                </View>
                <Text style={styles.title}>Đăng Nhập</Text>
                <Text style={styles.subtitle}>
                  Chào mừng bạn quay trở lại IntelliServOps
                </Text>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <View
                    style={[
                      styles.inputContainer,
                      emailError ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={emailError ? "#FF3B30" : "#999"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={email}
                      onChangeText={validateEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                  </View>
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View
                    style={[
                      styles.inputContainer,
                      passwordError ? styles.inputError : null,
                    ]}
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={passwordError ? "#FF3B30" : "#999"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Mật khẩu"
                      value={password}
                      onChangeText={validatePassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={onForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  activeOpacity={0.8}
                >
                  <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>hoặc</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Login */}
                <View style={styles.socialRow}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-google" size={22} color="#DB4437" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-apple" size={22} color="#000" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                  </TouchableOpacity>
                </View>

                {/* Sign Up */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                  <TouchableOpacity onPress={onSignUp}>
                    <Text style={styles.signupLink}>Đăng ký</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "92%",
  },
  header: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DDD",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 12,
    padding: 4,
  },
  titleSection: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#EBF5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "600",
  },
  loginButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    ...createShadow({
      color: "#007AFF",
      offsetY: 4,
      opacity: 0.3,
      radius: 8,
      elevation: 6,
    }),
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#AAA",
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F5F6FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 8,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  signupLink: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});
