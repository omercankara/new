<template>
    <ion-page>
        <Header />
        <ion-content>
            <ion-grid>
                <ion-row>

                    <ion-col size="12"
                        style="background-color:white; position:relative; padding: 10px; display: flex; align-items: center; flex-direction: row;">
                        <img src="../assets/tü.png" alt="" style="height: 30px;">
                        <p style="margin: 0px; margin-left: 0px; font-weight: bold;">İlan Düzenle</p>
                        <p @click="cancel"
                            style="margin: 0px; color:purple; font-weight: bold; position: absolute; right: 10px; top: 8px;">
                            x</p>
                    </ion-col>


                    <ion-col size="12"
                        style="background-color:#F3F2F7; position:relative; padding: 10px; display: flex; flex-direction: row ">
                        <p style="margin: 0px; margin-left: 10px;">İlan Bilgileri </p>

                    </ion-col>


                    <ion-col size="12" style="position: relative;">
                        <!-- Swiper component occupying space on the left -->
                        <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
                            <div style="width: 20%; height: 100px;">
                                <button
                                    style="height: 100%; color:white; width: 100%; border-radius: 1vh; background-color: purple;">Görsel
                                    yükle</button>
                            </div>
                            <div style="width: 80%;">
                                <Swiper :modules="modules" :slides-per-view="3" :navigation="true"
                                    style="flex-grow: 1;">
                                    <swiper-slide v-for="image in product.images" :key="image.id">
                                        <ion-card style="position: relative;" @click="selectImage(image.image)">
                                            <ion-card-content>
                                                <img style="width: 150px; height: 70px; object-fit: contain;"
                                                    :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + image.image" />
                                            </ion-card-content>
                                            <button @click.stop="removeImage(image)"
                                                style="width: 20%; height: 30px; border-radius: 1vh; font-weight: bold; color: purple;">
                                                X
                                            </button>

                                            <!-- Conditionally display the <p> tag -->
                                            <p v-if="selectedImage === image.image"
                                                style="position: absolute; font-size: 11px; background-color: purple; color: white; padding: 0px; margin: 0px; top: 0px; right: 5px;">
                                                Vitrin Görseli
                                            </p>
                                        </ion-card>
                                    </swiper-slide>
                                </Swiper>
                            </div>
                        </div>


                        <!-- The image positioned at the top-right -->
                        <img src="../assets/i,.png" alt=""
                            style="position: absolute; top: 10px; right: 20px; width: auto; height: 15px; object-fit: contain;">
                    </ion-col>




                    <!-- Form verileri -->
                    <ion-col size="12">
                        <ion-item>
                            <ion-label slot="start">İlan Başlığı</ion-label>
                            <ion-textarea placeholder="Başlık giriniz" v-model="formData.name" :clear-on-edit="true"
                                :auto-grow="true" :rows="1" />
                        </ion-item>
                        <ion-item>
                            <ion-label slot="start">Fiyat</ion-label>
                            <ion-input placeholder="Fiyat Giriniz." type="number" v-model.number="formData.price" />
                        </ion-item>
                        <ion-item>
                            <ion-label slot="start">Açıklama</ion-label>
                            <ion-textarea placeholder="Açıklama giriniz" v-model="formData.description"
                                :clear-on-edit="true" :auto-grow="true" :rows="1" />
                        </ion-item>

                        <ion-item>
                            <ion-label slot="start">İletişim Seçenekleri</ion-label>
                            <ion-select aria-label="Fruit" placeholder="İletişim Seçenekleri"
                                v-model="formData.communication_preference" :multiple="true">
                                <ion-select-option value="phone">Arama</ion-select-option>

                            </ion-select>
                        </ion-item>

                        <ion-item>
                            <ion-label slot="start">Takas Tekliflerine Aç</ion-label>
                            <ion-toggle v-model="formData.swap" />
                        </ion-item>

                        <ion-col size="12" style="display: flex; position: fixed; bottom:0px; justify-content: center;">
                            <ion-button @click="submitForm" style="width: 60%;">Kaydet</ion-button>
                        </ion-col>

                    </ion-col>
                    <ion-modal id="product-detail-modal-notif" ref="notification" :is-open="isNotificationOpen"
                        @did-dismiss="notificationDismiss">
                        <div class="wrapper" style="display: flex; flex-direction: column; justify-content: flex-start;
                        align-items: center;">
                            <div>
                                <img src="@/assets/delpng.png" />
                            </div>
                            <div style="width: 80%;">
                                <p style="text-align: center;">Görseli kaldırmak istediginizden emin misiniz ?</p>
                            </div>
                            <div style="display: flex; width: 80%; flex-direction: column;">
                                <ion-button @click="applyRemoveImage">Evet Sil</ion-button>
                                <ion-button @click="notificationDismiss">Vazgeç</ion-button>
                            </div>
                            <div
                                style=" width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                            </div>
                        </div>
                    </ion-modal>

                    <ion-modal id="product-detail-modal-notif" ref="closeNotification" :is-open="isCloseModal"
                        @did-dismiss="closeDismiss">
                        <div class="wrapper" style="display: flex; flex-direction: column; justify-content: flex-start;
                        align-items: center;">
                            <div>
                                <img src="@/assets/delpng.png" />
                            </div>
                            <div style="width: 80%;">
                                <p style="text-align: center;">Kaydedilmemiş degişiklikler var, Çıkış yapmak istediginizden emin misiniz ?</p>
                            </div>
                            <div style="display: flex; width: 80%; flex-direction: column;">
                                <ion-button @click="confirmExit">Evet</ion-button>
                                <ion-button @click="confirmCancel">Vazgeç</ion-button>
                            </div>
                            <div
                                style=" width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                            </div>
                        </div>
                    </ion-modal>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>


<script setup lang="ts">
import { IonPage, IonGrid, IonRow, IonCol, IonContent, IonCardContent, IonCard, IonItem, IonLabel, IonTextarea, IonInput, IonSelect, IonSelectOption, IonToggle, IonButton, IonModal } from '@ionic/vue';
import Header from '@/components/Header.vue';
import { useRoute, useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { ref, onMounted } from 'vue';
import productApi from '@/services/productApi';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@ionic/vue/css/ionic-swiper.css';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


// Initialize reactive variables
const router = useRouter();
const route = useRoute();
const modules = [Navigation, Pagination, Scrollbar];
const product = ref<Product>({ images: [], showcase_image: '', product_code: '', name: '', price: 0, description: '', communication_preference: [], swap: false });
const productCode = ref<string>(route.params.code as string);
const selectedImage = ref<string>('');
const notification = ref<HTMLIonModalElement | null>(null);
const isNotificationOpen = ref(false)


const closeNotification = ref<HTMLIonModalElement | null>(null);
const isCloseModal = ref(false);



// Define types
interface Image {
    id: number;
    image_code: string;
    image: string
}

interface Product {
    images: Image[];
    showcase_image: string;
    product_code: string;
    name: string;
    price: number;
    description: string;
    communication_preference: string[]; // Updated field name
    swap: boolean;
}

const notificationDismiss = () => {
    isNotificationOpen.value = false;
};

const closeDismiss = () => {
    isCloseModal.value = false
}


// Form data model
const formData = ref({
    product_code: '',
    showcase_image: '',
    name: '',
    price: 0,
    description: '',
    communication_preference: [] as string[], // Updated field name
    swap: false,
    images: [] as { id: number; image: string; }[]

});

// Fetch product data on mounted
onMounted(async () => {
    try {
        const response = await productApi.get(productCode.value);
        product.value = response.data;
        console.log("data", product.value)

        // Initialize formData with fetched product data
        formData.value = {
            product_code: product.value.product_code,
            showcase_image: product.value.showcase_image,
            name: product.value.name,
            price: product.value.price,
            description: product.value.description,
            communication_preference: product.value.communication_preference,
            swap: product.value.swap,
            images: product.value.images
        };

        // Set the initial selected image based on showcase_image
        selectedImage.value = product.value.showcase_image;
        console.log("formİmg", formData.value.images)

        console.log(product.value);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
});

let deletedImage = {
    image_code: '',
    is_deleted: true
}
const removeImage = async (image: Image) => {
    isNotificationOpen.value = true
    deletedImage.image_code = image.image_code
}

const applyRemoveImage = async (image: Image) => {
    try {
        //Görseli API üzerinden silme işlemi
        //const deletedImage = { image_code: image.image_code }; // Silinecek görselin bilgileri
        await productApi.productImageUpdate(deletedImage);

        // Silme işleminden sonra ürün verilerini yeniden çek
        const response = await productApi.get(productCode.value);
        product.value = response.data;

        // formData'yı güncelle
        formData.value = {
            product_code: product.value.product_code,
            showcase_image: product.value.showcase_image,
            name: product.value.name,
            price: product.value.price,
            description: product.value.description,
            communication_preference: product.value.communication_preference,
            swap: product.value.swap,
            images: product.value.images,
        };
        isNotificationOpen.value = false
        $toast.success('Görsel kaldırıldı', {
            position: 'top-right',
            //class: 'custom-toast', // className yerine class kullanılıyor
        });


    } catch (error) {
        console.error("Hata oluştu:", error);
        // Hata mesajını kullanıcıya göstermek için uygun bir yöntem ekleyebilirsiniz
    }
};


// Function to select an image
function selectImage(imageUrl: string): void {
    selectedImage.value = imageUrl;
    formData.value.showcase_image = imageUrl
}

// Function to submit the form
async function submitForm() {

    try {
        console.log("son hal", formData.value);
        const response = await productApi.productUpdate(formData.value);
        $toast.success("İlan Bilgileriniz Güncellendi.", {
            position: "top-right",
        });

        // İşlem başarılı ise yönlendirme yap
        router.push("/home");

    } catch (error) {
        console.error('Error submitting form:', error);
        // Hata durumunda gerekli işlemleri yapabilirsiniz (örneğin, bir hata mesajı gösterin)
    }

    // if (deletedImage.image_code !== '') {

    // }
}

import Swal from 'sweetalert2'

import 'sweetalert2/src/sweetalert2.scss'
const cancel = () => {
    isCloseModal.value = true
    // Swal.fire({
    //     //title: "Kaydedilmemiş değişiklikleriniz var, çıkış yapmak istediğinizden emin misiniz?",
    //     text: "Kaydedilmemiş değişiklikleriniz var, çıkış yapmak istediğinizden emin misiniz?",
    //     icon: "warning",
    //     heightAuto: false,
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: "Evet",
    //     cancelButtonText: "Vazgeç",
    //     customClass: {
    //         container: 'custom-swal' // Burada customClass kullanıyoruz
    //     }
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         Swal.fire({
    //             title: "İşlem iptal edildi",
    //             icon: "success",
    //             heightAuto: false,
    //             customClass: {
    //                 container: 'custom-swal' // Burada da customClass kullanıyoruz
    //             }
    //         });
    //         router.push("/home")
    //     }
    // });
};

const confirmExit = () => {
    isCloseModal.value = false
    router.push('/home')
}
const confirmCancel = () => {
    isCloseModal.value = false
}

</script>



<style >
.custom-toast {
    background-color: purple !important;
    color: white !important;
}

.custom-swal .swal2-title {
    font-size: 10px !important;
    /* Başlık metninin boyutunu ayarlayın */
}

#swal2-title {
    font-size: 10px !important;
}

.custom-swal .swal2-text {
    font-size: 1px !important;
    /* Metin boyutunu ayarlayın */
}

.swal2-popup {
    font-size: 1rem;
    /* Genel font boyutu */
}

.swal2-title {
    font-size: 1.5rem;
    /* Başlık font boyutu */
}

.swal2-html-container {
    font-size: 1rem;
    /* Metin font boyutu */
}

ion-modal#product-detail-modal-notif {
    --width: 300px;
    --height: fit-content;
    --border-radius: 40px;
    --height: 360px;
    --overflow: visible;
    --background: none;


    .wrapper {

        width: 300px;
        height: 360px;
        border-radius: 40px;
        background-color: white;

        img {

            margin-right: 10px;
            width: 300px;
        }

        #btn {
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
</style>