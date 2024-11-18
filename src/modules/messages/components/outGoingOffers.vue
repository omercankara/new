<template>
  <ion-page>
    <ion-content>


      <ion-row style="background-color: #F3F2F7;  display: flex; justify-content: center; margin-bottom: 5px;">
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
        <ion-col size="10">
          <ion-col size="9" offset="1" style="width: 50% !important;">
            <ion-label style="font-weight: bold; font-size: 19px;">Mesajlar</ion-label>
          </ion-col>
        </ion-col>

        <ion-col size="2" style=" display: flex; justify-content: center;">
          <ion-icon color="primary" :icon="search" />
        </ion-col>
      </ion-row>

      <ion-row @click="openMessage(i)" v-for="i in fromMessages" :key="i" style="margin-bottom: 5px;">
        <ion-col size="3" style="background-color: #F3F2F7; display: flex; justify-content: center;">
          <img style="height: 70px; object-fit: cover" :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + i.image"
            alt="">
        </ion-col>

        <ion-col size="9"
          style="background-color: #F3F2F7; height: 80px; display: flex; flex-direction: row; justify-content: space-between;">
          <ion-row>
            <ion-col style="height: 25px;" size="12">
              <ion-label style="font-weight: bold;">{{ i.name }}</ion-label>
            </ion-col>
            <ion-col style="height: 25px;" size="12">
              <ion-label>{{ i.name }}</ion-label>
            </ion-col>
            <ion-col style="height: 25px;" size="12">
              <ion-label style="font-size: 12px;">29.03.2024 14.05</ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="12">
              <ion-label>
                ...
              </ion-label>
            </ion-col>
            <ion-col size="12">
              <ion-icon color="primary" @click="openMessage(i)" :icon="chevronForward" />
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonCol, IonRow, IonLabel, IonIcon, IonContent } from '@ionic/vue';
import { calendarOutline, closeOutline, heart, heartOutline, timeOutline, chevronForward, search,send } from 'ionicons/icons';
import { onMounted, ref, watch } from 'vue';
import authApi from '@/services/authApi';
import messageApi from '@/services/messageApi';
import { useRoute, useRouter } from "vue-router";

//Data
const fromMessages = ref<any[]>([]);

//store
import { useMessageStore } from '@/stores/messageStore';
const store = useMessageStore()



const router = useRouter();
const route = useRoute();


const openMessage = (item: any) => {
  router.push({ name: 'messageDetails'});
  store.messageSet(item.message_code);
  store.setUserInfo(item)
  console.log(item)
}

watch(() => route.path, (newPath) => {
  if (newPath === '/messagess') {
    console.log("test")
  }
})


// onMounted(() => {
//   fromMessages.value = [];
//   let user_code = '';
//   console.log("test")

//   authApi.me().then(res => {
//     user_code = res.data.user_code;
//     //console.log(res.data.user_code);
//   }).then(() => {
//     messageApi.getMessageList(user_code,'_from').then(res => {
//       const allFromMessages: any[] = [];
//      // console.log(user_code)
//       const veri = res.data.data;
//       console.log(res.data)
//       veri.forEach((item: any) => {
//         console.log(item)
//        // console.log(item)
//         if (item.latest_offer && Array.isArray(item.latest_offer.to)) {
//           item.latest_offer.to.forEach((element: any) => {
//             //console.log(element)
//             // Yeni bir nesne oluştur ve gerekli bilgileri ekle
//             const newItem = {
//               message_code: item.message_code, // Mesaj kodunu ekle
//               product_code: element.product_code,
//               _from:item._to,
//               _to:item._from,
//               name: element.name,
//               image: element.image
//             };
//             allFromMessages.push(newItem);
//           });
//         }
//       });
//       fromMessages.value = allFromMessages;
//     });
//   });
// });



</script>

<style lang="scss" scoped>
ion-page {
  height: 100%;
}

ion-content {
  --overflow: auto; // This ensures that overflow is handled within the ion-content area
}
</style>