import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  image: ImageSourcePropType;
  rating?: number;
  category?: string;
}

interface ServiceCardProps {
  service: ServiceItem;
  onPress?: () => void;
  onAddPress?: () => void;
}

export function ServiceCard({
  service,
  onPress,
  onAddPress,
}: ServiceCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={service.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {service.name}
          </Text>
          {service.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={10} color="#FFB800" />
              <Text style={styles.ratingText}>{service.rating}</Text>
            </View>
          )}
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {service.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {service.price}
            <Text style={styles.unit}>/{service.unit}</Text>
          </Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 110,
  },
  info: {
    padding: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1A1A2E",
    flex: 1,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFB800",
    marginLeft: 2,
  },
  description: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  unit: {
    fontSize: 11,
    fontWeight: "normal",
    color: "#999",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FF9500",
    justifyContent: "center",
    alignItems: "center",
  },
});
