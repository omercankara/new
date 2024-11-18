<template>
    <ion-page>
        <Header />
        <PageHeader title="Ödeme" />
        <ion-content class="ion-padding">
            <ion-row style="height: 80vh; ">
                <div>
                    <img src="../../../src/assets/danger.png" alt="">
                    <p style="font-weight: bold; font-size: 30px; color: #901B6A; ">Ödeme Başarısız</p>
                    <p style="color: #901B6A;">Ödeme bilgilerinizin doğru olduğundan emin olun ve tekrar deneyin.</p>
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <ion-button @click="$router.push('/my-ads')" style="width: 55%; margin-bottom: 1rem;">
                            Tekrar dene
                        </ion-button>
                        <ion-button @click="$router.push('/home')" style="width: 55%;">
                            Anasayfaya dön
                        </ion-button>
                    </div>
                </div>
            </ion-row>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { IonContent, IonPage, IonSearchbar } from '@ionic/vue';

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";




</script>

<style lang="scss" scoped>
ion-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

ion-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
}

ion-row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

ion-col {
    display: flex;
    flex-direction: column;
    align-items: center;
}

img {
    max-width: 100px;
    margin-bottom: 1rem;
}

p {
    margin: 0.5rem 0;
}
</style>
