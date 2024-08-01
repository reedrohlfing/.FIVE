import { StyleSheet, Image, Pressable } from "react-native";

const BackButton = ({ navigation }) => {
  return navigation.canGoBack() ? (
    <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
      <Image
        style={styles.backButtonImg}
        source={require("../assets/icons/back-inactive.png")}
      />
    </Pressable>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 56,
    width: 56,
  },
  backButtonImg: {
    height: 34,
    width: 34,
  },
});

export { BackButton };
