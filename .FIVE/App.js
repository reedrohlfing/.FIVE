import { StatusBar, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./AuthContext";

import { Login } from "./pages/Login";
import { NavBar } from "./components/NavBar";
import { Settings } from "./pages/Settings";
import { ProfileCreation } from "./pages/ProfileCreation";

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
        options={{ title: "Profile Settings" }}
      />
    </InsideStack.Navigator>
  );
}

function AppNavigator() {
  const { user, isProfileSetUp } = useAuth();

  return (
    <NavigationContainer>
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
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
