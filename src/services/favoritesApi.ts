import api from "./api.js"


// const addFavorites = (payload: any) => {
//     return api.post('favorites', payload)
// }

const favoritesSettings = (payload: any) => {
    return api.post('favorites', payload)
}



const favoritesDelete = (payload: any) => {
    return api.put('favorites', payload)
}



const getFavorites = () => {
     
    // let filter = [
    //     // {
    //     //     k: "user_code",
    //     //     o: "=",
    //     //     v: `${user_code}`
    //     // },
    //     // {
    //     //     k: "product_code",
    //     //     o: "!=",
    //     //     v: null // Null olmayan product_code değerlerini filtrele
    //     // }
    // ];

    return api.get('favorites?with[]=products&filter[]={"k":"product_code","o":"!=","v":null}&filter[]={"k":"seller_code","o":"=","v":null}&filter[]={"k":"is_deleted","o":"=","v":false}', {
        // params: {
        //     filter: JSON.stringify(filter)
        // }
    });
};






const getFavoritesSeller = async () => {
    // let filter = [
    //     {
    //         k: "search",
    //         o: "=",
    //         v: null
    //     },
    //     {
    //         k: "is_deleted",
    //         o: "=",
    //         v: false
    //     }
    // ]
    return api.get(`favorites?with[]=seller&filter[]={"k":"search","o":"=","v":null}&filter[]={"k":"product_code","o":"=","v":null}`, {
        // params: {
        //     filter: JSON.stringify(filter)
        // }
    })

}

const getFavoriteSearch = async () => {
    const filter = [
        { k: "search", o: "!=", v: null },
        { k: "is_deleted", o: "=", v: false },
    ];

    // Filtreyi URL için uygun formata çeviriyoruz
    const filterParams = filter.map(f => 
        `filter[]=${encodeURIComponent(JSON.stringify(f))}`
    ).join("&");

    return api.get(`favorites?${filterParams}`, {});
};







export default {
    favoritesSettings,
    getFavorites,
    getFavoritesSeller,
    getFavoriteSearch,
    favoritesDelete
}