import { StyleSheet, Text, SafeAreaView } from "react-native";

const NotFound = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>:(</Text>
      <Text style={styles.text}>I'm sorry this page does not exist.</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4200FF",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    width: "100%",
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export { NotFound };
