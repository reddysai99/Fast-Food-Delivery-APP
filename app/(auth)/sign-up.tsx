import {View, Text, Button} from 'react-native'
import React from 'react'
import {router} from "expo-router";

const SignUp = () => {
    return (
        <View>
            <Text>SignUp</Text>
            <Button title="Sign-up" onPress={() => router.push("/sign-In") } />
        </View>
    )
}
export default SignUp
