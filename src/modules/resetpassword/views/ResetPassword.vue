<template>
    <ion-page>
        <Header />

        <ion-content class="ion-padding" style="background-color: red;">
            <ion-grid class="full-height ion-justify-content-center ion-align-items-center">
                <ion-row class="ion-justify-content-center" style="width: 80%;">
                    <ion-col class="custom-width" style="width: 100%;">
                        <ion-list style="width: 100%;">
                            <ion-item>
                                <img src="../../../assets/logo.png" alt="">
                            </ion-item>

                            <ion-item>
                                <ion-label style="margin-bottom: 20px;" position="floating">E Posta
                                    adresiniz</ion-label>
                                <ion-input type="text" placeholder="Kayıtlı e posta adresinizi giriniz."
                                    v-model="data.email"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label style="margin-bottom: 20px;" position="floating">Yeni Parola</ion-label>
                                <ion-input type="password" placeholder="Yeni parolanızı girin"
                                    v-model="data.password"></ion-input>
                            </ion-item>

                            <ion-item>
                                <ion-label style="margin-bottom: 20px;" position="floating">Yeni Parola</ion-label>
                                <ion-input type="password" placeholder="Yeni parolanızı tekrar girin"
                                    v-model="data.password_confirmation"></ion-input>
                            </ion-item>

                            <ion-button expand="block" @click="resetPassword">Parolayı Sıfırla</ion-button>
                        </ion-list>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import Header from "@/components/Header.vue";

import { useRouter, useRoute } from 'vue-router';
import { IonButton, IonInput, IonItem, IonList, IonLabel, IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
import authApi from '@/services/authApi';



const router = useRouter();
const route = useRoute();

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

let data = ref({
    email: '',
    password: '',
    password_confirmation: '',
    token: ''
});



const resetPassword = () => {
    // E-posta kontrolü
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.value.email)) {
        $toast.error('Geçerli bir e-posta adresi giriniz', { position: 'top' });
        return;
    }

    // Parola kontrolü
    if (data.value.password.length < 8) {
        $toast.error('Parola en az 8 karakter olmalıdır', { position: 'top' });
        return;
    }

    // Parola eşleşme kontrolü
    if (data.value.password !== data.value.password_confirmation) {
        $toast.error('Parolalar eşleşmiyor', { position: 'top' });
        return;
    }

    // Parola sıfırlama işlemi
    authApi.resetPassword(data.value).then((res: any) => {
        $toast.success('Parola sıfırlama işlemi başarılı', { position: 'top' });
        router.push({ name: 'login' });
        console.log(res);
    }).catch((error: any) => {
        $toast.error('Lütfen sistemde kayıtlı olan email bilginizi giriniz', { position: 'top' });
        console.error(error);
    });
};


// onMounted içinde data.token ataması
onMounted(() => {
    const code = route.params.code;
    // Eğer code bir dizi ise, ilk elemanı al, değilse direk değeri ata
    data.value.token = Array.isArray(code) ? code[0] : code || '';
    console.log('object :>> ', data.value.token)
});

// watch ile route.params.code değişimini izleme
watch(
    () => route.params.code,
    (newCode, oldCode) => {
        console.log('Route Code değişti:', oldCode, '=>', newCode);
    }
);
</script>

<style scoped>
.full-height {
    display: flex;
    height: 100vh;
    background-color: #9b427d;
    padding: 0px !important;
    margin: 0px !important;
}

.custom-width {
    max-width: 600px;
    width: 100%;
}
</style>
