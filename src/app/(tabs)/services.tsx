import {
  IncidentReportData,
  IncidentReportModal,
} from "@/src/components/Services/IncidentReportModal";
import {
  ServiceCard,
  ServiceItem,
} from "@/src/components/Services/ServiceCard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Sample service data
const SERVICES: ServiceItem[] = [
  {
    id: "1",
    name: "Dọn phòng",
    description: "Vệ sinh chuyên sâu, khử khuẩn và làm sạch toàn bộ căn hộ",
    price: "150k",
    unit: "giờ",
    image: require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg"),
    rating: 4.9,
    category: "cleaning",
  },
  {
    id: "2",
    name: "Giặt ủi",
    description: "Dịch vụ giặt là nhanh, giặt sấy trong vòng 24 giờ",
    price: "20k",
    unit: "kg",
    image: require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg"),
    rating: 4.8,
    category: "laundry",
  },
  {
    id: "3",
    name: "Sửa chữa điện",
    description: "Xử lý các sự cố điện, thay bóng đèn, ổ cắm...",
    price: "100k",
    unit: "lần",
    image: require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg"),
    rating: 4.7,
    category: "repair",
  },
  {
    id: "4",
    name: "Sửa ống nước",
    description: "Xử lý rò rỉ, tắc nghẽn đường ống nước",
    price: "150k",
    unit: "lần",
    image: require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg"),
    rating: 4.6,
    category: "repair",
  },
];

const CATEGORIES = [
  { id: "all", name: "Tất cả", icon: "grid-outline" as const },
  { id: "cleaning", name: "Vệ sinh", icon: "sparkles-outline" as const },
  { id: "laundry", name: "Giặt ủi", icon: "shirt-outline" as const },
  { id: "repair", name: "Sửa chữa", icon: "construct-outline" as const },
];

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const filteredServices =
    selectedCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === selectedCategory);

  const handleReportSubmit = (data: IncidentReportData) => {
    console.log("Report submitted:", data);
    // Handle report submission
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#1A1A2E", "#16213E"]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Dịch vụ</Text>
            <Text style={styles.headerSubtitle}>Tiện ích & Bảo trì</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Dịch vụ</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Đang xử lý</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={18}
                color={selectedCategory === cat.id ? "#fff" : "#666"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Services Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dịch vụ phổ biến</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
          >
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => console.log("Service pressed:", service.id)}
                onAddPress={() => console.log("Add service:", service.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Notice Card */}
        <View style={styles.noticeCard}>
          <View style={styles.noticeIcon}>
            <Ionicons name="information-circle" size={24} color="#fff" />
          </View>
          <View style={styles.noticeContent}>
            <Text style={styles.noticeTitle}>Thông báo bảo trì</Text>
            <Text style={styles.noticeText}>
              Bảo trì thang máy toà A từ 13:00 - 15:00 hôm nay
            </Text>
          </View>
        </View>

        {/* Report Section */}
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <View>
              <Text style={styles.reportTitle}>Báo cáo sự cố</Text>
              <Text style={styles.reportSubtitle}>
                Hỗ trợ 24/7, xử lý nhanh chóng
              </Text>
            </View>
            <View style={styles.reportBadge}>
              <Ionicons name="flash" size={14} color="#FF9500" />
              <Text style={styles.reportBadgeText}>Ưu tiên</Text>
            </View>
          </View>

          <View style={styles.reportFeatures}>
            <View style={styles.featureItem}>
              <View
                style={[styles.featureIcon, { backgroundColor: "#E8F5E9" }]}
              >
                <Ionicons name="time-outline" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.featureText}>Phản hồi trong 30 phút</Text>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[styles.featureIcon, { backgroundColor: "#E3F2FD" }]}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={20}
                  color="#2196F3"
                />
              </View>
              <Text style={styles.featureText}>Đội ngũ chuyên nghiệp</Text>
            </View>
            <View style={styles.featureItem}>
              <View
                style={[styles.featureIcon, { backgroundColor: "#FFF3E0" }]}
              >
                <Ionicons name="call-outline" size={20} color="#FF9800" />
              </View>
              <Text style={styles.featureText}>Hotline: 1900 xxxx</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setReportModalVisible(true)}
          >
            <Ionicons name="warning-outline" size={20} color="#fff" />
            <Text style={styles.reportButtonText}>Báo cáo sự cố ngay</Text>
          </TouchableOpacity>
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Lịch sử yêu cầu</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Dọn phòng</Text>
              <Text style={styles.historyDate}>15/01/2024 - 14:30</Text>
            </View>
            <View
              style={[styles.historyStatus, { backgroundColor: "#E8F5E9" }]}
            >
              <Text style={[styles.historyStatusText, { color: "#4CAF50" }]}>
                Hoàn thành
              </Text>
            </View>
          </View>

          <View style={styles.historyItem}>
            <View style={[styles.historyIcon, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="time" size={24} color="#FF9800" />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Sửa điều hòa</Text>
              <Text style={styles.historyDate}>14/01/2024 - 09:00</Text>
            </View>
            <View
              style={[styles.historyStatus, { backgroundColor: "#FFF3E0" }]}
            >
              <Text style={[styles.historyStatusText, { color: "#FF9800" }]}>
                Đang xử lý
              </Text>
            </View>
          </View>
        </View>

        {/* Spacer for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 100 }]}
        onPress={() => setReportModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Report Modal */}
      <IncidentReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReportSubmit}
      />
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
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 16,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryPillActive: {
    backgroundColor: "#007AFF",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  seeAll: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  servicesContainer: {
    paddingHorizontal: 20,
  },
  noticeCard: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  noticeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  reportCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  reportSubtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  reportBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  reportBadgeText: {
    fontSize: 12,
    color: "#FF9500",
    fontWeight: "600",
  },
  reportFeatures: {
    gap: 12,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 14,
    color: "#333",
  },
  reportButton: {
    flexDirection: "row",
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  historySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
  },
  historyStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF9500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
