    <template>
        <ion-page>
            <Header />
            <ion-content>
                <div
                    style="display: flex; align-items: center; margin-bottom: 10px;  border-radius: 1vh; padding: 5px;">
                    <ion-searchbar :debounce="1000" @ionInput="goToSearch($event)" type="text"
                        placeholder="Marka ürün adı, kategori arayın"
                        style="width: 100%; border: none; outline: none; background-color: #F3F2F7;"
                        v-model="searchTerm" />
                </div>


                <PageHeader v-if="title !== ''" :title="title">
                    <template #start-action v-if="categoryCode">
                        <ion-button @click="handleGoToBack()">
                            <ion-icon slot="icon-only" :icon="chevronBackOutline" />
                        </ion-button>
                    </template>


                </PageHeader>


                <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                    <ion-refresher-content></ion-refresher-content>
                </ion-refresher>
                <ion-list lines="full">

                    <ion-item v-for="(item, itemKey) in categoryTreeList" :key="itemKey"
                        :detail="childrenData.length > 0" @click="handleCategory(item)" button>
                        <div class="item-label">
                            {{ item?.name }}
                        </div>
                    </ion-item>
                </ion-list>
               
            </ion-content>
        </ion-page>
    </template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { IonButton, IonContent, IonIcon, IonItem, IonList,IonSearchbar, IonRefresher, IonRefresherContent, IonPage } from '@ionic/vue';
import { chevronBackOutline, code } from 'ionicons/icons';

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Stores
import { useCategoryStore } from "@/stores/categoryStore";
import categoryApi from '@/services/categoryApi';
import { FetchMessageList } from '@/helpers/messageCount';

// Other
const categoryStore = useCategoryStore();
const router = useRouter();
const route = useRoute();

// Data
const categoryTreeList = ref<any[]>([]);
const categoryCode = ref<string>('');
const childrenData = ref<any[]>([]);
let title = ref<string>('');
const searchTerm = ref<string>('');
const mainCategoriesFetched = ref(false);

// const fetchCategories = async () => {
//     await categoryStore.getCategoryMainList();
// };

// const filteredCategories = computed(() => {
//     if (!searchTerm.value) {
//         return CategoryParentData.value;
//     }
//     return CategoryParentData.value.filter(category =>
//         category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
//     );
// });


const goToSearch = async (event: any) => {
    const searchTerm = event?.detail?.value?.trim();
    if (searchTerm !== '') {
        categoryApi.getSearchCategoryResult(searchTerm).then((res) => {
            console.log(res.data.data)
            categoryTreeList.value = res.data.data
        })
    } else {
        const mainCategoriesResponse = await categoryApi.getProductCreateMainCategories();
        categoryTreeList.value = mainCategoriesResponse.data.data;
    }
}



const handleRefresh = async (event: any) => {
    setTimeout(async () => {
        (event.target as HTMLIonRefresherElement).complete();
        try {
            // İlgili kategori kodu varsa, detayları al
            if (categoryCode.value !== '') {
                if (route.params.code) {
                    const res = await categoryApi.getHeaderTitle(route.params.code); // await ekleyin
                    title.value = res.data.data[0].name;
                    console.log("gelenveri", title.value);
                }

                // İlk API çağrısı tamamlandıktan sonra bu satıra geçiyoruz
                const detailResponse = await categoryApi.getCategoriDetails(categoryCode.value);
                categoryTreeList.value = detailResponse.data.data;

                // Yerel depolama güncellemesi, kategori detayları alındıktan sonra

                //localStorage.setItem('categoryTreeList', JSON.stringify(categoryTreeList.value));
            } else {
                // Ana kategorileri al
                const mainCategoriesResponse = await categoryApi.getProductCreateMainCategories();
                categoryTreeList.value = mainCategoriesResponse.data.data;

                // Yerel depolama güncellemesi, ana kategoriler alındıktan sonra

                //localStorage.setItem('categoryTreeList', JSON.stringify(categoryTreeList.value));
            }
        } catch (error) {
            console.error('Veri çekme hatası:', error);
        }
    }, 2000)
}




// Functions
const handleGoToBack = () => {
    history.back();
}


if (route.params.code) {
    categoryCode.value = route.params.code as string;
}

const handleCategory = (item: any) => {
    router.push({ name: 'product-create-category', params: { code: item.category_code } })
    if (item.children) {
        childrenData.value = item.children
        if (childrenData.value.length == 0) {
            router.push({ name: 'product-create', params: { code: item.category_code } })
        }
    }
}

// const computedTitle = computed(() => {
//     if (categoryCode.value === '') {
//         return 'Kategori Seçimi';
//     }
//     return categoryTreeList.value.find((item) => item.categoryCode === categoryCode.value)?.name ?? 'Kategori Seçimi';
// })


// onMounted(() => {
//     const storedData = localStorage.getItem('categoryTreeList');
//    // fetchCategories();

//     if (storedData) {
//         categoryTreeList.value = JSON.parse(storedData);
//     } else {
//         categoryApi.getMainCategories().then((res) => {
//             categoryTreeList.value = res.data.data;
//             localStorage.setItem('categoryTreeList', JSON.stringify(res.data.data));
//         });
//     }

//     if (categoryCode.value !== '') {
//         categoryApi.getCategoriDetails(categoryCode.value).then((res) => {
//             categoryTreeList.value = res.data.data
//         })
//     }
// })

onMounted(async () => {





    //const storedData = localStorage.getItem('categoryTreeList');
    // if (storedData) {
    //     categoryTreeList.value = JSON.parse(storedData);
    // }

    try {
        // İlgili kategori kodu varsa, detayları al
        if (categoryCode.value !== '') {
            if (route.params.code) {
                const res = await categoryApi.getHeaderTitle(route.params.code); // await ekleyin
                title.value = res.data.data[0].name;
                console.log("gelenveri", title.value);
            }

            // İlk API çağrısı tamamlandıktan sonra bu satıra geçiyoruz
            const detailResponse = await categoryApi.getCategoriDetails(categoryCode.value);
            categoryTreeList.value = detailResponse.data.data;

            // Yerel depolama güncellemesi, kategori detayları alındıktan sonra

            //localStorage.setItem('categoryTreeList', JSON.stringify(categoryTreeList.value));
        } else {
            // Ana kategorileri al
            const mainCategoriesResponse = await categoryApi.getProductCreateMainCategories();
            categoryTreeList.value = mainCategoriesResponse.data.data;

            // Yerel depolama güncellemesi, ana kategoriler alındıktan sonra

            //localStorage.setItem('categoryTreeList', JSON.stringify(categoryTreeList.value));
        }
    } catch (error) {
        console.error('Veri çekme hatası:', error);
    }

});



</script>

<style lang="scss" scoped>
ion-button {
    --background: transparent;
    --background-hover: transparent;
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
            font-size: 15px;
            font-family: var(--font-medium);
        }
    }
}
</style>

