import {View, Text, Button, Alert} from 'react-native'
import React, {useState} from 'react'
import {Link, router} from "expo-router";
import CustomInput from "@/Components/CustomInput";
import CustomButton from "@/Components/CustomButton";


const SignIn = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({ email: '', password: ''});

    const submit = async () => {
        if(!form.email || !form.password) return Alert.alert('Error', 'Please Enter valid Email and Password')

        setIsSubmitting(true)

        try {
            // Call Appwrite Authentication Function

            Alert.alert('Success', 'User Signed in Successfully');
            router.push('/');
        } catch (error: any) {
            Alert.alert('Error' ,error.message);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <View className="gap-10 bg-white rounded-lg p-5 mt-5">
            <CustomInput
                placeholder="Enter your email"
                value={form.email}
                onChangeText={(text) => setForm( (prevState) => ({  ...prevState, email: text}))}
                label="Email"
                keyboardType="email-address"
            />
            <CustomInput
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(text) => setForm( (prevState) => ({  ...prevState, password: text}))}
                label="Password"
                secureTextEntry={true}
            />
            <CustomButton
            title="Sign In"
            isLoading={isSubmitting}
            onPress={submit}
            />

            <View className="flex justify-center mt-5 flex-row gap-2">
                <Text className="base-regular text-gray-100">
                    Still not Enjoying Life?
                </Text>
              <Link href= "/sign-up" className="base-bold text-primary">
               Sign Up
              </Link>
            </View>
        </View>
    )
}
export default SignIn

