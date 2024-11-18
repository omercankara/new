<template>
    <ion-page>
        <Header showSearchBar />
        <ion-content class="ion-padding">
            <ion-refresher slot="fixed" @ionRefresh="refreshPage">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <!-- Slider İçeriği -->
            <template v-if="sliderLoading">
                <ion-skeleton-text class="slider-loading" :animated="true" />
            </template>
            <template v-else>
                <swiper class="m-b-5">
                    <swiper-slide>
                        <img src="../assets/banner/1.png" class="swiper-slide-image">
                    </swiper-slide>
                    <swiper-slide @click="router.push('/categories')">
                        <img src="../assets/banner/1.png" class="swiper-slide-image">
                    </swiper-slide>
                </swiper>
            </template>

            <!-- Reklam Alanı -->
            <div id="reklam-alani-1">
                <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9004566245372248"
                    data-ad-slot="2083473597" data-ad-format="auto"></ins>
            </div>

            <!-- Ürün Kartları -->
            <div class="products-wrapper m-t-10">
                <template v-if="productsLoading">
                    <ProductCardLoading />
                    <ProductCardLoading />
                    <ProductCardLoading />
                </template>
                <template v-else>
                    <template v-for="(product, productKey) in products" :key="productKey">
                        <ProductCard :product="product" />

                    </template>

                </template>

                <div id="reklam-alani-1">
                    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9004566245372248"
                        data-ad-slot="2083473597" data-ad-format="auto"></ins>
                </div>

                <!-- İkinci Reklam Alanı -->
                <div id="reklam-alani-2">
                    <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9004566245372248"
                        data-ad-slot="5487360549" data-ad-format="auto"></ins>
                </div>
            </div>

            <!-- Sonsuz Kaydırma -->
            <ion-infinite-scroll @ionInfinite="getMoreProduct">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        </ion-content>
    </ion-page>
</template>


<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, IonButton, IonRefresher, IonRefresherContent, IonModal, IonLabel, IonSkeletonText } from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FetchMessageList } from "../../../helpers/messageCount"
import notification from "@/services/notification";

import { useAuthStore } from "@/stores/authStore";

import { useMessageStore } from "@/stores/messageStore";
import { useProductsStore } from "@/stores/productsStore";
import { useDopingStore } from "@/stores/dopingStore";
import { useNotificationStore } from "@/stores/notificationCount";
const store = useAuthStore();
const productStore = useProductsStore();
const dopingStore = useDopingStore();
const messageCountstore = useMessageStore()
const notificationStore = useNotificationStore()


import { useBreadCrumbStore } from "@/stores/breadCrumb";
//BreadCrumb store
const BreadCrumb = useBreadCrumbStore()

import messageCount from "@/services/messageCount";

// CSS
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';

// Components
import Header from "@/components/Header.vue";
import ProductCard from "@/modules/product/components/ProductCard.vue";
import ProductCardLoading from "@/modules/product/components/ProductCardLoading.vue";


import { useRoute, useRouter } from 'vue-router';
const route = useRoute();

// Services
import productApi from "@/services/productApi";
import sliderApi from "@/services/sliderApi";

// Other
import router from "@/router";
import messageApi from "@/services/messageApi";


// Data
const currentPage = ref<number>(1);
const totalPage = ref<number>(1);

const sliders = ref<any[]>([]);
const sliderLoading = ref<boolean>(false);

const products = ref<any[]>([]);
const productsLoading = ref<boolean>(false);

// Functions
const getSliders = () => {
    sliderLoading.value = true;
    sliders.value = [];
    return sliderApi.homepageSlider('1')
        .then((res: any) => {
            const responseData: any[] = res?.data ?? null;
            //  console.log(responseData)
        })
        .finally(() => {
            setTimeout(() => {
                sliderLoading.value = false;
            }, 1000)

        })
}
// const getProducts = (page: number = 1) => {
//     // İlk sayfa yükleniyorsa, mevcut ürünleri temizle
//     if (page === 1) {
//         products.value = [];
//     }
//     productsLoading.value = true;

//     // Daha fazla ürün al
//     return productApi.getMoreProduct(page)
//         .then((res: any) => {
//             const responseData: any = res?.data ?? null;

//             if (responseData?.data?.length > 0) {
//                 // Yeni ürünleri mevcut ürünlerle karşılaştırarak ekle
//                 const newProducts = responseData.data.filter(
//                     (newProduct: any) => !products.value.some(
//                         (existingProduct: any) => existingProduct.product_code === newProduct.product_code
//                     )
//                 );

//                 // Sadece yeni ürünleri ekle
//                 products.value = [
//                     ...products.value,
//                     ...newProducts
//                 ];
//             }

//             console.log(responseData);
//             currentPage.value = responseData?.current_page ?? 1;
//             totalPage.value = responseData?.last_page ?? 1;
//         })
//         .then(() => {
//             return productApi.getProductDopingShowcase();
//         })
//         .then((res: any) => {
//             console.log("test", res);

//             const newProducts = res.data || [];
//             const existingProducts = products.value || [];

//             // Mevcut ürünlerden tekrar edenleri filtrele
//             const filteredExistingProducts = existingProducts.filter(existingProduct =>
//                 !newProducts.some((newProduct: { product_code: any; }) => newProduct.product_code === existingProduct.product_code)
//             );

//             // Yeni ürünleri en başa ekle
//             products.value = [
//                 ...newProducts,
//                 ...filteredExistingProducts
//             ];

//             console.log("sdf", products.value);
//         })

//         .finally(() => {
//             productsLoading.value = false;
//         });
// }


const getProducts = (page: number = 1) => {
    // İlk sayfa yükleniyorsa, mevcut ürünleri temizle
    if (page === 1) {
        products.value = [];
    }
    productsLoading.value = true;

    // Daha fazla ürün al
    return productApi.getMoreProduct(page)
        .then((res: any) => {
            const responseData: any = res?.data ?? null;

            if (responseData?.data?.length > 0) {
                // Yeni ürünleri mevcut ürünlerle karşılaştırarak ekle
                const newProducts = responseData.data.filter((newProduct: any) =>
                    !products.value.some((existingProduct: any) =>
                        existingProduct.product_code === newProduct.product_code
                    )
                );

                // Sadece yeni ürünleri ekle
                products.value = [
                    ...products.value,
                    ...newProducts
                ];
            }

            console.log(responseData);
            currentPage.value = responseData?.current_page ?? 1;
            totalPage.value = responseData?.last_page ?? 1;
        })
        .then(() => {
            return productApi.getProductDopingShowcase();
        })
        .then((res: any) => {
            console.log("test", res);

            const newProducts = res.data || [];
            const existingProducts = products.value || [];

            // Mevcut ürünlerden tekrar edenleri filtrele
            const filteredExistingProducts = existingProducts.filter(existingProduct =>
                !newProducts.some((newProduct: { product_code: any; }) =>
                    newProduct.product_code === existingProduct.product_code
                )
            );

            // Yeni ürünleri en başa ekle
            products.value = [
                ...newProducts,
                ...filteredExistingProducts
            ];

            console.log("sdf", products.value);
        })
        .finally(() => {
            productsLoading.value = false;
        });
}



const goToProductList = () => {
    let item = localStorage.getItem('lastCreatedProduct');

    // item boşsa kontrol et
    if (item) {
        let product = JSON.parse(item); // item'ı nesneye çevir
        console.log(product);

        // Ürün kodunu kullanarak yönlendirme
        router.push({ name: 'doping-select-plan', params: { code: product.product_code } });
        isFirstModalOpen.value = false;
        localStorage.removeItem('lastCreatedProduct');
    } else {
        console.log('No product found in localStorage');
    }
}



const refreshPage = (event: any) => {
    getSliders();
    currentPage.value = 1;
    getProducts(currentPage.value)
        .then(() => {
            event.target.complete();
        })
}
// const getMoreProduct = (event: any) => {
//     if (currentPage.value < totalPage.value) {
//         currentPage.value += 1;
//         getProducts(currentPage.value)
//             .finally(() => {
//                 event.target.complete();
//             })
//     }
//     else {
//         setTimeout(() => {
//             event.target.complete();
//         }, 1000);
//     }
// }

const getMoreProduct = (event: any) => {
    if (currentPage.value < totalPage.value) {
        currentPage.value += 1;
        getProducts(currentPage.value)
            .finally(() => {
                event.target.complete();
            })
    }
    else {
        setTimeout(() => {
            event.target.complete();
        }, 1000);
    }
}

const goToProductDetail = (id: number) => {
    router.push(`/product-detail/${id}`);
}


watch(() => route.path, (newPath) => {
    // meProduct.value = [];
    // targetProduct.value = [];
    if (newPath === '/home') {
        getProducts(currentPage.value)
        // FetchMessageList()
        // FetchMessageList().then(() => {
        //     console.log("Mesaj listesi başarıyla alındı.");
        // }).catch(error => {
        //     console.error("Mesaj listesi alınırken hata oluştu:", error);
        // });

        if (localStorage.getItem('success-alert')) {
            setTimeout(() => {
                isFirstModalOpen.value = true;
                localStorage.removeItem('success-alert');
            }, 1500);
        }

        BreadCrumb.breadCrumbs = []
    }
});


const firstModal = ref<HTMLIonModalElement | null>(null);
const isFirstModalOpen = ref<boolean>(false);
const onFirstModalDismiss = () => {
    isFirstModalOpen.value = false;
}

const closeFirstModal = () => {
    isFirstModalOpen.value = false;
}


// On Mounted
onMounted(() => {

    messageCount.getMessageLength().then((res) => {
        console.log("mesaj sayısı", res.data)

        useMessageStore().setMessageCount(res.data)
        console.log(res.data)
    })

    setInterval(() => {
        messageCount.getMessageLength().then((res) => {
            console.log("mesaj sayısı", res.data)

            useMessageStore().setMessageCount(res.data)
            console.log(res.data)
        })
    }, 30000)



    notification.getNotificationCount().then((res) => {
        console.log("Bildirim", res.data)
        
        useNotificationStore().setNotificationsCount(res.data)
    })







    getProducts(currentPage.value)

    if ((window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }

    if (localStorage.getItem('success-alert')) {
        setTimeout(() => {
            isFirstModalOpen.value = true;
            localStorage.removeItem('success-alert');
        }, 1500);
    }


    // Script yüklendikten sonra reklamı tetikleme


    if (localStorage.getItem('success-alert')) {
        setTimeout(() => {
            isFirstModalOpen.value = true;

            // İşlem bitiminde localStorage'daki veriyi sıfırla
            localStorage.removeItem('success-alert');
        }, 1500);
    }
    BreadCrumb.breadCrumbs = []
    getSliders()

    // setInterval(() => {
    //     FetchMessageList().then(() => {
    //         console.log("Mesaj listesi başarıyla alındı.");
    //     }).catch(error => {
    //         console.error("Mesaj listesi alınırken hata oluştu:", error);
    //     });
    // }, 1500)
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

ion-modal#product-detail-modal-alert {
    --width: 350px;
    --height: fit-content;
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 0px 0px 0px 0px;

        .modal-close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 20003;
            cursor: pointer;
            height: 32px;
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .label1 {
            font-size: 14px;
            font-family: var(--font-medium), sans-serif;
            text-align: center;
            line-height: 18px;
            margin-bottom: 10px;
        }

        .label2 {
            font-size: 18px;
            font-family: var(--font-bold), sans-serif;
            margin-bottom: 20px;
            text-align: center;
        }

        ion-button {
            --background: #901B6A;
            color: white;
            margin-bottom: 20px;
            --padding-top: 10px;
            --padding-bottom: 10px;
            --padding-start: 60px;
            --padding-end: 60px;
            --border-radius: 10px;
            --box-shadow: none;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
        }
    }
}
</style>