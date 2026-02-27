import { useAuthStore } from "@/src/stores/Auth/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  iconBg?: string;
  iconColor?: string;
  showArrow?: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.replace("/Login");
  };

  const accountSettings: SettingItem[] = [
    {
      icon: "person-outline",
      label: "Thông tin cá nhân",
      showArrow: true,
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      icon: "lock-closed-outline",
      label: "Đổi mật khẩu",
      showArrow: true,
      iconBg: "#FFF3E0",
      iconColor: "#FF9800",
    },
    {
      icon: "shield-checkmark-outline",
      label: "Bảo mật & Quyền riêng tư",
      showArrow: true,
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
    },
    {
      icon: "card-outline",
      label: "Phương thức thanh toán",
      showArrow: true,
      iconBg: "#FCE4EC",
      iconColor: "#E91E63",
    },
  ];

  const appSettings: SettingItem[] = [
    {
      icon: "notifications-outline",
      label: "Thông báo",
      iconBg: "#EDE7F6",
      iconColor: "#5856D6",
      isSwitch: true,
      switchValue: notifications,
      onSwitchChange: setNotifications,
    },
    {
      icon: "moon-outline",
      label: "Chế độ tối",
      iconBg: "#1A1A2E",
      iconColor: "#fff",
      isSwitch: true,
      switchValue: darkMode,
      onSwitchChange: setDarkMode,
    },
    {
      icon: "language-outline",
      label: "Ngôn ngữ",
      value: "Tiếng Việt",
      showArrow: true,
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      icon: "home-outline",
      label: "Quản lý căn hộ",
      value: "12B, Tháp A",
      showArrow: true,
      iconBg: "#FFF3E0",
      iconColor: "#FF9800",
    },
  ];

  const supportSettings: SettingItem[] = [
    {
      icon: "help-circle-outline",
      label: "Trợ giúp & Hỗ trợ",
      showArrow: true,
      iconBg: "#E8F5E9",
      iconColor: "#4CAF50",
    },
    {
      icon: "chatbubbles-outline",
      label: "Liên hệ quản lý tòa nhà",
      showArrow: true,
      iconBg: "#E3F2FD",
      iconColor: "#2196F3",
    },
    {
      icon: "document-text-outline",
      label: "Điều khoản sử dụng",
      showArrow: true,
      iconBg: "#F3E5F5",
      iconColor: "#9C27B0",
    },
    {
      icon: "shield-outline",
      label: "Chính sách bảo mật",
      showArrow: true,
      iconBg: "#E0F2F1",
      iconColor: "#009688",
    },
    {
      icon: "star-outline",
      label: "Đánh giá ứng dụng",
      showArrow: true,
      iconBg: "#FFF8E1",
      iconColor: "#FFC107",
    },
  ];

  const renderSettingItem = (
    item: SettingItem,
    index: number,
    isLast: boolean,
  ) => (
    <TouchableOpacity
      key={index}
      style={[styles.settingItem, !isLast && styles.settingItemBorder]}
      onPress={item.onPress}
      disabled={item.isSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon} size={20} color={item.iconColor} />
        </View>
        <Text style={styles.settingLabel}>{item.label}</Text>
      </View>
      <View style={styles.settingRight}>
        {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
        {item.isSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: "#E0E0E0", true: "#007AFF" }}
            thumbColor="#fff"
          />
        )}
        {item.showArrow && (
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#1A1A2E", "#16213E"]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Cài đặt</Text>
            <Text style={styles.headerSubtitle}>Quản lý tài khoản của bạn</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="qr-code-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Card - Hero */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.9}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👨‍💼</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {typeof user?.fullName === "string"
                  ? user.fullName
                  : user?.email?.split("@")[0] || "Người dùng"}
              </Text>
              <Text style={styles.profileEmail}>
                {user?.email || "user@example.com"}
              </Text>
              <View style={styles.memberBadge}>
                <Ionicons name="diamond" size={12} color="#FFD700" />
                <Text style={styles.memberText}>Cư dân Premium</Text>
              </View>
            </View>
          </View>
          <View style={styles.profileEditButton}>
            <Ionicons name="create-outline" size={20} color="#007AFF" />
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <View
              style={[styles.quickStatIcon, { backgroundColor: "#E3F2FD" }]}
            >
              <Ionicons name="home" size={20} color="#2196F3" />
            </View>
            <Text style={styles.quickStatValue}>1</Text>
            <Text style={styles.quickStatLabel}>Căn hộ</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <View
              style={[styles.quickStatIcon, { backgroundColor: "#E8F5E9" }]}
            >
              <Ionicons name="construct" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.quickStatValue}>8</Text>
            <Text style={styles.quickStatLabel}>Yêu cầu</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <View
              style={[styles.quickStatIcon, { backgroundColor: "#FFF3E0" }]}
            >
              <Ionicons name="star" size={20} color="#FF9800" />
            </View>
            <Text style={styles.quickStatValue}>4.8</Text>
            <Text style={styles.quickStatLabel}>Đánh giá</Text>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.sectionContent}>
            {accountSettings.map((item, index) =>
              renderSettingItem(
                item,
                index,
                index === accountSettings.length - 1,
              ),
            )}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt ứng dụng</Text>
          <View style={styles.sectionContent}>
            {appSettings.map((item, index) =>
              renderSettingItem(item, index, index === appSettings.length - 1),
            )}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ & Thông tin</Text>
          <View style={styles.sectionContent}>
            {supportSettings.map((item, index) =>
              renderSettingItem(
                item,
                index,
                index === supportSettings.length - 1,
              ),
            )}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconContainer}>
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          </View>
          <Text style={styles.logoutText}>Đăng xuất</Text>
          <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>IntelliServOps</Text>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 IntelliServ Corp.</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 28,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 6,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 4,
  },
  memberText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFD700",
  },
  profileEditButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -12,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  quickStatItem: {
    flex: 1,
    alignItems: "center",
  },
  quickStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  quickStatLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 15,
    color: "#1A1A2E",
    fontWeight: "500",
    flex: 1,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: "#999",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFEBEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  logoutText: {
    fontSize: 15,
    color: "#FF3B30",
    fontWeight: "600",
    flex: 1,
  },
  appInfo: {
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  versionText: {
    fontSize: 13,
    color: "#999",
    marginBottom: 2,
  },
  copyrightText: {
    fontSize: 11,
    color: "#C7C7CC",
  },
});
