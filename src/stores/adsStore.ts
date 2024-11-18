import { useStorage } from "@vueuse/core";
import productApi from "@/services/productApi";
import { defineStore } from "pinia";


export const useAdsStore = defineStore("productsStore", () => {
    const userAdsList = useStorage<any>('userAds', []);
    const setAds = (value: any) => {
        userAdsList.value = value
    }
    const getAds = async () => {
        if (userAdsList.value.length == 0) {
            await getProductsFromApi();
        }
        return userAdsList.value
    }

    const getProductsFromApi = () => {
        setAds([])
        return productApi.myProducts()
            .then((res: any) => {
                console.log(res);
                const data: any[] = res ?? []
                setAds(data)
            })  
    }    


    


    return {
        userAdsList,
        setAds,
        getAds
    }
})