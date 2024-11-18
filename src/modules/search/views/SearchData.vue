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

                <ion-popover :is-open="popoverData" :event="event" @didDismiss="popoverData = false">
                    <ion-list class="ion-padding">Gelişmiş sıralama</ion-list>
                    <ion-list @click="dateSortProduct('ASC')" class="ion-padding">Tarihe göre sırala(önce en
                        yeni)</ion-list>
                    <ion-list @click="dateSortProduct('DESC')" class="ion-padding">Tarihe göre sırala (Önce en
                        eski)</ion-list>
                    <ion-list @click="priceSortProduct('DESC')" class="ion-padding">Fiyata göre sırala (Önce en
                        yüksek)</ion-list>
                    <ion-list @click="priceSortProduct('ASC')" class="ion-padding">Fiyata göre sırala (Önce en
                        düşük)</ion-list>
                </ion-popover>

                <ion-button @click="openPopoverFilter($event)">Filtre</ion-button>

                <ion-popover :is-open="filterPopoverData" :event="event" @didDismiss="filterPopoverData = false">
                    <div class="container">
                        <div class="title-container">
                            <span class="category">Kategori</span>
                            <span class="categoryContent">Akıllı telefon</span>
                        </div>
                        <div class="input-container">
                            <div class="iconContent">
                                <ion-icon size="small" :icon="searchOutline"></ion-icon>
                            </div>
                            <div class="inputContent">
                                <input type="text">
                            </div>
                        </div>
                        <ion-accordion-group>
                            <ion-accordion value="first">
                                <ion-item slot="header" color="white">
                                    <ion-label>Konum</ion-label>
                                </ion-item>
                                <div class="ion-padding" slot="content" style="display: flex;flex-direction: column;">
                                    <label v-for="city in citiesList" :key="city">

                                        <input type="checkbox" v-model="selectedCity" :value="city.id"> {{ city.name }}
                                    </label>
                                </div>
                            </ion-accordion>
                            <ion-accordion value="second">
                                <ion-item slot="header" color="white">
                                    <ion-label>Kategori</ion-label>
                                </ion-item>
                                <div class="ion-padding" slot="content">Second Content</div>
                            </ion-accordion>
                            <ion-accordion value="third">
                                <ion-item slot="header" color="white">
                                    <ion-label>Fiyat</ion-label>
                                </ion-item>
                                <div class="ion-padding" slot="content">
                                    <label for="minPrice">Minimum Fiyat:</label>
                                    <input type="number" id="minPrice" style="width: 98%;"
                                        v-model.number="priceRange.min" />

                                    <label for="maxPrice">Maximum Fiyat:</label>
                                    <input type="number" id="maxPrice" style="width: 98%;"
                                        v-model.number="priceRange.max" />
                                </div>
                            </ion-accordion>
                            <ion-accordion value="five">


                            </ion-accordion>
                            <ion-accordion value="six">
                                <ion-item slot="header" color="white">
                                    <ion-label>Takas</ion-label>
                                </ion-item>
                                <div class="ion-padding"
                                    style=" padding-top: 0px; padding-bottom: 0px;   display: flex; flex-direction:column ; justify-content: space-around;  height: 120px;  "
                                    slot="content">
                                    <div class="true"
                                        style="display: flex;  align-items: center; justify-content: space-between; width: 39%; height: 30px; ">
                                        <input v-model="selectedOptions" value="all" type="radio" />
                                        <p>Tümü</p>

                                    </div>
                                    <div class="true"
                                        style="display: flex;   align-items: center; justify-content: space-between; width: 33%; height: 30px;  ">
                                        <input v-model="selectedOptions" value="true" type="radio" />

                                        <p>Var</p>
                                    </div>
                                    <div class="false"
                                        style="display: flex; align-items: center;  justify-content: space-between; width: 33%; height:30px;   ">
                                        <input v-model="selectedOptions" value="false" type="radio" />

                                        <p>Yok</p>
                                    </div>
                                </div>

                            </ion-accordion>

                            <button
                                style="color:white; background-color: purple; width: 100%; padding: 5px;  position: sticky; bottom: 0px; border-radius: 1px;"
                                @click="submitForm" type="button">Kaydet
                            </button>
                        </ion-accordion-group>
                    </div>
                </ion-popover>

                <ion-button id="open-view-type">Görünüm</ion-button>

                <ion-button @click="openSearchPopover($event)">Aramayı Kaydet</ion-button>
                <ion-popover :is-open="searchPopoverData" :event="event" @didDismiss="searchPopoverData = false">
                    <div class="searchContainer">
                        <div class="searchInputContent">
                            <input v-model="favoriteSearchData.search" type="text" placeholder="Favori Arama kaydı">
                        </div>
                        <ion-list>
                            <ion-radio-group :compareWith="compareWith" @ionChange="handleChange($event)">
                                <ion-item v-for="food in foods" :key="food.id">
                                    <ion-radio :value="food">{{ food.name }}</ion-radio>
                                </ion-item>
                            </ion-radio-group>
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
    IonButton, IonContent,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonSearchbar,
    IonAccordion,
    IonAccordionGroup,
    IonRadio,
    IonRadioGroup,
    AccordionGroupCustomEvent
} from '@ionic/vue';

import { calendarOutline, chevronForwardOutline, closeOutline, heart, heartOutline, timeOutline, eyeOutline, searchOutline } from 'ionicons/icons';
import Header from "@/components/Header.vue";
import ProductCard from "@/modules/product/components/ProductCard.vue";
import { useRoute, useRouter } from "vue-router";
import { useSearchStore } from "@/stores/searchStore";
import productApi from '@/services/productApi';
import locationApi from '@/services/locationApi';
import { formatDate } from '@vueuse/core';
import categoryApi from '@/services/categoryApi';
import searchSuggestApi from '@/services/searchSuggestApi';
import { FetchMessageList } from '@/helpers/messageCount';
import favoritesApi from '@/services/favoritesApi';

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();


//Route
const router = useRouter();
const route = useRoute();

//Data
const priceRange = ref({ min: 0, max: 0 }); // Default price range
const selectedCity = ref<any[]>([]);
const swap = ref<string | boolean>("");
const citiesList = ref<any[]>([]);
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



const data = reactive({
    categoryCode: '',
    selectedCity: ref<any[]>([]),
    swap: ref<string | boolean>(""),
    priceRange: ref<{ min: number; max: number }>({ min: 0, max: 0 }),
    dateSort: ref<string>("desc"),
    priceSort: ref<string>(""),
    q: ''
});


const favoriteSearchData = reactive({
    product_code: "",
    search: null,
    seller_code: "",
    is_deleted: false
})


const submitForm = () => {
    data.categoryCode = categoryCode.value;
    data.selectedCity = selectedCity.value;
    data.swap = swap.value;
    data.priceRange = priceRange.value;

    data.q = (route.query.search || "").toString();
    searchSuggestApi.searchFilterData(data)
        .then((res) => {
            fromHomeSearchData.value = res.products
            console.log(res.products)
            //console.log(productData.value, 'productDataveri')
        });

    // Modalı kapat
    filterPopoverData.value = false;
};




const dateSortProduct = (e: any) => {
    data.dateSort = "";
    data.priceSort = "";
    data.q = (route.query.search || "").toString();
    if (e === "DESC") {
        data.dateSort = "DESC"
    } else {
        data.dateSort = "ASC"
    }
    searchSuggestApi.searchFilterData(data).then(res => {
        fromHomeSearchData.value = res.products
        console.log(res.data.data)
        popoverData.value = false
    })
}


const saveSearch = () => {
    favoritesApi.favoritesSettings(favoriteSearchData).then((res) => {
        console.log(res.data)
    })

    $toast.success("Arama favorilere kayıt edildi...", { position: 'top' });
    searchPopoverData.value = false

}

const priceSortProduct = (e: any) => {
    data.dateSort = "";
    data.priceSort = "";
    data.q = (route.query.search || "").toString();
    if (e === "DESC") {
        data.priceSort = "DESC"
    } else {
        data.priceSort = "ASC"
    }
    searchSuggestApi.searchFilterData(data).then(res => {
        fromHomeSearchData.value = res.products
        console.log(res.data.data)
        popoverData.value = false
    })
    // else {
    //buraya searchSuggest apisi gelicek
    //   const { categoryCode, ...dataWithoutCategoryCode } = data;

    //   productApi.getProductsFilterQuery(page.value, dataWithoutCategoryCode)
    //     .then((res) => {
    //       const newProducts = res.data.data;

    //       const existingIds = new Set(fromHomeSearchData.value.map(product => product.ad_no));

    //       const uniqueNewProducts = newProducts.filter((product: { ad_no: any; }) => !existingIds.has(product.ad_no));

    //       fromHomeSearchData.value.push(...uniqueNewProducts);
    //     });
    // }

}


const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase();

    if (fromHomeSearchData.value.length > 0) {
        // Eğer arama verileri varsa ve sorgu boş değilse filtrele
        return fromHomeSearchData.value.filter(product =>
            product.name.toLowerCase().includes(query)
        );
    }

    // Arama verileri yoksa veya sorgu boşsa tüm verileri döndür
    return fromHomeSearchData.value;
});

const getMoreCityAndSwapProduct = (event: any) => {
    if (page.value < totalPage.value) {
        page.value += 1;

        searchSuggestApi.getSearchData({ q: route.query.search }).then(res => {
            fromHomeSearchData.value = res.data.products;
            console.log("veri", res.data.products);
        });
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

watch(() => route.query.search, (newQuery) => {
    console.log(newQuery)
    console.log("get")
    if (newQuery) {
        fromHomeSearchData.value = []
        searchSuggestApi.getSearchData({ q: route.query.search }).then(res => {
            fromHomeSearchData.value = res.data.products
            console.log("veri", res.data.products)
        })
    }
});



onMounted(() => {
    searchSuggestApi.getSearchData({ q: route.query.search }).then(res => {
        fromHomeSearchData.value = res.data.products;
        console.log("veri", res.data.products);
    });


    locationApi.getCity().then((res) => {
        citiesList.value = res.data.data
    })

    if (route.query.search) {
        const searchTerm = route.query.search as string
        searchSuggestApi.getSearchData({ q: searchTerm }).then(res => {
            productData.value = res.data.products
            console.log("veri", res.data.products)
        })
    }
})


</script>




<style lang="scss" scoped>
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

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
        margin-bottom: 5px;
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