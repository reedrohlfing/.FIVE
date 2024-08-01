import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ProfileProvider, useProfileData } from "./ProfileContext";

import { Login } from "./pages/Login";
import { NavBar } from "./components/NavBar";
import { Settings } from "./pages/Settings";
import { PostModal } from "./pages/PostModal";
import { Bud } from "./pages/Bud";
import { ProfileCreation } from "./pages/ProfileCreation";
import { NotFound } from "./pages/NotFound";

const Stack = createStackNavigator();
const InsideStack = createStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen
        name="NavBar"
        component={NavBar}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <InsideStack.Screen
        name="PostModal"
        component={PostModal}
        options={({ route }) => ({
          headerShown: false,
          presentation: "modal",
          userId: route.params.userId,
          post: route.params.post,
        })}
      />
      <InsideStack.Screen
        name="Bud"
        component={Bud}
        options={({ route }) => ({
          headerShown: false,
          userId: route.params.userId,
        })}
      />
    </InsideStack.Navigator>
  );
}

function AppNavigator() {
  const { user, isProfileSetUp } = useProfileData();

  //TODO: Fix PostModal navigation
  const linking = {
    config: {
      screens: {
        Login: "login",
        ProfileCreation: "profile-creation",
        Inside: {
          screens: {
            NavBar: {
              screens: {
                Feed: "feed",
                Search: "search",
                Capture: "capture",
                Bursts: "bursts",
                Profile: "profile",
              },
            },
            Settings: "settings",
            PostModal: ":userId/:post",
            Bud: ":userId",
          },
        },
        NotFound: "*",
      },
    },
  };

  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName="Login">
          {user ? (
            isProfileSetUp ? (
              <Stack.Screen
                name="Inside"
                component={InsideLayout}
                options={{ headerShown: false }}
              />
            ) : (
              <Stack.Screen
                name="ProfileCreation"
                component={ProfileCreation}
                options={{ headerShown: false }}
              />
            )
          ) : (
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name="NotFound"
            component={NotFound}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <AppNavigator />
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: 500,
    alignContent: "center",
    marginHorizontal: "auto",
  },
});
