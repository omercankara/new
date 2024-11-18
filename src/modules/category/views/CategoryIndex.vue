<template>
    <ion-page>
        <Header />

        <ion-content class="ion-padding">
            <div
                    style="display: flex; align-items: center; margin-bottom: 10px;  border-radius: 1vh; padding: 5px;">
                    <ion-searchbar :debounce="1000" @ionInput="goToSearch($event)" type="text"
                        placeholder="Marka ürün adı, kategori arayın"
                        style="width: 100%; border: none; outline: none; background-color: #F3F2F7;"
                        v-model="searchTerm" />
                </div>
            <PageHeader title="Kategori Seçimi" />
            <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <ion-grid>
                <ion-row>
                   
                    <template v-if="categoriesLoading">
                        <ion-col size="3" v-for="number in 11" :key="number">
                            <div class="category-item loading">
                                <ion-skeleton-text :animated="true" class="loading-image" />
                                <ion-skeleton-text :animated="true" class="loading-title" />
                            </div>
                        </ion-col>
                    </template>
                   


                    <template v-else>


                        




                        <ion-col :size="category?.image ? '4' : '12'" v-for="category in filteredCategories"
                            :key="category.id">
                            <div class="category-item ripple-parent ion-activatable"
                                @click="router.push({ name: 'category', params: { code: category.category_code } })">
                                <img v-if="category?.image"
                                    :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + category?.image"
                                    :alt="category.name" />
                                <div>{{ category?.name }}</div>
                                <ion-ripple-effect type="bounded" />
                            </div>
                        </ion-col>
                        <ion-col size="4">
                            <div class="category-item all-categories" @click="router.push({ name: 'allCategory' })">
                                <div>Tüm<br>Kategorileri<br>Gör</div>
                            </div>
                        </ion-col>
                    </template>
                </ion-row>
            </ion-grid>

        </ion-content>
    </ion-page>
</template>



<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { IonContent, IonRow, IonCol, IonSearchbar, IonGrid, IonPage,IonRefresher, IonRefresherContent, IonRippleEffect, IonSkeletonText } from '@ionic/vue';

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Services
import categoryApi from "@/services/categoryApi";
import { FetchMessageList } from '@/helpers/messageCount';

// Other
const router = useRouter()
const route = useRoute()

// Data
const categoriesLoading = ref<boolean>(false);
const categories = ref<any[]>([]);
const searchTerm = ref<string>('');

import { useFilterStore } from '@/stores/savedFilter';
const savedFilter = useFilterStore();



const goToSearch = (event: any) => {
    const searchTerm = event?.detail?.value?.trim();
    if (searchTerm !== '') {

        categoryApi.getSearchCategoryResult(searchTerm).then((res) => {
            console.log(res.data.data)
            categories.value = res.data.data
        })
    } else {
        categoriesLoading.value = true;
        categories.value = [];
        return categoryApi.getMainCategories()
            .then((res: any) => {
                const responseData: any[] = res?.data?.data ?? [];
                if (responseData.length > 0) {
                    let i: number = 0;
                    responseData.forEach((item: any) => {
                        if (i > 16) return;
                        categories.value.push(item);
                        i++;
                    })
                }
            })
            .finally(() => {
                categoriesLoading.value = false;
            })
    }
}

// Functions
const getCategories = () => {
    categoriesLoading.value = true;
    categories.value = [];
    return categoryApi.getMainCategories()
        .then((res: any) => {
            const responseData: any[] = res?.data?.data ?? [];
            if (responseData.length > 0) {
                let i: number = 0;
                responseData.forEach((item: any) => {
                    if (i > 16) return;
                    categories.value.push(item);
                    i++;
                })
            }
        })
        .finally(() => {
            categoriesLoading.value = false;
        })
}

// Computed property for filtering categories
const filteredCategories = computed(() => {
    if (!searchTerm.value) {
        return categories.value;
    }
    return categories.value.filter(category =>
        category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});

const clearSearchTerm = () => {
    searchTerm.value = '';
}
watch(
    () => route.path, // route.path dinleniyor
    (newPath) => {
        if (newPath === '/categories') {
            searchTerm.value = '';
            getCategories();
            savedFilter.setFilter({ categoryCode: "", dateSort: "", priceRange: { min: 0, max: 0 }, priceSort: "", selectedCity: [] as string[], swap: false });

        }
    }
);

const handleRefresh = (event: any) => {
    setTimeout(() => {
        (event.target as HTMLIonRefresherElement).complete();
        getCategories();
    },2000)
}




// On Mounted
onMounted(() => {
    ///console.log("deneme")
    searchTerm.value = '';

    getCategories();
   
})
</script>
<style lang="scss" scoped>
.category-wrapper {
    margin-bottom: 10px;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    border-radius: 20px;
    background-color: var(--primary-gray);
    cursor: pointer;
    padding: 0px 5px;
    min-height: 140px;

    &.loading {
        background-color: var(--primary-gray);
        padding: 8px 10px;

        .loading-image {
            width: 100%;
            height: 124px;
            border-radius: 15px;
            margin: 0 0 5px 0;
        }

        .loading-title {
            width: 80%;
            height: 16px;
            border-radius: 10px;
            margin: 0;
        }
    }

    img {
        width: 100%;
        height: 90px;
        object-fit: cover;
        border-radius: 20px;
        margin: 5px 5px 0 5px;
    }

    div {
        margin-top: 0px;
        font-size: 13px;
        font-family: var(--font-bold);
        padding: 5px 10px 10px 10px;
        text-align: center;
        margin: auto;
    }
}

.ripple-parent {
    position: relative;
    overflow: hidden;
}
</style>