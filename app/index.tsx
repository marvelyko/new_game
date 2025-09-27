import React, { useState } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import * as Haptics from "expo-haptics";

export default function Index() {
  const [name, setName] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const createPlayer = useMutation(api.games.createPlayer);

  const handleStart = async () => {
    if (!name.trim()) {
      Alert.alert("შეცდომა", "გთხოვთ შეიყვანოთ თქვენი სახელი");
      return;
    }

    if (!secretWord.trim()) {
      Alert.alert("შეცდომა", "გთხოვთ შეიყვანოთ საიდუმლო სიტყვა");
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);

    try {
      const playerId = await createPlayer({
        name: name.trim(),
        secretWord: secretWord.trim(),
      });

      console.log("Player created with ID:", playerId);

      // Navigate to game with player ID
      router.push(`/game?playerId=${playerId}`);
    } catch (error) {
      console.error("Error creating player:", error);
      Alert.alert("შეცდომა", "მოთამაშის შექმნა ვერ მოხერხდა");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🔐</Text>
            <Text style={styles.title}>საიდუმლო სიტყვების გაცვლა</Text>
            <Text style={styles.subtitle}>
              შეიყვანეთ თქვენი სახელი და საიდუმლო სიტყვა, შემდეგ კომბინაციით მოძებნეთ თქვენი წყვილი
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>👤 თქვენი სახელი</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="მაგ: ნინო"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>🤫 საიდუმლო სიტყვა</Text>
              <TextInput
                style={styles.input}
                value={secretWord}
                onChangeText={setSecretWord}
                placeholder="მაგ: diegogrt"
                placeholderTextColor="#999"
                secureTextEntry={true}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.hint}>
                ეს სიტყვა გაიცვლება მხოლოდ წარმატებული დამთხვევის შემდეგ
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.startButton, isLoading && styles.startButtonDisabled]}
              onPress={handleStart}
              disabled={isLoading}
            >
              <Text style={styles.startButtonText}>
                {isLoading ? "იტვირთება..." : "დაწყება 🚀"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>📋 როგორ მუშაობს:</Text>
            <Text style={styles.instructionItem}>1. შეიყვანეთ სახელი და საიდუმლო სიტყვა</Text>
            <Text style={styles.instructionItem}>2. ჩაწერეთ ორი ცხოველის კომბინაცია</Text>
            <Text style={styles.instructionItem}>3. როცა სხვა მოთამაშე იგივე კომბინაციას ჩაწერს</Text>
            <Text style={styles.instructionItem}>4. ავტომატურად მოხდება საიდუმლო სიტყვების გაცვლა!</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    color: "#333",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    fontStyle: "italic",
  },
  startButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0,
    elevation: 0,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  instructions: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
  },
});