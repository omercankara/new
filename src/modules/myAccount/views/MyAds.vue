<template>
    <ion-page>
        <Header />
        <ion-content class="ion-padding">
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>
            <div>
                <swiper class="m-b-5">
                    <swiper-slide>
                        <img src="../../home/assets/banner/1.png" class="swiper-slide-image">
                    </swiper-slide>
                    <swiper-slide>
                        <img src="../../home/assets/banner/1.png" class="swiper-slide-image">
                    </swiper-slide>
                </swiper>
            </div>
            <!-- <MyAccountHeader class="m-l-10 m-r-10" /> -->
            <PageHeader title="İlanlarım" style="margin-bottom: 10px;">
                <template #end-action>
                    <ion-button size="small" class="ion-text-wrap" shape="round" @click="adversimentPage()">
                        <ion-icon slot="start" :icon="add" />
                        <span>İlan Ekle</span>
                    </ion-button>
                </template>
            </PageHeader>

            <ion-searchbar v-model="searchValue" show-cancel-button="never"
                placeholder="Marka, ürün adı, kategori arayın" />




            <ion-card v-for="item in filteredUserAdsList">
                <div class="card-left" style="margin-right: 12px;">
                    <img @click="goProduct(item.product.product_code)"
                        :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + item.product?.showcase_image"
                        style="width: 100%; border-radius: 8px; object-fit: cover;" />
                </div>

                <div class="card-right" style="display: flex; flex-direction: column; gap: 1px; margint-top: 12px;">
                    <ion-buttons class="card-action" slot="primary">
                        <ion-button @click="showCardAction(item.product.product_code)">
                            <ion-icon slot="icon-only" :ios="ellipsisHorizontal" :md="ellipsisHorizontal" />
                        </ion-button>
                    </ion-buttons>

                    <ion-card-title class="is-font-bold" style="font-size: 12px; font-weight: bold;">
                        {{ item.product?.name }}
                    </ion-card-title>

                    <ion-card-title style="margin: 0; font-size: 14px; color: #333;">
                        Favorilenme: {{ item.product?.favorite_count > 0 ? item.product?.favorite_count : 0 }}
                    </ion-card-title>

                    <div style="display: flex; align-items: center; gap: 2px; margin-bottom: 10px;">
                        <span style="font-size: 12px; color: #555;">İlan durumu:</span>
                        <p style="padding: 5px; border-radius: 5px; background-color: #901B6A; color: white; width: 100px; text-align: center;"
                            :class="{ 'text-danger': !item.product?.status, 'text-success': item.product?.status }">
                            {{ item.product?.status ? 'Yayında' : 'Yayında Değil' }}
                        </p>
                    </div>

                    <ion-button @click="buyDoping(item.product)" size="small" shape="round"
                        style="background-color: #901B6A; border-radius: 5px; color: white;">
                        Öne Çıkar
                    </ion-button>
                </div>
            </ion-card>

            <ion-modal id="product-detail-modal-notif" ref="notification" :is-open="isNotificationOpen"
                @did-dismiss="onFirstModalDismiss">
                <div class="wrapper">
                    
                    <div style="display: flex; justify-content: center;">
                        
                        <img style="position: absolute; margin-left: 35px; top: 5%; height: 80px;" src="@/assets/textlogo.png" alt="">
                        <img style="position: absolute; height: 25px; color:white; top: 38%;" src="@/assets/ring.png" />
                        <img src="@/assets/notif2.png" />
                       
                        <p style="position: absolute; color:white; top: 43%;">Bu Sayfa Çok Yakında Sizinle!</p>
                        <img @click="onFirstModalDismiss" src="@/assets/x.png" style="position: absolute; height:50px; color:black; top: 0%; right:0px"/>
                        <p style="position: absolute; margin-left: 5%; font-size: 15px; color:white; top: 55%; text-align: center;">
                            Geliştirmelerimiz hızla devam ediyor. Takasimo’nun bu yeni özelliği kısa süre içinde kullanıma açılacak.
                        </p>
                        
                        <p style="position: absolute; margin-left: 5%; font-size: 14px; color:white; top: 75%; text-align: center;">
                            Beklediğiniz için teşekkür ederiz! <br> En iyi deneyimi sunmak için çalışıyoruz.
                        </p>
                    </div>
                    



                    <div
                        style=" width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">

                    </div>
                </div>
            </ion-modal>



        </ion-content>
        <ion-action-sheet :is-open="cardActionsShow" :buttons="cardActions" @didDismiss="cardActionsShow = false" />
    </ion-page>
</template>

<script lang="ts" setup>
import { usePaymentStore } from '@/stores/paymentToken';

import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
//import Swal from 'sweetalert2'
// import 'sweetalert2/src/sweetalert2.scss'

const deleteModal = ref<HTMLIonModalElement | null>(null);
const isDeleteModalOpen = ref(false);

const paymentToken = usePaymentStore()



const onDeleteModalDismiss = () => {
    //    deleteModal.value = false
}

const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
        (event.target as HTMLIonRefresherElement).complete();
        productApi.myProducts().then(res => {
            userAdsList.value = res.data.products
            console.log(res.data)
        })
    }, 2000)
}


import {
    IonActionSheet,
    IonButton,
    IonButtons,
    IonCard,
    IonCardTitle,
    IonContent,
    IonIcon,
    IonPage,
    IonLabel,
    IonModal,
    IonSearchbar,
    IonSkeletonText
} from '@ionic/vue';
import { add, ellipsisHorizontal } from 'ionicons/icons';
import Swal from 'sweetalert2'

import { Swiper, SwiperSlide } from 'swiper/vue';

// CSS
import 'swiper/css';
import '@ionic/vue/css/ionic-swiper.css';


//stores
// import { useProductsStore } from "@/stores/productsStore";
import { useAdsStore } from '@/stores/adsStore';
import productApi from '@/services/productApi';

// Components
import Header from "@/components/Header.vue";
import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Data
const selectedCard = ref<number | null>(null);
const cardActionsShow = ref(false);
const cardActions = [
    {
        text: 'İlanı Düzenle',
        data: {
            action: 'edit',

        },
        handler: () => handleAction('edit') // Handler for edit action
    },
    {
        text: 'İlanı Kaldır',
        data: {
            action: 'delete',
        },
        handler: () => handleAction('delete') // Handler for edit action

    }
];


const isNotificationOpen = ref(false)
const notification = ref<HTMLIonModalElement | null>(null);


const onFirstModalDismiss = () => {
    isNotificationOpen.value = false
}


const generateRandomString = (length: any) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const buyDoping = (e: any) => {
    // 32 karakterlik rastgele string oluştur
    const randomString = generateRandomString(32);

    // e.order_code yerine randomString kullan
    useProductsStore().lastCreatedProduct = e;
    paymentToken.setCreatedOrderByDoping(randomString);
    router.push({ name: 'doping-select-plan', params: { code: e.product_code } });
};




const handleAction = (action: string,) => {
    if (action === 'edit') {
        edit(); // Call the edit function
    } else if (action === 'delete') {
        deleteItem();
        //isDeleteModalOpen.value = true
    }
};

import 'sweetalert2/src/sweetalert2.scss'
import { FetchMessageList } from '@/helpers/messageCount';
import { useProductsStore } from '@/stores/productsStore';


const deleteItem = () => {

    Swal.fire({
        title: "İlanı kaldırmak istediğinzden emin misiniz ? ",
        text: "İlan kaldırma işlemi geri alınamaz",
        icon: "warning",
        heightAuto: false,

        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Evet Sil",
        cancelButtonText: "Vazgeç",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "İlan Kaldırıldı",
                heightAuto: false,
                icon: "success"
            });
            let item = {
                product_code: selectedCard.value,
                is_deleted: true

            }
            productApi.deleteProduct(item).then(res => {
                console.log(res)
            })
            loadUserData()
        }
    });
};


const edit = () => {
    console.log(selectedCard.value)
    // Your edit logic here
    router.push({ name: 'myAdsDetail', params: { code: selectedCard.value } })

};


// Other


const adsStore = useAdsStore();
const router = useRouter();
// const route = useRoute();

// Data
const userAdsList = ref<any[]>([]);
const searchValue = ref('')

// Other

const showCardAction = (id: number) => {
    selectedCard.value = id;
    cardActionsShow.value = true;
    console.log(id)
};

const filteredUserAdsList = computed(() => {
    const searchTerm = searchValue.value.trim().toLowerCase();
    if (!searchTerm) {
        return userAdsList.value;
    } else {

        return userAdsList.value.filter(item => item.product?.name.toLowerCase().includes(searchTerm));
    }
});

const adversimentPage = () => {
    router.push('/product/create/category');
};


const goProduct = (e: any) => {
    console.log("test")
    console.log(e)
    //router.push({ name: 'product-detail', params: { code: e } })
}


//Kullanıcının ilanları
const loadUserData = () => {
    productApi.myProducts().then(res => {
        userAdsList.value = res.data.products
        console.log(res.data)
    })
};
//sayfa degiştinde fonksiyonu tekrar çağır
watch(() => router.currentRoute.value, (to, from) => {
    loadUserData();
});

onMounted(() => {
    productApi.myProducts().then(res => {
        userAdsList.value = res.data.products
        console.log("x", res.data)

    })


})
</script>


























<style lang="scss" scoped>
ion-button {
    text-transform: none;
    --padding-start: 20px;
    --padding-end: 20px;
    font-size: 14px;
}

.text-danger {
    color: white;
    font-weight: bold;
    font-size: 11px;
}

.text-success {
    color: green;
    font-weight: bold;
}



ion-searchbar {
    padding-left: 10px;
    padding-right: 10px;
    --border-radius: 20px;
    --box-shadow: none;
    --background: var(--primary-gray);
    padding-top: 0;
    padding-bottom: 10px;
    min-height: 40px;
}

ion-card {
    display: grid;
    grid-template-columns: 2fr 3fr;
    padding: 0px 10px 0px 10px;
    background: var(--primary-gray);
    border-radius: var(--border-radius-large);
    box-shadow: none;
    gap: 10;

    margin: 0 10px 10px 10px;



    .card-left {

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: var(--border-radius-large);
            max-height: 111px;
            margin-top: 10px;
        }

        ion-skeleton-text.image {
            width: 100%;
            height: 140px;
            border-radius: var(--border-radius-large);
        }
    }

    .card-right {
        padding: 10px 0;

        ion-card-title {
            font-size: 15px;
            margin-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            width: calc(100% - 36px);
        }

        ion-skeleton-text {
            border-radius: var(--border-radius);
            height: 20px;
            margin-bottom: 5px;

            &:nth-child(1) {
                width: 60%;
            }

            &:nth-child(2) {
                width: 50%;
            }

            &:nth-child(3) {
                width: 50%;
            }

            &:nth-child(5) {
                border-radius: 20px;
                width: 100px;
                height: 30px;
            }
        }

        .card-action {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    }
}

ion-button span {
    text-wrap: nowrap;
}




ion-modal#product-detail-modal-notif {
    --width: 340px;
    --height: fit-content;
    --border-radius: 50px;
    --height: 360px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;
    --background:none;

    .wrapper {
        padding: 0px 0px 0px 0px;
        width: 340px;
        border: none;
        
     
    }
}
</style>