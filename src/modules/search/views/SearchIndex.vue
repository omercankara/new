<template>
  <ion-page>
    <Header />
    <ion-content>
      <ion-searchbar v-model="searchQuery" class="header-search custom-searchbar"
        placeholder="Marka, ürün adı, kategori arayın" />

      <ion-popover :is-open="popoverOpen" :event="event" @didDismiss="popoverOpen = false">
        <ion-content>
          <ion-list>
            <ion-item v-for="(breadcrumb, i) in collapsedBreadcrumbs" :key="i" :href="breadcrumb.href"
              :lines="i === collapsedBreadcrumbs.length - 1 ? 'none' : undefined">
              <ion-label>{{ breadcrumb.textContent }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-popover>

      <div class="filters-views-wrapper">
        <ion-button @click="openPopover($event)">Sırala</ion-button>

        <ion-modal style=" background-color: none !important; " :is-open="popoverData" :event="event"
          @didDismiss="popoverData = false">
          <ion-list class="ion-padding">Gelişmiş sıralama</ion-list>
          <ion-list @click="dateSortProduct('ASC')" class="ion-padding">Tarihe göre sırala(önce en yeni)</ion-list>
          <ion-list @click="dateSortProduct('DESC')" class="ion-padding">Tarihe göre sırala (Önce en eski)</ion-list>
          <ion-list @click="priceSortProduct('DESC')" class="ion-padding">Fiyata göre sırala (Önce en
            yüksek)</ion-list>
          <ion-list @click="priceSortProduct('ASC')" class="ion-padding">Fiyata göre sırala (Önce en düşük)</ion-list>
        </ion-modal>

        <ion-button @click="openPopoverFilter($event)">Filtre</ion-button>

        <ion-modal :is-open="filterPopoverData" :event="event" @didDismiss="filterPopoverData = false">
          <div class="container" style="overflow-y: scroll; height: 400px; margin-top: 10px">
            <div class="input-container">
              <div class="iconContent">
                <ion-icon size="small" :icon="searchOutline"></ion-icon>
              </div>
              <div class="inputContent">
                <input type="text">
              </div>
            </div>
            <div class="title-container">
              <span class="category" style="font-weight: bold">Kategori</span>
              <span class="categoryContent">{{ breadCrumbs.breadCrumbs[0] }}</span>
            </div>

            <ion-accordion-group :multiple="true">
              <!-- Konum Accordion -->
              <ion-accordion value="konum">
                <ion-item slot="header" color="white">
                  <ion-label style="font-weight: bold;">Konum</ion-label>
                </ion-item>
                <div class="ion-padding" slot="content">
                  <ion-accordion value="first">
                    <ion-item class="border" slot="header" color="white">
                      <ion-label style="font-weight: bold; border-bottom: none;">İl</ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content"
                      style="display: flex; flex-direction: column; height: 120px; overflow-y: scroll">
                      <label v-for="city in citiesList" :key="city" style="margin-left: 8px;">
                        <input type="checkbox" @change="handleInputChange(city)" v-model="selectedCity"
                          :value="city.id"> {{ city.name }}
                      </label>
                    </div>
                  </ion-accordion>

                  <ion-accordion value="city" v-if="selectedCity.length == 1">
                    <ion-item slot="header" color="white">
                      <ion-label style="font-weight: bold">İlçe</ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content"
                      style="display: flex; flex-direction: column; height: 120px; overflow-y: scroll">
                      <label v-for="city in districtList" :key="city" style="margin-left: 8px;">
                        <input type="checkbox" v-model="selectedDistrict" :value="city.id"> {{ city.name }}
                      </label>
                    </div>
                  </ion-accordion>

                  <!-- <ion-accordion value="district" style="border-bottom: none;">
                    <ion-item slot="header" color="white">
                      <ion-label style="font-weight: bold">Mahalle</ion-label>
                    </ion-item>
                    <div class="ion-padding" slot="content"
                      style="display: flex; flex-direction: column; height: 120px; overflow-y: scroll">
                      <label v-for="city in districtList" :key="city" style="margin-left: 8px;">
                        <input type="checkbox" v-model="selectedCity" :value="city.id"> {{ city.name }}
                      </label>
                    </div>
                  </ion-accordion> -->
                </div>
              </ion-accordion>

              <!-- Fiyat Accordion -->
              <ion-accordion value="third">
                <ion-item slot="header" color="white">
                  <ion-label style="font-weight: bold">Fiyat</ion-label>
                </ion-item>
                <div class="ion-padding" slot="content">
                  <label for="minPrice" style="display: block; margin-bottom: 5px; font-weight: bold;">En Düşük
                    Fiyat</label>
                  <input type="number" id="minPrice"
                    style="width: 98%; border: none; border-radius: 10px; background-color: #F3F2F7; margin-bottom: 10px"
                    v-model.number="priceRange.min" placeholder="Minimum Fiyat" />

                  <label for="maxPrice" style="display: block; margin-bottom: 5px; font-weight: bold;">En Yüksek
                    Fiyat</label>
                  <input type="number" id="maxPrice"
                    style="width: 98%; border: none; border-radius: 10px; background-color: #F3F2F7; margin-bottom: 10px"
                    v-model.number="priceRange.max" placeholder="Maksimum Fiyat" />
                </div>

              </ion-accordion>

              <!-- Takas Accordion -->
              <ion-accordion value="six">
                <ion-item slot="header" color="white">
                  <ion-label style="font-weight: bold">Takas</ion-label>
                </ion-item>
                <div class="ion-padding"
                  style="padding-top: 0px; padding-bottom: 0px; display: flex; flex-direction: column; justify-content: space-around; height: 120px;"
                  slot="content">
                  <div class="true"
                    style="display: flex; align-items: center; justify-content: space-between; width: 39%; height: 30px;">
                    <input v-model="selectedOptions" value="all" type="radio" />
                    <p>Tümü</p>
                  </div>
                  <div class="true"
                    style="display: flex; align-items: center; justify-content: space-between; width: 33%; height: 30px;">
                    <input v-model="selectedOptions" value="true" type="radio" />
                    <p>Var</p>
                  </div>
                  <div class="false"
                    style="display: flex; align-items: center; justify-content: space-between; width: 33%; height:30px;">
                    <input v-model="selectedOptions" value="false" type="radio" />
                    <p>Yok</p>
                  </div>
                </div>
              </ion-accordion>

              <button
                style="color:white; background-color: purple; width: 50%; padding: 5px; position: sticky; margin-top: 20px; left: 100%; border-radius: 1px;"
                @click="submitForm" type="button">Kaydet
              </button>
            </ion-accordion-group>
          </div>
        </ion-modal>

        <!-- Görünüm ve Aramayı Kaydet Butonları -->
        <ion-button id="open-view-type">Görünüm</ion-button>

        <ion-button @click="openSearchPopover($event)">Aramayı Kaydet</ion-button>
        <ion-popover :is-open="searchPopoverData" :event="event" @didDismiss="searchPopoverData = false">
          <div class="searchContainer">
            <div class="searchInputContent">
              <input v-model="favoriteSearchData.name" type="text" placeholder="Favori Arama kaydı">
            </div>
            <ion-list>
              <ion-item v-for="food in foods" :key="food.id">
                <ion-checkbox :value="food">{{ food.name }}</ion-checkbox>
              </ion-item>
            </ion-list>
            <ion-item>
              <ion-button @click="saveSearch" style="margin-right: 10px;">Kaydet</ion-button>
              <button class="custombutton">Vazgeç</button>
            </ion-item>
          </div>
        </ion-popover>

        <ion-action-sheet trigger="open-view-type" :buttons="viewTypeButtons" />
      </div>

      <div v-if="filteredProducts.length > 0" class="products-wrapper p-10" :class="viewType">
        <ProductCard v-for="key in filteredProducts" :key="key.id" :product="key" :cardType="viewType" />
      </div>
      <div v-else>
        <p>Aradığınız kriterlerde ürün bulunamadı</p>
      </div>
      <ion-infinite-scroll @ionInfinite="handleInfiniteScroll">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>




<script lang="ts" setup>
import { onMounted, ref, watch, computed, reactive } from 'vue';
import {
  IonActionSheet,
  IonBreadcrumb, IonLabel,
  IonPopover,
  IonItem,

  IonRefresher,
  IonRefresherContent,
  IonList,
  IonCheckbox,
  IonButton, IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonSearchbar,
  IonAccordion,
  IonAccordionGroup,
  IonRadio,
  IonModal,
  IonRadioGroup,
  AccordionGroupCustomEvent
} from '@ionic/vue';

import { calendarOutline, chevronForwardOutline, closeOutline, heart, heartOutline, timeOutline, eyeOutline, searchOutline, save, } from 'ionicons/icons';

import Header from "@/components/Header.vue";
import ProductCard from "@/modules/product/components/ProductCard.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

import { useSearchStore } from "@/stores/searchStore";
import productApi from '@/services/productApi';
import locationApi from '@/services/locationApi';
import { formatDate } from '@vueuse/core';
import categoryApi from '@/services/categoryApi';
import searchSuggestApi from '@/services/searchSuggestApi';
import { FetchMessageList } from '@/helpers/messageCount';
import favoritesApi from '@/services/favoritesApi';


import { useFilterStore } from '@/stores/savedFilter';
const savedFilter = useFilterStore();




const router = useRouter();
const route = useRoute();


import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { useBreadCrumbStore } from '@/stores/breadCrumb';
const breadCrumbs = useBreadCrumbStore();
const $toast = useToast();

//Data
const priceRange = ref({ min: 0, max: 0 }); // Default price range
const selectedCity = ref<any[]>([]);
const selectedDistrict = ref<any[]>([]);
const selectedLocation = ref<any[]>([]);
const swap = ref<string | boolean>("");
const citiesList = ref<any[]>([]);
const districtList = ref<any[]>([]);
const productData = ref<any[]>([]);
const fromHomeSearchData = ref<any[]>([]);
const categoryCode = ref<string>('');
const selectedOptions = ref<string>('');
let page = ref<number>(1);
const totalPage = ref<number>(3);
const searchStore = useSearchStore();
let popoverData = ref<boolean>(false);
let filterPopoverData = ref<boolean>(false);
let searchPopoverData = ref<boolean>(false);
const popoverOpen = ref<boolean>(false)
const collapsedBreadcrumbs = ref<any[]>([]);
const event = ref<any>(null);
const viewType = ref<string>(searchStore.viewType);
const searchQuery = ref('');


const data = reactive({
  categoryCode: '',
  selectedCity: ref<any[]>([]),
  selectedDistrict: ref<any[]>([]),
  swap: ref<string | boolean>(""),
  priceRange: ref<{ min: number; max: number }>({ min: 0, max: 0 }),
  dateSort: ref<string>("desc"),
  priceSort: ref<string>(""),

});



function handleInputChange(city: any) {
  console.log(`${city.name} checkbox durumu değişti.`);
  locationApi.getDistrict(city.id).then(res => {
    districtList.value = res.data.data;
  })
}


const submitForm = () => {
  data.categoryCode = categoryCode.value;
  data.selectedCity = selectedCity.value;
  data.selectedDistrict = selectedDistrict.value;
  data.swap = swap.value;
  data.priceRange = priceRange.value;

  const requestData = JSON.stringify(data);
  favoriteSearchData.search = requestData;
  console.log(requestData);

  productApi.getProductsFilterQuery(page.value, data).then(res => {
    productData.value = res.data.data;
  });


  // Modalı kapat
  filterPopoverData.value = false;
};





//const productData = ref<any[]>([]);

const foods = ref([
  {
    id: 1,
    name: 'Mobil bildirim almak istiyorum',
    type: 'fruit',
  },
  {
    id: 2,
    name: 'E Posta almak istiyorum',
    type: 'vegetable',
  },
]);

const viewTypeButtons = [
  {
    text: 'Vitrin',
    handler: function () {
      viewType.value = 'cover';
    }
  },
  {
    text: 'Liste',
    handler: function () {
      viewType.value = 'list';
    }
  }
]





const dateSortProduct = (e: any) => {
  data.dateSort = "";
  data.priceSort = "";

  if (e === "DESC") {
    data.dateSort = "DESC"
  } else {
    data.dateSort = "ASC"
  }
  productApi.getProductsFilterQuery(page.value, data).then(res => {
    productData.value = res.data.data
    console.log(res.data.data)
    popoverData.value = false
  })
}

let favoriSearch = "";

const favoriteSearchData = reactive({
  product_code: "",
  search: '',
  seller_code: "",
  is_deleted: false,
  name: ''
})
const saveSearch = () => {
  if (favoriteSearchData.search == '') {
    favoriteSearchData.search = route.params.code as string

  }
  favoritesApi.favoritesSettings(favoriteSearchData).then((res) => {
    console.log(res.data);
  });

  $toast.success("Arama favorilere kayıt edildi...", { position: 'top' });
  searchPopoverData.value = false;
};


const priceSortProduct = (e: any) => {
  data.dateSort = "";
  data.priceSort = "";

  if (e === "DESC") {
    data.priceSort = "DESC"
  } else {
    data.priceSort = "ASC"
  }
  productApi.getProductsFilterQuery(page.value, data).then(res => {
    productData.value = res.data.data
    console.log(res.data.data)
    popoverData.value = false
  })
}

const filteredProducts = computed(() => {

  const query = searchQuery.value.toLowerCase();
  return productData.value.filter(product => {
    return product.name.toLowerCase().includes(query);
  });
});


onBeforeRouteLeave((to, from, next) => {
  breadCrumbs.breadCrumbs = []
  next(); // Çıkışa izin ver
});

//Load Data 
const getMoreCityAndSwapProduct = (event: any) => {
  if (page.value < totalPage.value) {
    page.value += 1;

    productApi.getProductsFilterQuery(page.value, data)
      .then((res) => {
        const newProducts = res.data.data;

        const existingIds = new Set(productData.value.map(product => product.ad_no));

        const uniqueNewProducts = newProducts.filter((product: { ad_no: any; }) => !existingIds.has(product.ad_no));

        productData.value.push(...uniqueNewProducts);
      })
  }

  setTimeout(() => {
    event.target.complete();
  }, 1000);

}

const handleInfiniteScroll = (event: Event) => {
  const infiniteScrollEvent = event as CustomEvent;
  getMoreCityAndSwapProduct(infiniteScrollEvent);
  // Infinite scroll'ün tamamlandığını belirtmek için:
  (infiniteScrollEvent.target as HTMLIonInfiniteScrollElement).complete();
};


const compareWith = (o1: any, o2: any) => {
  return o1 === o2;
}

const handleChange = (event: any) => {
  console.log("Selected value: ", event.detail.value);
}

const openPopover = (e: Event) => {
  popoverData.value = !popoverData.value
  page.value = 1

}

const openPopoverFilter = (e: Event) => {
  filterPopoverData.value = !filterPopoverData.value
  page.value = 1
}

const openSearchPopover = (e: Event) => {
  searchPopoverData.value = !searchPopoverData.value

}

watch(selectedOptions, (newValue) => {
  if (newValue === 'true') {
    swap.value = true;
  } else if (newValue === 'false') {
    swap.value = false;
  }
  else if (newValue === 'all') {
    swap.value = 'all';
  }
});

watch(
  () => route.params.code,
  (newCode, oldCode) => {
    console.log("Code değişti:", newCode, "Önceki değer:", oldCode);
    // let item = savedFilter.filter;


    // if (item && item.selectedCity && item.swap !== undefined && item.priceRange) {
    //   selectedCity.value = item.selectedCity;
    //   swap.value = item.swap;
    //   priceRange.value = item.priceRange;

    //   // Swap değerini boolean olarak kontrol et
    //   const isSwapTrue = item.swap === true;
    //   const isSwapFalse = item.swap === false;
    //   console.log(isSwapFalse);


    //   if (isSwapTrue) {
    //     selectedOptions.value = "true";
    //   } else if (isSwapFalse) {
    //     selectedOptions.value = "false";
    //   } else {
    //     selectedOptions.value = "";
    //     console.warn("Swap değeri 'true' veya 'false' değil:", item.swap);
    //   }
    // } else {
    //   console.warn("Filter bilgisi eksik veya boş.");
    // }
  }
);





onMounted(() => {

  // let item = savedFilter.filter;

  // if (item && item.selectedCity && item.swap !== undefined && item.priceRange) {
  //   selectedCity.value = item.selectedCity;
  //   swap.value = item.swap;
  //   priceRange.value = item.priceRange;

  //   // Swap değerini boolean olarak kontrol et
  //   const isSwapTrue = item.swap === true;
  //   const isSwapFalse = item.swap === false;
  //   console.log("item",isSwapTrue);
  //   console.log("item",isSwapFalse);

  //   if (isSwapTrue) {
  //     selectedOptions.value = "true";
  //   } else if (isSwapFalse) {
  //     selectedOptions.value = "false";
  //   } else {
  //     selectedOptions.value = "All";
  //     console.warn("Swap değeri 'true' veya 'false' değil:", item.swap);
  //   }
  // } else {
  //   console.warn("Filter bilgisi eksik veya boş.");
  // }



  categoryApi.getHeaderTitle(route.params.code).then((res) => {
    let title = res.data.data[0].name
    // console.log("gelenveri", res.data.data[0].name)
    breadCrumbs.setSelectedBreadCrumbs(title)
  })



  categoryCode.value = route.params.code as string
  data.categoryCode = categoryCode.value;

  productApi.getProductData(page.value, categoryCode.value).then((res) => {
    productData.value = res.data.data;
    totalPage.value = res.data.last_page;
  })
    .then(() => {
      // Bu fonksiyon önceki tamamlandıktan sonra çalışacak
      return productApi.getProductDopingCategory();
    })
    .then((res: any) => {
      console.log("test", res.data);

      const newProducts = res.data || [];
      const existingProducts = productData.value || [];

      // Yeni ürünleri filtrele, yalnızca category_code eşitse ekle
      const filteredNewProducts = newProducts.filter((newProduct: { category_code: string; }) =>
        newProduct.category_code === categoryCode.value
      );

      // Mevcut ürünleri filtrele
      const filteredExistingProducts = existingProducts.filter(existingProduct =>
        !filteredNewProducts.some((newProduct: { product_code: any; }) => newProduct.product_code === existingProduct.product_code)
      );

      // Mevcut ürünleri sabit bir sıraya göre ayarlayın (örneğin, product_code ile sıralama)
      const sortedExistingProducts = [...filteredExistingProducts].sort((a, b) => {
        return a.product_code.localeCompare(b.product_code);
      });

      // Yeni ürünleri ve mevcut ürünleri birleştir
      productData.value = [...filteredNewProducts, ...sortedExistingProducts];

      //console.log("sdf", productData.value);
    });





  locationApi.getCity().then((res) => {
    citiesList.value = res.data.data
  })


  // if (route.query.search) {
  //   const searchTerm = route.query.search as string
  //   searchSuggestApi.getSearchData({ q: searchTerm }).then(res => {
  //     productData.value = res.data.products
  //     console.log("veri", res.data.products)
  //   })
  // }
})

</script>



<style lang="scss">
.custombutton {
  background-color: transparent !important;
  border: 1px solid #8F1B69 !important;
  outline: none !important;
  /* Outline'ı kaldırdım */
  color: #8F1B69 !important;
  padding: 5px 15px;
  /* Butonun iç boşluğunu ayarlamak için */
  box-sizing: border-box;
  /* Border'ların boyutu dahil olsun */
}

ion-modal {
  --height: 30%;
  --width: 320px;
}

ion-accordion ion-item[slot="header"] {
  --color: rgb(94, 94, 94);
  /* Başlık rengini her durumda ayarlayın */
  --border-width: 0px;
  background-color: white;
  margin-left: 10px;
  margin-top: 0px;
  border-bottom: 0.5px solid rgb(226, 224, 224);
}

ion-accordion.accordion-expanding ion-item[slot="header"],
ion-accordion.accordion-expanded ion-item[slot="header"] {
  --color: rgb(113, 31, 121);
  --border-width: 0px;

}

ion-accordion ion-icon {
  transform: rotate(-90deg);
  /* Varsayılan durumda sola döner */
  transition: transform 0.3s;
  /* Geçiş animasyonu */
}

ios-accordion-animated accordion-expanded {
  transform: rotate(0deg);
  /* Genişletildiğinde aşağıyı gösterir */
}







.container {
  display: flex;
  flex-direction: column;

  align-items: center;
  height: 250px;

  ion-accordion-group {
    width: 90%;
    height: 150px;
    scrollbar-color: pink !important;
  }



  .title-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 15px;
    justify-content: space-around;

    .category {
      color: black
    }

    .categoryContent {
      color: #901B6A
    }
  }

  .input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 80%;
    margin-bottom: 5px;
    justify-content: space-between;
    position: relative;

    .iconContent {
      width: 15%;
      height: 40;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
    }

    .inputContent {
      width: 100%;
      height: 100%;

      input {
        width: 100%;
        border-radius: 5px;
        border: 1px solid #D9D9D9;
      }
    }
  }
}

ion-list {
  border-bottom: 1px solid gray;
  font-size: 14px;
}

.searchContainer {
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .searchInputContent {
    width: 100%;
    padding: 10px;
  }

  input {
    width: 70%;
    border-radius: 10px;
    border: 1px solid gray
  }

  ion-list {
    width: 100%;
    font-size: 12px;

    ion-radio {
      font-size: 13px;
    }
  }
}

ion-searchbar {
  padding: 0 10px 0 10px;
  --border-radius: 20px;
  --box-shadow: none;
  --background: #ebebed;
}

ion-breadcrumbs {
  background: var(--primary-gray);
  padding: 2px 10px;
  border-bottom: 1px solid #e5e5e5;

  ion-breadcrumb {
    --color: var(--black);
    --color-hover: #444444;
    font-family: var(--font-bold);
    font-size: 14px;
    letter-spacing: 0;

    ion-icon {
      color: var(--black);
    }

    .breadcrumbs-collapsed-indicator {
      ion-icon {
        color: var(--black);
      }
    }
  }
}


.filters-views-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 2fr) 3fr;
  background: #f3f2f7;
  padding: 2px 15px;
  gap: 5px;

  ion-button {
    --background: var(--white);
    --color: var(--black);
    --box-shadow: none;
    --padding-start: 0px;
    --padding-end: 0px;
    --padding-top: 0px;
    --padding-bottom: 0px;
    --min-height: 10px;
    flex-grow: 1;
    font-family: var(--font-medium), sans-serif;
    letter-spacing: 0;
    font-size: 14px;
  }
}



.custom-searchbar ::placeholder {
  font-size: .75rem;
}

.custom-searchbar {
  font-size: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 37px;
  padding-top: 0px;
  padding-bottom: 10px;
}
</style>