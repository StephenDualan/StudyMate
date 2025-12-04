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
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (!email.trim() || !password) {
      return Alert.alert("Error", "Please enter email and password");
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Dashboard");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        Alert.alert("Login Failed", "No user found with this email.");
      } else if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        Alert.alert("Login Failed", "Incorrect email or password.");
      } else if (err.code === "auth/invalid-email") {
        Alert.alert("Login Failed", "Invalid email format.");
      } else {
        Alert.alert("Login Failed", err.message);
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
                <Icon name="school" size={48} color="#667eea" />
              </View>
              <Text style={styles.title}>StudyMate</Text>
              <Text style={styles.subtitle}>Welcome back! Login to continue</Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
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
                  placeholder="Password"
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

              <TouchableOpacity 
                style={[styles.btn, loading && styles.btnDisabled]} 
                onPress={login} 
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
                      <Text style={styles.btnText}>Logging in...</Text>
                    </View>
                  ) : (
                    <View style={styles.btnContent}>
                      <Text style={styles.btnText}>Login</Text>
                      <Icon name="arrow-forward" size={20} color="#fff" />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate("Signup")}
                disabled={loading}
                style={styles.signupContainer}
              >
                <Text style={styles.linkText}>
                  Don't have an account? 
                </Text>
                <Text style={styles.linkBold}> Sign up</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: 'center'
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
    marginBottom: 16,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24
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