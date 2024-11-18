<template>
    <ion-page>
        <Header />
        <PageHeader :title="title">
            <template #start-action>
                <ion-button @click="handleGoToBack()">
                    <ion-icon slot="icon-only" :icon="chevronBackOutline" />
                </ion-button>
            </template>
        </PageHeader>

        <div style="height: 10px;" v-if="loading"></div>
        <div style="display: flex; align-items: center; margin-bottom: 10px;  border-radius: 1vh; padding: 5px;">
            <ion-searchbar :debounce="1000" @ionInput="goToSearch($event)" type="text"
                placeholder="Marka ürün adı, kategori arayın"
                style="width: 100%; border: none; outline: none; background-color: #F3F2F7;" v-model="searchTerm" />
        </div>

       


        <ion-content>
            <ion-list lines="full">
                <ion-item v-if="title !== ''" @click="allAds" style="color: purple;">
                    Tüm {{ title }} ilanlarını gör
                </ion-item>
                <ion-item v-for="(item, itemKey) in filteredCategories" :key="itemKey" @click="handleCategory(item)"
                    button>
                    <div class="item-label">
                        {{ item.name }}
                    </div>
                </ion-item>
                <ion-item @click="suggestion">
                    <p style="margin-left:0px; color:purple; font-size:15px; font-weight:bold;">Kategori
                        Önerisinde bulun</p>
                </ion-item>



                <ion-modal id="product-detail-modal" ref="suggestModal"  :is-open="isSuggestModalOpen"
                @did-dismiss="closeFirstModal">
                <div class="wrapper">
    
                    <div class="modal-close-button ion-activatable ripple-parent">
                        <span> <ion-icon color="primary" @click="closeFirstModal" :icon="closeOutline"
                                size="large" /></span>
    
                        <ion-ripple-effect></ion-ripple-effect>
                    </div>
    
                    <ion-label>
                        <div class="label2">
                            <p>Takasimo'da <br> görmek istediginiz yeni kategoriyi önerin</p>
                        </div>
                    </ion-label>
    
    
                    <ion-grid>
                        <!-- Kategori adı -->
                        <ion-row>
                            <ion-col size="12">
                                <div class="input-group">
                                    <ion-label>Kategori</ion-label>
                                    <input v-model="formData.category_name"
                                        style="width: 60%; border-radius:1vh; border:none; height:30px; background-color:gainsboro;"
                                        type="text"></input>
                                </div>
                            </ion-col>
                        </ion-row>
    
                        <!-- Örnek Ürünler -->
                        <ion-row>
                            <ion-col size="12">
                                <div class="input-group">
                                    <ion-label>Örnek Ürünler</ion-label>
                                    <input v-model="formData.product"
                                        style="width: 60%; border-radius:1vh; border:none; height:30px; background-color:gainsboro;"
                                        type="text"></input>
                                </div>
                            </ion-col>
                        </ion-row>
    
                        <!-- Açıklama -->
                        <ion-row>
                            <ion-col size="12">
                                <div class="input-group">
                                    <ion-label>Açıklama</ion-label>
                                    <input v-model="formData.description"
                                        style="width: 60%; border-radius:1vh; border:none; height:30px; background-color:gainsboro;"
                                        type="text"></input>
                                </div>
                            </ion-col>
                        </ion-row>
    
                        <ion-row>
                            <ion-col size="12">
                                <div class="button-group">
                                    <button @click="onSecondModal" color="primary">Gönder</button>
                                </div>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </div>
            </ion-modal>
   
            <ion-modal id="product-detail-success-modal" ref="secondModal" :is-open="isSuggestSuccesModalOpen"
                @did-dismiss="closeSecondModal">
                <div class="wrapper">
    
                    <div class="modal-close-button ion-activatable ripple-parent">
                        <span> <ion-icon color="primary" @click="closeSecondModal" :icon="closeOutline"
                                size="large" /></span>
    
                        <ion-ripple-effect></ion-ripple-effect>
                    </div>
                    <div class="takasimo-logo">
                        <img src="@/assets/takasimo-icon.png" />
                    </div>
    
    
                    <ion-label>
                        <div class="label2" style="font-size: 16px;">
                            <p style="font-size: 20px; margin-bottom: 10px;">Teşekkürler</p>
                            <p style="margin-left:30px; color:black; font-size:15px; ">Önerin bizim için çok
                                değerli <br>Kategori öneriniz başarıyla alınmıştır</p>
                        </div>
                    </ion-label>
                </div>
            </ion-modal>







            </ion-list>



        </ion-content>

    </ion-page>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { IonButton, IonModal, IonRow,IonGrid,IonRippleEffect,IonLabel,IonCol, IonContent, IonSearchbar, IonIcon, IonItem, IonList, IonPage } from '@ionic/vue';
import { chevronBackOutline, closeOutline } from 'ionicons/icons';

const isSuggestModalOpen = ref<boolean>(false);
const isSuggestSuccesModalOpen = ref<boolean>(false);

const secondModal = ref<HTMLIonModalElement | null>(null);
const suggestModal = ref<HTMLIonModalElement | null>(null);


// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

const closeFirstModal = () => {
    isSuggestModalOpen.value = false
}

// Stores
import { useCategoryStore } from "@/stores/categoryStore";
import categoryApi from '@/services/categoryApi';

import { useBreadCrumbStore } from '@/stores/breadCrumb';

const breadCrumbs = useBreadCrumbStore()

// Other
const categoryStore = useCategoryStore();
const router = useRouter();
const route = useRoute();

// Data
// const categoryTreeList = ref<any[]>([]);
const CategoryParentData = ref<any[]>([]);
const categoryCode = ref<string>('');
const searchTerm = ref<string>('');

let title = ref<string>('');

let formData = ref<any>({
    parent_code: route.params.code as string,
    category_name: '',
    product: "",
    description: "",
    status: true
});



const filteredCategories = computed(() => {
    if (!searchTerm.value) {
        return CategoryParentData.value;
    }
    return CategoryParentData.value.filter(category =>
        category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});


const suggestion = () => {
    isSuggestModalOpen.value = true
}




const closeSecondModal = () => {
    isSuggestModalOpen.value = false
    isSuggestSuccesModalOpen.value = false
}


const onSecondModal = async () => {
    console.log("test")
    await categoryApi.createCategorySuggestion(formData.value).then((res) => {
        console.log(res.data)
    });
    isSuggestModalOpen.value = false
    isSuggestSuccesModalOpen.value = true
}


const goToSearch = (event: any) => {
    const searchTerm = event?.detail?.value?.trim();
    if (searchTerm !== '') {
        categoryApi.getSearchCategoryResult(searchTerm).then((res) => {
            console.log(res.data.data)
            CategoryParentData.value = res.data.data
        })
    }
}

const allAds = () => {
    router.push({ name: 'search', params: { code: categoryCode.value } });
}

//Routa parent parametre kodunu at
if (route.params.code) {
    categoryCode.value = route.params.code as string;
}
//Parent parametre koduna göre kategori başlıgını al
// const computedTitle = computed(() => {
//     if (route.params.code === '') {
//         return 'Kategori Seçim';
//     }
//     const categoryCode = String(route.params.code);
//     const category = CategoryParentData.value.find(item => String(item.parent_code) === categoryCode);
//     return category ? category.name : 'Kategori Seçimi';
// });



//Sonraki kategoriye geçç
const handleCategory = (item: any) => {
    if (item.children.length > 0) {
        router.push({ name: 'category', params: { code: item.category_code } });
        //console.log("data", item)
    }
    else {
        router.push({ name: 'search', params: { code: item.category_code } });
    }

}


//Önceki kategoriye geri dön
const handleGoToBack = () => {
    router.go(-1);
    //history.back();
    breadCrumbs.handleGoToBack()
}


const loading = ref(true); // loading state

// onBeforeMount(() => {
//     categoryApi.getHeaderTitle(route.params.code)
//         .then((res) => {
//             ///console.log('API Response:', res.data); // API yanıtını kontrol et
//             title.value = res.data.data[0].name;
//             if (res.data.data[0].children < 1) {
//                 router.push({ name: 'search', params: { code: res.data.data[0].category_code } });
//                 loading.value = true;
//             }
//             if (title.value !== "") {
//                 breadCrumbs.setSelectedBreadCrumbs(title.value);
//             }

//             return categoryApi.getCategoriDetails(route.params.code);
//         })
//         .catch((error) => {
//             console.error('An error occurred:', error); // Hata kontrolü
//         });
// })



// On Mounted
onMounted(() => {

    searchTerm.value = '';
    //Önce breadCrumb işlemini yap ondan sonra alt kategorileri getir 
    //breadcrumb tamamlanmadan geçirtme
    categoryApi.getHeaderTitle(route.params.code)
        .then((res) => {
            // console.log('API Response:', res.data); // API yanıtını kontrol et,
            console.log("test", res.data)
            title.value = res.data.data[0].name;
            if (res.data.data[0].children < 1) {
                router.push({ name: 'search', params: { code: res.data.data[0].category_code } });
                loading.value = false;
            }
            if (title.value !== "") {
                breadCrumbs.setSelectedBreadCrumbs(title.value);
            }
            return categoryApi.getCategoriDetails(route.params.code);
        })
        .catch((error) => {
            console.error('An error occurred:', error); // Hata kontrolü
        });


})

watch(
    () => route.params, // route.params dinleniyor
    (newParams) => {
        searchTerm.value = ""; // searchTerm değeri temizleniyor

        categoryApi.getHeaderTitle(route.params.code)
            .then((res) => {

                console.log('object :>> ', res.data.data)
                if (res.data.data[0].children < 1) {
                    router.push({ name: 'search', params: { code: res.data.data[0].category_code } });
                }
                loading.value = false;
                //console.log("gelenveri", res.data.data[0].name);

                // if (title.value !== "") {
                //     breadCrumbs.setSelectedBreadCrumbs(title.value);
                // }
                return categoryApi.getCategoriDetails(route.params.code);

            })
            .then((res) => {
                console.log("gelen", res.data)
                CategoryParentData.value = res.data.data;
                //console.log('res :>> ', res);
            })
            .catch((error) => {
                // console.error('An error occurred:', error);
            });



    },
    { immediate: true } // Başlangıçta da çalışması için
);




</script>

<style lang="scss" scoped>
ion-modal#product-detail-success-modal {
    --width: 380px;
    --height: fit-content;
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 90px 10px 20px 10px;

        .takasimo-logo {
            position: absolute;
            top: -50px;
            left: calc(50% - 50px);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
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

        ion-label {
            margin-right: 10px;
            /* Optional: space between label and input */
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


















ion-modal#product-detail-modal {
    --width: 380px;
    --height: fit-content;
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 30px 10px 20px 10px;

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

        .input-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            /* Adjust this based on spacing preference */
        }

        .button-group {
            display: flex;
            align-items: center;
            justify-content: center;

            /* Adjust this based on spacing preference */
            button {
                width: 60%;
                height: 35px;
                border-radius: 1vh;
                background-color: #901B6A;
                color: white;
            }
        }

        ion-label {
            margin-right: 10px;
            /* Optional: space between label and input */
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

























ion-button {
    --background: transparent;
    --background-hover: red;
    --box-shadow: none;
    --border-width: 0px;

    ion-icon {
        color: var(--primary);
    }
}

ion-list {
    margin-bottom: 30px;
    --padding-start: 0px;
    --padding-end: 0px;

    ion-item {
        --background-hover: var(--primary-gray);
        --background-hover-opacity: 1;
        --min-height: 46px;
        cursor: pointer;
        font-size: 16px;

        &::part(detail-icon) {
            opacity: 1;
            font-size: 20px;
            color: var(--primary);
        }

        .item-label {
            margin-left: 0px;
            font-size: 15px;
            font-family: var(--font-medium);
        }
    }
}
</style>