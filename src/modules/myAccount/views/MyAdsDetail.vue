<template>
    <ion-page>
        <Header />
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="4">
                        <div
                            style="width: 120px; padding: 7px; border-radius: 7px; background-color: whitesmoke; display: flex; justify-content: center;">
                            <img style="height: 100px; width: 100%; border-radius: 0px;"
                                :src="`https://takasimos3.s3.eu-north-1.amazonaws.com${product?.showcase_image}`"
                                class="swiper-slide-image" />
                        </div>
                    </ion-col>
                    <ion-col size="8">
                        <p style="font-weight: bold; margin: 0; margin-top: 5px;">{{ product?.name }}</p>
                        <p style="font-size: 25px; margin: 0; margin-top: 5px; font-weight: bold;">{{ product?.price }}
                        </p>
                        <p style="margin: 0; margin-top: 5px;">İlan Bitiş Tarihi 26.02.2024</p>
                        <p style="margin: 0; margin-top: 12px;">Görüntüleme: {{ product?.view_count }}</p>
                        <p style="margin: 0; margin-top: 5px;">Favorileme: {{ product?.favorite_count }}</p>
                        <p style="margin: 0; margin-top: 5px;">Mesaj Sayısı: {{ product?.message_count }}</p>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="12" style="background-color: #F3F2F6;">
                        <ion-label style="margin-left: 10px; font-weight: bold;">İlan Yönetimi</ion-label>
                    </ion-col>
                    <ion-col size="12">

                        <ion-row style="border-bottom:1px solid gray; margin-bottom: 5px ">
                            <ion-col size="2" style="background-color: white; display: flex; justify-content: center;">
                                <ion-icon style="color: purple; font-size: 25px;" :icon="starOutline"></ion-icon>
                            </ion-col>

                            <ion-col size="10">
                                <ion-row>
                                    <ion-col size="6" @click="buyDoping()"
                                        style="background-color:white; padding: 0px;">
                                        <p style="margin: 0px; font-size: 20px;">İlanını <span
                                                style="font-weight: bold; font-size: 18px">Öne Çıkar</span> </p>
                                    </ion-col>
                                    <ion-col size="1">
                                        <ion-icon font-weight="normal" style="color: purple;"
                                            :icon="chevronForwardOutline"></ion-icon>

                                    </ion-col>
                                </ion-row>

                                <span style="margin: 0; font-size: 13px;">İlan bilgilerinizi güncelleyerek ürünlerinizi
                                    daha etkili tanıtın ve alıcıların ilgisini çekin.</span>
                            </ion-col>
                        </ion-row>



                        <ion-row style="border-bottom:1px solid gray; margin-bottom: 5px ">
                            <ion-col size="2" style="background-color: white; display: flex; justify-content: center;">
                                <ion-icon style="color: purple; font-size: 25px;" :icon="createOutline"></ion-icon>
                            </ion-col>

                            <ion-col size="10">
                                <ion-row>
                                    <ion-col @click="editMyAds" size="8" style="background-color:white; padding: 0px;">
                                        <p style="margin: 0px; font-size: 20px;">İlan Bilgilerini <span
                                                style="font-weight: bold; font-size: 18px">Düzenle</span> </p>
                                    </ion-col>
                                    <ion-col size="1">
                                        <ion-icon font-weight="normal" style="color: purple;"
                                            :icon="chevronForwardOutline"></ion-icon>

                                    </ion-col>
                                </ion-row>

                                <span style="margin: 0; font-size: 13px;">İlan bilgilerinizi güncelleyerek ürünlerinizi
                                    daha etkili tanıtın ve alıcıların ilgisini çekin.</span>
                            </ion-col>
                        </ion-row>







                        <ion-row>
                            <ion-col size="2" style="background-color: white; display: flex; justify-content: center;">
                                <ion-icon style="color: purple; font-size: 25px;" :icon="calendarOutline"></ion-icon>
                            </ion-col>
                            <ion-col size="10" @click="editAdsDate">
                                <p @click="editAdsDate" style="margin: 0; font-size: 20px; font-weight: bold;">İlan
                                    Tarihini Güncelle </p>
                                <span @click="editAdsDate" style="margin: 0; font-size: 13px;">İlan bilgilerinizi
                                    güncelleyerek ürünlerinizi
                                    daha etkili tanıtın ve alıcıların ilgisini çekin.</span>
                            </ion-col>
                        </ion-row>


                    </ion-col>
                    <ion-col size="12" style="background-color: #F3F2F6; margin-bottom: 20px;">
                        <ion-label style="margin-left: 10px; font-weight: bold;">Bildirimler</ion-label>
                    </ion-col>

                    <ion-col size="12" style="background-color: #F3F2F6; margin-bottom:5px;">

                        <ion-label style="margin-left: 10px; font-weight: bold; margin-top: 20px;  ">Paylaş</ion-label>

                        <ion-row size="2"
                            style="padding: 10px; width: 30%; display:flex; justify-content: space-between; ">
                            <a :href="'https://api.whatsapp.com/send?text=' + encodeURIComponent('Bu ilana göz atın: ') + encodeURIComponent(currentUrl)"
                            target="_blank">
                            <img style="height: 25px; width: 25px; border-radius: 50%; border: 2px solid white;"
                                src="@/assets/wp.png" alt="WhatsApp Icon">
                        </a>
                        <a :href="twitterShareUrl" target="_blank">
                            <img style="height: 25px; width: 25px; border-radius: 50%; border: 2px solid white;"
                                src="@/assets/twitter.png" alt="Icon 1">
                        </a>

                        <a :href="'mailto:?subject=İlginç Bir Link&body=Bu ilana göz atın: ' + encodeURIComponent(currentUrl)"
                       target="_blank">
                      <img style="height: 25px; width: 25px; border-radius: 50%; border: 2px solid white;"
                           src="@/assets/eposta.png" alt="E-posta Iconu">
                    </a>

                 
                        </ion-row>

                    </ion-col>

                    <ion-col size="12" style="display: flex; justify-content: center; align-items: center;">
                        <ion-button @click="deleteProduct"  >Yayından Kaldır</ion-button>
                    </ion-col>

                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonButton, IonContent, IonModal, IonLabel, IonGrid, IonInput, IonCard, IonCardContent, IonRow, IonCol, IonTextarea, IonRadioGroup, IonRadio, IonIcon, IonItem, IonPage } from '@ionic/vue';
import { calendarOutline, closeOutline, heart, starOutline, createOutline, heartOutline, timeOutline, eyeOutline, chevronForwardOutline, logoFacebook, logoInstagram, logoWhatsapp, mail } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted,computed } from 'vue';
import Header from '@/components/Header.vue';
import productApi from '@/services/productApi';
import EditMyAds from './editMyAds.vue';
import router from '@/router';
import { useProductsStore } from '@/stores/productsStore';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();
// Icons


// Reactive state
const productCode = ref<string>(useRoute().params.code as string);
const product = ref<any>({});

// Fetch product data on component mount


const currentUrl = ref(window.location.href.replace('/myAdsDetail/', '/product-detail/'));

const tweetText = ref('Bu ilana göz atın');
const twitterShareUrl = computed(() => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText.value)}&url=${encodeURIComponent(currentUrl.value)}`;
});


const editMyAds = () => {
    router.push({ name: 'edit-my-ads', params: { code: productCode.value } })
}

const editAdsDate = () => {
    router.push({ name: 'edit-ads-date', params: { code: productCode.value } })
}


const buyDoping = () => {
    useProductsStore().lastCreatedProduct = product.value
    router.push({ name: 'doping-select-plan', params: { code: productCode.value } })
}

const deleteProduct = async () => {
    let item = product.value;
    console.log(item);

    // Yeni nesne oluştur
    const dataToSend = {
        product_code: item.product_code,
        status: false, // status değerini true yap
    };

    try {
        const response = await productApi.productUpdate(dataToSend);
        // Başarılı yanıt alındığında yapılacak işlemler
        $toast.success('İlan yayından kaldırıldı!', {
            position: 'top',
        })
    } catch (error) {
        // Hata durumunda yapılacak işlemler
        console.error("Güncelleme işlemi başarısız:", error);
    }
};






onMounted(async () => {
    try {
        const res = await productApi.get(productCode.value);
        product.value = res.data;
        console.log
        console.log(product.value);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
});
</script>

<style scoped>
/* Add component-specific styles here */
</style>
