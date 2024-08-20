import { StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useProfileData } from "../ProfileContext";
import { Feed } from "../pages/Feed";
import { Search } from "../pages/Search";
import { Capture } from "../pages/Capture";
import { Bursts } from "../pages/Bursts";
import { Profile } from "../pages/Profile";

const Tab = createBottomTabNavigator();

const NavBar = () => {
  const { profileData } = useProfileData();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarOnMagicTap: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.navigator,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={styles.button}
              source={
                focused
                  ? require("../assets/icons/feed-circle-black-active.png")
                  : require("../assets/icons/feed-circle-black-inactive.png")
              }
              on
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={styles.button}
              source={
                focused
                  ? require("../assets/icons/bubbles-black-active.png")
                  : require("../assets/icons/bubbles-black-inactive.png")
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Capture"
        component={Capture}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={styles.button}
              source={
                focused
                  ? require("../assets/icons/add-black-active.png")
                  : require("../assets/icons/add-black-inactive.png")
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bursts"
        component={Bursts}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={styles.button}
              source={
                focused
                  ? require("../assets/icons/burst-black-active.png")
                  : require("../assets/icons/burst-black-inactive.png")
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              style={
                focused
                  ? [styles.button, styles.profileActive]
                  : [styles.button, styles.profileInactive]
              }
              source={profileData.profileImage}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navigator: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 32,
    alignSelf: "center",
    position: "absolute",
    bottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: "auto",
  },
  button: {
    width: 32,
    height: 32,
  },
  profileInactive: {
    borderRadius: "50%",
    border: "none",
  },
  profileActive: {
    border: "1.5px solid black",
    borderRadius: "50%",
  },
});

export { NavBar };
