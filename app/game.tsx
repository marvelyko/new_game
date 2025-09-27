import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import * as Haptics from "expo-haptics";

export default function Game() {
  const { playerId } = useLocalSearchParams<{ playerId: string }>();
  const [animalCombination, setAnimalCombination] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("Game screen - playerId:", playerId);

  const player = useQuery(api.games.getPlayer, 
    playerId ? { playerId: playerId as Id<"players"> } : "skip"
  );
  const recentMatches = useQuery(api.games.getRecentMatches);

  const submitAnimalCombination = useMutation(api.games.submitAnimalCombination);
  const resetPlayer = useMutation(api.games.resetPlayer);

  useEffect(() => {
    console.log("useEffect - playerId:", playerId);
    if (!playerId) {
      console.log("No playerId, redirecting to home");
      router.replace("/");
    }
  }, [playerId]);

  const handleSubmit = async () => {
    if (!animalCombination.trim()) {
      Alert.alert("შეცდომა", "გთხოვთ შეიყვანოთ ორი ცხოველის კომბინაცია");
      return;
    }

    if (!playerId) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsSubmitting(true);

    try {
      const result = await submitAnimalCombination({
        playerId: playerId as Id<"players">,
        animalCombination: animalCombination.trim(),
      });

      if (result.matched) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert(
          "🎉 წარმატება!",
          `დამთხვევა მოიძებნა ${result.matchedWith}-თან!\n\nთქვენი საიდუმლო სიტყვა: ${result.revealedSecretWord}`,
          [
            {
              text: "კიდევ ერთხელ თამაში",
              onPress: handlePlayAgain,
            },
            {
              text: "მთავარ გვერდზე",
              onPress: () => router.replace("/"),
            },
          ]
        );
      } else {
        Alert.alert("ელოდება...", result.message);
      }
    } catch (error) {
      console.error("Error submitting combination:", error);
      Alert.alert("შეცდომა", "კომბინაციის გაგზავნა ვერ მოხერხდა");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlayAgain = async () => {
    if (!playerId) return;

    try {
      await resetPlayer({ playerId: playerId as Id<"players"> });
      setAnimalCombination("");
    } catch (error) {
      console.error("Error resetting player:", error);
    }
  };

  if (!player) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>იტვირთება...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.backButtonText}>← უკან</Text>
          </TouchableOpacity>
          
          <Text style={styles.playerName}>👋 გამარჯობა, {player.name}!</Text>
        </View>

        {player.revealedSecretWord ? (
          // Success state
          <View style={styles.successContainer}>
            <Text style={styles.successEmoji}>🎉</Text>
            <Text style={styles.successTitle}>წარმატება!</Text>
            <Text style={styles.successMessage}>
              თქვენმა წყვილმა გაგიზიარათ საიდუმლო სიტყვა:
            </Text>
            <View style={styles.secretWordContainer}>
              <Text style={styles.secretWord}>{player.revealedSecretWord}</Text>
            </View>
            <Text style={styles.combinationUsed}>
              გამოყენებული კომბინაცია: {player.animalCombination}
            </Text>
            
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={handlePlayAgain}
            >
              <Text style={styles.playAgainButtonText}>კიდევ ერთხელ თამაში 🔄</Text>
            </TouchableOpacity>
          </View>
        ) : player.isWaitingForMatch ? (
          // Waiting state
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>⏳</Text>
            <Text style={styles.waitingTitle}>ელოდება დამთხვევას...</Text>
            <Text style={styles.waitingMessage}>
              თქვენი კომბინაცია: <Text style={styles.combination}>{player.animalCombination}</Text>
            </Text>
            <Text style={styles.waitingSubtext}>
              ელოდება სხვა მოთამაშეს, რომელიც ჩაწერს იგივე კომბინაციას
            </Text>
            
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handlePlayAgain}
            >
              <Text style={styles.changeButtonText}>კომბინაციის შეცვლა</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Input state
          <View style={styles.gameContainer}>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.animalInput}
                value={animalCombination}
                onChangeText={setAnimalCombination}
                placeholder="მაგ: პანტერაკატა"
                placeholderTextColor="#999"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "იგზავნება..." : "გაგზავნა 🚀"}
              </Text>
            </TouchableOpacity>

            <View style={styles.exampleContainer}>
              <Text style={styles.exampleTitle}>მაგალითები:</Text>
              <Text style={styles.exampleItem}>• პანტერაკატა</Text>
              <Text style={styles.exampleItem}>• ლომიძაღლი</Text>
              <Text style={styles.exampleItem}>• დათვიარდა</Text>
              <Text style={styles.exampleItem}>• ვეფხვიღორი</Text>
            </View>
          </View>
        )}

        {recentMatches && recentMatches.length > 0 && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>📊 ბოლო დამთხვევები</Text>
            {recentMatches.slice(0, 5).map((match) => (
              <View key={match._id} style={styles.historyItem}>
                <Text style={styles.historyText}>
                  {match.player1Name} ↔ {match.player2Name}
                </Text>
                <Text style={styles.historyCombination}>
                  {match.animalCombination}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  playerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  gameContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  gameInstructions: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  animalInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    borderWidth: 2,
    borderColor: "#E5E5E5",
    color: "#333",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#34C759",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#999",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  exampleContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  exampleItem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  waitingContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  waitingEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  waitingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  waitingMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  combination: {
    fontWeight: "bold",
    color: "#007AFF",
  },
  waitingSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  changeButton: {
    backgroundColor: "#FF9500",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  changeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#34C759",
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  secretWordContainer: {
    backgroundColor: "#F0F9FF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  secretWord: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
  },
  combinationUsed: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
    textAlign: "center",
  },
  playAgainButton: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  playAgainButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  historyText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  historyCombination: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
});