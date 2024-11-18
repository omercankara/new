<template>
    <ion-page>
        <Header />
        <PageHeader title="Favorilerim" />
        <ion-segment :value="selectedTab" @ionChange="changeTab">
            <ion-segment-button :value="tab.value" v-for="(tab, tabKey) in tabs" :key="tabKey">
                <ion-label>{{ tab.label }}</ion-label>
            </ion-segment-button>
        </ion-segment>
        <ion-content>
            <MyFavoritesFavoriteAds v-if="selectedTab === 'favorite-ads'" />
            <MyFavoritesFavoriteSearches v-if="selectedTab === 'favorite-searches'" />
            <MyFavoritesFavoriteSellers v-if="selectedTab === 'favorite-sellers'" />
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton } from '@ionic/vue';

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Pages
import MyFavoritesFavoriteAds from "@/modules/myAccount/views/MyFavorites-FavoriteAds.vue";
import MyFavoritesFavoriteSearches from "@/modules/myAccount/views/MyFavorites-FavoriteSearches.vue";
import MyFavoritesFavoriteSellers from "@/modules/myAccount/views/MyFavorites-FavoriteSellers.vue";
import { FetchMessageList } from '@/helpers/messageCount';
import favoritesApi from '@/services/favoritesApi';

// Data
const selectedTab = ref<string>('favorite-ads');
const tabs = ref<any[]>([
    {
        value: 'favorite-ads',
        label: 'Favori İlanlar'
    },
    {
        value: 'favorite-searches',
        label: 'Favori Aramalar'
    },
    {
        value: 'favorite-sellers',
        label: 'Favori Satıcılar'
    }
]);

// Function
const changeTab = (e: any) => {
    selectedTab.value = e?.detail?.value;
}

// OnMounted
onMounted(() => {
    FetchMessageList().then(() => {
        console.log("Mesaj listesi başarıyla alındı.");
    }).catch(error => {
        console.error("Mesaj listesi alınırken hata oluştu:", error);
    });

   
})
</script>

<style lang="scss" scoped>
ion-segment {
    --background: var(--white);

    ion-segment-button {
        --indicator-height: 4px;
        text-transform: none;
        letter-spacing: 0;
        font-family: var(--font-medium), sans-serif;
        color: var(--black);
        border-bottom: 1px solid #e9e9e9;
        border-radius: 0;

        ion-label {
            --margin-top: 8px;
            --margin-bottom: 8px;
        }
    }
}
</style>
