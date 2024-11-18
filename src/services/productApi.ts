import axios from "axios";
import api from "./api.js"
import { ref } from "vue";
interface ProductCodeImage {
    product_code_images: string;
}






const getProductsFilterQuery = (page: number, payload: any) => {
    const citynum = ref<number[]>([]);
    const districtnum = ref<number[]>([]);
    payload.selectedCity.forEach((element: any) => {
        citynum.value.push(element)
    })
    payload.selectedDistrict.forEach((element: any) => {
        districtnum.value.push(element)
    })

    let filter = [
        `{"k": "category_code", "o": "=", "v": "${payload.categoryCode}"}`,
    ];

    let orderBy = []

    if (payload.swap !== "all" && payload.swap !== "") {
        filter.push(`{"k":"swap","o":"=","v":${payload.swap}}`);
    }

    if (citynum.value.length >= 1) {
        filter.push(`{"k": "city", "o": "in", "v": ${JSON.stringify(citynum.value)}}`);
    }
    if (districtnum.value.length >= 1) {
        filter.push(`{"k": "district", "o": "in", "v": ${JSON.stringify(districtnum.value)}}`);
    }

    if (payload.priceRange.min >= 0 && payload.priceRange.max > 0) {
        filter.push(`{"k": "price", "o": ">=", "v": ${payload.priceRange.min}}`);
        filter.push(`{"k": "price", "o": "<=", "v": ${payload.priceRange.max}}`);
    }

    if (payload.dateSort !== "") {
        orderBy.push(`{"k":"created_at","o":"=","v":"${payload.dateSort}"}`);
    }

    if (payload.priceSort !== "") {
        orderBy.push(`{"k":"price","o":"=","v":"${payload.priceSort}"}`);
    }

    return api.get(`products?page=${page}`, {
        params: {
            filter: filter,
            with: ['images', 'owner','city', 'district'],
            orderBy: orderBy
        }
    });
}

const getProductData = (page: number, category_code: string) => {
    let filter = [
        `{"k": "category_code", "o": "=", "v": "${category_code}"}`,
    ];

    // Varsayılan sıralama: created_at DESC
    let orderBy = [
        `{"k": "created_at", "o": "DESC", "v": ""}`
    ];

    return api.get(`products?page=${page}`, {
        params: {
            filter: filter,
            with: ['images', 'owner', 'city', 'district'],
            orderBy: orderBy
        }
    });
}


const myProducts = () => {

    return api.get('auth/list?with[]=products', {
        params: {
           
        }
    });
}

const deleteProduct = (payload: any) => {
    return api.put(`products`, payload)

}

const getAll = () => {
    return api.get('products', {
        params: {
            filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
            with: ["images"]
        }
    })
}

const getMoreProduct = (page: number) => {
    let orderBy = [];

    // Varsayılan sıralama: created_at ASC
    orderBy.push(`{"k":"created_at","v":"ASC"}`);
    return api.get(`products?page=${page}`, {
        params: {
            filter: [
                JSON.stringify({ k: "is_deleted", o: "=", v: false }),
                JSON.stringify({ k: "status", o: "=", v: true }) // Yeni filtre eklendi
            ],
            page: page,
            with: ['city', 'district', 'doping'],
            orderBy: orderBy
        }
    });
}


const get = (code: string) => {
    return api.get(`products/${code}`, {
        params: {
            filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
            with: ["images", "owner", "city", "district", "categories"]
        }
    })
}

const getImages = (code: string, product_code_images: ProductCodeImage[]) => {
    let filter = [
        '{"k": "is_deleted", "o": "=", "v": false}',
    ];

    product_code_images.forEach(element => {
        filter.push(`{"k": "product_code_images", "o": "=", "v": "${element.product_code_images}"}`);
    });

    return api.get(`product-images/${code}`, {
        params: {
            filter: filter
        }
    });
};

const create = (payload: any) => {
    return api.post('products', payload)
}

const productImageUpdate = (payload: any) => {
    return api.put('product-images', payload)
}

const productImageCreate = (payload: any) => {
    return api.post('cdn/multi', payload);
};


const productMultiImageCreate = (payload: any) => {
    return api.post('/product-images', payload)
}

//Mevcut kullanıcının ürünü
const getMeSingleProduct = async (payload: any) => {
    //console.log(payload.targetProductCode)

    try {
        // `targetProductCode`'u tek bir API çağrısı ile al
        const targetProductPromise = api.get(`products/${payload.targetProductCode}`, {
            params: {
                filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
                with: ["images", "owner","city","district","localities"]
            }
        });

        // `meProductCode` dizisindeki ürünler için API çağrıları yap
        const meProductCodes = payload.meProductCode;
        const meProductPromises = meProductCodes.map((productCode: any) =>
            api.get(`products/${productCode}`, {
                params: {
                    filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
                    with: ["images", "owner","city","district","localities"]
                }
            })
        );

        // Tüm API çağrılarını bekle
        const [targetProductResponse, ...meProductResponses] = await Promise.all([
            targetProductPromise,
            ...meProductPromises
        ]);

        // Sonuçları döndür
        return {
            targetProduct: targetProductResponse,
            meProducts: meProductResponses
        };
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}


//Karşı kullanıcının tüm ürünleri
const getOwnerProducts = (code: string) => {
    //console.log(code.value.value)
    // console.log(code)
    return api.get(`owner-products/${code}`, {
        params: {
           
            with: ["images", "owner","doping","city"]
        }
    })
}


const productUpdate = (payload: any) => {
    return api.put('products', payload)
}


const getProductDopingShowcase = () => {
    let doping_code = 'bc373717-1335-4672-8b5f-7ffc5624486e';
    return api.get('product-with-dopings', {
        params: {
            doping_code: doping_code,
            with: ["owner","city","district","doping"]
        }
    });
};


const getProductDopingCategory = () => {
    let doping_code = 'd3528188-c058-4863-ab7d-7319a0933ddb';
    return api.get('product-with-dopings', {
        params: {
            doping_code: doping_code,
            with: ["owner","city","district","doping"]
        }
    });
};

const getProductDopingEmergency = () => {
    let doping_code = 'bbc4f72a-a68b-45fa-be53-6d59e78dbce3';
    return api.get('product-with-dopings', {
        params: {
            doping_code: doping_code,
            with: ["owner","city","district","doping"]
        }
    }); 
};



export default {
    myProducts,
    getAll,
    get,
    getImages,
    create,
    productImageUpdate,
    productImageCreate,
    productMultiImageCreate,
    getMoreProduct,
    getProductData,
    getMeSingleProduct,
    getProductsFilterQuery,
    getOwnerProducts,
    deleteProduct,
    productUpdate,
    getProductDopingShowcase,
    getProductDopingCategory,
    getProductDopingEmergency
}
