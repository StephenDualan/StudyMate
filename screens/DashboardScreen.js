// screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    
    if (!user) {
      setLoading(false);
      navigation.replace('Login');
      return;
    }

    setLoading(true);
    
    const remindersRef = collection(db, 'reminders');
    const q = query(
      remindersRef,
      where('userId', '==', user.uid),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReminders(items);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching reminders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const confirmDelete = (id) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'reminders', id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const togglePin = async (item) => {
    if (!item) return;
    try {
      await updateDoc(doc(db, 'reminders', item.id), { 
        pinned: !item.pinned 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to pin reminder');
    }
  };

  const toggleCompleted = async (item) => {
    if (!item) return;
    try {
      await updateDoc(doc(db, 'reminders', item.id), { 
        completed: !item.completed 
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update reminder');
    }
  };

  const filtered = reminders.filter(r => {
    const matchesSearch = 
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.notes?.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === 'all' || r.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const sorted = filtered.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    const dateA = a.dueDate?.toDate ? a.dueDate.toDate() : new Date(a.dueDate);
    const dateB = b.dueDate?.toDate ? b.dueDate.toDate() : new Date(b.dueDate);
    return dateA - dateB;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'study': return 'book';
      case 'quiz': return 'clipboard';
      default: return 'bookmark';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'study': return '#8b5cf6';
      case 'quiz': return '#ec4899';
      default: return '#6366f1';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    const d = date.toDate ? date.toDate() : new Date(date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  };

  const isOverdue = (date) => {
    if (!date) return false;
    const d = date.toDate ? date.toDate() : new Date(date);
    return d < new Date() && !reminders.find(r => r.dueDate === date)?.completed;
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;
    const overdue = isOverdue(item.dueDate);
    
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setExpandedId(isExpanded ? null : item.id)}
      >
        <View
          style={[
            styles.card,
            item.pinned && styles.pinnedCard,
            item.completed && styles.completedCard,
            overdue && styles.overdueCard
          ]}
        >
          {item.pinned && (
            <View style={styles.pinnedBadge}>
              <Icon name="bookmark" size={12} color="#d97706" />
              <Text style={styles.pinnedText}>Pinned</Text>
            </View>
          )}

          {overdue && !item.completed && (
            <View style={[styles.pinnedBadge, { backgroundColor: 'rgba(239, 68, 68, 0.15)', top: item.pinned ? 36 : 8 }]}>
              <Icon name="warning" size={12} color="#dc2626" />
              <Text style={[styles.pinnedText, { color: '#dc2626' }]}>Overdue</Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <TouchableOpacity 
                onPress={() => toggleCompleted(item)} 
                style={styles.checkbox}
              >
                <Icon
                  name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={26}
                  color={item.completed ? '#10b981' : getTypeColor(item.type)}
                />
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <View style={styles.titleContainer}>
                  <Icon 
                    name={getTypeIcon(item.type)} 
                    size={16} 
                    color={getTypeColor(item.type)} 
                  />
                  <Text 
                    style={[
                      styles.title,
                      item.completed && styles.titleCompleted
                    ]}
                  >
                    {item.title || 'Untitled'}
                  </Text>
                </View>

                {item.subject && (
                  <Text style={styles.subject}>{item.subject}</Text>
                )}

                <View style={styles.dateRow}>
                  <Icon name="calendar-outline" size={14} color="#6b7280" />
                  <Text style={[styles.dateText, overdue && !item.completed && styles.overdueText]}>
                    {formatDate(item.dueDate)}
                  </Text>
                </View>
              </View>
            </View>
            
            {isExpanded && item.notes && (
              <View style={styles.notesContainer}>
                <Icon name="document-text-outline" size={16} color="#6b7280" />
                <Text style={styles.notes}>{item.notes}</Text>
              </View>
            )}

            <View style={styles.actionsBottom}>
              {item.completed ? (
                <TouchableOpacity 
                  onPress={() => confirmDelete(item.id)} 
                  style={[styles.actionButton, { flex: 1, justifyContent: 'center' }]}
                >
                  <Icon name="trash-outline" size={18} color="#ef4444" />
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity 
                    onPress={() => confirmDelete(item.id)} 
                    style={styles.actionButton}
                  >
                    <Icon name="trash-outline" size={18} color="#ef4444" />
                    <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                  </TouchableOpacity>

                  <View style={styles.actionDivider} />

                  <TouchableOpacity 
                    onPress={() => navigation.navigate('AddEdit', { reminder: item })} 
                    style={styles.actionButton}
                  >
                    <Icon name="create-outline" size={18} color="#6366f1" />
                    <Text style={[styles.actionText, { color: '#6366f1' }]}>Edit</Text>
                  </TouchableOpacity>

                  <View style={styles.actionDivider} />

                  <TouchableOpacity 
                    onPress={() => togglePin(item)} 
                    style={styles.actionButton}
                  >
                    <Icon
                      name={item.pinned ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={item.pinned ? '#d97706' : '#9ca3af'}
                    />
                    <Text style={[styles.actionText, { color: item.pinned ? '#d97706' : '#6b7280' }]}>
                      {item.pinned ? 'Pinned' : 'Pin'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <LinearGradient 
        colors={['#667eea', '#764ba2', '#f093fb']} 
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading reminders...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={['#667eea', '#764ba2', '#f093fb']} 
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>📚 Study Time!</Text>
        <Text style={styles.headerTitle}>My Reminders</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#6b7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search reminders..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close-circle" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity 
          onPress={() => setFilterType('all')} 
          style={[styles.filterBtn, filterType === 'all' && styles.filterBtnActive]}
        >
          <Icon name="apps" size={18} color={filterType === 'all' ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.filterText, filterType === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setFilterType('study')} 
          style={[styles.filterBtn, filterType === 'study' && styles.filterBtnActive]}
        >
          <Icon name="book" size={18} color={filterType === 'study' ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.filterText, filterType === 'study' && styles.filterTextActive]}>
            Study
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setFilterType('quiz')} 
          style={[styles.filterBtn, filterType === 'quiz' && styles.filterBtnActive]}
        >
          <Icon name="clipboard" size={18} color={filterType === 'quiz' ? '#8b5cf6' : '#6b7280'} />
          <Text style={[styles.filterText, filterType === 'quiz' && styles.filterTextActive]}>
            Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {sorted.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Icon name="book-outline" size={80} color="#8b5cf6" />
            <Text style={styles.emptyText}>No reminders yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first study reminder
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AddEdit')}
      >
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600'
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  search: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  filterBtnActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#8b5cf6',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pinnedCard: {
    borderWidth: 2,
    borderColor: '#d97706',
  },
  completedCard: {
    opacity: 0.7,
  },
  overdueCard: {
    borderWidth: 2,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },
  pinnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 119, 6, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 1,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#d97706',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  subject: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    color: '#6b7280',
  },
  overdueText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginLeft: 38,
    gap: 8,
  },
  notes: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
  },
  actionsBottom: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});