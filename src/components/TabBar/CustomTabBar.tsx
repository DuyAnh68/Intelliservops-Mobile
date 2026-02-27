import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabItem {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
}

const tabs: TabItem[] = [
  {
    name: "index",
    label: "Trang chủ",
    icon: "home-outline",
    iconFocused: "home",
  },
  {
    name: "services",
    label: "Dịch vụ",
    icon: "construct-outline",
    iconFocused: "construct",
  },
  {
    name: "bills",
    label: "Hóa đơn",
    icon: "receipt-outline",
    iconFocused: "receipt",
  },
  {
    name: "notifications",
    label: "Thông báo",
    icon: "notifications-outline",
    iconFocused: "notifications",
  },
  {
    name: "settings",
    label: "Cài đặt",
    icon: "settings-outline",
    iconFocused: "settings",
  },
];

interface TabButtonProps {
  tab: TabItem;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  badge?: number;
}

function TabButton({
  tab,
  isFocused,
  onPress,
  onLongPress,
  badge,
}: TabButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0.7)).current;
  const backgroundAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateYAnim, {
        toValue: isFocused ? -4 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: isFocused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(backgroundAnim, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }),
    ]).start();
  }, [isFocused, translateYAnim, opacityAnim, backgroundAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
  };

  const backgroundColor = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(0, 122, 255, 0)", "rgba(0, 122, 255, 0.12)"],
  });

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabButton}
    >
      <Animated.View
        style={[
          styles.tabButtonInner,
          {
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <Animated.View style={[styles.iconWrapper, { backgroundColor }]}>
          <Ionicons
            name={isFocused ? tab.iconFocused : tab.icon}
            size={24}
            color={isFocused ? "#007AFF" : "#8E8E93"}
          />
          {badge && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge > 99 ? "99+" : badge}</Text>
            </View>
          )}
        </Animated.View>
        <Text
          style={[
            styles.tabLabel,
            { color: isFocused ? "#007AFF" : "#8E8E93" },
            isFocused && styles.tabLabelFocused,
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const tab = tabs.find((t) => t.name === route.name);
          if (!tab) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          // Example: show badge on notifications tab
          const badge = route.name === "notifications" ? 3 : undefined;

          return (
            <TabButton
              key={route.key}
              tab={tab}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              badge={badge}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: Platform.OS === "ios" ? 0 : 8,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  iconWrapper: {
    position: "relative",
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: 2,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
  tabLabelFocused: {
    fontWeight: "700",
  },
});
