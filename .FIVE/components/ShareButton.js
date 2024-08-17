import { useState, useEffect } from "react";
import { StyleSheet, Image, Pressable } from "react-native";
import * as Sharing from "expo-sharing";

const ShareButton = ({ shareLink, shareTitle }) => {
  const [isSharingAvailable, setIsSharingAvailable] = useState(false);

  useEffect(() => {
    Sharing.isAvailableAsync().then((isAvailable) => {
      setIsSharingAvailable(isAvailable);
    });
  }, []);

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(
        shareLink,
        (options = { dialogTitle: shareTitle })
      );
    } catch (error) {
      console.error("Error sharing link:", error);
    }
  };

  if (!isSharingAvailable) return null;

  return (
    <Pressable style={styles.shareButton} onPress={handleShare}>
      <Image
        style={styles.shareButtonImg}
        source={require("../assets/icons/share-inactive.png")}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shareButton: {
    position: "absolute",
    right: 13,
    margin: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: "50%",
    height: 56,
    width: 56,
  },
  shareButtonImg: {
    height: 34,
    width: 34,
  },
});

export { ShareButton };
