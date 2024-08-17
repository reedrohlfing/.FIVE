import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import PhoneInput from "react-phone-number-input";
import AuthCode from "react-auth-code-input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import firebase from "firebase/app";
import "react-phone-number-input/style.css";
import "../assets/css/authentication.css";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [value, setValue] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        FIREBASE_AUTH,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
          "expired-callback": () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            Alert.alert("Error", "reCAPTCHA expired, please try again.");
          },
        }
      );
    }
  }, []);

  const handlePhoneNumChange = (value) => {
    setValue(value);
    setPhoneNumber(value);
  };

  const sendCode = async () => {
    setLoading(true);

    // Attempt to use Firebase to sign in with phone number entered
    try {
      const result = await signInWithPhoneNumber(
        FIREBASE_AUTH,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmResult(result);
      Alert.alert("Success", "Verification code sent to your phone");
    } catch (error) {
      Alert.alert("Error", error.message);
      window.recaptchaVerifier.render().then(function (widgetId) {
        grecaptcha.reset(widgetId);
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmCode = async () => {
    if (verificationCode.length < 6) {
      Alert.alert("Error", "Please enter a valid verification code");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await confirmResult.confirm(verificationCode);
      const user = userCredential.user;

      const userDocRef = doc(FIREBASE_DB, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(
          userDocRef,
          {
            phoneNumber: user.phoneNumber,
            phoneNumberNoCountry: user.phoneNumber.substring(2),
            initialized: false,
            userId: user.uid,
            buds: [user.uid],
          },
          { merge: true }
        );
        navigation.navigate("ProfileCreation");
      } else {
        Alert.alert("Success", "Phone number verified successfully");
        var credential = firebase.auth.PhoneAuthProvider.credential(
          confirmationResult.verificationId,
          code
        );
        firebase.auth().signInWithCredential(credential);
      }
    } catch (error) {
      Alert.alert("Error", "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>.FIVE</Text>
      <View id="recaptcha-container" />
      {!confirmResult ? (
        <View style={styles.phoneSubmitView}>
          {loading ? (
            <ActivityIndicator size="large" color="#00FFFF" />
          ) : (
            <View>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                placeholder="Phone Number"
                defaultCountry="US"
                value={value}
                onChange={handlePhoneNumChange}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.nextButton,
                  pressed && { backgroundColor: "rgba(0, 155, 155, 1)" },
                ]}
                onPress={sendCode}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.codeSubmitView}>
          {loading ? (
            <ActivityIndicator size="large" color="#00FFFF" />
          ) : (
            <View style={styles.authCodeGo}>
              <Text style={styles.codeText}>
                Please enter the 6-digit code texted to you.
              </Text>
              <AuthCode
                allowedCharacters="numeric"
                onChange={setVerificationCode}
                inputMode="numeric"
                containerClassName="auth-code-input"
                inputClassName="auth-code-input"
              />
              <Pressable
                style={({ pressed }) => [
                  styles.goButton,
                  pressed && { backgroundColor: "rgba(0, 155, 155, 1)" },
                ]}
                onPress={confirmCode}
              >
                <Text style={styles.goButtonText}>Go</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "black",
  },
  phoneSubmitView: {
    width: "85%",
    alignSelf: "center",
  },
  codeSubmitView: {
    width: "85%",
    alignSelf: "center",
  },
  authCodeGo: {
    width: "100%",
  },
  codeText: {
    textAlign: "center",
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: "#4200FF",
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  goButton: {
    backgroundColor: "#00FFFF",
    height: 40,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  goButtonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export { Login };
