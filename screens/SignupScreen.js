import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signup = async () => {
    // Validation
    if (!name.trim()) {
      return Alert.alert("Error", "Please enter your name");
    }
    if (!email.trim()) {
      return Alert.alert("Error", "Please enter your email");
    }
    if (!password) {
      return Alert.alert("Error", "Please enter a password");
    }
    if (password.length < 6) {
      return Alert.alert("Error", "Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    setLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: name.trim()
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
        uid: user.uid
      });

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => navigation.replace("Dashboard") }
      ]);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        Alert.alert("Signup Failed", "This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        Alert.alert("Signup Failed", "Invalid email format.");
      } else if (err.code === "auth/weak-password") {
        Alert.alert("Signup Failed", "Password is too weak.");
      } else {
        Alert.alert("Signup Failed", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#667eea', '#764ba2', '#f093fb']} 
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Logo/Icon Section */}
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <Icon name="person-add" size={48} color="#667eea" />
              </View>
              <Text style={styles.title}>Join StudyMate</Text>
              <Text style={styles.subtitle}>Create your account to get started</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  placeholder="Full Name"
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  placeholder="Password (min. 6 characters)"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Icon 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  placeholder="Confirm Password"
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Icon 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.btn, loading && styles.btnDisabled]} 
                onPress={signup} 
                disabled={loading}
              >
                <LinearGradient
                  colors={loading ? ['#ccc', '#aaa'] : ['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.btnGradient}
                >
                  {loading ? (
                    <View style={styles.btnContent}>
                      <Text style={styles.btnText}>Creating account...</Text>
                    </View>
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.btnText}>Sign Up</Text>
                      <Icon name="arrow-forward" size={20} color="#fff" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate("Login")}
                disabled={loading}
                style={styles.loginContainer}
              >
                <Text style={styles.linkText}>
                  Already have an account? 
                </Text>
                <Text style={styles.linkBold}> Login</Text>
              </TouchableOpacity>
            </View>

            {/* Decorative Elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  container: { 
    padding: 24, 
    flex: 1, 
    justifyContent: "center",
    paddingTop: 60,
    paddingBottom: 40
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    textAlign: 'center',
    paddingHorizontal: 20
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12
  },
  inputIcon: {
    marginRight: 8
  },
  input: { 
    flex: 1,
    padding: 14, 
    fontSize: 16,
    color: '#333'
  },
  eyeIcon: {
    padding: 8
  },
  btn: { 
    borderRadius: 12, 
    marginTop: 8,
    overflow: 'hidden',
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6
  },
  btnDisabled: {
    shadowOpacity: 0.1
  },
  btnGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center"
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  btnText: { 
    color: "white", 
    fontWeight: "700",
    fontSize: 16
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
  },
  linkText: { 
    color: "#666", 
    fontSize: 15
  },
  linkBold: {
    color: "#667eea",
    fontWeight: "700",
    fontSize: 15
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)'
  }
});