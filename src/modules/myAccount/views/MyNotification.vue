<template>
  <ion-page>
    <Header />
    <PageHeader title="Bildirimler" />
    <ion-content>
      <ion-list lines="full">
        <!-- <ion-list-header>
            <ion-label>Bugün</ion-label>
          </ion-list-header> -->

          


        <ion-item v-for="(notification, index) in notificationList" :key="index">
          <img src="../../../assets/account/avatar.png" class="avatar" alt="Avatar" />
          <div>
            <ion-label class="title">
              <!-- Dinamik HTML içeriği göstermek için v-html kullanın -->
              <span style="font-size:11px;" v-html="notification.description" class="is-color-primary is-font-bold"></span>
            </ion-label>
            <ion-label class="time">2 saat önce</ion-label>
          </div>
        </ion-item>

        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>


      </ion-list>
      <ion-infinite-scroll @ionInfinite="handleInfiniteScroll">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
   
  </ion-page>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { IonContent, IonPage,IonInfiniteScroll,IonLabel,IonItem,IonList, IonRefresher,IonRefresherContent,IonInfiniteScrollContent, } from '@ionic/vue';
import Header from '@/components/Header.vue';
import PageHeader from '@/components/page/PageHeader.vue';
import notification from '@/services/notification';
import { chevronDownCircleOutline } from 'ionicons/icons';

// Reactive reference for notification list
const notificationList = ref<any[]>([]);

let totalPage = ref<number>(1)
let page = ref<number>(1)





// Fetch notifications from API
const getNotifications = async () => {  
  try {    
    const res = await notification.getNotification(page.value);    
    console.log(res.data.data);  
    
    // Eğer `res.data.data` bir dizi ise, bu diziyi doğrudan `notificationList`'e ekleyebilirsiniz.
    // Eğer `res.data.data` bir dizi değilse, bu durumda bir dizi oluşturarak `notificationList`'e ekleyin.
    if (Array.isArray(res.data.data)) {
      notificationList.value.push(...res.data.data);
    } else {
      console.error('Unexpected data format:', res.data.data);
    }
    
    console.log("notf", notificationList.value);
    
    totalPage.value = res.data.last_page;  
  } catch (error) {    
    console.error('Error fetching notifications:', error);  
  } 
};

const handleRefresh = (event: CustomEvent) => {
        setTimeout(() => {
          // Any calls to load data go here
          (event.target as HTMLIonRefresherElement).complete();
          getNotifications()
        }, 2000);
      };


const handleInfiniteScroll = async (event: Event) => {
  const infiniteScrollEvent = event as CustomEvent;
  if (page.value < totalPage.value) {
        page.value++;

        try {
            await getNotifications();
        } catch (error) {
            console.error('Veri alırken bir hata oluştu:', error);
        }
    }

   
  // Infinite scroll'ün tamamlandığını belirtmek için
  (infiniteScrollEvent.target as HTMLIonInfiniteScrollElement).complete();
  console.log("test")
  console.log(totalPage.value)
  console.log(page.value)
};



// Fetch notifications when the component is mounted
onMounted(() => {
  getNotifications();
  console.log(totalPage.value)
});
</script>

<style lang="scss" scoped>
ion-list {
  padding: 0;

  ion-list-header {
    border-bottom: 1px solid var(--border-color);
  }

  ion-item {
    --inner-padding-start: 20px;
    --inner-padding-top: 20px;
    --inner-padding-bottom: 20px;

    &:nth-of-type(even) {
      --background: var(--primary-gray);
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .title {
      font-size: 16px;
      color: var(--text-color-light);
      margin-bottom: 5px;
    }

    .time {
      font-size: 12px;
      color: var(--text-color-light);
    }
  }
}
</style>