import { useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

interface Product {
    ad_no: string;
    [key: string]: any;
}

// Store tanımlaması
export const useSwapStore = defineStore('swapStore', () => {
    // İlk state: swap ürünleri
    const swap = useStorage<Product[]>('swap', []);
    const swapNotification = useStorage<any>('swapNotification', {});

    // swap state yönetim fonksiyonları
    const swapSet = (newProduct: Product) => {
        const existingProductIndex = swap.value.findIndex(product => product.ad_no === newProduct.ad_no);

        if (existingProductIndex !== -1) {
            //console.log(`Product with ad_no ${newProduct.ad_no} already exists in swap. Updating the product.`);
            // Ürünü güncelle
            swap.value[existingProductIndex] = newProduct;
        } else {
            //console.log(`Adding new product with ad_no ${newProduct.ad_no} to swap.`);
            // Ürünü ekle
            swap.value.push(newProduct);
        }
    };
    
    const setSwapNotification = (notification: any) => {
        swapNotification.value = notification;
    };

    const removeProduct = (ad_no: string) => {
        swap.value = swap.value.filter(product => product.ad_no !== ad_no);
        //console.log(`Removed product with ad_no ${ad_no} from swap.`);
    };

    const clearSwap = () => {
        swap.value = [];
    };

    interface ProductCodes {
        product_code: string;
        user_code?: string;
    }

    // İkinci state: targetSwap ürünleri
    const targetSwap = useStorage<ProductCodes[]>('targetSwap', []);

    // targetSwap state yönetim fonksiyonları
    const targetSwapSet = (productCodes: ProductCodes) => {
        const existingProductIndex = targetSwap.value.findIndex(product => product.product_code === productCodes.product_code);
        if (existingProductIndex === -1) {
         // console.log(`Adding new product_code ${productCodes.product_code} to targetSwap.`);
          targetSwap.value.push(productCodes);
        } else {
         // console.log(`Product_code ${productCodes.product_code} already exists in targetSwap.`);
        }
      };

    const clearTargetSwap = () => {
        targetSwap.value = [];
    };

    return {
        swap,
        swapSet,
        removeProduct,
        clearSwap,
        targetSwap,
        targetSwapSet,
        clearTargetSwap,
        swapNotification,
        setSwapNotification
    };
});
