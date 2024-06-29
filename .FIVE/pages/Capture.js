import { CameraView, useCameraPermissions } from "expo-camera";
import MaskedView from "@react-native-masked-view/masked-view";
import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Mask,
  Pressable,
  SafeAreaView,
} from "react-native";

const Capture = () => {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={styles.container}>
      <MaskedView
        style={styles.cameraFrame}
        maskElement={<View style={styles.transparentCircle}></View>}
      >
        <CameraView style={styles.camera} facing={facing} zoom={0}></CameraView>
      </MaskedView>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  cameraFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  transparentCircle: {
    backgroundColor: "white",
    borderRadius: 900,
    width: "95%",
    aspectRatio: 1,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    marginTop: 47,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});

export { Capture };
