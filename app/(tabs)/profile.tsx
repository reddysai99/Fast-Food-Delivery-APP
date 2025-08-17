import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View, Pressable, ActivityIndicator, Alert } from "react-native";
import React, { useState } from "react";
import useAuthStore from "@/store/auth.store";
import { images } from "@/constants";
import CustomButton from "@/Components/CustomButton";
import { router } from "expo-router";
import { logout as appwriteLogout, updateUserProfile, uploadImageFromUri } from "@/lib/appwrite";
import * as ImagePicker from "expo-image-picker";

const InfoRow = ({ icon, label, value }: { icon: any; label: string; value?: string }) => (
  <View className="flex-row items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3">
    <Image source={icon} className="w-5 h-5" resizeMode="contain" />
    <View>
      <Text className="text-gray-400 text-xs">{label}</Text>
      <Text className="text-dark-100 font-semibold">{value || "Not provided"}</Text>
    </View>
  </View>
);

const Profile = () => {
  const { user, setUser, setIsAuthenticated } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogout = async () => {
    try {
      await appwriteLogout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      router.replace("/sign-In");
    }
  };

  const onChangeAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Please allow photo library access to change your profile picture.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.9,
      });
      if ((result as any).canceled) return;
      const uri = (result as any).assets?.[0]?.uri;
      if (!uri || !user) return;
      setIsUploading(true);
      const { url } = await uploadImageFromUri(uri);
      const updated = await updateUserProfile({ documentId: user.$id, avatar: url });
      setUser(updated as any);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to update photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="px-5 py-6 gap-6">
        <View className="items-center gap-3">
          <Pressable onPress={onChangeAvatar} disabled={isUploading}>
            <View>
              <Image
                source={user?.avatar ? { uri: user.avatar } : images.avatar}
                className="w-24 h-24 rounded-full"
                resizeMode="cover"
              />
              {isUploading && (
                <View className="absolute inset-0 items-center justify-center bg-black/40 rounded-full">
                  <ActivityIndicator color="#fff" />
                </View>
              )}
            </View>
          </Pressable>
          <Text className="text-2xl font-bold text-dark-100">{user?.name || "Your Name"}</Text>
          <Text className="text-gray-400 text-xs">Tap photo to change</Text>
        </View>

        <View className="gap-4">
          <InfoRow icon={images.envelope} label="Email" value={user?.email} />
          <InfoRow icon={images.phone} label="Mobile" value={user?.mobile !== undefined ? String(user.mobile) : undefined} />
          <InfoRow icon={images.location} label="Address" value={(user as any)?.address} />
        </View>

        <View className="gap-4 mt-4">
          <CustomButton
            title="Edit Profile"
            leftIcon={<Image source={images.pencil} className="w-5 h-5 mr-2" resizeMode="contain" />}
            onPress={() => router.push("/edit-profile")}
          />
          <CustomButton
            title="Logout"
            leftIcon={<Image source={images.logout} className="w-5 h-5 mr-2" resizeMode="contain" />}
            style="bg-red-500"
            onPress={handleLogout}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
