import { Pressable, Image, Text } from 'react-native'
import { MenuItem } from "@/type";
import {appwriteConfig} from "@/lib/appwrite";
import {useCartStore} from "@/store/cart.store";

const MenuCard = ({ item: { $id, image_url, name, price } }: { item: MenuItem }) => {
    let imageUrl = image_url;

    if (imageUrl && appwriteConfig.projectId && !/[?&]project=/.test(imageUrl)) {
        const joiner = imageUrl.includes('?') ? '&' : '?';
        imageUrl = `${imageUrl}${joiner}project=${appwriteConfig.projectId}`;
    }
    const { addItem } = useCartStore();

    return (
        <Pressable
          className="menu-card"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
            <Image source={{ uri: imageUrl }} className="w-32 h-32 rounded-2xl" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From RS.{price}</Text>
            <Pressable
              onPress={() => addItem({ id: $id, name, price, image_url: imageUrl, customizations: []})}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              className="px-4 py-2 rounded-full bg-primary/10"
              style={({ pressed }) => [{ transform: [{ scale: pressed ? 0.98 : 1 }] }]}
              accessibilityRole="button"
              accessibilityLabel={`Add ${name} to cart`}
            >
              <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </Pressable>
        </Pressable>
    )
}
export default MenuCard
