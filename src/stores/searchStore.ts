import {defineStore} from "pinia"
import {useStorage} from "@vueuse/core";

export const useSearchStore = defineStore("searchStore", () => {
    const search = useStorage<string>('search-search', '');
    const searchSet = (value: string) => {
        search.value = value
    }

    const orderType = useStorage<string>('search-orderType', '');
    const orderTypeSet = (value: string) => {
        orderType.value = value
    }

    const category = useStorage<string>('search-category', '');
    const categorySet = (value: string) => {
        category.value = value
    }

    const viewType = useStorage<string>('search-viewType', 'cover');
    const viewTypeSet = (value: string) => {
        viewType.value = value
    }

    return {
        search,
        searchSet,

        orderType,
        orderTypeSet,

        category,
        categorySet,

        viewType,
        viewTypeSet
    }
})
