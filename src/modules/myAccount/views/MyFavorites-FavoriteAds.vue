<template>
    <div>
        <ion-page>
            <ion-content class="ion-padding">
                <div class="products-wrapper m-t-15">
                    <template v-if="favoriteProductsLoading">
                        <ProductCardLoading />
                        <ProductCardLoading />
                        
                    </template>
                    <ion-card v-else v-for="(product, productKey) in favorites" :key="productKey"  @click="goToProductDetail(product.product_code)">
                               
                              
                        <img alt="Silhouette of mountains"
                            :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + product.showcase_image"
                            v-if="product && product.showcase_image" />
                        <img alt="No Image" v-else />
                        <ion-card-header>
                            <ion-card-title>{{ product?.name }}</ion-card-title>
                            <div class="ion-card-subtitles">
                                <ion-card-subtitle>Maltepe / Istanbul</ion-card-subtitle>
                                <ion-card-subtitle class="price" v-if="product && product.price">
                                    {{ moneyFormat(product.price, product.currency) }}
                                </ion-card-subtitle>
                            </div>
                        </ion-card-header>
                    </ion-card>
                </div>
            </ion-content>
        </ion-page>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent,IonCardTitle,IonCard,IonCardHeader,IonCardSubtitle, IonPage, IonRefresher, IonRefresherContent, IonSkeletonText } from '@ionic/vue';
import { moneyFormat } from "@/helpers/moneyHelpers";
import { useFilterStore } from '@/stores/savedFilter';
const savedFilter = useFilterStore();
// CSS
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

// Components
//import FavoriteCard from "./FavoriteCard.vue";
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
    favorites.value = []; // Önceki veriyi temizle

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
        savedFilter.setFilter({ categoryCode: "", dateSort: "", priceRange: { min: 0, max: 0 }, priceSort: "", selectedCity: [] as string[], swap: false });
        console.log("favoriler yenilendi")
        
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

ion-card {
    margin: 0;
    padding: 15px 15px 5px 15px;
    border-radius: 15px;
    background: var(--background-grey);
    box-shadow: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .deActive {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 100;
        background: var(--white);
        opacity: 0.6;
        top: 0;
        left: 0;
        border: 1px solid var(--primary-gray);
    }

    .deActiveText {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 101;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: var(--font-bold), sans-serif;
        font-size: 20px;
        color: var(--primary);
    }

  

    img {
        border-radius: 15px;
        width: 100%;
        height: 130px;
        object-fit: cover;
    }

    ion-card-header {
        padding: 0;

        ion-card-title {
            text-align: center;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
            margin-bottom: 1px;

            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;

        }

        ion-card-subtitle {
            margin-top: 0;
            margin-bottom: 1px;
            text-align: center;
            font-family: var(--font-medium), sans-serif;
            font-size: 14px;

            &.price {
                color: var(--black);
                font-family: var(--font-medium), sans-serif;
                font-size: 18px;
                margin-bottom: 0;
            }
        }
    }

    &.list {
        flex-direction: row;
        padding: 15px;

        img {
            width: 100px;
            height: 80px;
            object-fit: cover;
        }

        ion-card-header {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: start;

            ion-card-title {
                display: flex;
                align-items: center;
                font-size: 20px;
                flex-grow: 1;
                width: 100%;
            }

            .ion-card-subtitles {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 5px;
                width: 100%;

                ion-card-subtitle {
                    font-size: 14px;
                    font-family: var(--font-medium), sans-serif;

                    &.price {
                        color: var(--primary);
                        font-family: var(--font-bold), sans-serif;
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
}
</style>
