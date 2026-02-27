import { useAuthStore } from "@/src/stores/Auth/AuthStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  isActive?: boolean;
}

interface DeviceItem {
  id: string;
  name: string;
  room: string;
  icon: keyof typeof Ionicons.glyphMap;
  isOn: boolean;
  value?: string;
  color: string;
}

const scenarios: ScenarioItem[] = [
  {
    id: "1",
    title: "Về nhà",
    description: "Mở cửa, bật đèn, điều hoà 24°C",
    icon: "home",
    color: "#007AFF",
    bgColor: "#E3F2FD",
    isActive: true,
  },
  {
    id: "2",
    title: "Đi ngủ",
    description: "Khoá cửa, tắt đèn, an ninh",
    icon: "moon",
    color: "#5856D6",
    bgColor: "#EDE7F6",
  },
  {
    id: "3",
    title: "Ra ngoài",
    description: "Khoá cửa, tắt thiết bị",
    icon: "exit-outline",
    color: "#FF9500",
    bgColor: "#FFF3E0",
  },
  {
    id: "4",
    title: "Tiệc tùng",
    description: "Đèn RGB, nhạc, điều hoà",
    icon: "musical-notes",
    color: "#FF2D55",
    bgColor: "#FCE4EC",
  },
];

const devices: DeviceItem[] = [
  {
    id: "1",
    name: "Điều hoà",
    room: "Phòng khách",
    icon: "snow-outline",
    isOn: true,
    value: "24°C",
    color: "#007AFF",
  },
  {
    id: "2",
    name: "Đèn chính",
    room: "Phòng khách",
    icon: "bulb-outline",
    isOn: true,
    value: "80%",
    color: "#FF9500",
  },
  {
    id: "3",
    name: "Smart TV",
    room: "Phòng khách",
    icon: "tv-outline",
    isOn: false,
    color: "#5856D6",
  },
  {
    id: "4",
    name: "Loa",
    room: "Phòng ngủ",
    icon: "volume-high-outline",
    isOn: false,
    color: "#FF2D55",
  },
];

export default function HomeScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const activeDevices = devices.filter((d) => d.isOn).length;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={["#1A1A2E", "#16213E", "#0F3460"]}
          style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👨‍💼</Text>
              </View>
              <View style={styles.greeting}>
                <Text style={styles.greetingText}>Xin chào,</Text>
                <Text style={styles.userName}>
                  {typeof user?.fullName === "string"
                    ? user.fullName
                    : user?.email?.split("@")[0] || "Người dùng"}{" "}
                  👋
                </Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="search" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="notifications-outline" size={22} color="#fff" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location & Weather */}
          <View style={styles.locationWeatherRow}>
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={14} color="#007AFF" />
              <Text style={styles.locationText}>Căn hộ 12B, Tháp A</Text>
            </View>
            <View style={styles.weatherBadge}>
              <Text style={styles.weatherIcon}>☀️</Text>
              <Text style={styles.weatherText}>28°C</Text>
            </View>
          </View>

          {/* Smart Lock Card - Hero */}
          <View style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <View style={styles.heroStatusRow}>
                  <View style={styles.statusDot} />
                  <Text style={styles.heroStatusText}>An toàn</Text>
                </View>
                <Text style={styles.heroTitle}>Cửa chính</Text>
                <Text style={styles.heroSubtitle}>Yale Smart Lock Pro</Text>
                <TouchableOpacity style={styles.heroButton}>
                  <Ionicons name="lock-open-outline" size={18} color="#fff" />
                  <Text style={styles.heroButtonText}>Mở khóa</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.heroRight}>
                <View style={styles.lockIconOuter}>
                  <LinearGradient
                    colors={["#00D9FF", "#007AFF"]}
                    style={styles.lockIconGradient}
                  >
                    <Ionicons name="lock-closed" size={36} color="#fff" />
                  </LinearGradient>
                </View>
                <Text style={styles.lockLabel}>Đang khóa</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="flash" size={20} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.statValue}>152 kWh</Text>
              <Text style={styles.statLabel}>Điện tháng này</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="water" size={20} color="#2196F3" />
            </View>
            <View>
              <Text style={styles.statValue}>8.5 m³</Text>
              <Text style={styles.statLabel}>Nước tháng này</Text>
            </View>
          </View>
        </View>

        {/* Active Devices */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Thiết bị</Text>
              <Text style={styles.sectionSubtitle}>
                {activeDevices} thiết bị đang hoạt động
              </Text>
            </View>
            <TouchableOpacity style={styles.addDeviceButton}>
              <Ionicons name="add" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.devicesGrid}>
            {devices.map((device) => (
              <TouchableOpacity
                key={device.id}
                style={[
                  styles.deviceCard,
                  device.isOn && styles.deviceCardActive,
                ]}
              >
                <View style={styles.deviceHeader}>
                  <View
                    style={[
                      styles.deviceIcon,
                      {
                        backgroundColor: device.isOn ? device.color : "#F0F0F0",
                      },
                    ]}
                  >
                    <Ionicons
                      name={device.icon}
                      size={22}
                      color={device.isOn ? "#fff" : "#999"}
                    />
                  </View>
                  <View
                    style={[
                      styles.deviceToggle,
                      device.isOn && styles.deviceToggleOn,
                    ]}
                  >
                    <View
                      style={[
                        styles.deviceToggleCircle,
                        device.isOn && styles.deviceToggleCircleOn,
                      ]}
                    />
                  </View>
                </View>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceRoom}>{device.room}</Text>
                {device.value && (
                  <Text style={[styles.deviceValue, { color: device.color }]}>
                    {device.value}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scenarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Kịch bản thông minh</Text>
              <Text style={styles.sectionSubtitle}>
                Tự động hóa ngôi nhà của bạn
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scenariosContainer}
          >
            {scenarios.map((scenario) => (
              <TouchableOpacity
                key={scenario.id}
                style={[
                  styles.scenarioCard,
                  scenario.isActive && styles.scenarioCardActive,
                ]}
              >
                <View
                  style={[
                    styles.scenarioIconContainer,
                    {
                      backgroundColor: scenario.isActive
                        ? scenario.color
                        : scenario.bgColor,
                    },
                  ]}
                >
                  <Ionicons
                    name={scenario.icon}
                    size={24}
                    color={scenario.isActive ? "#fff" : scenario.color}
                  />
                </View>
                <Text
                  style={[
                    styles.scenarioTitle,
                    scenario.isActive && styles.scenarioTitleActive,
                  ]}
                >
                  {scenario.title}
                </Text>
                <Text style={styles.scenarioDescription} numberOfLines={2}>
                  {scenario.description}
                </Text>
                {scenario.isActive && (
                  <View style={styles.activeIndicator}>
                    <Text style={styles.activeIndicatorText}>Đang chạy</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dịch vụ nhanh</Text>
          <View style={styles.servicesRow}>
            <TouchableOpacity style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#FFF3E0" }]}
              >
                <Ionicons name="construct-outline" size={24} color="#FF9800" />
              </View>
              <Text style={styles.serviceText}>Bảo trì</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E8F5E9" }]}
              >
                <Ionicons name="leaf-outline" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.serviceText}>Vệ sinh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#E3F2FD" }]}
              >
                <Ionicons name="car-outline" size={24} color="#2196F3" />
              </View>
              <Text style={styles.serviceText}>Đỗ xe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceItem}>
              <View
                style={[styles.serviceIcon, { backgroundColor: "#FCE4EC" }]}
              >
                <Ionicons name="gift-outline" size={24} color="#E91E63" />
              </View>
              <Text style={styles.serviceText}>Ưu đãi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer for bottom tab */}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
  },
  greeting: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  locationWeatherRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 13,
    color: "#fff",
    marginLeft: 6,
    fontWeight: "500",
  },
  weatherBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weatherIcon: {
    fontSize: 20,
  },
  weatherText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroLeft: {
    flex: 1,
  },
  heroStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },
  heroStatusText: {
    fontSize: 13,
    color: "#4ADE80",
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 6,
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  heroRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  lockIconOuter: {
    padding: 4,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "rgba(0,217,255,0.3)",
  },
  lockIconGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  lockLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  addDeviceButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E8F4FD",
    justifyContent: "center",
    alignItems: "center",
  },
  devicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  deviceCard: {
    width: (width - 52) / 2,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  deviceCardActive: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8F4FD",
  },
  deviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  deviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  deviceToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  deviceToggleOn: {
    backgroundColor: "#007AFF",
  },
  deviceToggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  deviceToggleCircleOn: {
    alignSelf: "flex-end",
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  deviceRoom: {
    fontSize: 12,
    color: "#999",
  },
  deviceValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  scenariosContainer: {
    paddingRight: 20,
  },
  scenarioCard: {
    width: width * 0.38,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scenarioCardActive: {
    backgroundColor: "#1A1A2E",
  },
  scenarioIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  scenarioTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  scenarioTitleActive: {
    color: "#fff",
  },
  scenarioDescription: {
    fontSize: 11,
    color: "#999",
    lineHeight: 15,
  },
  activeIndicator: {
    marginTop: 10,
    backgroundColor: "rgba(74, 222, 128, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  activeIndicatorText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4ADE80",
  },
  servicesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  serviceItem: {
    alignItems: "center",
    width: (width - 60) / 4,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
});
