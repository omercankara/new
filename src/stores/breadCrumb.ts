import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useBreadCrumbStore = defineStore("breadCrumbs", () => {
    // Başlangıç değeri her zaman [] olacak şekilde ayarlanıyor
    const breadCrumbs = useStorage<any>('selected-breadCrumbs', [], localStorage);
    const favoriteSearches = useStorage<any>('favorite-searches', [], localStorage);

    const setSelectedBreadCrumbs = (value: any) => {
        // Eğer değer zaten mevcut değilse ekle
        if (!breadCrumbs.value.includes(value)) {
            breadCrumbs.value.push(value);
        } else {
            console.log('Zaten mevcut :>> ', value);
        }
    };

    const handleGoToBack = () => {
        if (breadCrumbs.value.length > 0) {
            breadCrumbs.value = breadCrumbs.value.slice(0, -1);
        }
    };

    const addFavoriteSearch = (search: any) => {
        // Eğer arama zaten favorilerde yoksa ekle
        if (!favoriteSearches.value.includes(search)) {
            favoriteSearches.value.push(search);
        } else {
            console.log('Favori aramalarda zaten mevcut :>> ', search);
        }
    };

    const removeFavoriteSearch = (search: any) => {
        // Arama favorilerden çıkartılıyor
        favoriteSearches.value = favoriteSearches.value.filter((item: any) => item !== search);
    };
    
    return {
        breadCrumbs,
        favoriteSearches,
        setSelectedBreadCrumbs,
        handleGoToBack,
        addFavoriteSearch,
        removeFavoriteSearch
    };
});
