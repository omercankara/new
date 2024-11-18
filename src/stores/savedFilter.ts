import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useFilterStore = defineStore("filterStore", () => {
    const filter = useStorage('filter', {
        categoryCode: "",
        dateSort: "",
        priceRange: { min: 0, max: 0 },
        priceSort: "",
        selectedCity: [] as string[],
        swap: false // swap varsayılan olarak boolean bir değer
    });

    const setFilter = (newFilter: Partial<typeof filter.value>) => {
        filter.value = { ...filter.value, ...newFilter };
    };

    return {
        filter,
        setFilter
    };
});
