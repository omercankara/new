<template>
    <ion-header>
        <div class="header" v-if="!isAuthPage">
            <div class="header-left ion-activatable ripple-parent">
                <ion-img :src="logoImage" alt="Logo" @click="router.push('/home')" />
                <ion-ripple-effect></ion-ripple-effect>
            </div>
            <div class="header-right">
                <div class="ion-img-wrapper ripple-parent circle ion-activatable"
                    @click="router.push({ name: 'messages' })" style="position: relative;">
                    <ion-img :src="chatIcon" />
                    <p style="position:absolute; color:red;  font-weight:bold; top:-17px; left:8px;">
                        <img v-if="messageStore.messageCount !== 0 && isLogin == true" style="width: 15px;  "
                            src="../assets/nkt.png" alt="">
                    </p>
                    <ion-ripple-effect type="unbounded" />
                </div>
                <div class="ion-img-wrapper ripple-parent circle ion-activatable"
                    @click="router.push({ name: 'my-favorites' })">
                    <ion-img :src="heartIcon" />
                    <ion-ripple-effect type="unbounded" />
                </div>
                <div class="ion-img-wrapper ripple-parent circle ion-activatable"
                    @click="router.push({ name: 'my-notifications' })">
                    <ion-img :src="notificationIcon" />
                    <p v-if="notificationStore.notificationCount !== 0 && isLogin == true"
                        style="position:absolute; color:red;  font-weight:bold; top:-17px; left:8px;">
                        <img style="width: 15px;  " src="../assets/nkt.png" alt="">
                    </p>
                    <ion-ripple-effect type="unbounded" />
                </div>
            </div>
        </div>
    </ion-header>
    <!-- <ion-searchbar :debounce="1000"
                   class="header-search custom-searchbar"
                   placeholder="Marka, Ürün Adı, Kategori Arayın"
                   v-if="props.showSearchBar"
                   @ionFocus="searchModalOpen()"
                   showClearButton="always"
                   @ionInput="goToSearch($event)"f
    /> -->
    <!-- <ion-searchbar :debounce="1000" class="header-search custom-searchbar"
        placeholder="Marka, Ürün Adı, Kategori Arayın" v-if="props.showSearchBar" @ionFocus="searchModalOpen()"
        showClearButton="always" v-model="searchValue" @ionInput="goToSearch($event)" /> -->

    <ion-searchbar :debounce="1000" class="header-search custom-searchbar"
        placeholder="Marka, Ürün Adı, Kategori Arayın" v-if="props.showSearchBar" @ionFocus="searchModalOpen()"
        showClearButton="always" @ionClear="searchModalClose" v-model="searchValue" @ionInput="goToSearch($event)" />


    <div class="search-modal-wrapper" v-if="searchModalShow">
        <div class="search-modal-inner">

            <!-- <div class="search-modal-close ion-activatable ripple-parent" @click="searchModalClose()">
                <ion-icon color="primary" :icon="closeOutline" />
                <ion-ripple-effect></ion-ripple-effect>
            </div> -->



            <ion-grid style="padding:0px;">
                <ion-row>
                    <ion-col size="12" style="padding: 15px;">
                        <div v-for="(i, index) in searchProductData" :key="index" @click="goToProductDetails(i)"
                            style="background-color: #EBEBED; padding: 0px; display: flex; justify-content: space-between; align-items: center;">

                            <!-- Ürün adı kısmı -->
                            <div class="product-info">
                                <div class="product-detail">
                                    {{ i.name }}
                                </div>
                            </div>

                            <!-- Kategori simgesi (icon) kısmı -->
                            <p style="margin-right: 10px;"><img style="height: 15px; " src="../assets/kate.png" alt="">
                            </p>
                        </div>
                    </ion-col>
                </ion-row>
            </ion-grid>



            <ion-grid style="padding:0px; border-top:.5px solid #e8e8e8">

                <ion-row v-if="searchCategoryData.length > 0">
                    <ion-col size="12">
                        <h4 style="font-weight: bold;">İlgili Kategoriler</h4>
                    </ion-col>

                    <ion-chip style="white-space: nowrap;        /* Tek satırda tut */
  overflow: hidden;           /* Taşan kısmı gizle */
  text-overflow: ellipsis;    /* Taşan kısma üç nokta ekle */
  padding-right: 4px; text-align: center;   " @click="goToDetails(i, 'relating')"
                        v-for="(i, index) in searchCategoryData" :key="index">{{ i.name }}</ion-chip>

                </ion-row>
                <ion-row>
                    <ion-col size="12">
                        <h4 style="font-weight: bold;">En Çok Takaslananlar</h4>
                    </ion-col>
                    <ion-col size="12" class="grid-3">
                        <ion-chip style="border-radius: 4px;font-weight: bold;
   text-align: center;     display: flex;
    flex-direction: column;" @click="goToDetails(i, 'mostSwapped')" color="medium" v-for="(i, index) in mostSwaped"
                            :key="index"><span style="margin: auto;">{{ i.name }}</span></ion-chip>
                    </ion-col>
                </ion-row>

                <ion-row>
                    <ion-col size="12">
                        <h4 style="font-weight: bold;">Sana Özel Kategoriler</h4>
                    </ion-col>
                    <ion-col size="12" class="grid-3">
                        <ion-chip style="border-radius: 4px;font-weight: bold; text-align: center;display: flex;
    flex-direction: column; " @click="goToDetails(i, 'yourSuggest')" color="medium"
                            v-for="(i, index) in yourSuggestedCategory" :key="index"><span style="margin: auto;">{{
                                i.name
                                }}</span></ion-chip>
                    </ion-col>
                </ion-row>


            </ion-grid>


        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IonHeader, IonIcon, IonImg, IonRippleEffect, IonCol, IonRow, IonGrid, IonList, IonLabel, IonChip, IonCard, IonContent, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonThumbnail, IonSearchbar } from "@ionic/vue";
import { closeOutline } from "ionicons/icons";



// Images
import logoImage from "@/assets/logo.png";
import chatIcon from "@/assets/header/chat.svg";
import heartIcon from "@/assets/header/heart.svg";
import notificationIcon from "@/assets/header/notification.svg";
import searchSuggestApi from "@/services/searchSuggestApi";
import messageApi from "@/services/messageApi";


// Other
const route = useRoute()
const router = useRouter()

// Props
interface propsInterface {
    showSearchBar?: boolean
}

const props = withDefaults(defineProps<propsInterface>(), {
    showSearchBar: false
})

// Data
const searchModalShow = ref<boolean>(false)
const mostSwaped = ref<any[]>([])
const yourSuggestedCategory = ref<any[]>([])
const searchProductData = ref<any[]>([])
const searchCategoryData = ref<any[]>([])
const searchValue = ref<string>("")


// Computed
const isAuthPage = computed(() => {
    const notVisibleRoutes = ["Login", "Signup", "SignupDetails"]
    return notVisibleRoutes.includes(route.name as string)
})

// Functions
const searchModalOpen = async () => {
    searchModalShow.value = true;
}
const searchModalClose = async () => {
    searchModalShow.value = false;
}


watch(() => route.path, (newPath) => {
    searchModalShow.value = false;
    console.log("header")
})


const goToDetails = (product: any, event: any) => {
    console.log(product)
    if (event == 'yourSuggest') {
        router.push({ name: 'search', params: { code: product.category_code } as any })
    }
    if (event == 'mostSwapped') {
        console.log("test")
        router.push({ name: 'search', params: { code: product.category_code } as any })
    }
    if (event == 'relating') {
        router.push({ name: 'search', params: { code: product.category_code } as any })
    }
}

const getSearchSuggest = () => {
    searchSuggestApi.getSuggest().then(res => {
        //console.log(res.data)
        mostSwaped.value = res.data.mostSwaped
        yourSuggestedCategory.value = res.data.yourSuggestedCategories
        //console.log(yourSuggestedCategory.value)
    })
}

const showClearAlert  = () => {
   
    searchModalClose();
}


import { useAuthStore } from "@/stores/authStore";
import { useMessageStore } from "@/stores/messageStore";
import { useNotificationStore } from "@/stores/notificationCount";

// Store
const store = useAuthStore();
const messageStore = useMessageStore();
const notificationStore = useNotificationStore();
console.log(messageStore.messageCount)







const goToSearch = (event: any) => {
    const searchTerm = event?.detail?.value?.trim(); // Trim to remove any leading or trailing whitespace
    if (searchTerm && searchTerm.length > 1) {
        // Eğer arama terimi boş değilse ve uzunluğu 1'den büyükse, API çağrısını yap
        searchSuggestApi.getSearchData({ q: searchTerm }).then(res => {
            // API yanıtını al ve ürünleri sınırlı sayıda göstermek için filtrele
            searchProductData.value = res.data.categories
            searchCategoryData.value = res.data.categories;
            searchModalOpen()
        });
    } else {
        // Eğer arama terimi boşsa, searchSuggestApi.getSearchData çağrısını yapma
        searchProductData.value = []; // Boş bir dizi ile ürünleri temizle
        searchCategoryData.value = []; // Boş bir dizi ile kategorileri temizle
    }
}

const goToAllSearchResults = () => {
    // router.push({ name: 'search', query: { search: searchValue.value } as any })
    router.push({ name: 'SearchData', query: { search: searchValue.value } as any })
}

const goToProductDetails = (product: any) => {
    //router.push({ name: 'product-detail', params: { code: product.category_code } as any })
    router.push({ name: 'search', params: { code: product.category_code } });
}







let isLogin = ref<boolean>(false);
onMounted(() => {
    getSearchSuggest()
    console.log("deneme")


    const isLoggedIn = computed(() => store.user);
    if (isLoggedIn.value.user_code !== null) {
        isLogin.value = true
    }
})


</script>

<style lang="scss" scoped>
.grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

ion-header {
    box-shadow: none;
    -webkit-box-shadow: none;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 0px 0px 0;

        .header-left {
            border-radius: var(--border-radius);
            padding: 10px 10px 5px 10px;

            ion-img {
                height: 30px;
                cursor: pointer;
                width: 125px;
            }
        }

        .header-right {
            display: flex;
            gap: 15px;
            margin-right: 10px;

            .ion-img-wrapper {
                border-radius: 50%;
                width: 20px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;

                &:hover {
                    background-color: var(--primary-gray);
                }

                ion-img {
                    width: 24px;
                    cursor: pointer;
                }
            }
        }
    }
}

ion-searchbar {
    padding: 0 10px 0 10px;
    --border-radius: 20px;
    --box-shadow: none;
    --background: #ebebed;
}

.ripple-parent {
    position: relative;
    overflow: hidden;
}

.circle {
    width: 90px;
    height: 90px;
    border-radius: 50%;
}

.search-modal-wrapper {
    position: absolute;
    top: 89px;
    /* background: var(--white); */
    z-index: 100;
    height: calc(100vh - 110px);
    width: 100%;
    padding-top: 0px;
    overflow-y: scroll;
    background-color: white;

    .search-modal-inner {
        padding: 0px;
    }

    .search-modal-close {
        position: absolute;
        top: 1%;
        right: 8%;
        cursor: pointer;

        border: 1px solid var(--primary-gray);
        border-radius: 50%;
        height: 20px;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transform: translate(50%, -50%);
        /* Butonu tam ortada hizalar */

        ion-icon {
            font-size: 20px;
        }
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
    padding-bottom: 5px;
}

.product-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-left: 10px;
    padding: 0px;
    width: 100%;
    //background-color: gray;
}

.product-detail {
    margin-bottom: 5px;
    padding: 0px;
    width: 100%;
    //background-color: blue;
}

.product-detail strong {
    display: block;
}
</style>