import { Platform } from "react-native";

export default {
  normal: Platform.OS === "ios" ? "Noto Kufi Arabic" : "NotoKufiArabic-Regular",
  bold: Platform.OS === "ios" ? "Noto Kufi Arabic" : "NotoKufiArabic-Bold",

  // normal: Platform.OS === 'ios' ? 'JF Flat' : 'JF Flat regular',
  // bold: Platform.OS === 'ios' ? 'JF Flat' : 'JF Flat medium',
  boldIsStyle: true
};
