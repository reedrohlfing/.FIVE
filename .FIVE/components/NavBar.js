import { StyleSheet, Text, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feed } from "../pages/Feed";
import { Search } from "../pages/Search";
import { Capture } from "../pages/Capture";
import { Bursts } from "../pages/Bursts";
import { Profile } from "../pages/Profile";

const Tab = createBottomTabNavigator();

const NavBar = () => {
  return (
    <Tab.Navigator
      styles={styles.navigator}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={styles.button}
              source={
                focused
                  ? require("../assets/icons/feed-circle-black-active.png")
                  : require("../assets/icons/feed-circle-black-inactive.png")
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              style={styles.button}
              source={
                focused
                  ? require("../assets/icons/search-black-active.png")
                  : require("../assets/icons/search-black-inactive.png")
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Capture"
        component={Capture}
        options={{
          tabBarShowLabel: false,
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
          tabBarShowLabel: false,
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
          tabBarShowLabel: false,
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
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    width: 33,
    height: 33,
  },
});

export { NavBar };
