import {View, Text, FlatList, Image} from 'react-native'
import React from 'react'
import {SafeAreaView} from "react-native-safe-area-context";
import {useCartStore} from "@/store/cart.store";
import CustomHeader from "@/Components/CustomHeader";
import cn from "clsx";
import CustomButton from "@/Components/CustomButton";
import {PaymentInfoStripeProps} from "@/type";
import CartItem from "@/Components/CartItem";
import { images } from "@/constants";
import { router } from "expo-router";

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const Cart = () => {
    const { items, getTotalItems, getTotalPrice } = useCartStore();

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    return (
        <SafeAreaView className="bg-white h-full">
            <FlatList
                data={items}
                renderItem={({ item }) => <CartItem item={item}/>}
                keyExtractor={(item) => item.id}
                contentContainerClassName="pb-28 px-5 pt-5"
                ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
                ListEmptyComponent={() => (
                    <View className="items-center justify-center mt-10 gap-4">
                        <Image source={images.emptyState} className="w-48 h-48" resizeMode="contain" />
                        <Text className="h3-bold text-dark-100">Your cart is empty</Text>
                        <Text className="text-gray-400 body-regular text-center">Browse our menu and add some delicious items!</Text>
                        <CustomButton title="Browse Menu" onPress={() => router.push('/')} />
                    </View>
                )}
                ListFooterComponent={() => totalItems > 0 && (
                    <View className="gap-5">
                        <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                           <Text className="h3-bold text-dark-100 mb-5">
                              Payment Summary
                           </Text>

                           <PaymentInfoStripe
                               label={`Total Items (${totalItems})`}
                               value={`RS. ${totalPrice.toFixed(2)}`}
                           />
                            <PaymentInfoStripe
                                label={`Delivery Fee`}
                                value={`RS.50.00`}
                            />
                            <PaymentInfoStripe
                                label={`Discount`}
                                value={`RS.-10.00`}
                                valueStyle="!text-success"
                            />
                            <View className="border-t border-gray-300 my-2"/>
                            <PaymentInfoStripe
                                label={`Total`}
                                value={`RS. ${(totalPrice + 50 -10).toFixed(2)}`}
                                labelStyle="base-bold !text-dark-100"
                                valueStyle="base-bold !text-dark-100 !text-right"
                            />
                        </View>

                        <CustomButton title="Order Now" />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}
export default Cart
