import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { CustomHeaderProps } from "@/type";
import {images} from "@/constants";

const CustomHeader = ({ title }: CustomHeaderProps) => {
    const router = useRouter();

    return (
        <View className="custom-header">
            <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
                <Image
                    source={images.arrowBack}
                    className="size-5"
                    resizeMode="contain"
                />
            </TouchableOpacity>

            {title && <Text className="base-semibold text-dark-100">{title}</Text>}

            <TouchableOpacity onPress={() => router.push('/search')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} activeOpacity={0.7}>
                <Image source={images.search} className="size-5" resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

export default CustomHeader;
