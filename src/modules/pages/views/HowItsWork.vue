<template>
  <ion-page>
    <Header />
    <PageHeader title="Nasıl Çalışır" />
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" v-for="(product, index) in myProducts" :key="index">
            <ion-row style="background-color: #F3F2F7 !important; border-radius: 10px;">
              <ion-col size="12"><span>{{ product.title }}</span></ion-col>
              <ion-col size="12">
                <p>{{ product.description }}</p>
              </ion-col>
            </ion-row>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/vue';
import faqApi from '@/services/faqApi';

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// TypeScript arayüzü
interface Product {
  title: string;
  description: string;
}

// Data
const myProducts = ref<Product[]>([]);

onMounted(() => {
  faqApi.getAll().then(res => {
    console.log(res.data.data);
    myProducts.value = res.data.data;
  });
});
</script>

<style lang="scss" scoped>
.ion-container {
  background-color: #F3F2F7;
}

span {
  margin: 5px;
  font-weight: bold;
}

p {
  margin: 5px;
}
</style>
