import { useState } from "react";
import { StyleSheet, Image, Pressable } from "react-native";
import { useProfileData } from "../ProfileContext";
import moment from "moment";

const BurstButton = ({ budId }) => {
  const [pressed, setPressed] = useState(false);
  const { defaultData, profileData, setProfileData, updateProfile } =
    useProfileData();

  const handleBurst = () => {
    setPressed(true);

    // Add user to buds list if not included already
    if (!profileData.buds.includes(budId)) {
      updateProfile({
        buds: [...profileData.buds, budId],
      });
    }

    // Only send one notification that the user got bursted
    // const dateNow = moment().format("YYYYMMDD_HHmmss");
    // updateProfile({
    //     bursts: [...profileData.bursts, {
    //         datetime: dateNow,
    //         burstType: 'bud_profile'
    //         user:
    //     }
    //     ]
    // })
  };
  return (
    <Pressable style={styles.backButton} onPress={() => handleBurst()}>
      <Image
        style={styles.backButtonImg}
        source={
          pressed
            ? require("../assets/icons/burst2-black-active.png")
            : require("../assets/icons/burst2-black-inactive.png")
        }
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
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

export { BurstButton };
