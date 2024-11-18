import { useStorage } from "@vueuse/core";
import productApi from "@/services/productApi";
import { defineStore } from "pinia";

export const useProductsStore = defineStore("productsStore", () => {
    const productsList = useStorage<any>('products', []);
    const lastCreatedProduct = useStorage<any>('lastCreatedProduct', {});
    
    const setProducts = (value: any) => {
        productsList.value = value;
    }

    const setLastCreatedProduct = (product: any) => {
        lastCreatedProduct.value = product;
    }

    const getProducts = async () => {
        if (productsList.value.length == 0) {
            await getProductsFromApi();
        }
        return productsList.value;
    }

    const getProductsFromApi = () => {
        setProducts([]);
        return productApi.getAll()
            .then((res: any) => {
                const data: any[] = res?.data?.data ?? [];
                setProducts(data);
            });
    }

    return {
        productsList,
        lastCreatedProduct,
        setProducts,
        setLastCreatedProduct,
        getProducts
    }
});
