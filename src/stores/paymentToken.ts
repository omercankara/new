import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const usePaymentStore = defineStore("paymentStore", () => {
    // Use useStorage for persistent storage
    const createdProductDoping = useStorage<any>('createdProduct', {});
    const createdOrderByDoping = useStorage<any>('createdOrderBy', {});

    // Function to update createdProductDoping
    const setCreatedProductDoping = (value: any) => {
        createdProductDoping.value = value; 
    };

    // Function to update createdOrderByDoping
    const setCreatedOrderByDoping = (value: any) => {
        createdOrderByDoping.value = value;
    };

    return {
        createdProductDoping,
        setCreatedProductDoping,
        createdOrderByDoping,
        setCreatedOrderByDoping, // Return the function so it can be used outside
    };
});
