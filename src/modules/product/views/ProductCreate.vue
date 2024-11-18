<template>
  <ion-page ref="page">
    <Header />
    <p style="margin-left: 20px; font-weight: bold; font-size: 20px">İlan Oluştur</p>
    <!-- <PageHeader title="İlan Oluştur">
      <template #start-action>
        <ion-button class="go-to-back" @click="handleGoToBack()">
          <ion-icon slot="icon-only" :icon="chevronBackOutline" />
        </ion-button>
      </template>
</PageHeader> -->
    <ion-content>
      <form>
        <ion-list lines="full">


          <ion-item>
            <div class="image" style="
    width: 100%;
    height: 140px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
  ">
              <div style="
      display: flex; 
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 0px;
      border-radius: 10px;
      width: 100%; 
      height: 150px;
    ">

                <div type="button" @click="openFileInput()" style="
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 0px;
        width: 35%;
        height:65%;
        border-radius: 1vh;
        background-color: rgb(160, 10, 129);
      ">
                  <p style="
          font-weight: bold;
          text-align: center;
          color: white;
        ">
                    +
                    <br>Görsel Yükle
                  </p>
                </div>

                <div v-if="loadingBar" style=" 
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      ">
                  <img style="
          width: 30px;
          height: 30px;" src="../assets/loadingicon.svg">
                </div>

                <div v-if="multitpleImages.length !== 0" style="
        width: 100%;
        display: flex;
        overflow-x: scroll; /* Horizontal scroll if content overflows */
        overflow-y: hidden;
        padding: 10px;
        flex-direction: row;
        white-space: nowrap; /* Prevent wrapping */
      ">
                  <div v-for="(i, index) in multitpleImages" :key="index" style="
        display: flex;
  position: relative;
  flex-direction: column;
  min-width: 50%; /* Allow width to adjust based on content */
  padding: 5px;
  margin-left: 5px;
  overflow-y: scroll;
  overflow-x: auto; /* Eklendi */
          
         
        ">

                    <button type="button" @click="removeImg(i)" style="
        width: 15%;
        position: absolute;
        top:10px;
        margin-top: 9px;
        margin-bottom: 5px;
        margin-left:70%;
        height: 15px;
        border-radius: 1vh;
        color: purple;
        font-weight: bold;
      ">X</button>
      <img @click="selectedİmg(i)" :class="{ selected: formData.showcase_image === i.image }" style="
      height: 100px; /* Fixed height */
      max-width: 100%; /* Ensure image does not exceed container */
      object-fit: cover; /* Maintain aspect ratio */
      cursor: pointer;
      margin-right: 2px;
      padding-right:8px;
      padding-left:8px;
      border: 1px solid black;
      border-radius:23px !important;
    " :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + i.image">

                    <p v-show="formData.showcase_image === i.image" style="
            background-color: #8F1B69;
            position: absolute;
            left: 10px;
            top: 0px;
            padding: 5px;
            font-size: 0.8em;
            color:white; 
            border-top-left-radius: 1vh;
            
          ">
                      Vitrin Görseli
                    </p>

                  </div>
                  <div style="
          position: absolute;
          z-index: 999;
          border-radius:1vh;
          top: 35%;
          right: 20px;
         
          width:35%;
        ">
                    <p v-if="showToast">
                      Vitrin Görseli seçmek istediğiniz görseli seçiniz
                    </p>
                  </div>
                </div>

                <div v-if="multitpleImages.length != 0" style="
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 0%;
        height:80%;
        border-radius: 1vh;
        
      ">
                  <ion-button class="go-to-back" @click="showToast = !showToast">
                    <ion-icon slot="icon-only" :icon="helpCircle" />
                  </ion-button>
                </div>

                <input accept="image/jpeg,image/png,image/jpg" multiple style="display: none;" ref="fileInput"
                  @change="mountImages($event)" type="file" />

              </div>
            </div>
          </ion-item>


          <ion-item>
            <ion-label slot="start">İlan Başlığı</ion-label>
            <ion-textarea placeholder="Başlık giriniz" :clear-on-edit="true" :auto-grow="true" :rows="1"
              v-model="formData.name" />
          </ion-item>
          <ion-item>
            <ion-label slot="start">Fiyat</ion-label>
            <ion-input placeholder="Fiyat Giriniz." type="number" v-model="formData.price" />
          </ion-item>
          <ion-item>
            <ion-label slot="start">Açıklama</ion-label>
            <ion-textarea placeholder="Açıklama giriniz" :clear-on-edit="true" :auto-grow="true" :rows="1"
              v-model="formData.description" />
          </ion-item>


          <ion-item>
            <div :style="{ width: selectedProvince ? '73%' : '70%' }">
              <ion-select placeholder="İl" v-model="selectedProvince" ok-text="Tamam" cancel-text="İptal">
                <div slot="label">İl <ion-text color="danger"></ion-text></div>
                <ion-select-option v-for="(province, index) in provinceList" :key="index" :value="province.id">
                  {{ province.name }}
                </ion-select-option>
              </ion-select>
            </div>
          </ion-item>



          <ion-item id="createElement2">
            <div :style="{ width: selectedDistrict ? '72%' : '65%' }">
              <ion-select placeholder="İlçe" v-model="selectedDistrict" ref="districtSelect2"
                :disabled="selectedProvince === null">
                <div slot="label">
                  <ion-text color="black">İlçe</ion-text>
                </div>
                <ion-select-option v-for="(district, index) in districtList" :key="index" :value="district.id">
                  {{ district.name }}

                </ion-select-option>
              </ion-select>

            </div>
          </ion-item>

          <ion-item id="createElement">
            <div :style="{ width: selectedLocalizations ? '76%' : '65%' }">
              <ion-select placeholder="Mahalle" v-model="selectedLocalizations" ref="districtSelect"
                :disabled="localizationsList.length === 0">
                <div slot="label">Mahalle <ion-text color="danger"></ion-text></div>
                <ion-select-option v-for="(district, index) in localizationsList" :key="index" :value="district.id">
                  {{ district.name }}
                </ion-select-option>
              </ion-select>
            </div>
          </ion-item>






          <!-- <ion-item  v-if="districtList.length > 0">
            <ion-label slot="start">İlçe</ion-label>
            <ion-select placeholder="İlçe" v-model="selectedDistrict">
              <ion-select-option v-for="(district, index) in districtList" :key="index" :value="district.id">

                {{ district.name }}
              </ion-select-option>

            </ion-select>
          </ion-item> -->

          <!-- <ion-modal @did-dismiss="onKvkkModal3Dismiss" :is-open="kvkkModalShow3" id="product-detail-modal">
            <ion-item  v-if="districtList.length > 0">
              <ion-label slot="start">İlçe</ion-label>
              <ion-select placeholder="İlçe" v-model="selectedDistrict">
                <ion-select-option v-for="(district, index) in districtList" :key="index" :value="district.id">

                  {{ district.name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-modal> -->




          <!-- <ion-modal @did-dismiss="onKvkkModal2Dismiss" :is-open="kvkkModalShow2" id="product-detail-modal"
            @ionModalDidPresent="showSelectOptions">
           
          </ion-modal> -->




          <!-- <ion-item  v-if="localizationsList.length > 0">
            <ion-label slot="start">Mahalle</ion-label>
            <ion-select placeholder="Mahalle" v-model="selectedLocalizations">
              <ion-select-option v-for="(district, index) in localizationsList" :key="index" :value="district.id">
                {{ district.name }}
              </ion-select-option>
            </ion-select>
          </ion-item> -->




          <!-- <ion-item>
            <ion-label slot="start">İletişim Seçenekleri</ion-label>
            <ion-select aria-label="Fruit" placeholder="İletişim Seçenekleri" :multiple="true"
              @ionChange="handleChange($event)">
            
              <ion-select-option value="phone">Arama</ion-select-option>
            </ion-select>
          </ion-item> -->

          <ion-item>
            <ion-label slot="start">Arama İzni</ion-label>
            <ion-toggle @ionChange="updatePreference" v-model="toggleValue" />
          </ion-item>





          <ion-item>
            <ion-label slot="start">Takas Tekliflerine Aç</ion-label>
            <ion-toggle v-model="formData.swap" />
          </ion-item>
        </ion-list>
        <div class="kvkk">
          <ion-label>
            Kişisel Verilerin işlenmesine ilişkin <span @click="kvkkModalShow = true">aydınlatma metni</span>
          </ion-label>
        </div>
      </form>
      <ion-modal :is-open="kvkkModalShow">
        <ion-header>
          <ion-toolbar>
            <ion-title>KVKK</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="kvkkModalShow = false">Close</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          KVKK text

        </ion-content>

      </ion-modal>
      <ion-modal>
        <ion-header>
          <ion-toolbar>
            <ion-title>Konum Seçiniz</ion-title>
            <ion-title></ion-title>

          </ion-toolbar>
        </ion-header>
        <ion-content class="my-class">

        </ion-content>
      </ion-modal>
    </ion-content>
    <ion-footer>
      <ion-button color="primary" expand="block" @click="submit">
        <ion-spinner name="dots" v-if="formSubmitLoading" />
        <ion-label v-else>İlan Oluştur</ion-label>
      </ion-button>
    </ion-footer>
    <ion-alert :is-open="alertData.show" :header="alertData.header" :message="alertData.message"
      :buttons="[{ text: 'OK', role: 'confirm' }]" @didDismiss="alertClose"></ion-alert>
  </ion-page>
</template>







<script setup lang="ts">
import { computed, onMounted, onUpdated, reactive, ref, watch, watchEffect, onActivated } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { chevronBackOutline, helpCircle } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';





import {

  IonAlert,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonCol,
  IonRow,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar
} from '@ionic/vue';
import { helpers, numeric, required } from "@vuelidate/validators";


import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Api
import productApi from "@/services/productApi";
import locationApi from '@/services/locationApi';

// Stores
import { useCategoryStore } from "@/stores/categoryStore";
import axios from "axios";
import authApi from '@/services/authApi';


const categoryStore = useCategoryStore();
const router = useRouter();
const route = useRoute();



//Data
let showToast = ref<boolean>(false);
let loadingBar = ref<boolean>(false);
// const categoryTreeList = ref<any[]>([]);
const categoryCode = ref<string>('');
// const selectedAdress = ref<any>(null);
const multitpleImages = ref<any[]>([])
const uploadFiles = ref<FileList | null>(null);


let provinceList = ref<any[]>([])
let districtList = ref<any[]>([])
let localizationsList = ref<any[]>([]);



let selectedProvince = ref<number | null>(null);
let selectedDistrict = ref<number>(1);
let selectedLocalizations = ref<number>(1);



const selectedProvinceId = computed(() => {
  const selected = provinceList.value.find((p: { id: any; }) => p.id === selectedProvince.value);
  return selected ? selected.id : '';
});

const selectedDistrictId = computed(() => {
  const selected = districtList.value.find((p: { id: any; }) => p.id === selectedDistrict.value);
  return selected ? selected.id : '';
});

const selectedLocalizationsId = computed(() => {
  const selected = localizationsList.value.find((p: { id: any; }) => p.id === selectedLocalizations.value);
  return selected ? selected.id : '';
})



if (route.params.code) {
  categoryCode.value = route.params.code as string;
}

const formSubmitLoading = ref<boolean>(false);
const formData = ref<any>({
  category_code: categoryCode.value,
  name: null,
  price: '',
  swap: true,
  description: null,
  currency: "TRY",
  showcase_image: null,
  communication_preference: [],
  city: selectedProvinceId,
  district: selectedDistrictId,
  localities: selectedLocalizationsId,
  lat: 1,
  lng: 1
})



const openFileInput = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg,image/png,image/jpg';
  input.multiple = true;
  input.style.display = 'none';
  input.onchange = (event: Event) => {
    mountImages(event);
  };
  document.body.appendChild(input);
  input.click();
};


const mountImages = (event: Event) => {

  const formImagesData = new FormData();
  // const uploadFiles = ref<FileList | null>(null); // uploadFiles'e uygun tür
  uploadFiles.value = (event.target as HTMLInputElement).files;
  if (uploadFiles.value) {
    for (let i = 0; i < uploadFiles.value.length; i++) {
      const reader = new FileReader();
      const file = uploadFiles.value[i];
      formImagesData.append('images[]', file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Image = reader.result as string;
        formImagesData.append('images[]', base64Image);
      };
    }

    loadingBar.value = true;
    productApi.productImageCreate(formImagesData)
      .then((response: { data: { files: any; }; }) => {
        try {
          let item = response.data.files;
          item.forEach((element: { original: string, [240]: string }) => {
            let item = {
              product_code_images: "test",
              image: element[240],
            };
            multitpleImages.value.push(item);
            console.log("Mulitple", multitpleImages.value);
            $toast.success("Resim yüklendi.", {
              position: "top-right",
            })

            selectedİmg({ image: element[240] })
          });
        } catch (error) {
          $toast.error("Bu Dosya Türü Desteklenmemektedir.", {
            position: "top-right",
          });
          alert("bu dosya türü desteklenmiyor")
          console.error('Veri işleme sırasında bir hata oluştu:', error);


        } finally {
          // Yükleme işlemi tamamlandığında loadingBar false olarak ayarlanır
          loadingBar.value = false;
        }
      })
      .catch((error: { response: { status: number; }; }) => {
        if (error.response && error.response.status === 401) {
          // 401 hatası alındığında giriş sayfasına yönlendir
          router.push('/login');
        } else {
          $toast.error("Bu Dosya formatında resim yükleme desteklenmiyor", {
            position: "top-right",
          });
          console.error('Yükleme işlemi sırasında bir hata oluştu:', error);
        }

        loadingBar.value = false;
      });
  }
};

let toggleValue = true
const updatePreference = () => {
  console.log(toggleValue)
  formData.value.communication_preference = toggleValue ? ["phone"] : ["message"];

}


import Swal from 'sweetalert2'
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FetchMessageList } from '@/helpers/messageCount';
import { useProductsStore } from '@/stores/productsStore';


const ilce = ref(false)
const mahalle = ref(false)


const onKvkkModal2Dismiss = () => {
  kvkkModalShow2.value = false
}

const onKvkkModal3Dismiss = () => {
  kvkkModalShow3.value = false
}

const selectedİmg = (event: any) => {
  formData.value.showcase_image = event.image;
  console.log("tiklandi")
}

const removeImg = (e: any) => {
  Swal.fire({
    title: "Görseli kaldırmak istediğinizden emin misiniz?",
    text: "Görsel kaldırma işlemi geri alınamaz",
    icon: "warning",
    heightAuto: false,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet Sil",
    cancelButtonText: "Vazgeç",
    customClass: {
      title: 'custom-title' // Özel sınıf ekliyoruz
    }
  }).then((result) => {
    if (result.isConfirmed) {
      formData.value.showcase_image = '';
      multitpleImages.value = multitpleImages.value.filter(item => item.image !== e.image);
      Swal.fire({
        title: "Görsel Kaldırıldı",
        heightAuto: false,
        icon: "success",
        customClass: {
          title: 'custom-title' // Aynı özel sınıfı buraya da ekliyoruz
        }
      });
    }
  });

  //console.log(e)
  //console.log("form", formData.value.showcase_image)
}

const test = () => {
  //formData.value.showcase_image = ''
  console.log("form", formData.value)
  console.log("multi", multitpleImages.value)
}

// Kuralların tanımlanması
const formRules = {
  name: {
    required: helpers.withMessage('Lütfen "ilan başlığı" alanını giriniz.', required)
  },
  price: {
    required: helpers.withMessage('Lütfen "fiyat" alanını giriniz.', required),
    numeric: helpers.withMessage('Lütfen sayısal bir değer giriniz.', numeric),

  },
  description: {
    required: helpers.withMessage('Lütfen "açıklama" alanını giriniz.', required)
  }
};

const validation = useVuelidate(formRules, formData.value);
const alertData = reactive<any>({
  header: null,
  message: null,
  show: false
});
const alertClose = () => {
  alertData.header = null;
  alertData.message = null;
  alertData.show = false;
};

const kvkkModalShow = ref<boolean>(false);
const kvkkModalShow2 = ref<boolean>(false);
const kvkkModalShow3 = ref<boolean>(false);

const handleGoToBack = () => {
  history.back()
};

const handleChange = (event: any) => {
  formData.value.communication_preference = event.detail.value;
};


const submit = () => {
  // Vitrin görseli kontrolü
  if (formData.value.showcase_image === '' || formData.value.showcase_image === null) {
    alert("Lütfen vitrin görseli seçiniz");
    return; // Vitrin görseli seçilmemişse işlemi durdur
  }

  // Fiyat kontrolü
  if (formData.value.price < 1) {
    $toast.error("Fiyat Değeri 0'dan büyük olmalıdır.", {
      position: "top-right",
    });
    return; // Fiyat 0'dan küçükse işlemi durdur
  }

  // Form doğrulama
  validation.value.$touch();
  if (validation.value.$invalid) {
    const message: any = validation.value.$errors[0].$message ?? '';
    if (message) {
      alertData.header = 'Hata';
      alertData.message = message;
      alertData.show = true;
    }
    return; // Form geçersizse işlemi durdur
  }

  // İletişim tercihlerinin ayarlanması
  if (formData.value.communication_preference.includes('message') && formData.value.communication_preference.includes('phone')) {
    formData.value.communication_preference = 'message_and_phone';
  } else if (formData.value.communication_preference.includes('message')) {
    formData.value.communication_preference = 'message';
  } else if (formData.value.communication_preference.includes('phone')) {
    formData.value.communication_preference = 'phone';
  }

  formSubmitLoading.value = true;
  console.log('object :>> ', formData.value);
  //API çağrısı ve diğer işlemler
  return productApi.create(formData.value)
    .then((res: { data: { product_code: any; } | null; }) => {
      useProductsStore().lastCreatedProduct = res.data
      multitpleImages.value.forEach((element: any) => {
        element.product_code_images = res.data?.product_code ?? '';
        // console.log(element);
      });

      const responseData: any = res?.data ?? null;

      if (responseData?.category_code) {
        router.push({ name: 'doping-select-plan', params: { code: responseData.category_code } });
      }
      localStorage.setItem('success-alert', 'true');
    })
    .then(() => {
      return productApi.productMultiImageCreate(multitpleImages.value);
    })
    .then((res: any) => {
      // console.log(res.data);
    })
    .finally(() => {
      formSubmitLoading.value = false;
    });
};

const showSelectOptions2 = () => {
  const districtSelect2 = (document.querySelector('#createElement2 ion-select') as HTMLIonSelectElement);
  districtSelect2?.open(); // Seçenekleri göster
  console.log("deneme")
};
watch(selectedProvince, (newValue: any, oldValue: any) => {
  locationApi.getDistrict(newValue).then(res => {
    // API'den gelen veriyi al
    districtList.value = res.data.data;

    // Veriyi Türk alfabesine göre sırala
    // districtList.value.sort((a, b) => {
    //   return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
    // });

    // Modal gösterimi
    kvkkModalShow3.value = true;
  });

  setTimeout(() => {
    showSelectOptions2();
  }, 1000)
});

const showSelectOptions = () => {
  const districtSelect = (document.querySelector('#createElement ion-select') as HTMLIonSelectElement);
  districtSelect?.open(); // Seçenekleri göster
  console.log("deneme")
};


watch(selectedDistrict, (newValue: any, oldValue: any) => {
  locationApi.getLocalizitions(newValue).then(res => {
    // API'den gelen veriyi al
    localizationsList.value = res.data.data;

    // Veriyi Türk alfabesine göre sırala
    // localizationsList.value.sort((a, b) => {
    //   return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
    // });
  });

  mahalle.value = true;
  console.log('object :>> ', mahalle.value);
  kvkkModalShow2.value = true;



  setTimeout(() => {
    showSelectOptions();
  }, 1000)
});







watch(selectedLocalizations, (newValue: any, oldValue: any) => {
  kvkkModalShow2.value = false
  kvkkModalShow3.value = false
})


const checkAuth = async () => {
  try {
    const response = await authApi.me();
    console.log(response.data); // Başarılı yanıt alındığında veriyi konsola yazdır
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

watch(() => route.path, (newPath: string) => {
  if (newPath === '/product-create') {
    checkAuth()

  }
});

import { useBreadCrumbStore } from "@/stores/breadCrumb";
const breadCrumb = useBreadCrumbStore()

onBeforeRouteLeave((to, from, next) => {
  breadCrumb.breadCrumbs = []
  next(); // Çıkışa izin ver
});


onMounted(() => {

  formData.value.communication_preference = ["phone"]

  locationApi.getCity().then((res) => {
    // API'den gelen veriyi al
    provinceList.value = res.data.data;

    // Veriyi Türk alfabesine göre sırala
    // provinceList.value.sort((a, b) => {
    //   return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
    // });

    console.log(provinceList.value); // Sıralanmış listeyi konsola yazdır
  });



  checkAuth()

  FetchMessageList().then(() => {
    console.log("Mesaj listesi başarıyla alındı.");
  }).catch(error => {
    console.error("Mesaj listesi alınırken hata oluştu:", error);
  });


  if (categoryCode.value === '') {
    router.push({ name: 'home' });
  }

});
</script>



<style lang="scss">
.custom-title {
  font-size: 1.2em;
  /* Burada istediğiniz boyutu ayarlayın */
}

.selected {

  /* Seçili görsellerin etrafına mavi bir çerçeve ekler */

  /* Hafif bir gölge efekti ekler */
  border-radius: 5vh;
  padding: 5px;
  background-color: #8F1B69;
  transition: 0.1s ease-in-out;
}

img {
  border-radius: 1vh !important;
  transition: 0.2s ease;
}

ion-button.go-to-back {
  --background: transparent;
  --background-hover: tranparent;
  --box-shadow: none;
  --border-width: 0px;

  ion-icon {
    color: var(--primary);
  }
}

ion-list {
  margin-bottom: 10px;
  --padding-start: 0px;
  --padding-end: 0px;

  ion-item {
    --background-hover: var(--primary-gray);
    --background-hover-opacity: 1;
    --min-height: 46px;
    cursor: pointer;


    ion-label {
      --font-size: 12px
    }

    ion-textarea {
      --padding-top: 5px;
      --padding-bottom: 5px;
      margin: 10px 0;
      min-height: 10px !important;
    }
  }
}

.kvkk {
  padding: 0 15px;

  ion-label {
    font-size: 14px;

    span {
      color: var(--primary);
      cursor: pointer;
    }
  }
}

ion-footer {
  padding: 20px;
  --background: var(--primary-light);

  ion-button {
    --border-radius: 20px;
  }
}

.category-list-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 5px;
  margin: 6px 0;

  .category-list {
    display: flex;
    align-items: center;
    padding: 4px 20px;
    border-radius: 15px;
    background-color: var(--background-grey);
    color: var(--black);
    font-size: 14px;
    font-family: var(--font-medium);
    cursor: pointer;
  }
}


ion-modal#product-detail-modal {
  --width: 380px;
  --height: fit-content --border-radius: 30px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
  --overflow: visible;


  .wrapper {
    padding: 20px 10px 20px 10px;



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
</style>
