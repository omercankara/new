import {defineStore} from "pinia"
import {useStorage} from "@vueuse/core";

export const useDopingStore = defineStore("dopingStore", () => {
    const selectedDopings = useStorage<any>('selected-dopings', []);
    const createdProductDoping = useStorage<any>('created-product', {});

    const setSelectedDopings = (value: any) => {
        selectedDopings.value = value
    }

    const setCreatedProductDoping = (value: any) => {
        createdProductDoping.value = value
    }


    return {
        selectedDopings,
        createdProductDoping,
        setSelectedDopings,
        setCreatedProductDoping
    }
})
