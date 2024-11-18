<template>
    <ion-page>
        <ion-content class="ion-padding">
            <div class="products-wrapper m-t-15">
                <template v-if="favoriteProductsLoading">
                    <ProductCardLoading />
                    <ProductCardLoading />
                    
                </template>
                <template v-else>
                    <template v-for="(product, productKey) in favorites" :key="productKey">
                        <FavoriteCard :product="product" />
                    </template>
                </template>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText } from '@ionic/vue';

// CSS
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

// Components
import FavoriteCard from "./FavoriteCard.vue";
import ProductCardLoading from "@/modules/product/components/ProductCardLoading.vue";

import { useRoute, useRouter } from "vue-router";


const route = useRoute();
// Services
import favoritesApi from "@/services/favoritesApi";

// Other
import router from "@/router";

// Data
const favorites = ref<any[]>([]);
const favoriteProductsLoading = ref<boolean>(false);

// Functions
const getProducts = () => {
    favoriteProductsLoading.value = true; 
    let user_code = "13a79bbe-3f7d-4852-8bf8-52c6077efcbc";
    return favoritesApi.getFavorites()
        .then((res: any) => {
            let items = res.data.data;

            items.forEach((element: any) => {
                const productExists = favorites.value.some(
                    (favoriteProduct: any) => favoriteProduct.product_code === element.product_code
                );

                if (!productExists) {
                    favorites.value.push(element.products);
                }
            });
        })
        .catch((error: any) => {
            console.error('Bağlantı Hatasi:', error);
        })
        .finally(() => {
            favoriteProductsLoading.value = false;
        });
};


watch(() => route.fullPath, (newPath) => {
    if (newPath === '/my-favorites') {
        getProducts()
    }
}, { immediate: true });


const goToProductDetail = (id: number) => {
    router.push(`/product-detail/${id}`);
}

// On Mounted
onMounted(() => {
    getProducts()
   
})
</script>

<style lang="scss" scoped>
.swiper-slide-image {
    border-radius: 20px;
    cursor: pointer;
}

.slider-loading {
    border-radius: 20px;
    width: 100%;
    height: 140px;
}
</style>