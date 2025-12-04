import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function TaskItem({ item, onPress, onLongPress, onToggleDone }) {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={styles.box}>
      <View>
        <Text style={[styles.title, item.done && { textDecorationLine: "line-through" }]}>
          {item.title}
        </Text>
        {item.notes ? <Text style={styles.note}>{item.notes}</Text> : null}
      </View>

      <TouchableOpacity onPress={onToggleDone}>
        <Text style={{ fontSize: 16, color: "#555" }}>
          {item.done ? "☑" : "☐"}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "600" },
  note: { color: "#666", marginTop: 4 },
});
