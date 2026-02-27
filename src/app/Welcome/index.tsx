import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageSourcePropType,
} from "react-native";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { createShadow } from "@/src/utils/shadow";

const { width, height } = Dimensions.get("window");

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
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    await AsyncStorage.setItem("hasSeenWelcome", "true");
    router.replace("/Login");
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
    <View style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>
      )}

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

      {/* Pagination & Button */}
      <View style={styles.footer}>
        {/* Dots */}
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

        {/* Next / Get Started button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: isLastSlide ? "#007AFF" : "#007AFF",
            },
          ]}
          onPress={handleNext}
        >
          {isLastSlide ? (
            <Text style={styles.nextButtonText}>Bắt đầu</Text>
          ) : (
            <Ionicons name="arrow-forward" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  skipButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  slideImage: {
    width: width * 0.75,
    height: width * 0.55,
    borderRadius: 20,
    marginBottom: 40,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    ...createShadow({
      color: "#000",
      offsetY: 4,
      opacity: 0.2,
      radius: 8,
      elevation: 8,
    }),
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 50,
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
    width: 56,
    height: 56,
    borderRadius: 28,
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
  },
});
