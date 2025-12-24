import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

export const ProfileScreen: React.FC = () => {
  const { logout, user } = useAuth();
  const { colors } = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Avatar
          name={user?.name || ''}
          imageUrl={user?.avatar}
          size={100}
        />
        <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
      </View>

      <View style={styles.content}>
        <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Info</Text>
            <View style={styles.row}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Member Since</Text>
                <Text style={[styles.value, { color: colors.text }]}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
            </View>
        </Card>

        <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: SPACING.xxl,
  },
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: SPACING.md,
  },
  email: {
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.md,
  },
  value: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  logoutButton: {
    marginTop: SPACING.xl,
    borderColor: '#EF4444', // Red color for danger action
  },
});
