import { BackgroundTheme } from "@/src/layout/BackgroundTheme";
import { useAuthStore } from "@/src/stores/Auth/AuthStore";
import { createShadow } from "@/src/utils/shadow";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const smartHomeImage = require("@/src/assets/phong-khach-can-ho-smart-home_grande.jpg");

interface SlideItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  image?: ImageSourcePropType;
}

const slides: SlideItem[] = [
  {
    id: "1",
    icon: "rocket-outline",
    title: "Chào mừng đến IntelliServOps",
    description:
      "Ứng dụng quản lý dịch vụ thông minh giúp bạn vận hành hiệu quả hơn.",
    color: "#4A90D9",
    image: smartHomeImage,
  },
  {
    id: "2",
    icon: "clipboard-outline",
    title: "Quản lý công việc",
    description:
      "Theo dõi và quản lý các yêu cầu dịch vụ, phân công công việc một cách dễ dàng.",
    color: "#50C878",
  },
  {
    id: "3",
    icon: "notifications-outline",
    title: "Thông báo thời gian thực",
    description:
      "Nhận thông báo ngay lập tức khi có cập nhật mới về công việc của bạn.",
    color: "#FF8C42",
  },
  {
    id: "4",
    icon: "bar-chart-outline",
    title: "Báo cáo & Thống kê",
    description:
      "Xem báo cáo chi tiết, phân tích hiệu suất để đưa ra quyết định tốt hơn.",
    color: "#9B59B6",
  },
];

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Redirect to Login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/Login" />;
  }

  const handleGoHome = async () => {
    router.replace("/(tabs)" as any);
  };

  const handleOpenTutorial = () => {
    setShowTutorialModal(true);
    setCurrentIndex(0);
  };

  const handleCloseTutorial = () => {
    setShowTutorialModal(false);
  };

  const handleNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleCloseTutorial();
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const renderSlide = ({ item }: { item: SlideItem }) => (
    <View style={[styles.slide, { width }]}>
      {item.image ? (
        <Image
          source={item.image}
          style={styles.slideImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={80} color="#fff" />
        </View>
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <BackgroundTheme>
      {/* Welcome Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Ionicons name="home-outline" size={64} color="#fff" />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeTitle}>Chào mừng đến IntelliServOps</Text>
        <Text style={styles.welcomeSubtitle}>
          Ứng dụng quản lý dịch vụ thông minh cho bạn
        </Text>

        {/* Enter Text Navigation */}
        <TouchableOpacity
          style={styles.enterContainer}
          onPress={handleGoHome}
          activeOpacity={0.7}
        >
          <Text style={styles.enterText}>Vào nhà của bạn</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#ffffff"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>

      {/* Tutorial Info Icon */}
      <TouchableOpacity
        style={styles.tutorialButton}
        onPress={handleOpenTutorial}
      >
        <Ionicons name="information-circle-outline" size={28} color="#00D4FF" />
      </TouchableOpacity>

      {/* Tutorial Modal */}
      <Modal
        visible={showTutorialModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseTutorial}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseTutorial}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>

            {/* Slides */}
            <FlatList
              ref={flatListRef}
              data={slides}
              renderItem={renderSlide}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              bounces={false}
            />

            {/* Footer */}
            <View style={styles.modalFooter}>
              {/* Pagination Dots */}
              <View style={styles.pagination}>
                {slides.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          index === currentIndex ? "#007AFF" : "#D0D0D0",
                        width: index === currentIndex ? 24 : 8,
                      },
                    ]}
                  />
                ))}
              </View>

              {/* Next Button */}
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNextSlide}
              >
                {isLastSlide ? (
                  <Text style={styles.nextButtonText}>Hoàn tất</Text>
                ) : (
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </BackgroundTheme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F2027",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 1,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 212, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 2,
    borderColor: "rgba(0, 212, 255, 0.5)",
    ...createShadow({
      color: "#00D4FF",
      offsetY: 12,
      opacity: 0.4,
      radius: 16,
      elevation: 12,
    }),
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  welcomeSubtitle: {
    fontSize: 17,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 56,
    lineHeight: 26,
    fontWeight: "500",
  },
  enterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  enterText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  tutorialButton: {
    position: "absolute",
    bottom: 48,
    right: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(0, 212, 255, 0.4)",
    zIndex: 10,
    ...createShadow({
      color: "#00D4FF",
      offsetY: 6,
      opacity: 0.3,
      radius: 10,
      elevation: 6,
    }),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 22,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  slideImage: {
    width: width * 0.5,
    height: width * 0.4,
    borderRadius: 16,
    marginBottom: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    ...createShadow({
      color: "#000",
      offsetY: 4,
      opacity: 0.2,
      radius: 8,
      elevation: 8,
    }),
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    minWidth: 56,
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    ...createShadow({
      color: "#007AFF",
      offsetY: 2,
      opacity: 0.3,
      radius: 4,
      elevation: 4,
    }),
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
