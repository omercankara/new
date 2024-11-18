<template>
    <ion-list lines="full">
        <ion-item-sliding v-for="(search, searchKey) in searches" :key="searchKey">
            <ion-item>
                <ion-label @click="goProducts(search)">{{ search.name }}</ion-label>
                <div class="notification-status" slot="end" @click="search.notification = !search.notification">
                    <ion-icon :icon="search.notification ? notificationsOutline : notificationsOffOutline" />
                    <!--<ion-label>
                        {{ search.notification ? 'Bildirimler Açık' : 'Bildirimler Kapalı' }}
                    </ion-label>-->
                </div>
            </ion-item>
            <ion-item-options>
                <ion-item-option @click="deleteSearch(search)" color="danger">Delete</ion-item-option>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { IonIcon, IonList, IonLabel, IonItemOptions, IonItemOption, IonItem, IonItemSliding } from '@ionic/vue';
import { notificationsOffOutline, notificationsOutline } from 'ionicons/icons';
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useFilterStore } from '@/stores/savedFilter';
const router = useRouter();
const route = useRoute();
import favoritesApi from '@/services/favoritesApi';
import axios from 'axios';


const savedFilter = useFilterStore();

// Data
const searches = ref<any[]>([
    {
        id: 1,
        label: 'Asus Bilgisayar',
        notification: false
    },

    {
        id: 3,
        label: 'Dell Laptop',
        notification: false
    }
]);




const goProducts = (search: any) => {


    try {
        // search'i JSON.parse ile dönüştür
        const parsedSearch = JSON.parse(search.search);
        //console.log(parsedSearch);
        savedFilter.setFilter(parsedSearch)

        router.push({ name: 'search', params: { code: parsedSearch.categoryCode } });
    } catch (error) {
        router.push({ name: 'search', params: { code: search.search } });
    }
};

// watch(() => route.fullPath, (newPath) => {
//     if (newPath === '/my-favorites') {

//         savedFilter.setFilter({ categoryCode: "", dateSort: "", priceRange: { min: 0, max: 0 }, priceSort: "", selectedCity: [] as string[], swap: false });
//         console.log("favoriler yenilendi")

//     }
// }, { immediate: true });


const deleteSearch = (search: any) => {
    // is_deleted değerini true yap
    search.is_deleted = true;

    favoritesApi.favoritesDelete(search).then((res) => {
        // Başarılı yanıt alındığında yapılacak işlemler
        console.log("Favori silindi:", res);
        favoritesApi.getFavoriteSearch().then((res) => {
            searches.value = res.data.data
            let item = res.data.data
            item.forEach((element: any) => {
                console.log(element.search)
                const parsedSearch = JSON.parse(element.search);
                //console.log(parsedSearch)
            });


        })
    }).catch((error) => {
        // Hata durumunda yapılacak işlemler
        console.error("Silme işlemi başarısız:", error);
    });
};



// OnMounted
onMounted(() => {
    console.log("test")
    savedFilter.setFilter({ categoryCode: "", dateSort: "", priceRange: { min: 0, max: 0 }, priceSort: "", selectedCity: [] as string[], swap: false });
    console.log("favoriler yenilendi")
    favoritesApi.getFavoriteSearch()
        .then((res) => {
            searches.value = res.data.data;
            let item = res.data.data;

            item.forEach((element: any) => {
                console.log(element.search);
                const parsedSearch = JSON.parse(element.search);
                // console.log(parsedSearch);
            });
        })
        .catch((error) => {
            //console.error("Hata oluştu:", error);
           
        });

})
</script>

<style lang="scss" scoped>
ion-list {
    ion-item {
        --inner-padding-top: 10px;
        --inner-padding-bottom: 10px;

        ion-label {
            font-size: 14px;
            --font-family: var(--font-bold);
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .notification-status {
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;

            ion-icon {
                font-size: 20px;
            }
        }
    }
}
</style>
