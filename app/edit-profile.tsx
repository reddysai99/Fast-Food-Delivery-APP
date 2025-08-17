import { View, Alert } from "react-native";
import React, { useState } from "react";
import CustomHeader from "@/Components/CustomHeader";
import CustomInput from "@/Components/CustomInput";
import CustomButton from "@/Components/CustomButton";
import useAuthStore from "@/store/auth.store";
import { updateUserProfile } from "@/lib/appwrite";
import { router } from "expo-router";

const EditProfile = () => {
  const { user, setUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: String((user as any)?.mobile ?? ""),
    address: (user as any)?.address || "",
  });

  const onSave = async () => {
    if (!form.name) {
      Alert.alert("Validation", "Full name is required");
      return;
    }

    // Sanitize and validate mobile as integer for Appwrite
    const digitsOnly = (form.mobile || '').replace(/\D/g, '');
    let mobileNumber: number | undefined = undefined;
    if (digitsOnly.length > 0) {
      const num = Number(digitsOnly);
      if (!Number.isSafeInteger(num)) {
        Alert.alert("Validation", "Mobile number must be digits only and within a valid range.");
        return;
      }
      mobileNumber = num;
    }

    setIsSubmitting(true);
    try {
      if (!user) throw new Error("No user found");
      const updated = await updateUserProfile({
        documentId: user.$id,
        name: form.name,
        mobile: mobileNumber,
        address: form.address?.trim() || undefined,
      });
      setUser(updated as any);
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="bg-white h-full">
      <View className="px-5 pt-5">
        <CustomHeader title="Edit Profile" />
      </View>

      <View className="px-5 mt-6 gap-6">
        <CustomInput
          label="Full Name"
          placeholder="Enter your full name"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        />
        <CustomInput
          label="Mobile Number"
          placeholder="Enter your mobile number"
          keyboardType="numeric"
          value={form.mobile}
          onChangeText={(text) => setForm((prev) => ({ ...prev, mobile: text.replace(/\D/g, '') }))}
        />
        <CustomInput
          label="Address"
          placeholder="Enter your address"
          value={form.address}
          onChangeText={(text) => setForm((prev) => ({ ...prev, address: text }))}
        />

        <CustomButton title="Save Changes" isLoading={isSubmitting} onPress={onSave} />
      </View>
    </View>
  );
};

export default EditProfile;
