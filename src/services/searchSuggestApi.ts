import { AnyFn } from "@vueuse/core"
import api from "./api.js"
import { ref } from "vue"



const getSuggest = () => {
    return api.get(`search-suggest`, {

    })
}


const getSearchData = (payload: any) => {
    return api.post(`search?filter[]={\"k\":\"is_deleted\",\"o\":\"=\",\"v\":false}`, payload)
}


// const searchFilterData = async (payload: any) => {
//     const citynum = ref<string[]>([]);

//     Seçilen şehirleri citynum'a ekliyoruz
//     payload.selectedCity.forEach((element: any) => {
//         citynum.value.push(element.toString());
//     });

//     URL'yi oluşturuyoruz
//     let url = 'https://ap1.takasimo.com/api/search?';

//     Eğer citynum array'i en az bir eleman içeriyorsa
//     if (citynum.value.length >= 1) {
//         const cityFilter = `filter[]={\"k\":\"city\",\"o\":\"=\",\"v\":\"${citynum.value[0]}\"}`;
//         const deletedFilter = `&filter[]={\"k\":\"is_deleted\",\"o\":\"=\",\"v\":false}`;
//         url += cityFilter + deletedFilter; // Filtreleri ekliyoruz
//     }

//     Gövdeyi oluşturuyoruz
//     const raw = JSON.stringify({
//         q: payload.q
//     });

//     const requestOptions = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json" // İçerik tipini ayarlıyoruz
//         },
//         body: raw
//     };

//     try {
//         const response = await fetch(url, requestOptions);
//         const result = await response.json(); // Yanıtı JSON olarak al
//         return result; // Sonucu döndürüyoruz
//     } catch (error) {
//         console.error(error);
//         throw error; // Hata durumunda hatayı döndürüyoruz
//     }
// };


const searchFilterData = async (payload: any) => {
    const citynum = ref<string[]>([]);

    // Seçilen şehirleri citynum'a ekliyoruz
    payload.selectedCity.forEach((element: any) => {
        citynum.value.push(element.toString());
    });

    // URL'yi oluşturuyoruz
    let url = 'https://ap1.takasimo.com/api/search?';

    // Filtre parçalarını tutacak bir dizi
    const filters: string[] = [];

    // Eğer citynum array'i en az bir eleman içeriyorsa
    if (citynum.value.length >= 1) {
        const cityFilter = `filter[]={\"k\":\"city\",\"o\":\"=\",\"v\":\"${citynum.value[0]}\"}`;
        filters.push(cityFilter);
    }

    // is_deleted filtresini ekliyoruz
    const deletedFilter = `filter[]={\"k\":\"is_deleted\",\"o\":\"=\",\"v\":false}`;
    filters.push(deletedFilter);

    // Eğer payload.dateSort varsa created_at filtresini ekliyoruz
    if (payload.dateSort) {
        const dateFilter = `orderBy[]={\"k\":\"created_at\",\"o\":\"=\",\"v\":\"${payload.dateSort}\"}`;
        filters.push(dateFilter);
    }

    // price sıralaması için orderBy filtresini ekliyoruz
    const priceFilter = `orderBy[]={\"k\":\"price\",\"o\":\"=\",\"v\":\"${payload.priceSort}\"}`;
    filters.push(priceFilter);

    // priceRange filtrelerini ekliyoruz
    if (payload.priceRange && payload.priceRange.min >= 0 && payload.priceRange.max > 0) {
        const minPriceFilter = `filter[]={\"k\":\"price\",\"o\":\">=\",\"v\":${payload.priceRange.min}}`;
        const maxPriceFilter = `filter[]={\"k\":\"price\",\"o\":\"<=\",\"v\":${payload.priceRange.max}}`;
        filters.push(minPriceFilter);
        filters.push(maxPriceFilter);
    }

    // Filtreleri URL'ye ekliyoruz
    if (filters.length > 0) {
        url += filters.join('&');
    }

    // Gövdeyi oluşturuyoruz
    const raw = JSON.stringify({
        q: payload.q
    });

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // İçerik tipini ayarlıyoruz
        },
        body: raw
    };

    try {
        const response = await fetch(url, requestOptions);
        const result = await response.json(); // Yanıtı JSON olarak al
        return result; // Sonucu döndürüyoruz
    } catch (error) {
        console.error(error);
        throw error; // Hata durumunda hatayı döndürüyoruz
    }
};












export default {
    getSuggest,
    getSearchData,
    searchFilterData

}
