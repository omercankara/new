<script setup lang="ts">
import { computed, onMounted, ref, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { closeOutline, image } from 'ionicons/icons';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';

const isFirstModalOpen = ref(false);
const isTextModalOpen = ref(false);
const firstModal = ref<HTMLIonModalElement | null>(null);
const meProduct = ref<any[]>([]);

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@ionic/vue/css/ionic-swiper.css';

import { IonButton, IonContent, IonModal, IonLabel, IonGrid, IonInput, IonCheckbox, IonCard, IonCardContent, IonRow, IonCol, IonTextarea, IonRadioGroup, IonRadio, IonIcon, IonItem, IonPage } from '@ionic/vue';
import { chevronBackOutline } from 'ionicons/icons';
import Header from '@/components/Header.vue';
import PageHeader from '@/components/page/PageHeader.vue';
import productApi from '@/services/productApi';
import { useSwapStore } from '@/stores/swapStore';
import authApi from '@/services/authApi';
import messageApi from '@/services/messageApi';
import { FetchMessageList } from '@/helpers/messageCount';

const store = useSwapStore();
const router = useRouter();
const route = useRoute();
const swap = computed(() => store.swap);
const productDetail = ref<any[]>([]);
const productCode = ref<string>(route?.params?.code as string);

const modules = [Navigation, Pagination, Scrollbar]
const handleGoToBack = () => {
    router.push({ name: 'home' });
};


const goDetailPage = () => {
    router.push(`/product-detail/${meProduct.value[0].product_code}`);
}

const testing = reactive({
    meProductCode: ref<any[]>([]),
    targetProductCode: ''
});

const isChecked = ref(false);
function onCheckboxChange(event: any) {
    isChecked.value = event.detail.checked;
    console.log('isChecked:', isChecked.value);
}

const formData = ref<any>({
    _to: "",
    latest_offer: {
        swapStatus: true,
        offerStatus: true,
        offer_type: "offer",
        price: "",
        currency: "TRY",
        from: [],
        message: "",
        productMessage: "",
        to: [],
        targetOwnerInfo: {},
        meOwnerInfo: {}
    },
    from: false,
    to_is_deleted: false
})
const openFirstModal = () => {
    // price değerinin kontrolü
    if (formData.value.latest_offer.price.trim() === "") {
        $toast.error("Lütfen fiyat bilgisi giriniz.", {
            position: "top-right",
        });
        return; // Eğer price boşsa fonksiyonu sonlandır
    }

    // isChecked kontrolü
    if (isChecked.value === false) {
        $toast.error("Lütfen İlan verme kurallarını onaylayınız", {
            position: "top-right",
        });
    } else {
        messageApi.sendMessage(formData.value).then(res => {
            console.log(res.data);
        });
        store.setSwapNotification({ isTrue: true });

        router.push(`/product-detail/${meProduct.value[0].product_code}`);
        console.log(formData.value);
    }
};


watch(isChecked, (newValue) => {
    console.log('isChecked:', newValue);
});





const showText = () => {
    isTextModalOpen.value = true;
    console.log("text")
}

const onTextModalDismiss = () => {
    isTextModalOpen.value = false;
    console.log("text")
}

const closeFirstModal = () => {
    isFirstModalOpen.value = false;
};

const fetchProducts = async () => {
    try {
        // Auth API'den kullanıcı bilgilerini alın
        const authResponse = await authApi.me();
        const authUserData = authResponse.data;

        // FormData'ya auth API'den alınan kullanıcı adını ve soyadını atayın
        formData.value.latest_offer.meOwnerInfo = {
            name: authUserData.name,
        };

        console.log('Auth API User Data:', authUserData);

        if (testing.targetProductCode !== '') {
            try {
                // Ürünü alın
                const response = await productApi.getMeSingleProduct(testing);
                // meProduct.value = response.targetProduct.data;
                //meProduct.value = response.meProducts[0].data;

                console.log('Product Response:', response.targetProduct.data);
                meProduct.value.push(response.targetProduct.data);

                formData.value._to = response.targetProduct.data.owner.user_code;

                // FormData'yı güncelleyin
                formData.value.latest_offer.targetOwnerInfo = response.targetProduct.data.owner;

                let offerProductInfo = {
                    product_code: response.targetProduct.data.product_code,
                    name: response.targetProduct.data.name,
                    image: response.targetProduct.data.showcase_image
                };

                formData.value.latest_offer.to.push(offerProductInfo);
                console.log('Updated FormData:', formData.value);

            } catch (error) {
                console.error('Failed to fetch product:', error);
            }
        }
    } catch (error) {
        console.error('Failed to fetch auth data:', error);
    }
};


const checkAuth = async () => {
    try {
        const response = await authApi.me();
        console.log(response.data, "Başarılı"); // Başarılı yanıt alındığında veriyi konsola yazdır
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            // 401 hatası alındığında giriş sayfasına yönlendir
            try {
                $toast.error('Oturumunuz sonlandırıldı giriş ekranına yönlendiriliyorsunuz.!');
                setTimeout(() => {
                    router.push('/login'); // Yönlendirme işlemini bekleyin
                }, 2000)
            } catch (routingError) {
                console.error('Yönlendirme hatası:', routingError);
            }
        } else {
            console.error('Auth API çağrısı sırasında bir hata oluştu:', error);
        }
    }
};

// const fetchProducts = async () => {
//     authApi.me().then(res => {
//         console.log(res.data)
//     })


//     if (testing.targetProductCode !== '') {
//         try {
//             const response = await productApi.getMeSingleProduct(testing);
//             meProduct.value = response.targetProduct.data
//             console.log(response)
//             formData.value._to = response.targetProduct.data.owner.user_code

//             formData.value.latest_offer.targetOwnerInfo = response.targetProduct.data.owner
//             formData.value.latest_offer.meOwnerInfo = 

//             let offerProductInfo = {
//                 product_code: response.targetProduct.data.product_code,
//                 name: response.targetProduct.data.name,
//                 image: response.targetProduct.data.showcase_image
//             }

//             formData.value.latest_offer.to.push(offerProductInfo)
//             console.log(formData.value)


//             // console.log(formData.value)
//             //console.log(offerProductInfo)
//             // formData.value.latest_offer.meOwnerInfo = response.meProducts[0].data.owner
//             // formData.value._to = meProduct.value.user_code
//             //console.log(response.targetProduct.data.owner.user_code)
//             //console.log(response)

//         } catch (error) {
//             console.error('Failed to fetch product:', error);
//         }
//     }
// };

const onFirstModalDismiss = () => {
    isFirstModalOpen.value = false;
};

const goMessage = () => {
    router.push({ name: 'messages' })
    isFirstModalOpen.value = false;
}


watch(
    () => route.params, // route.params dinleniyor
    (newParams) => {
        console.log('newParams :>> ', newParams)
        fetchProducts()
        checkAuth()
    },
    { immediate: true } // Başlangıçta da çalışması için
);


onMounted(() => {
    testing.targetProductCode = productCode.value
    // if (route.path === '/swap') {
    //     fetchProducts();
    // }
    fetchProducts()
    console.log(testing.targetProductCode)


});

</script>


<template>
    <ion-page>
        <Header />
        <PageHeader title="Teklif Ver" style="margin-bottom: 0px; font-weight: bold; background-color: white;">
            <template #start-action>
                <img style="height: 24px; margin-right: 10px; margin-top: 2px" @click="goDetailPage()"
                    src="@/assets/icons3.png" alt="">
            </template>
            <template #end-action>
                <span
                    style="cursor: pointer; margin-left: auto;  height: 34px; width: 34px; display: flex; align-items: center;">
                    <img @click="goDetailPage()" src="@/assets/x.png" alt="" style="height: 44px; width: 44px;">
                </span>
            </template>
        </PageHeader>

        <PageHeader title="Teklif Bilgileri" style="margin-bottom: 10px;">
            <template #start-action>
                <img style="height: 17px; margin-right: 10px; margin-top: 2px" @click="goDetailPage()"
                    src="@/assets/back.png" alt="">
            </template>
        </PageHeader>

        <ion-content class="content">
            <ion-grid>

                <ion-row class="buy-container" style="margin-bottom: 10px;">
                    <ion-col size="12" class="item-scroll">
                        <p v-if="meProduct.length < 1"> Loading</p>
                        <img v-else
                            :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + meProduct[0]?.showcase_image" />


                    </ion-col>
                </ion-row>

                <ion-row style="border-bottom: 1px solid gainsboro; padding-bottom:5px;" class="message-container">
                    <ion-col size="7">
                        <div class="userInfo"
                            style="display: flex; margin-left: 5px;  flex-direction: column; align-items: flex-start;">
                            <p style="margin: 0px; font-weight: bold ">{{ meProduct[0]?.name }}</p>
                            <p style="margin: 0px; ">

                                {{ meProduct[0]?.price }}</p>
                        </div>
                    </ion-col>

                    <ion-col size="5">
                        <div style="display: flex;  flex-direction: column; align-items: flex-start;">
                            <p style="margin: 0px;">
                                <img style="height: 15px; width: 15px;" src="../../../assets/account/avatar.png" alt="">
                                {{ meProduct[0]?.owner.name }}
                            </p>

                        </div>
                    </ion-col>
                </ion-row>



                <ion-row style="border-bottom: 1px solid gainsboro" class="message-container">
                    <ion-col size="7" class="ion-align-items-center ion-justify-content-start flex-col">
                        <ion-label class="custom-label">Teklif</ion-label>
                    </ion-col>
                    <ion-col size="4">
                        <ion-input v-model="formData.latest_offer.price" type="number" placeholder="Örn 13.000 ₺"
                            inputmode="numeric"></ion-input>
                    </ion-col>
                </ion-row>
                <ion-row class="message-container " style="border-bottom: 1px solid gainsboro">
                    <ion-col size="7" class="ion-align-items-start ion-justify-content-start">
                        <ion-label class="custom-label" style="margin-left:8px; margin-top: 10px">Mesaj</ion-label>
                    </ion-col>
                    <ion-col size="5">
                        <ion-textarea v-model="formData.latest_offer.productMessage" :cols="12" :rows="5"
                            placeholder="Açıklama girin" :maxlength="120"
                            :class="{ 'error': formData.latest_offer.productMessage.length >= 200 }"></ion-textarea>
                        <div v-if="formData.latest_offer.productMessage.length >= 200" class="error-message">
                            Maksimum karakter sayısına ulaşıldı!
                        </div>
                    </ion-col>
                </ion-row>



                <!-- <ion-modal id="product-detail-modal" ref="secondModal" :is-open="isFirstModalOpen"
                    @did-dismiss="onFirstModalDismiss">
                    <div class="wrapper">

                        <div class="takasimo-logo">
                            <img src="@/assets/takasimo-icon.png" />
                        </div>
                        <div class="modal-close-button ion-activatable ripple-parent">
                            <ion-icon color="primary" @click="closeFirstModal" :icon="closeOutline" size="large" />
                           
                        </div>


                        <ion-label>
                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 20px; margin-bottom: 10px;">Teklif Gönderildi</p>
                                <ion-button @click="goMessage" color="primary">Mesajlarda Gör</ion-button>
                            </div>
                        </ion-label>
                    </div>
                </ion-modal> -->

                <ion-modal id="product-text-detail-modal" ref="thirdModal" :is-open="isTextModalOpen"
                    @did-dismiss="onTextModalDismiss">
                    <div class="wrapper">

                        <div class="takasimo-logo">
                            <img src="@/assets/takasimo-icon.png" />
                        </div>
                        <div class="modal-close-button ion-activatable ripple-parent">
                            <ion-icon color="primary" @click="onTextModalDismiss" :icon="closeOutline" size="large" />
                            <!-- <ion-ripple-effect></ion-ripple-effect> -->
                        </div>


                        <ion-label>
                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 20px; margin-bottom: 10px;">KVKK Aydınlatma Metni</p>

                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; ">
                                    6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU (“KVKK”) USUL VE ESASLARI UYARINCA
                                    KİŞİSEL
                                    VERİLERİNİZİN KORUNMASI HAKKINDA AYDINLATMA METNİ
                                </p>
                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; text-align: left; ">
                                    Veri sorumlusu sıfatı ile Temiz Enerji Vakfı olarak (“Vakıf”); hangi kişisel
                                    verilerinizi
                                    hangi amaçlarla işleyeceğimiz konusunda işbu metin hazırlanmış olup, 6698 sayılı
                                    Kişisel
                                    Verilerin Korunmasına İlişkin Kanun’a (“KVKK”) uygun olarak kişisel verilerinizin
                                    korunması
                                    hususunda gerekli önlemlerin alındığını bildiririz.
                                </p>
                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; text-align: left; ">
                                    Aşağıda belirttiğimiz kişisel verilerinizi her koşulda hukuka ve dürüstlük
                                    kurallarına
                                    uygun, doğruluğunu ve en güncel halini koruyarak, belirli, açık ve hukuka uygun
                                    amaçlar
                                    için, işlenecekleri amaçla bağlantılı, sınırlı ve ölçülü olacak şekilde, ilgili
                                    mevzuatta
                                    öngörülen veya işlendikleri amaç için gerekli olan süre kadar saklayarak
                                    işleyeceğimizi
                                    bildiririz.
                                </p>
                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; text-align: left; ">
                                    Kişisel verileriniz elektronik ve/veya fiziksel ortamlarda saklanacaktır. Vakfımız
                                    tarafından temin edilen ve saklanan kişisel verilerinizin saklandıkları ortamlarda
                                    yetkisiz
                                    erişime maruz kalmamaları, kaybolmamaları ve zarar görmemeleri amacıyla gerekli
                                    teknik
                                    tedbirler uygulanarak korunmaktadır.
                                </p>
                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; text-align: left; ">
                                    işisel verileriniz, size bildirilen amaçlar ve kapsam dışında kullanılmamak kaydı
                                    ile
                                    gerekli tüm bilgi güvenliği tedbirleri de alınarak işlenecek ve yasal saklama
                                    süresince veya
                                    böyle bir süre öngörülmemişse işleme amacının gerekli kıldığı süre boyunca
                                    saklanacak ve
                                    işlenecektir. Bu süre sona erdiğinde, kişisel verileriniz silinme, yok edilme ya da
                                    anonimleştirme yöntemleri ile Vakfımızın veri akışlarından çıkarılacaktır.
                                </p>
                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; text-align: left; ">
                                    işisel verileriniz, size bildirilen amaçlar ve kapsam dışında kullanılmamak kaydı
                                    ile
                                    gerekli tüm bilgi güvenliği tedbirleri de alınarak işlenecek ve yasal saklama
                                    süresince veya
                                    böyle bir süre öngörülmemişse işleme amacının gerekli kıldığı süre boyunca
                                    saklanacak ve
                                    işlenecektir. Bu süre sona erdiğinde, kişisel verileriniz silinme, yok edilme ya da
                                    anonimleştirme yöntemleri ile Vakfımızın veri akışlarından çıkarılacaktır.
                                </p>
                            </div>

                            <div class="label2" style="font-size: 16px;">
                                <p style="font-size: 9px; line-height: 10px; text-align: left; ">
                                    işisel verileriniz, size bildirilen amaçlar ve kapsam dışında kullanılmamak kaydı
                                    ile
                                    gerekli tüm bilgi güvenliği tedbirleri de alınarak işlenecek ve yasal saklama
                                    süresince veya
                                    böyle bir süre öngörülmemişse işleme amacının gerekli kıldığı süre boyunca
                                    saklanacak ve
                                    işlenecektir. Bu süre sona erdiğinde, kişisel verileriniz silinme, yok edilme ya da
                                    anonimleştirme yöntemleri ile Vakfımızın veri akışlarından çıkarılacaktır.
                                </p>
                            </div>
                        </ion-label>

                    </div>

                </ion-modal>



                <ion-row class="notification">
                    <ion-col size="12" @click="showText">
                        <p @click="showText">Kişisel verilerin işlenmesine <span style="color: purple;">dair aydınlatma
                                metni</span></p>
                    </ion-col>
                </ion-row>

                <ion-row class="check-container" style="align-items: center;">
                    <ion-col size="12" style="display: flex; align-items: center; gap: 8px;">
                        <ion-checkbox @ionChange="onCheckboxChange"></ion-checkbox>
                        <ion-label>İlan verme kurallarını kabul ediyorum</ion-label>
                    </ion-col>
                    <ion-col size="12">
                        <button
                            style="height: 40px; width: 100%; border-radius: 5px; color:white; background-color: var(--ion-color-primary);"
                            @click="openFirstModal" expand="full">Teklif ver</button>
                    </ion-col>
                </ion-row>

            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<style lang="scss" scoped>
ion-modal#product-detail-modal {
    --width: 380px;
    --height: fit-content;
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 60px 10px 20px 10px;

        .takasimo-logo {
            position: absolute;
            top: -50px;
            left: calc(50% - 50px);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            background: var(--primary);
            width: 100px;
            height: 100px;
            border-radius: 50px;
            z-index: 20003;

            img {
                width: 60px;
                height: 60px;
            }
        }

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
            --background: #d7d2d2;
            --color: var(--black);
            --padding-top: 15px;
            --padding-bottom: 15px;
            --padding-start: 60px;
            --padding-end: 60px;
            --border-radius: 30px;
            --box-shadow: none;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
        }
    }
}


.flex-col {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 10px;
}

.custom-label {
    color: black;
    margin: 0;
    padding: 0;
}

.content {
    // --padding-bottom: env(safe-area-inset-bottom);
    //background-color: blue !important;
    // display: flex;
    // flex-direction: column;
}

.buy-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    /* Dikey düzenleme */
    align-items: center;
    /* Ortalamak için */

    .item-scroll {
        flex: 1;
        padding: 0 10px;
        width: 100%;
        position: relative;

        .priceNameInfo {
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 0;
            left: 20px;
            font-weight: bold;

            p {
                margin: 0px;
            }
        }

        .userInfo {
            display: flex;
            flex-direction: column;
            position: absolute;
            bottom: 0;
            right: 20px;
            font-weight: bold;

            p {
                margin: 0px;
            }
        }

        img {
            height: 150px;
            width: 100%;
            object-fit: contain;
            display: block;
            /* Blok seviyesine al */
        }
    }
}

.message-container {
    margin: 0 10px;
    /* Kenar boşluklarını düzenle */
    display: flex;


    ion-label {
        display: flex;
        align-items: center;
        margin-right: 10px;
        /* Label ve input arasına boşluk bırak */
    }

    ion-input {
        flex: 1;
        --padding-start: 0;
        --padding-end: 0;
        --padding-top: 0;
        --padding-bottom: 0;
        border: none;
    }
}

.notification {
    margin: 15px;
    padding-top: 10px;

    p {
        text-align: center;
        margin: 0;
        font-size: 13px;
    }
}

.check-container {
    background-color: #F3F2F6;
    border-radius: 10px 10px 0 0;
    padding: 10px;

    ion-button {
        margin-top: 10px;
    }
}












ion-modal#product-text-detail-modal {
    --width: 380px;
    --height: 50vh;
    /* Ekranın yarısı */
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 60px 10px 20px 10px;
        max-height: calc(50vh - 80px);
        /* İçerik için maksimum yükseklik ayarla */
        overflow-y: auto;
        /* Dikey kaydırma çubuğunu etkinleştir */

        .takasimo-logo {
            position: absolute;
            top: -50px;
            left: calc(50% - 50px);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            background: var(--primary);
            width: 100px;
            height: 100px;
            border-radius: 50px;
            z-index: 20003;

            img {
                width: 60px;
                height: 60px;
            }
        }

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
            border-radius: 30px !important;
            color: white;
            width: 25%;
            height: 20px;
            position: absolute;
            left: 28%;
            --color: var(--black);
            --padding-top: 15px;
            --padding-bottom: 15px;
            --padding-start: 60px;
            --padding-end: 60px;
            --border-radius: 30px;
            --box-shadow: none;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
        }
    }
}
</style>
