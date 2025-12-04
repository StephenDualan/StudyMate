import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DetailsScreen({ route }) {
  const { task } = route.params;

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.meta}>Done: {task.done ? "Yes" : "No"}</Text>
      {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700" },
  meta: { marginTop: 10, color: "#444" },
  notes: { marginTop: 14, lineHeight: 20 },
});
