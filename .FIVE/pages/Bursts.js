import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";

const Bursts = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>I'm in Bursts</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export { Bursts };
