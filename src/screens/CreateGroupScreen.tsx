import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/api';
import { User } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { isValidEmail } from '../utils/helpers';

export const CreateGroupScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [groupName, setGroupName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [errors, setErrors] = useState({ groupName: '', memberEmail: '' });

  const validateGroupName = (): boolean => {
    if (!groupName.trim()) {
      setErrors((prev) => ({ ...prev, groupName: 'Group name is required' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, groupName: '' }));
    return true;
  };

  const handleSearchMember = async () => {
    if (!memberEmail.trim()) {
      setErrors((prev) => ({ ...prev, memberEmail: 'Email is required' }));
      return;
    }

    if (!isValidEmail(memberEmail)) {
      setErrors((prev) => ({ ...prev, memberEmail: 'Invalid email format' }));
      return;
    }

    setErrors((prev) => ({ ...prev, memberEmail: '' }));

    try {
      setIsSearching(true);
      const response = await api.searchUsers(memberEmail);
      const users = response.data?.users || [];

      if (users.length === 0) {
        Alert.alert('Not Found', 'No user found with this email');
        return;
      }

      setSearchResults(users);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddMember = (user: User) => {
    // Check if already added
    if (members.some((m) => m.id === user.id)) {
      Alert.alert('Already Added', 'This member is already in the group');
      return;
    }

    setMembers([...members, user]);
    setMemberEmail('');
    setSearchResults([]);
  };

  const handleRemoveMember = (userId: string) => {
    setMembers(members.filter((m) => m.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!validateGroupName()) {
      return;
    }

    try {
      setIsCreating(true);

      // Create group
      const groupResponse = await api.createGroup(groupName);
      const group = groupResponse.data?.group;

      if (!group) {
        throw new Error('Failed to create group');
      }

      // Add members
      for (const member of members) {
        try {
          await api.addMember(group._id, member.email);
        } catch (error) {
          console.error(`Failed to add member ${member.email}:`, error);
        }
      }

      Alert.alert('Success', 'Group created successfully', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
            // Optionally navigate to the new group
            // navigation.navigate('GroupDashboard', { groupId: group._id });
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to create group');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Group Name */}
        <Input
          label="Group Name"
          placeholder="e.g., Trip to Goa, Roommates, Office Team"
          value={groupName}
          onChangeText={setGroupName}
          error={errors.groupName}
          onBlur={validateGroupName}
        />

        {/* Add Members Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Add Members
        </Text>

        <View style={styles.searchContainer}>
          <Input
            placeholder="Enter member's email"
            value={memberEmail}
            onChangeText={setMemberEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.memberEmail}
            containerStyle={{ flex: 1, marginBottom: 0 }}
          />
          <Button
            title="Search"
            onPress={handleSearchMember}
            loading={isSearching}
            size="medium"
            style={styles.searchButton}
          />
        </View>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card style={styles.searchResults}>
            {searchResults.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.searchResultItem}
                onPress={() => handleAddMember(user)}
              >
                <Avatar name={user.name} imageUrl={user.avatar} size={40} />
                <View style={styles.searchResultInfo}>
                  <Text style={[styles.searchResultName, { color: colors.text }]}>
                    {user.name}
                  </Text>
                  <Text style={[styles.searchResultEmail, { color: colors.textSecondary }]}>
                    {user.email}
                  </Text>
                </View>
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Members List */}
        {members.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Members ({members.length})
            </Text>
            {members.map((member) => (
              <Card key={member.id} style={styles.memberCard}>
                <Avatar name={member.name} imageUrl={member.avatar} size={40} />
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { color: colors.text }]}>
                    {member.name}
                  </Text>
                  <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>
                    {member.email}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleRemoveMember(member.id)}>
                  <Ionicons name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </Card>
            ))}
          </>
        )}

        {/* Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            You can add more members later. You'll be automatically added as a member.
          </Text>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          title="Create Group"
          onPress={handleCreateGroup}
          loading={isCreating}
          fullWidth
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  searchButton: {
    marginTop: 28, // Align with input (label height + spacing)
  },
  searchResults: {
    marginTop: SPACING.md,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  searchResultName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  searchResultEmail: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  memberInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  memberName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
  },
  memberEmail: {
    fontSize: FONT_SIZES.sm,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
});
