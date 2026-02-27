import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheetModal } from "../Modal/BottomSheetModal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface IncidentReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: IncidentReportData) => void;
}

export interface IncidentReportData {
  location: string;
  description: string;
  images: string[];
}

const LOCATIONS = [
  { id: "1", name: "Phòng khách", icon: "home-outline" as const },
  { id: "2", name: "Phòng ngủ", icon: "bed-outline" as const },
  { id: "3", name: "Nhà bếp", icon: "restaurant-outline" as const },
  { id: "4", name: "Phòng tắm", icon: "water-outline" as const },
  { id: "5", name: "Ban công", icon: "sunny-outline" as const },
  { id: "6", name: "Khác", icon: "ellipsis-horizontal-outline" as const },
];

export function IncidentReportModal({
  visible,
  onClose,
  onSubmit,
}: IncidentReportModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setSelectedLocation(null);
      setDescription("");
      setImages([]);
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!selectedLocation) return;

    onSubmit({
      location: selectedLocation,
      description,
      images,
    });
    onClose();
  }, [selectedLocation, description, images, onSubmit, onClose]);

  const handleAddImage = useCallback(() => {
    setImages((prev) => [...prev, `image_${Date.now()}`]);
  }, []);

  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSelectLocation = useCallback((id: string) => {
    setSelectedLocation(id);
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const isFormValid = selectedLocation && description.trim().length > 0;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      title="Báo cáo sự cố"
      height={SCREEN_HEIGHT * 0.85}
    >
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step 1: Select Location */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Chọn vị trí</Text>
          </View>
          <View style={styles.locationGrid}>
            {LOCATIONS.map((loc) => (
              <TouchableOpacity
                key={loc.id}
                style={[
                  styles.locationItem,
                  selectedLocation === loc.id && styles.locationItemActive,
                ]}
                onPress={() => handleSelectLocation(loc.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={loc.icon}
                  size={24}
                  color={selectedLocation === loc.id ? "#007AFF" : "#666"}
                />
                <Text
                  style={[
                    styles.locationText,
                    selectedLocation === loc.id && styles.locationTextActive,
                  ]}
                >
                  {loc.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Step 2: Description */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View
              style={[
                styles.stepBadge,
                !selectedLocation && styles.stepBadgeDisabled,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  !selectedLocation && styles.stepNumberDisabled,
                ]}
              >
                2
              </Text>
            </View>
            <Text
              style={[
                styles.stepTitle,
                !selectedLocation && styles.stepTitleDisabled,
              ]}
            >
              Mô tả sự cố
            </Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={handleDescriptionChange}
            editable={!!selectedLocation}
          />
        </View>

        {/* Step 3: Add Images */}
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View
              style={[
                styles.stepBadge,
                !selectedLocation && styles.stepBadgeDisabled,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  !selectedLocation && styles.stepNumberDisabled,
                ]}
              >
                3
              </Text>
            </View>
            <Text
              style={[
                styles.stepTitle,
                !selectedLocation && styles.stepTitleDisabled,
              ]}
            >
              Thêm hình ảnh <Text style={styles.optional}>(tùy chọn)</Text>
            </Text>
          </View>
          <View style={styles.imageSection}>
            {images.map((img, index) => (
              <View key={img} style={styles.imagePreview}>
                <Ionicons name="image" size={24} color="#007AFF" />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[
                styles.addImageButton,
                !selectedLocation && styles.addImageButtonDisabled,
              ]}
              onPress={handleAddImage}
              disabled={!selectedLocation}
              activeOpacity={0.7}
            >
              <Ionicons
                name="camera-outline"
                size={28}
                color={selectedLocation ? "#007AFF" : "#ccc"}
              />
              <Text
                style={[
                  styles.addImageText,
                  !selectedLocation && styles.addImageTextDisabled,
                ]}
              >
                Thêm ảnh
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
          activeOpacity={0.8}
        >
          <Ionicons
            name="send"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepBadgeDisabled: {
    backgroundColor: "#E0E0E0",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  stepNumberDisabled: {
    color: "#999",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  stepTitleDisabled: {
    color: "#999",
  },
  optional: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#999",
  },
  locationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  locationItem: {
    width: (SCREEN_WIDTH - 60) / 3,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  locationItemActive: {
    backgroundColor: "#E8F4FF",
    borderColor: "#007AFF",
  },
  locationText: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  locationTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#1A1A2E",
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  imageSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#E8F4FF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButtonDisabled: {
    borderColor: "#E0E0E0",
  },
  addImageText: {
    fontSize: 11,
    color: "#007AFF",
    marginTop: 4,
  },
  addImageTextDisabled: {
    color: "#ccc",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    paddingTop: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#FF9500",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#E0E0E0",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
