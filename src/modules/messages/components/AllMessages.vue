<template>
  <ion-page>
    <ion-content>

      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-row style="background-color: #F3F2F7; display: flex; justify-content: center; margin-bottom: 5px;">
        <ion-col size="12" style=" display: flex; justify-content: space-around; ">
          <ion-col size="4" offset="0" style=" display: flex; justify-content: center; align-items: center;">
            <ion-label style="font-weight: normal; font-size: 12px;">Okundu</ion-label>
          </ion-col>

          <ion-col size="4" offset="0" style=" display: flex; justify-content: center">
            <ion-label style=" font-size: 12px;">okunmadı</ion-label>
          </ion-col>
          <ion-col size="5" offset="0" style=" display: flex; justify-content: center">
            <ion-label style=" font-size: 12px;">yıldızlı</ion-label>
          </ion-col>
        </ion-col>
      </ion-row>

      <ion-row style="background-color: #F3F2F7; margin-bottom: 5px;">
        <ion-col size="5" style=" display: flex; align-items:center;">
          <ion-col size="9" offset="1" style="width: 50% !important;">
            <ion-label style="font-weight: bold; font-size: 19px;">Mesajlar</ion-label>
          </ion-col>
        </ion-col>

        <ion-col size="7" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="flex-grow: 1; display: flex; justify-content: center;">
              <input v-if="isSearchVisible" v-model="searchMsg" placeholder="Ara"
              style="border-bottom: 1px solid purple; border-top: none; width: 90%; border-left: none; border-right: none; background-color: #F3F2F7;">
          </div>
          <ion-icon color="primary" :icon="search" @click="toggleSearchInput" style="margin-right: 20px;" />
      </ion-col>
      
      
      </ion-row>

      <ion-list lines="full">
        <ion-item-sliding v-for="(i, index) in filteredUserAdsList" :key="index">
          <ion-item @click="openMessage(i)">
            <ion-col v-if="i.latest_offer.to[0]?.image" size="3"
              style="background-color: #F3F2F7; display: flex; justify-content: center;">
              <img style="height: 70px; object-fit: cover"
                :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + i.latest_offer.to[0]?.image">
            </ion-col>

            <ion-col v-else size="3" style="background-color: #F3F2F7; display: flex; justify-content: center;">
              <img style="height: 70px; object-fit: cover"
                :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + i.latest_offer.showcase_image">
            </ion-col>

            <ion-col size="9"
              style="background-color: #F3F2F7; height: 80px; display: flex; flex-direction: row; justify-content: space-between;">
              <ion-row>
                <ion-col v-if="userCode !== i.latest_offer.targetOwnerInfo?.user_code" style="height: 25px;" size="12">
                  {{ userCode !== i.latest_offer.targetOwnerInfo?.user_code ? i.latest_offer.targetOwnerInfo?.name :
                    i.latest_offer.meOwnerInfo?.name || i.latest_offer.meName }}
                </ion-col>

                <ion-col v-else style="height: 25px;" size="12">
                  {{ userCode !== i.latest_offer.targetOwnerInfo?.user_code ? i.latest_offer.targetOwnerInfo?.name :
                    i.latest_offer.meOwnerInfo?.name || i.latest_offer.meName }}
                </ion-col>

                <ion-col style="height: 25px;" size="12">
                  <ion-label v-if="i.latest_offer.to[0]?.name"> {{ i.latest_offer.to[0]?.name }}</ion-label>
                  <ion-label v-else>{{ i.latest_offer.product_name }}</ion-label>
                </ion-col>

                <ion-col style="height: 25px;" size="12">
                  <ion-label style="font-size: 12px;">29.03.2024 14.05</ion-label>
                </ion-col>
              </ion-row>

              <!-- Silmek için kaydırın yazısı -->
              <ion-row style="justify-content: flex-end;">
                <ion-col size="12" style="text-align: right; font-size: 12px; color: grey; padding-right: 10px;">
                  Silmek için kaydırın
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-item>

          <ion-item-options>
            <ion-item-option color="danger" @click="deleteAd(i)">Delete</ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>

import { useRoute, useRouter } from "vue-router"
import authApi from '@/services/authApi';
import messageApi from '@/services/messageApi';
import { IonPage, IonCol, IonRow, IonLabel, IonIcon, IonContent, IonItemSliding, IonItemOption, IonItemOptions, IonList, IonItem } from '@ionic/vue';
import { calendarOutline, closeOutline, heart, heartOutline, timeOutline, chevronForward, search } from 'ionicons/icons';
import { onMounted, ref, watch, computed } from 'vue';

// Reactive property for managing search input visibility
const isSearchVisible = ref(false);

const messageList = ref<any[]>([]);

const userCode = computed(() => {
  // LocalStorage'dan kullanıcı verisini çek
  const user = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;
  return parsedUser ? parsedUser.user_code : null;
});

// Store
import { useMessageStore } from '@/stores/messageStore';
import productApi from "@/services/productApi";
const store = useMessageStore()

const router = useRouter();
const route = useRoute();
const searchMsg = ref('');

const filteredUserAdsList = computed(() => {
  const searchTerm = searchMsg.value.trim().toLowerCase();
  if (!searchTerm) {
    return messageList.value;
  } else {
    return messageList.value.filter(item => {
      const targetOwnerFirstName = item.targetOwnerInfo?.name?.toLowerCase() || '';
      const meOwnerFirstName = item.MeOwnerInfo?.name?.toLowerCase() || '';
      return targetOwnerFirstName.includes(searchTerm) || meOwnerFirstName.includes(searchTerm);
    });
  }
});

const openMessage = (item: any) => {
  router.push(`/messageDetails/${item.message_code}`);
  store.messageSet(item.message_code);
  store.setUserInfo(item);
  console.log(item);
};

const deleteAd = async (item: any) => {
  const updatedItem = userCode.value === item._from
    ? { ...item, from_is_deleted: true }
    : userCode.value === item._to
      ? { ...item, to_is_deleted: true }
      : { ...item };

  console.log('updatedItem :>> ', updatedItem);

  try {
    await messageApi.deleteMessage(updatedItem);
    console.log('Güncelleme başarılı:', updatedItem);
  } catch (error) {
    console.error('Güncelleme sırasında hata oluştu:', error);
  }
};

const FetchMessageList = async () => {
  try {
    console.log(userCode.value);
    const response = await messageApi.getMessageList();
    console.log(response);

    messageList.value = response.data.data.filter(
      (item: any) =>
        (item._from === userCode.value && item.from_is_deleted === false) ||
        (item._to === userCode.value && item.to_is_deleted === false)
    );

  } catch (error) {
    console.error(error);
  }
};

watch(() => route.path, (newPath: string) => {
  if (newPath === '/messages') {
    FetchMessageList();
  }
});

const handleRefresh = (event: CustomEvent) => {
  setTimeout(() => {
    (event.target as HTMLIonRefresherElement).complete();
    FetchMessageList();
  }, 2000);
};

const toggleSearchInput = () => {
  isSearchVisible.value = !isSearchVisible.value; // Toggle the search input visibility
};

onMounted(async () => {
  FetchMessageList();
});

</script>

<style lang="scss" scoped>
ion-page {
  height: 100%;
}

ion-content {
  --overflow: auto; // This ensures that overflow is handled within the ion-content area
}
</style>
