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

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "success" | "warning" | "error" | "system";
  read: boolean;
  date: "today" | "yesterday" | "earlier";
}

const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "Yêu cầu bảo trì đã hoàn thành",
    message: "Yêu cầu sửa điều hòa phòng khách của bạn đã được hoàn thành.",
    time: "2 giờ trước",
    type: "success",
    read: false,
    date: "today",
  },
  {
    id: "2",
    title: "Lịch bảo trì định kỳ",
    message: "Thang máy toà A sẽ được bảo trì vào 13:00 - 15:00 ngày mai.",
    time: "5 giờ trước",
    type: "warning",
    read: false,
    date: "today",
  },
  {
    id: "3",
    title: "Cập nhật hệ thống",
    message: "Ứng dụng đã được cập nhật phiên bản mới với nhiều tính năng.",
    time: "8 giờ trước",
    type: "system",
    read: true,
    date: "today",
  },
  {
    id: "4",
    title: "Thanh toán thành công",
    message: "Bạn đã thanh toán 500.000đ cho dịch vụ dọn phòng.",
    time: "Hôm qua",
    type: "info",
    read: true,
    date: "yesterday",
  },
  {
    id: "5",
    title: "Yêu cầu dịch vụ mới",
    message: "Yêu cầu giặt ủi của bạn đã được tiếp nhận và đang xử lý.",
    time: "2 ngày trước",
    type: "info",
    read: true,
    date: "earlier",
  },
  {
    id: "6",
    title: "Khuyến mãi đặc biệt",
    message: "Giảm 20% cho tất cả dịch vụ dọn phòng trong tuần này!",
    time: "3 ngày trước",
    type: "info",
    read: true,
    date: "earlier",
  },
];

const FILTERS = [
  { id: "all", label: "Tất cả", icon: "notifications-outline" as const },
  { id: "unread", label: "Chưa đọc", icon: "mail-unread-outline" as const },
  { id: "system", label: "Hệ thống", icon: "settings-outline" as const },
];

const getIconConfig = (type: NotificationItem["type"]) => {
  switch (type) {
    case "success":
      return { name: "checkmark-circle", color: "#4CAF50", bg: "#E8F5E9" };
    case "warning":
      return { name: "warning", color: "#FF9800", bg: "#FFF3E0" };
    case "error":
      return { name: "close-circle", color: "#F44336", bg: "#FFEBEE" };
    case "system":
      return { name: "cog", color: "#5856D6", bg: "#EDE7F6" };
    default:
      return { name: "information-circle", color: "#007AFF", bg: "#E3F2FD" };
  }
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "unread") return !n.read;
    if (selectedFilter === "system") return n.type === "system";
    return true;
  });

  const todayNotifications = filteredNotifications.filter(
    (n) => n.date === "today",
  );
  const yesterdayNotifications = filteredNotifications.filter(
    (n) => n.date === "yesterday",
  );
  const earlierNotifications = filteredNotifications.filter(
    (n) => n.date === "earlier",
  );

  const renderNotificationCard = (notification: NotificationItem) => {
    const iconConfig = getIconConfig(notification.type);
    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadCard,
        ]}
        activeOpacity={0.7}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}
        >
          <Ionicons
            name={iconConfig.name as any}
            size={22}
            color={iconConfig.color}
          />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.notificationTitle,
                !notification.read && styles.unreadTitle,
              ]}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage} numberOfLines={2}>
            {notification.message}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={12} color="#999" />
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={18} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: NotificationItem[]) => {
    if (items.length === 0) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {items.map(renderNotificationCard)}
      </View>
    );
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
            <Text style={styles.headerTitle}>Thông báo</Text>
            <Text style={styles.headerSubtitle}>
              {unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : "Không có thông báo mới"}
            </Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="checkmark-done" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Tổng cộng</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{unreadCount}</Text>
            <Text style={styles.statLabel}>Chưa đọc</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {notifications.filter((n) => n.date === "today").length}
            </Text>
            <Text style={styles.statLabel}>Hôm nay</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterPill,
                selectedFilter === filter.id && styles.filterPillActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={selectedFilter === filter.id ? "#fff" : "#666"}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
              {filter.id === "unread" && unreadCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Notifications List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#ccc"
              />
            </View>
            <Text style={styles.emptyTitle}>Không có thông báo</Text>
            <Text style={styles.emptyText}>
              Bạn không có thông báo nào trong mục này
            </Text>
          </View>
        ) : (
          <>
            {renderSection("Hôm nay", todayNotifications)}
            {renderSection("Hôm qua", yesterdayNotifications)}
            {renderSection("Trước đó", earlierNotifications)}
          </>
        )}

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
  filterContainer: {
    paddingVertical: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterPill: {
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
  filterPillActive: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
  },
  filterBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 4,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: "#F8FAFF",
    borderLeftWidth: 3,
    borderLeftColor: "#007AFF",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A2E",
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  moreButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
