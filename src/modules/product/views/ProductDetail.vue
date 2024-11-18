<template>
    <ion-page>
        <Header />

        <ion-content>
            <div class="product-slider" v-if="productImagesLoading">
                <ion-skeleton-text class="product-slider-loading" :animated="true" />
            </div>
            <div class="product-slider" style="padding: 20px; " v-else>


                <swiper style="" :modules="modules" :pagination="true" class="m-b-5" v-if="productImages.length > 0">
                    <swiper-slide @click="showİmage" v-for="(i, index) in productImages" :key="index">
                        <img :src="i.image" class="swiper-slide-image" />
                    </swiper-slide>
                </swiper>
            </div>

            <ion-modal style="--background: transparent;" id="product-detail-modal-image" ref="imageModal"
                :is-open="isİmageModalOpen" @did-dismiss="onİmageModalDismiss" :css-class="'modal-fullscreen'">
                <swiper style="height: 100vh; width: 99vw; background-color:transparent" :modules="modules"
                    :navigation="true" :pagination="{ clickable: true }" :scrollbar="{ draggable: true }">
                    <swiper-slide v-for="(i, index) in productImages" :key="index"
                        style="display: flex; justify-content: center; align-items: center;">
                        <img :src="i.image"
                            style="max-height: 100vh; max-width: 100vw; width: 95%; height: 90%; object-fit: cover;" />
                    </swiper-slide>
                </swiper>
            </ion-modal>

            <div class="product-grid">
                <div class="product-title">
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-120 height-22" :animated="true" />
                    </span>
                    <span v-else>
                        {{ productDetail?.name }}

                    </span>
                </div>
                <div v-if="isMeProduct" class="product-detail-likes ripple-parent ripple-likes ion-activatable"
                    @click="isLiked = !isLiked">
                    <ion-icon color="primary" :icon="heart" v-if="isLiked" @click="deleteFavorites()" />
                    <ion-icon color="primary" :icon="heartOutline" v-else @click="addFavorite()" />
                    <span>{{ isLiked! ? productDetail?.favorite_count : productDetail?.favorite_count }}</span>
                    <ion-ripple-effect />
                </div>

            </div>

            <ion-row size="5"
                style="padding: 5px; position:absolute; right:10px; width:30%; height: 5%; display:flex;   justify-content: space-around ">
                <img @click="showCardActions" style="height: 30px;" src="@/assets/share.png" alt="">

            </ion-row>

            <!--
          <div class="product-grid m-b-10">
            <div class="product-title">
                  <span v-if="productDetailLoading">
                      <ion-skeleton-text class="width-120 height-22" :animated="true" />
                  </span>
                  <span v-else>
                      {{ productDetail?.name }}
                  </span>
              </div>

              <div class="product-detail-time">
                  <ion-icon color="primary" :icon="calendarOutline" />
                  <span class="m-t-1" v-if="productDetailLoading">
                      <ion-skeleton-text class="width-75 height-20" :animated="true" />
                  </span>
                  <span v-else> {{ formattedDate }}</span>
              </div>
          </div>
          -->
            <page-header title="İlan Bilgileri" paddingLeft="15px" paddingRight="15px" />
            <div class="user-info-wrapper">
                <div @click="userProfile" class="user-info">
                    <img v-if="productDetail?.owner.photo == null" src="@/assets/no-avatar.png" alt="Avatar"
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                    <img v-else :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + productDetail?.owner.photo"
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                    <div class="font-size-16 is-font-bold">
                        <span v-if="productDetailLoading">
                            <ion-skeleton-text class="width-100 height-20" :animated="true" />
                        </span>
                        <span v-else>
                            {{ productDetail?.owner.name }}
                        </span>
                    </div>
                </div>

                <div class="user-info" style="margin-left: 30px;" v-if="isMeProduct">

                    <div class="font-size-16 is-font-bold"
                        style="display: flex; justify-content: space-between; align-items: center;">
                        <span v-if="productDetailLoading">
                            <ion-skeleton-text class="width-100 height-20" :animated="true" />
                        </span>
                        <span @click="sendMessage"
                            style="background-color: #8F1B69; font-size:11px; font-weight: normal; color:white; padding: 2px; border-radius:5px; margin-left: 100px;"
                            v-else>
                            Satıcıya mesaj gönder
                        </span>
                    </div>
                </div>


                <div class="user-score-wrapper">
                    <!--
                    <div class="user-score">
                        <ion-icon color="primary"
                                  :icon="star"
                        />
                        <span v-if="productDetailLoading">
                            <ion-skeleton-text class="width-70 height-20"
                                               :animated="true"
                            />
                        </span>
                        <span v-else>
                            5.0
                        </span>
                    </div>
                    <div class="user-score-detail">
                        Değerlendirmeleri Gör
                    </div>
                    -->
                    <!--
                  TODO::Arama ve Mesaj butonu icon eklenecek. ilanda verilen izne göre görüntüleyecek.
                  -->
                </div>
            </div>

            <div class="product-detail-list" @click="closePopup">
                <div class="product-detail-list-item">
                    <span>İlan No</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-100 height-20" :animated="true" />
                    </span>
                    <span v-else>
                        {{ productDetail?.ad_no }}

                    </span>
                </div>
                <div class="product-detail-list-item">
                    <span>İlan Tarihi</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-100 height-20" :animated="true" />
                    </span>
                    <span v-else> {{ formattedDate }}</span>
                </div>
                <div class="product-detail-list-item">
                    <span>Konum</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-150 height-20 no-margin" :animated="true" />
                    </span>
                    <span v-else>{{ productDetail?.city.name }} / {{ productDetail?.district.name }}</span>
                </div>
                <div class="product-detail-list-item">
                    <span>İletişim</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-150 height-20 no-margin" :animated="true" />
                    </span>
                    <a style="text-decoration: none;" :href="`tel:${formattedPhone}`">{{ formattedPhone }}</a>

                </div>
                <div class="product-detail-list-item">
                    <span>Kategori</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-150 height-20 no-margin" :animated="true" />
                    </span>
                    <span v-else>
                        {{ productDetail?.categories[0].name }}
                    </span>
                </div>
                <!-- <div class="product-detail-list-item">
                    <span>Model</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-150 height-20 no-margin" :animated="true" />
                    </span>
                     <span v-else>{{ productDetail?.product_code }}</span> 
                </div> -->
                <div class="product-detail-list-item">
                    <span>Açıklama</span>
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-150 height-20 no-margin" :animated="true" />
                    </span>
                    <span>
                        {{ productDetail?.description }}
                    </span>
                </div>




            </div>

            <ion-modal id="product-detail-modal" ref="firstModal" :is-open="isFirstModalOpen"
                @did-dismiss="onFirstModalDismiss">
                <div class="wrapper">
                    <div class="takasimo-logo">
                        <img src="@/assets/takasimo-icon.png" />
                    </div>
                    <div class="modal-close-button ion-activatable ripple-parent">
                        <ion-icon color="primary" @click="closeFirstModal" :icon="closeOutline" size="large" />
                        <ion-ripple-effect></ion-ripple-effect>
                    </div>
                    <ion-label>
                        <div class="label1">
                            Takasimo hesabında hem satış yapabilir<br>
                            hem de istediğin gibi takaslayabilirsin.
                        </div>
                    </ion-label>
                    <ion-label>
                        <div class="label2">
                            Hemen şimdi teklif ver!
                        </div>
                    </ion-label>
                    <ion-button @click="goToBuyProduct" expand="block" class="m-b-10">
                        Satın Al
                    </ion-button>
                    <ion-button :disabled="productDetail?.swap == false ? true : false" expand="block"
                        @click="openSecondModal">
                        Takasla
                    </ion-button>
                </div>
            </ion-modal>

            <ion-modal id="product-detail-modal" ref="messsageModal" :is-open="isMessageModalOpen"
            @did-dismiss="closeMessageModal">
     <div class="wrapper" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
 
         <div class="modal-close-button ion-activatable ripple-parent">
             <ion-icon color="primary" @click="closeMessageModal" :icon="closeOutline" size="large" />
             <ion-ripple-effect></ion-ripple-effect>
         </div>
 
         <!-- Başlık Eklendi -->
         <div style="margin-bottom: 20px; font-size: 18px; font-weight: bold; text-align: center;">
             Satıcıyla İletişime Geçin
         </div>
         <div style="margin-bottom: 20px; width: 80%; font-size: 14px; text-align: center; color: #555;">
            Bu ürün hakkında sormak istediklerinizi veya teklifinizi mesajla iletin. Satıcı sizinle doğrudan iletişime geçecek.
        </div>
 
         <div class="label1">
             <textarea v-model="formData.latest_offer.message" placeholder="Mesajınızı buraya yazın..." name="" id=""
                 rows="2" cols="50" style="width: 100%; height: auto; border:none; border-bottom:1px solid gainsboro; resize: none;"></textarea>
         </div>
 
         <div style="display: flex; justify-content: flex-end; width:90%;">
             <button @click="sendMessageResponse"
                 style="width: 100%; padding: 10px; background-color: #8F1B69; color:white; border-radius: 10px;"
                 class="m-b-10">
                Gönder
             </button>
         </div>
 
     </div>
 </ion-modal>
 
            <ion-modal id="product-detail-modal" ref="secondModal" :is-open="isSecondModalOpen"
                @did-dismiss="onSecondModalDismiss">
                <div class="wrapper">

                    <div class="takasimo-logo">
                        <img src="@/assets/takasimo-icon.png" />
                    </div>
                    <div class="modal-close-button ion-activatable ripple-parent">
                        <ion-icon color="primary" @click="closeSecondModal" :icon="closeOutline" size="large" />
                        <ion-ripple-effect></ion-ripple-effect>
                    </div>

                    <ion-label>
                        <div class="label2" style="font-size: 16px;">
                            Takaslamak istediğin ilanını seç
                        </div>
                    </ion-label>

                    <div v-if="meProducts.length > 0" class="product-card"
                        style="display: flex; flex-direction: column;">
                        <div class="not" style="display: flex; flex-direction: row;">
                            <div class="row" v-for="i in meProducts">
                                <div class="card-header">
                                    <img :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + i?.showcase_image" />
                                </div>
                                <div class="card-body">
                                    <p style="font-size:11px;">{{ i.name }}</p>
                                    <span style="font-size:9px;" >{{ productDetail?.city.name }} / {{ productDetail?.district.name }}</span>
                                </div>
                                <div class="card-footer">
                                    <!-- <ion-checkbox :checked="isSelected(i)"
                                        @ionChange="(e: CustomEvent<any>) => handleCheckboxChange(e, i)"></ion-checkbox> -->
                                    <ion-checkbox
                                        @ionChange="(e: CustomEvent<any>) => handleCheckboxChange(e, i)"></ion-checkbox>
                                </div>

                            </div>
                            <!-- <div class="row"
                                style="background-color: gainsboro; width: 100%; height:170px; display: flex !important; justify-content: center !important; align-items: center !important;">
                                <div class="card-body"
                                    style="width:100%; height:50%; text-align: center; padding:10px; border-radius: 8px;">
                                    <p @click="goToProductList"
                                        style="font-size: 2rem; margin: 0; font-weight: bold; color:#8F1B69">+</p>
                                    <p @click="goToProductList" style="margin: 0; font-size: 0.9rem;">Tüm İlanları Gör..
                                    </p>
                                </div>

                            </div> -->
                        </div>

                        <div
                            style="margin: 0px; display: flex; flex-direction: column; position: fixed; bottom: 30px; width: 100%; align-items: center; justify-content: center; padding: 8px;">
                            <p v-if="selectedProducts.length > 0" style="margin: 0px;">{{ selectedProducts.length }}
                                Ürün Seçildi</p>
                            <button @click="goToOffer"
                                style="background-color: #8F1B69 ; padding: 7px; border-radius: 1vh;  color: white; width: 45%;">Teklif
                                Ver</button>
                        </div>
                    </div>

                    <div v-else class="empty-product-card" style="display: flex; flex-direction: column;">
                        <div class="empty-row"
                            style="display: flex !important; flex-direction: row !important;  justify-content: space-around; align-items: center;">
                            <div class="empty-item-card" v-for="i in 3"
                                style="height: 150px; background-color: gainsboro; border-radius: 1vh;  width: 30%; ">
                                <div class="empty-card-header"> </div>

                                <div class="empty-card-body"
                                    style="display: flex; flex-direction: column;   justify-content: center;  align-items: center; width: 100%;  height:100%;">
                                    <p
                                        style="margin: 0px; padding: 0px; font-size: 28px; color: gray; font-weight: bold">
                                        +</p>
                                    <p
                                        style="margin: 0px; padding: 0px; font-size: 11px; color: gray; font-weight: bold">
                                        İlan oluştur</p>
                                </div>
                            </div>
                        </div>
                        <div class="empty-info" style="width: 100%; display: flex; justify-content: center;">
                            <p>Henüz İlan Yok</p>
                            <button @click="createProduct">İlan Oluştur</button>
                        </div>
                    </div>
                </div>
            </ion-modal>


        </ion-content>

        <ion-footer v-if="isMeProduct">
            <div class="product-footer">
                <div class="product-price">
                    <span v-if="productDetailLoading">
                        <ion-skeleton-text class="width-100 height-26" :animated="true" />
                    </span>
                    <span v-else-if="productDetail?.price && productDetail?.currency">
                        {{ moneyFormat(productDetail.price, productDetail.currency) }}
                    </span>
                </div>
                <div class="product-offer-button">
                    <ion-button color="primary" @click="openFirstModal">
                        Teklif Ver
                    </ion-button>
                </div>
            </div>

        </ion-footer>


        <ion-row v-if="cardActionsShow"
            style="width: 100%; display: flex; background-color: #F3F2F6;  justify-content: center; align-items: center; height: 145px; position: absolute; bottom:0px; z-index: 999;   ">
            <ion-col size="6" style="margin: 0; height: 50px;">
                <ion-row size="12" style="justify-content: space-between; ">


                    <!-- Icon 2 -->
                    <ion-col size="4" style="display: flex; justify-content: center; align-items: center; padding: 0;">
                        <a :href="'https://api.whatsapp.com/send?text=' + encodeURIComponent('Bu ilana göz atın: ') + encodeURIComponent(currentUrl)"
                            target="_blank">
                            <img style="height: 50px; width: 50px; border-radius: 50%; border: 2px solid white;"
                                src="@/assets/wp.png" alt="WhatsApp Icon">
                        </a>
                    </ion-col>



                    <ion-col size="4" style="display: flex; justify-content: center; align-items: center; padding: 0;">
                        <a :href="twitterShareUrl" target="_blank">
                            <img style="height: 50px; width: 50px; border-radius: 50%; border: 2px solid white;"
                                src="@/assets/twitter.png" alt="Icon 1">
                        </a>
                    </ion-col>




                </ion-row>
            </ion-col>

            <ion-col size="12" style="border-bottom: 1px solid gray;"></ion-col>
          

            <ion-col size="12" style="margin: 0; height: 100px;">
                <ion-row size="12">
                  <!-- E-posta Iconu -->
                  <ion-col size="4" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <a :href="'mailto:?subject=İlginç Bir Link&body=Bu ilana göz atın: ' + encodeURIComponent(currentUrl)"
                       target="_blank">
                      <img style="height: 50px; width: 50px; border-radius: 50%; border: 2px solid white;"
                           src="@/assets/eposta.png" alt="E-posta Iconu">
                    </a>
                    <span style="font-size: 12px; color: #333;">E-posta</span>
                  </ion-col>
              
                  <!-- Link Iconu -->
                  <ion-col size="4" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                   
                    <img  @click="copyUrl()" style="height: 50px; width: 50px; border-radius: 50%; border: 2px solid white;"
                         src="@/assets/link.png" alt="Link Iconu">
                         <span @click="copyUrl()" style="font-size: 12px; color: #333;">Kopyala</span>
                  </ion-col>
              
                  <!-- Daha Fazla Iconu -->
                  <ion-col size="4" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <img @click="handleShare" style="height: 50px; width: 50px; border-radius: 50%; border: 2px solid white;"
                         src="@/assets/Group739.png" alt="Daha Fazla Iconu">
                    <span @click="handleShare" style="font-size: 12px; color: #333;">Daha Fazla</span>
                  </ion-col>
                </ion-row>
              </ion-col>
              
            <ion-col size="12" style="border-bottom: 1px solid gray;"></ion-col>
        </ion-row>



        <ion-row v-if="isMeProduct === false">
            <ion-col size="12">
                <ion-row>
                    <ion-col size="6">
                        <ion-button @click="goEdit" expand="block">Düzenle</ion-button>
                    </ion-col>
                    <ion-col size="6">
                        <ion-button @click="deleteProduct" expand="block">Yayından Kaldır</ion-button>
                    </ion-col>
                </ion-row>
            </ion-col>
        </ion-row>

        <ion-modal id="product-detail-modal-notif" ref="notification" :is-open="isNotificationOpen"
            @did-dismiss="onFirstModalDismiss">
            <div class="wrapper">


                <!-- <div class="modal-close-button ion-activatable ripple-parent">
                            <ion-icon color="primary" @click="closeFirstModal" :icon="closeOutline" size="large" />
                           
                        </div> -->
                <div>
                    <img src="@/assets/notif.png" />
                </div>

                <ion-label>
                    <div class="label2" style="font-size: 16px;">
                        <p style="font-size: 20px; margin-bottom: 10px;">Teklif Gönderildi</p>
                    </div>
                </ion-label>

                <div
                    style=" width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <button
                        style="width: 60%; color:white;   margin-bottom: 10px; border-radius: 10px; height: 40px; background-color: #901B6A   "
                        @click="toMessagePage"> Tekliflerim</button>
                    <button
                        style="width: 60%; color:white;   margin-bottom: 10px; border-radius: 10px; height: 40px; background-color: #901B6A  ">
                        Diğer ürünleri keşfet</button>
                </div>
            </div>
        </ion-modal>


    </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { IonActionSheet, IonButton, IonContent, IonCheckbox, IonFooter, IonRow, IonCol, IonIcon, IonLabel, IonModal, IonPage, IonRippleEffect, IonSkeletonText } from '@ionic/vue';
import { calendarOutline, closeOutline, heart, heartOutline, timeOutline, eyeOutline, logoFacebook, logoInstagram, logoWhatsapp, mail } from 'ionicons/icons';


import { useSwapStore } from '@/stores/swapStore'; // Store'u import edin
const store = useSwapStore()


import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Scrollbar } from 'swiper/modules';



import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import '@ionic/vue/css/ionic-swiper.css';

const modules = [Navigation, Pagination, Scrollbar]

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Services
import productApi from "@/services/productApi";
import favoritesApi from '@/services/favoritesApi';

// Helpers
import { moneyFormat } from "@/helpers/moneyHelpers";
import authApi from '@/services/authApi';
import { FetchMessageList } from '@/helpers/messageCount';
import messageApi from '@/services/messageApi';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


const cardActionsShow = ref(false);

const handleShare = async () => {
      // navigator.share() API'sini kontrol et
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Web Sayfam',
            text: 'Bu sayfayı çok beğendim!',
            url: window.location.href,
          });
          console.log('Paylaşım başarılı!');
        } catch (error) {
          console.error('Paylaşım sırasında bir hata oluştu:', error);
        }
      } else {
        alert('Bu özellik sadece mobil cihazlarda kullanılabilir.');
      }
    };


const showCardActions = () => {
    cardActionsShow.value = true;
};

// Other
const route = useRoute();
const router = useRouter();

// Data
const isLiked = ref<boolean>(false);
//const modal = ref();
//const sliderImages = ref<any[]>([]);

const meProducts = ref<any[]>([]);
const selectedProducts = ref<any[]>([]);
const productImages = ref<any[]>([]);
const productImagesLoading = ref<boolean>(false);
const productDetail = ref<any>(null);
const productDetailLoading = ref<boolean>(false);
const isFirstModalOpen = ref(false);
const isSecondModalOpen = ref(false);
const firstModal = ref<HTMLIonModalElement | null>(null);
const secondModal = ref<HTMLIonModalElement | null>(null);
const messageModal = ref<HTMLIonModalElement | null>(null);
const isMessageModalOpen = ref(false)
const isNotificationOpen = ref(false)
const notification = ref<HTMLIonModalElement | null>(null);
const swapProductCode = ref<string>('');
const createdAt = ref<string>('');
const updatedAt = ref<string>('');
let ownerUserCode = ref<string>('');
const isMeProduct = ref<boolean>();




let sendMessageUserName = ref<string>('');

const currentUrl = ref(window.location.href);
const tweetText = ref('Bu ilana göz atın');

const twitterShareUrl = computed(() => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText.value)}&url=${encodeURIComponent(currentUrl.value)}`;
});

const copyUrl = async () => {
      try {
        // `navigator.clipboard.writeText()` ile URL'yi panoya kopyala
        await navigator.clipboard.writeText(currentUrl.value);
        alert('URL panoya kopyalandı!');
      } catch (err) {
        alert('Kopyalama işlemi başarısız oldu!');
        console.error('Kopyalama hatası: ', err);
      }
    };


const goEdit = () => {
    //console.log("test")
    router.push({ name: 'myAdsDetail', params: { code: productCode.value } })
}


const deleteProduct = async () => {
    let item = route.params.code as string;
    console.log(item);

    // Yeni nesne oluştur
    const dataToSend = {
        product_code: item,
        status: false, // status değerini true yap
    };

    try {
        const response = await productApi.productUpdate(dataToSend);
        // Başarılı yanıt alındığında yapılacak işlemler
        $toast.success('İlan yayından kaldırıldı!', {
            position: 'top',
        })
        console.log("Ürün güncellendi:", response);
    } catch (error) {
        // Hata durumunda yapılacak işlemler
        console.error("Güncelleme işlemi başarısız:", error);
    }
};


const productCode = ref<string>(route?.params?.code as string);
const product_code_images = ref<any[]>([])

const getImages = async () => {
    productImagesLoading.value = true;
    // console.log('getImages - product_code_images:', product_code_images.value);

    try {
        const res = await productApi.getImages(productCode.value, product_code_images.value);
        let images = res?.data?.data ?? [];
        //console.log('Gelen veri:', images);

        productImages.value = images.map((item: { image: string }) => {
            // URL sınıfını kullanarak URL oluştur
            const url = new URL(item.image, 'https://takasimos3.s3.eu-north-1.amazonaws.com');
            // URL path'ini değiştir
            url.pathname = url.pathname.replace('/240/', '/320/');
            // Yeni URL'yi döndür
            return {
                ...item,
                image: url.href
            };
        });

        //console.log('Düzenlenmiş veri:', productImages.value);
    } catch (error) {
        console.error('getImages hatası:', error);
    } finally {
        productImagesLoading.value = false;
    }
}





const getDetail = async () => {
    productDetailLoading.value = true;

    try {
        const res = await productApi.get(productCode.value);
        formData.value._to = res.data.owner.user_code;
        formData.value.latest_offer.product_name = res.data.name
        formData.value.latest_offer.showcase_image = res.data.showcase_image
        formData.value.latest_offer.targetName = res.data.owner.name
        formData.value.latest_offer.targetOwnerInfo = res.data.owner
        sendMessageUserName.value = res.data.owner.name


        interface User {
            name: string;
            // Diğer özellikler buraya eklenebilir
        }

        // localStorage'dan kullanıcıyı al
        let myUserName: string | null = localStorage.getItem('user');

        // Kullanıcı mevcutsa
        if (myUserName) {
            try {
                // JSON string'ini parse et
                const parsedUser: User = JSON.parse(myUserName);

                // name özelliğini al
                const userName = parsedUser.name;

                formData.value.latest_offer.meName = userName;
            } catch (error) {
                console.error("JSON çözme hatası:", error);
            }
        } else {
            console.log("localStorage'da kullanıcı bulunamadı.");
        }


        console.log(formData.value)
        console.log(res.data.favorited, "Veri")
        if (res.data.favorited !== null && res.data.favorited !== "") {
            isLiked.value = true
        }


        //formData.value.latest_offer.to.push(res.data)
        productDetail.value = res?.data ?? null;
        console.log("xx", productDetail.value)
        product_code_images.value = res.data.images;
        createdAt.value = res.data.created_at;
        updatedAt.value = res.data.updated_at;
        ownerUserCode.value = res.data.owner.user_code;

        //console.log('getDetail - product_code_images (after update):', product_code_images.value);

        let userCode = localStorage.getItem('user');
        if (userCode !== null) {
            try {
                const parsedUserCode = JSON.parse(userCode);
                let user_code = parsedUserCode.user_code;
                let user_code2 = productDetail.value.owner.user_code;
                isMeProduct.value = user_code !== user_code2;
                //console.log(isMeProduct.value)
            } catch (e) {
                console.error('JSON parse hatası:', e);
            }
        } else {
            console.log('user bulunamadı');
        }

        //console.log('Calling getImages with updated product_code_images...');
        await getImages();
    } catch (error) {
        console.error('getDetail hatası:', error);
    } finally {
        productDetailLoading.value = false;
    }
}




const formattedPhone = computed(() => {
    const phone = productDetail.value?.owner?.phone;
    if (phone) {
        const cleaned = phone.replace(/\D/g, ''); // Sayılardan başka her şeyi kaldır
        if (cleaned.length === 10) { // 10 haneli olmalı (0'ı atlayarak)
            return `0 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
        }
    }
    return 'Doğrulanmamış';
});

watch(
    () => route.params.code, // Route parametresini izleyin
    (newId, oldId) => {
        getDetail()

        console.log("deneme", route.params.code)
        let item = localStorage.getItem("swapNotification");
        if (item) {
            let parse = JSON.parse(item);
            if (parse.isTrue === true) {
                console.log("sdfsdf", parse)

                isNotificationOpen.value = true
                //localStorage.removeItem("swapNotification");
                setTimeout(() => {
                    store.setSwapNotification({ isTrue: false });
                }, 1500)

            }

        } else {
            console.log("swapNotification anahtarı bulunamadı.");
        }

    },

    { immediate: true } // İlk değerle hemen çalıştır
);

const goToProductList = () => {
    router.push({ name: 'my-ads' });
    isSecondModalOpen.value = false;
};


const openFirstModal = () => {
    isFirstModalOpen.value = true;
    store.clearSwap()
    store.clearTargetSwap()

};

const sendMessage = () => {
    isMessageModalOpen.value = true;
}

const closeMessageModal = () => {
    isMessageModalOpen.value = false;
}



const isİmageModalOpen = ref(false)
const showİmage = () => {
    isİmageModalOpen.value = true;
}

const onİmageModalDismiss = () => {
    isİmageModalOpen.value = false;
}




const formData = ref<any>({
    _to: "",
    latest_offer: {
        swapStatus: true,
        offerStatus: true,
        readStatus: false,
        product_name: "",
        showcase_image: "",
        targetName: '',
        meName: '',
        offer_type: "request",
        price: "",
        currency: "TRY",
        message: "",
        productMessage: "",
        from: [],
        to: [],
        meOwnerInfo: {},
        targetOwnerInfo: {}
    },
    from: false,
    to_is_deleted: false
})

const sendMessageResponse = async () => {
    isMessageModalOpen.value = false;
    try {
        const res = await messageApi.sendMessage(formData.value);
        console.log(res.data);
        router.push({ name: 'messages' });
    } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        router.push({ name: 'login' });
    }
};




const goToOffer = () => {
    isSecondModalOpen.value = false;
    router.push({ name: 'swap' });
    let productCodes = {
        product_code: route.params.code as string,
        user_code: productDetail.value.owner.user_code
    }
    store.targetSwapSet(productCodes);
}

const closeFirstModal = () => {
    isFirstModalOpen.value = false;
};

// const openSecondModal = async () => {
//     if (firstModal.value) {
//         // İlk modal kapatılırken ikinci modal açılmadan önce bir gecikme uygula
//         closeFirstModal();
//         setTimeout(() => {
//             isSecondModalOpen.value = true;
//         }, 300); // İlk modalın kapanmasını beklemek için 300ms gecikme
//     }

//     try {
//         const res = await authApi.meProducts();
//         let item = res.data.products;

//         // Eğer veri varsa ve veri bir dizi ise, sadece ilk 5 ürünü göster
//         if (item && Array.isArray(item)) {
//             meProducts.value = item.slice(0, 5).map((element: any) => element.product);
//         } else {
//             meProducts.value = []; // Veri yoksa boş bir dizi ile başla
//         }
//     } catch (error) {
//         console.error('Ürünler alınırken bir hata oluştu:', error);
//         meProducts.value = []; // Hata durumunda boş bir dizi ile başla
//     }
// };


const openSecondModal = async () => {
    if (firstModal.value) {
        // İlk modal kapatılırken ikinci modal açılmadan önce bir gecikme uygula
        closeFirstModal();
        setTimeout(() => {
            isSecondModalOpen.value = true;
        }, 300); // İlk modalın kapanmasını beklemek için 300ms gecikme
    }

    try {
        const res = await authApi.meProducts();
        let item = res.data.products;

        // Eğer veri varsa ve veri bir dizi ise, tüm ürünleri göster
        if (item && Array.isArray(item)) {
            meProducts.value = item.map((element: any) => element.product);
        } else {
            meProducts.value = []; // Veri yoksa boş bir dizi ile başla
        }
        //console.log(meProducts)
    } catch (error) {
        console.error('Ürünler alınırken bir hata oluştu:', error);
        meProducts.value = []; // Hata durumunda boş bir dizi ile başla
    }
};



const closeSecondModal = () => {
    selectedProducts.value = [];
    isSecondModalOpen.value = false;
};

const onFirstModalDismiss = () => {
    isFirstModalOpen.value = false;
};

const onSecondModalDismiss = () => {
    selectedProducts.value = [];
    isSecondModalOpen.value = false;
};


// Functions
const createProduct = () => {
    router.push({ name: 'product-create', params: { code: productCode.value } });
    isSecondModalOpen.value = false;
}

const goToBuyProduct = () => {

    router.push({ name: 'buy-product', params: { code: productCode.value } });
    isFirstModalOpen.value = false;
    //  console.log(productCode.value)
}


const handleCheckboxChange = (event: CustomEvent, item: any): void => {
    const isChecked = (event.detail as { checked: boolean }).checked;
    // Eğer isChecked true ise çalışacak yapı

    if (isChecked) {
        // Eğer aynı elemandan yoksa ekle
        if (!selectedProducts.value.some(existingItem => existingItem.ad_no === item.ad_no)) {
            selectedProducts.value.push(item);
            selectedProducts.value.forEach((element: any) => {
                store.swapSet(element);
            });
        }
    } else {
        // item'ın ad_no'suna göre elemanı çıkart
        selectedProducts.value = selectedProducts.value.filter(existingItem => existingItem.ad_no !== item.ad_no);

        //Store dan çıkart
        store.removeProduct(item.ad_no);
    }

    // swapProductCode'yu güncelle
    swapProductCode.value = item.product_code;

};


const formattedDate = computed<string>(() => {
    const date = new Date(createdAt.value);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long', // Uzun biçimde ay adı (örneğin, 'Ağustos')
        day: 'numeric' // Gün
    };

    return date.toLocaleDateString('tr-TR', options);
});

const timeAgo = computed<string>(() => {
    const now = new Date();
    const updatedDate = new Date(updatedAt.value);

    const diffTime = now.getTime() - updatedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Gün cinsinden fark

    if (diffDays === 0) {
        return 'Bugün güncellendi';
    } else if (diffDays === 1) {
        return '1 gün önce güncellendi';
    } else {
        return `${diffDays} gün önce güncellendi`;
    }
});

const addFavorite = () => {
    let data = {
        product_code: null,
        search: null,
        is_deleted: false,
        seller_code: null
    };
    productApi.get(productCode.value)
        .then((res) => {
            data.seller_code = null;
            data.product_code = res.data.owner.product_code;
            return favoritesApi.favoritesSettings(data); // API çağrısını yapın
        })
        .then((res) => {
            // console.log(res.data.data); // Başarı durumunda loglama
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                // Yönlendirme yapılacak URL'yi belirleyin
                router.push('/login');
            } else {
                console.error('Hata oluştu:', error); // Diğer hataları loglama
            }
        });


    $toast.success('Favorilere eklendi', { position: 'top' });


};


const toMessagePage = () => {
    isNotificationOpen.value = false
    router.push({ name: 'messages' });
}


const deleteFavorites = () => {
    console.log("test")
    let data = {
        product_code: null,
        search: null,
        is_deleted: true,
        seller_code: null
    };
    //Urun kodunu çekiyorum
    productApi.get(productCode.value)
        .then((res) => {
            data.product_code = res.data.owner.product_code;
            return favoritesApi.favoritesDelete(data); // API çağrısını yapın
        })
        .then((res) => {
            //console.log(res.data); // Başarı durumunda loglama
        })
        .catch((error) => {
            if (error.response && error.response.status === 401) {
                // Yönlendirme yapılacak URL'yi belirleyin
                router.push('/login');
            } else {
                console.error('Hata oluştu:', error); // Diğer hataları loglama
            }
        });

    $toast.error('Favorilerden kaldırıldı', { position: 'top' });

};


const userProfile = () => {
    router.push({ name: 'userDetails', params: { code: ownerUserCode.value } });
};

const closePopup = () => {

    cardActionsShow.value = false
}

// On Mounted
onMounted(() => {
    console.log(isMeProduct.value)
    setTimeout(() => {
        console.log(isMeProduct.value)
    }, 1500)
    if (!productCode.value) {
        router.push('/404');
    }
    else {
        // getImages();
        getDetail();
        //console.log(productDetail.value);
    }




})
</script>

<style lang="scss" scoped>
// SCSS Variables
$card-height: 250px;
$header-height: 100px;
$bg-color: rgb(202, 202, 202);
$row-bg-color: blue;
$header-bg-color: yellow;
$margin: 3px; // Margin between rows

// Product Card Styles
.product-card {
    display: flex;
    flex-direction: row;
    //background-color: $bg-color;
    border-radius: 1vh;
    width: 100%;
    flex-wrap: nowrap;
    overflow-x: auto; // Enable horizontal scroll
    overflow-y: hidden; // Hide vertical scroll
    height: $card-height;
    padding: $margin; // Add padding to accommodate margins of rows

    .row {
        flex: 0 0 calc(33.333% - 2 * $margin); // Adjust width to account for margins
        background-color: $bg-color;
        box-sizing: border-box; // Ensure padding and border are included in width
        margin: $margin; // Add margin between rows
        padding: 0px;
        border-radius: 1vh;

        &:last-child {
            margin-right: 0; // Remove margin for the last row to avoid extra space
        }

        .card-header {
            //background-color: $header-bg-color;
            height: $header-height;
            border-radius: 1vh;
            padding: 6px;

            img {
                object-fit: cover;
                height: 100%;
                width: 100%;
                border-radius: 1vh;
            }
        }

        .card-body {
            //padding: px;
            //background-color: yellow;
            height: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            p {
                margin: 0px;
                font-size: 13px;
            }

            span {
                font-weight: bold;
                font-size: 11px;
                margin: 0px;
                padding: 0px
            }
        }

        .card-footer {
            display: flex;
            width: 100%;
            height: 20%;
            justify-content: center;
            align-items: center;
            //background-color: pink
            // Define styles for card-footer if needed
        }
    }
}


.empty-info {
    width: 100%;

    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    button {
        background-color: #8F1B69;
        padding: 10px;
        border-radius: 1vh;
        color: white;
        width: 45%;
    }
}







.product-slider {
    padding: 15px 15px 0 15px;

    .swiper-slide-image {
        width: 100%;
        height: 250px;
        object-fit: contain;
        border-radius: 30px;
    }

    .product-slider-loading {
        width: 100%;
        height: 400px;
        border-radius: 30px;
    }
}

.no-detail-image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
    background: var(--primary-gray);
    border-radius: 30px;

    img {
        width: 100%;
        height: 400px;
        object-fit: cover;
    }
}

.product-grid {
    display: flex;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;

    .product-updated-time {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 70%;
        gap: 8px;
        justify-content: flex-start;

        .updatedContent {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            width: 80%;
            height: 70%;

            .ion-content {
                width: 10%;
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
            }

            .time-content {
                width: 90%;
                height: 100%;
                font-size: 12px;
                color: #777777;
            }

            span {
                font-weight: bold
            }
        }

        ion-icon {
            // width: 24px;
            // height: 24px;

        }
    }

    .product-detail-likes {
        display: flex;
        align-items: center;
        gap: 2px;
        justify-content: end;
        cursor: pointer;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: -10px;

        ion-icon {
            width: 24px;
            height: 24px;
        }

        span {
            margin-top: 5px;
            min-width: 20px;
        }
    }

    .product-title {
        font-size: 18px;
        font-family: var(--font-bold), sans-serif;
        position: relative;
        display: block;
        margin: auto 0;
    }

    .product-detail-time {
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: center;
        font-size: 12px;
        color: #777777;

        ion-icon {
            width: 24px;
            height: 24px;
        }

        span {
            margin-top: 5px;
        }
    }
}

.ripple-parent {
    position: relative;
    overflow: hidden;
}

.ripple-likes {
    height: 40px;
    border-radius: 10px;
}

.user-info-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid var(--primary-gray);

    .user-info {
        display: flex;
        align-items: center;
        gap: 10px;

        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
        }
    }

    .user-score-wrapper {
        display: flex;
        flex-direction: column;
        align-items: end;

        .user-score {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 5px;

            ion-icon {
                width: 24px;
                height: 24px;
            }

            span {
                margin-top: 5px;
            }
        }

        .user-score-detail {
            color: var(--primary);
            font-size: 14px;
            cursor: pointer;
        }
    }
}

.product-detail-list {
    padding-left: 15px;
    padding-right: 15px;

    .product-detail-list-item {
        border-bottom: .5px solid var(--primary-light-border);
        width: 100%;
        display: grid;
        grid-template-columns: 120px auto;
        padding: 0px;
        line-height: 30px;
        align-items: flex-start;

        span {
            &:first-child {
                font-family: var(--font-bold), sans-serif;
            }
        }
    }

    .product-detail-list-item:last-child {
        border-bottom: 0;
    }
}

ion-footer {
    background: var(--background-grey);
    padding: 10px 0;

    .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;

        .product-price {
            font-size: 18px;
            font-family: var(--font-bold), sans-serif;
        }

        .product-offer-button {
            ion-button {
                --padding-top: 7px;
                --padding-bottom: 7px;
                --padding-start: 40px;
                --padding-end: 40px;
                --border-radius: 10px;
                font-size: 16px;
                min-height: 40px;
            }
        }
    }
}

ion-modal#product-detail-modal {
    --width: 350px;
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

ion-modal#product-detail-modal-notif {
    --width: 380px;
    --height: fit-content;
    --border-radius: 50px;

    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 0px 0px 0px 0px;

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


ion-modal#product-detail-modal-image {
    --width: 480px;
    --height: 350px;
    --border-radius: 30px;

    --overflow: visible;


    .wrapper {
        padding: 60px 10px 20px 10px;


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





    }
}
</style>
