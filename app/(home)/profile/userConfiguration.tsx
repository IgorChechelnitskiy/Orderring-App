import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import * as ImagePicker from 'expo-image-picker';
import { useAppToast } from '@/hooks/use-app-toast';
import { router } from 'expo-router';

export default function UserScreen() {
  const { user } = useUser();
  const { theme, isDarkMode } = useThemeStore();
  const activeColors = Colors[theme];
  const { showToast } = useAppToast();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const onEditAvatar = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const pickerOptions: ImagePicker.ImagePickerOptions = {
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
    base64: true,
  };

  const uploadImage = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled && result.assets[0].base64) {
      try {
        setUploading(true);
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;

        await user?.setProfileImage({
          file: base64,
        });

        showToast('Profile picture updated!', 'success');
      } catch (err) {
        console.error(err);
        showToast('Failed to upload image', 'danger');
      } finally {
        setUploading(false);
        closeModal();
      }
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('We need camera access to take a photo.', 'danger');
      return;
    }

    const result = await ImagePicker.launchCameraAsync(pickerOptions);
    if (!result.canceled) {
      await uploadImage(result);
    }
  };

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!result.canceled) {
      setUploading(true);
      await uploadImage(result);
      setUploading(false);
    }
  };

  const handlePreview = () => {
    closeModal();
    setTimeout(() => {
      setIsPreviewVisible(true);
    }, 300);
  };

  const MenuRow = ({
    icon,
    title,
    iconColor,
    bgColor,
    rightElement,
    onPressAction,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    iconColor: string;
    bgColor?: string;
    rightElement?: React.ReactNode;
    onPressAction?: () => void;
  }) => (
    <Pressable
      style={({ pressed }) => [styles.menuRow, { opacity: pressed ? 0.7 : 1 }]}
      onPress={onPressAction}>
      <View style={[styles.iconContainer, { backgroundColor: bgColor || 'transparent' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      <ThemedText style={styles.menuTitle}>{title}</ThemedText>

      {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <Pressable style={styles.avatarWrapper} onPress={handlePreview}>
            {uploading ? (
              <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
            ) : (
              <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
            )}
          </Pressable>
          <Pressable
            onPress={onEditAvatar}
            style={({ pressed }) => [styles.changeAvatar, { opacity: pressed ? 0.7 : 1 }]}>
            <Ionicons name="person-outline" size={16} color={activeColors.link} />
            <ThemedText
              style={styles.changeAvatarText}
              lightColor={Colors.light.link}
              darkColor={Colors.dark.link}>
              Change avatar
            </ThemedText>
          </Pressable>

          <ThemedText style={styles.sectionLabel}>Profile</ThemedText>
          <View style={styles.sectionCard}>
            <MenuRow
              icon="create-outline"
              title={'Change Name'}
              iconColor="#5856D6"
              onPressAction={() => router.push('/profile/changeName')}
            />
            <MenuRow
              icon="create-outline"
              title={`Change Password`}
              iconColor="#5856D6"
              onPressAction={() => router.push('/profile/changePassword')}
            />
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: isDarkMode ? '#1A212E' : '#FFFFFF' },
                ]}>
                <View
                  style={[
                    styles.modalHandle,
                    { backgroundColor: isDarkMode ? '#2C3E50' : '#E0E0E0' },
                  ]}
                />

                <ThemedText style={styles.modalTitle}>Profile Photo</ThemedText>

                <Pressable style={styles.modalOption} onPress={handleTakePhoto}>
                  <Ionicons name="camera-outline" size={24} color={activeColors.tint} />
                  <ThemedText style={styles.modalOptionText}>Take a Photo</ThemedText>
                </Pressable>

                <Pressable style={styles.modalOption} onPress={handleChoosePhoto}>
                  <Ionicons name="image-outline" size={24} color={activeColors.tint} />
                  <ThemedText style={styles.modalOptionText}>Choose from Gallery</ThemedText>
                </Pressable>

                <Pressable style={styles.modalOption} onPress={handlePreview}>
                  <Ionicons name="eye-outline" size={24} color={activeColors.tint} />
                  <ThemedText style={styles.modalOptionText}>Preview Avatar</ThemedText>
                </Pressable>

                <Pressable style={[styles.modalOption, styles.cancelOption]} onPress={closeModal}>
                  <ThemedText style={styles.cancelText}>Cancel</ThemedText>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={isPreviewVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setIsPreviewVisible(false)}>
        <ThemedView style={styles.previewContainer}>
          <Pressable onPress={() => setIsPreviewVisible(false)} style={styles.closePreviewButton}>
            <Ionicons name="close" size={30} color="#FFFFFF" />
          </Pressable>
          <Image
            source={{ uri: user?.imageUrl }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <View style={styles.previewFooter}>
            <ThemedText style={styles.previewName}>{user?.fullName}</ThemedText>
          </View>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120,
    justifyContent: 'space-between',
  },
  mainContent: { width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  avatarWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 40 },
  changeAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  changeAvatarText: {
    fontSize: 15,
    fontWeight: '600',
  },
  joinedDate: { fontSize: 14, color: '#8E8E93', marginTop: 4 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: { marginBottom: 30 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: { flex: 1, fontSize: 16, fontWeight: '500' },
  separator: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 52, marginVertical: 4 },
  bottomContent: { marginTop: 20 },
  signOutButton: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  signOutText: { color: '#FF3B30', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 10,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 15,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelOption: {
    marginTop: 10,
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#8E8E93',
  },
  cancelText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closePreviewButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
  },
  previewImage: {
    width: '100%',
    height: '80%',
  },
  previewFooter: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
