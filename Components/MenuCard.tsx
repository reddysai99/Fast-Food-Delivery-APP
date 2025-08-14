import {TouchableOpacity, Image, Text, Platform,} from 'react-native'
import { MenuItem } from "@/type";
import {appwriteConfig} from "@/lib/appwrite";

const MenuCard = ({ item: { image_url, name, price } }: { item: MenuItem }) => {
    let imageUrl = image_url;

    if (imageUrl && appwriteConfig.projectId && !/[?&]project=/.test(imageUrl)) {
        const joiner = imageUrl.includes('?') ? '&' : '?';
        imageUrl = `${imageUrl}${joiner}project=${appwriteConfig.projectId}`;
    }

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? {elevation: 10, shadowColor: '#878787'}: {} }>
            <Image source={{ uri: imageUrl }} className="w-32 h-32" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From RS.{price}</Text>
            <TouchableOpacity onPress={() => {}}></TouchableOpacity>
            <Text className="paragraph-bold text-primary">Add to Cart +</Text>
        </TouchableOpacity>
    )
}
export default MenuCard
