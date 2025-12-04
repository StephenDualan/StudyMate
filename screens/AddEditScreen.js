// screens/AddEditScreen.js
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
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";

export default function AddEditScreen({ navigation, route }) {
  const editing = route.params?.reminder ?? null;

  const [title, setTitle] = useState(editing?.title || "");
  const [subject, setSubject] = useState(editing?.subject || "");
  const [type, setType] = useState(editing?.type || "study");
  const [dueDate, setDueDate] = useState(
    editing?.dueDate?.toDate ? editing.dueDate.toDate() : new Date()
  );
  const [notes, setNotes] = useState(editing?.notes || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveReminder = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in");
      navigation.replace("Login");
      return;
    }

    if (!title.trim()) {
      return Alert.alert("Error", "Title is required");
    }

    if (!subject.trim()) {
      return Alert.alert("Error", "Subject is required");
    }

    setLoading(true);
    try {
      const reminderData = {
        title: title.trim(),
        subject: subject.trim(),
        type: type,
        dueDate: Timestamp.fromDate(dueDate),
        notes: notes.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editing?.id) {
        await updateDoc(doc(db, "reminders", editing.id), reminderData);
        Alert.alert("Success", "Reminder updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        await addDoc(collection(db, "reminders"), {
          ...reminderData,
          completed: false,
          pinned: false,
          createdAt: serverTimestamp(),
          userId: auth.currentUser.uid
        });
        Alert.alert("Success", "Reminder created successfully", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      }
    } catch (err) {
      console.error("Error saving reminder:", err);
      Alert.alert("Error", "Could not save reminder. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>
            {editing ? "Edit Reminder" : "New Reminder"}
          </Text>

          {/* Type Selection */}
          <Text style={styles.label}>Type *</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'study' && styles.typeBtnActive]}
              onPress={() => setType('study')}
            >
              <Icon name="book" size={20} color={type === 'study' ? '#8b5cf6' : '#6b7280'} />
              <Text style={[styles.typeText, type === 'study' && styles.typeTextActive]}>
                Study Session
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, type === 'quiz' && styles.typeBtnActive]}
              onPress={() => setType('quiz')}
            >
              <Icon name="clipboard" size={20} color={type === 'quiz' ? '#ec4899' : '#6b7280'} />
              <Text style={[styles.typeText, type === 'quiz' && styles.typeTextActive]}>
                Quiz/Exam
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.label}>Title *</Text>
          <TextInput 
            placeholder="e.g., Study Calculus Chapter 3" 
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />

          {/* Subject */}
          <Text style={styles.label}>Subject *</Text>
          <TextInput 
            placeholder="e.g., Mathematics, Science, History" 
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            editable={!loading}
          />

          {/* Due Date */}
          <Text style={styles.label}>Due Date *</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            disabled={loading}
          >
            <Icon name="calendar-outline" size={20} color="#6b7280" />
            <Text style={styles.dateText}>
              {dueDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {/* Notes */}
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput 
            placeholder="Add any additional notes or topics to cover..."
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!loading}
          />

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.btn, loading && styles.btnDisabled]} 
            onPress={saveReminder}
            disabled={loading}
          >
            <Icon 
              name={editing ? "checkmark-circle" : "add-circle"} 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.btnText}>
              {loading ? "Saving..." : editing ? "Update Reminder" : "Create Reminder"}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelBtn} 
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf9f7"
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 16
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  typeBtnActive: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f3e8ff',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  typeTextActive: {
    color: '#8b5cf6',
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#e5e7eb", 
    padding: 14, 
    borderRadius: 12, 
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1f2937"
  },
  textArea: {
    height: 120,
    textAlignVertical: "top"
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  btn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: "#8b5cf6", 
    padding: 16, 
    borderRadius: 12, 
    marginTop: 32,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  btnDisabled: {
    backgroundColor: "#c4b5fd",
    shadowOpacity: 0.1
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16
  },
  cancelBtn: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff"
  },
  cancelBtnText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 16
  }
});