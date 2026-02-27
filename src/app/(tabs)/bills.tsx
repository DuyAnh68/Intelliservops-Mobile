import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Bill {
  id: string;
  type:
    | "electricity"
    | "water"
    | "internet"
    | "maintenance"
    | "parking"
    | "other";
  name: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue" | "paid";
  period: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}

const billsData: Bill[] = [
  {
    id: "1",
    type: "electricity",
    name: "Tiền điện",
    amount: 850000,
    dueDate: "28/02/2026",
    status: "pending",
    period: "Tháng 02/2026",
    icon: "flash",
    iconBg: "#FFF3E0",
    iconColor: "#FF9800",
  },
  {
    id: "2",
    type: "water",
    name: "Tiền nước",
    amount: 250000,
    dueDate: "28/02/2026",
    status: "pending",
    period: "Tháng 02/2026",
    icon: "water",
    iconBg: "#E3F2FD",
    iconColor: "#2196F3",
  },
  {
    id: "3",
    type: "internet",
    name: "Internet & Truyền hình",
    amount: 350000,
    dueDate: "25/02/2026",
    status: "overdue",
    period: "Tháng 02/2026",
    icon: "wifi",
    iconBg: "#EDE7F6",
    iconColor: "#9C27B0",
  },
  {
    id: "4",
    type: "maintenance",
    name: "Phí quản lý",
    amount: 1500000,
    dueDate: "05/03/2026",
    status: "pending",
    period: "Tháng 03/2026",
    icon: "business",
    iconBg: "#E8F5E9",
    iconColor: "#4CAF50",
  },
  {
    id: "5",
    type: "parking",
    name: "Phí gửi xe",
    amount: 500000,
    dueDate: "05/03/2026",
    status: "pending",
    period: "Tháng 03/2026",
    icon: "car",
    iconBg: "#FCE4EC",
    iconColor: "#E91E63",
  },
  {
    id: "6",
    type: "electricity",
    name: "Tiền điện",
    amount: 780000,
    dueDate: "28/01/2026",
    status: "paid",
    period: "Tháng 01/2026",
    icon: "flash",
    iconBg: "#FFF3E0",
    iconColor: "#FF9800",
  },
  {
    id: "7",
    type: "water",
    name: "Tiền nước",
    amount: 220000,
    dueDate: "28/01/2026",
    status: "paid",
    period: "Tháng 01/2026",
    icon: "water",
    iconBg: "#E3F2FD",
    iconColor: "#2196F3",
  },
];

type FilterType = "all" | "pending" | "paid";

export default function BillsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);

  const filteredBills = billsData.filter((bill) => {
    if (filter === "all") return true;
    if (filter === "pending")
      return bill.status === "pending" || bill.status === "overdue";
    return bill.status === "paid";
  });

  const totalPending = billsData
    .filter((b) => b.status === "pending" || b.status === "overdue")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalOverdue = billsData
    .filter((b) => b.status === "overdue")
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingCount = billsData.filter(
    (b) => b.status === "pending" || b.status === "overdue",
  ).length;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN") + "đ";
  };

  const getStatusConfig = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return { label: "Đã thanh toán", color: "#4CAF50", bg: "#E8F5E9" };
      case "overdue":
        return { label: "Quá hạn", color: "#FF3B30", bg: "#FFEBEE" };
      default:
        return { label: "Chờ thanh toán", color: "#FF9800", bg: "#FFF3E0" };
    }
  };

  const handlePayBill = (bill: Bill) => {
    setSelectedBill(bill);
    setPaymentModalVisible(true);
  };

  const handleConfirmPayment = () => {
    // Handle payment logic here
    setPaymentModalVisible(false);
    setSelectedBill(null);
  };

  const renderBillCard = (bill: Bill) => {
    const statusConfig = getStatusConfig(bill.status);

    return (
      <TouchableOpacity
        key={bill.id}
        style={styles.billCard}
        activeOpacity={0.7}
        onPress={() => handlePayBill(bill)}
      >
        <View style={styles.billHeader}>
          <View style={styles.billLeft}>
            <View style={[styles.billIcon, { backgroundColor: bill.iconBg }]}>
              <Ionicons name={bill.icon} size={22} color={bill.iconColor} />
            </View>
            <View style={styles.billInfo}>
              <Text style={styles.billName}>{bill.name}</Text>
              <Text style={styles.billPeriod}>{bill.period}</Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
          >
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.billDetails}>
          <View style={styles.billAmountRow}>
            <Text style={styles.billAmountLabel}>Số tiền</Text>
            <Text
              style={[
                styles.billAmount,
                bill.status === "overdue" && styles.billAmountOverdue,
              ]}
            >
              {formatCurrency(bill.amount)}
            </Text>
          </View>
          <View style={styles.billDueRow}>
            <Ionicons name="calendar-outline" size={14} color="#999" />
            <Text style={styles.billDueText}>Hạn: {bill.dueDate}</Text>
          </View>
        </View>

        {bill.status !== "paid" && (
          <TouchableOpacity
            style={[
              styles.payButton,
              bill.status === "overdue" && styles.payButtonOverdue,
            ]}
            onPress={() => handlePayBill(bill)}
          >
            <Ionicons name="card-outline" size={18} color="#fff" />
            <Text style={styles.payButtonText}>Thanh toán ngay</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#1A1A2E", "#16213E"]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Hóa đơn</Text>
            <Text style={styles.headerSubtitle}>
              Thanh toán các chi phí hàng tháng
            </Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="time-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="receipt-outline" size={20} color="#FF9800" />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Chờ thanh toán</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: "#FFEBEE" }]}
            >
              <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
            </View>
            <View style={styles.statInfo}>
              <Text style={[styles.statValue, { color: "#FF3B30" }]}>
                {formatCurrency(totalOverdue)}
              </Text>
              <Text style={styles.statLabel}>Quá hạn</Text>
            </View>
          </View>
        </View>

        {/* Total Pending */}
        <View style={styles.totalCard}>
          <View style={styles.totalLeft}>
            <Text style={styles.totalLabel}>Tổng cần thanh toán</Text>
            <Text style={styles.totalAmount}>
              {formatCurrency(totalPending)}
            </Text>
          </View>
          <TouchableOpacity style={styles.payAllButton}>
            <Text style={styles.payAllText}>Thanh toán tất cả</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(["all", "pending", "paid"] as FilterType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterTab,
              filter === type && styles.filterTabActive,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}
            >
              {type === "all"
                ? "Tất cả"
                : type === "pending"
                  ? "Chưa thanh toán"
                  : "Đã thanh toán"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bills List */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredBills.length > 0 ? (
          filteredBills.map(renderBillCard)
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
            </View>
            <Text style={styles.emptyTitle}>Không có hóa đơn</Text>
            <Text style={styles.emptyText}>
              {filter === "pending"
                ? "Bạn đã thanh toán tất cả hóa đơn"
                : "Chưa có hóa đơn nào trong danh sách"}
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xác nhận thanh toán</Text>
              <TouchableOpacity
                onPress={() => setPaymentModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedBill && (
              <>
                <View style={styles.modalBillInfo}>
                  <View
                    style={[
                      styles.modalBillIcon,
                      { backgroundColor: selectedBill.iconBg },
                    ]}
                  >
                    <Ionicons
                      name={selectedBill.icon}
                      size={28}
                      color={selectedBill.iconColor}
                    />
                  </View>
                  <Text style={styles.modalBillName}>{selectedBill.name}</Text>
                  <Text style={styles.modalBillPeriod}>
                    {selectedBill.period}
                  </Text>
                  <Text style={styles.modalBillAmount}>
                    {formatCurrency(selectedBill.amount)}
                  </Text>
                </View>

                {/* Payment Methods */}
                <View style={styles.paymentMethods}>
                  <Text style={styles.paymentMethodsTitle}>
                    Chọn phương thức thanh toán
                  </Text>

                  <TouchableOpacity style={styles.paymentMethodItem}>
                    <View
                      style={[
                        styles.paymentMethodIcon,
                        { backgroundColor: "#E3F2FD" },
                      ]}
                    >
                      <Ionicons name="card" size={20} color="#2196F3" />
                    </View>
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>
                        Thẻ ngân hàng
                      </Text>
                      <Text style={styles.paymentMethodDesc}>**** 4532</Text>
                    </View>
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#007AFF"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.paymentMethodItem}>
                    <View
                      style={[
                        styles.paymentMethodIcon,
                        { backgroundColor: "#FCE4EC" },
                      ]}
                    >
                      <Ionicons name="wallet" size={20} color="#E91E63" />
                    </View>
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>Ví MoMo</Text>
                      <Text style={styles.paymentMethodDesc}>0912 xxx xxx</Text>
                    </View>
                    <View style={styles.radioOuter}>
                      <View style={styles.radioInner} />
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.paymentMethodItem}>
                    <View
                      style={[
                        styles.paymentMethodIcon,
                        { backgroundColor: "#E8F5E9" },
                      ]}
                    >
                      <Ionicons name="qr-code" size={20} color="#4CAF50" />
                    </View>
                    <View style={styles.paymentMethodInfo}>
                      <Text style={styles.paymentMethodName}>QR Code</Text>
                      <Text style={styles.paymentMethodDesc}>
                        VNPay / ZaloPay
                      </Text>
                    </View>
                    <View style={styles.radioOuter}>
                      <View style={styles.radioInner} />
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.confirmPayButton}
                  onPress={handleConfirmPayment}
                >
                  <Ionicons name="lock-closed" size={18} color="#fff" />
                  <Text style={styles.confirmPayText}>
                    Thanh toán {formatCurrency(selectedBill.amount)}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20,
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
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 16,
  },
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  totalLeft: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  payAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  payAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabActive: {
    backgroundColor: "#1A1A2E",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
  },
  filterTextActive: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  billCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  billHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  billLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  billPeriod: {
    fontSize: 13,
    color: "#999",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  billDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  billAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  billAmountLabel: {
    fontSize: 14,
    color: "#666",
  },
  billAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  billAmountOverdue: {
    color: "#FF3B30",
  },
  billDueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  billDueText: {
    fontSize: 13,
    color: "#999",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  payButtonOverdue: {
    backgroundColor: "#FF3B30",
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBillInfo: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  modalBillIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalBillName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  modalBillPeriod: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  modalBillAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
  },
  paymentMethods: {
    paddingVertical: 20,
  },
  paymentMethodsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 16,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  paymentMethodIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A2E",
    marginBottom: 2,
  },
  paymentMethodDesc: {
    fontSize: 13,
    color: "#999",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 0,
    height: 0,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  confirmPayButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 20,
    gap: 8,
  },
  confirmPayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
