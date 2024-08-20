import React from "react";
import { StyleSheet, View, Platform } from "react-native";

const Bubble = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.bubble]}>
        {Platform.OS === "web" && <View style={styles.blurEffectWeb} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
  },
  bubble: {
    width: "101%",
    height: "101%",
    borderRadius: "50%", // Makes it a circle
    backgroundColor: "rgba(0, 255, 255, 0.1)", // Light cyan color
    borderWidth: 2,
    borderColor: "rgba(0, 255, 255, 0.5)", // Semi-transparent border
    position: "absolute",
  },
  // Blur effect for web
  blurEffectWeb: {
    ...StyleSheet.absoluteFillObject,
    backdropFilter: "blur(20px)", // Apply blur effect for web
    borderRadius: "50%",
  },
});

export { Bubble };
