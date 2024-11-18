<template>
    <ion-page>
        <div class="container">
            <div class="content">
                <Header />
                <ion-grid>
                    <MyAccountHeader :user="user" class="m-l-10 m-r-10">
                        <template #close>
                            <ion-icon color="primary" size="small" />
                        </template>
                    </MyAccountHeader>
                    <ion-row class="ion-justify-content-start">


                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">Mevcut Parola</ion-label>
                        </ion-col>

                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input v-model="formData.current_password"
                                :type="showPassword.current_password ? 'text' : 'password'"
                                placeholder="Lütfen mevcut parolanızı giriniz."
                                class="form-control inputStyle"></ion-input>
                            <img class="eyeIcon" src="../assets/eye.png" alt=""
                                @click="togglePasswordVisibility('current_password')">
                        </ion-col>



                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">Parola</ion-label>
                        </ion-col>

                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input v-model="formData.password" :type="showPassword.password ? 'text' : 'password'"
                                placeholder="******" class="form-control inputStyle"></ion-input>
                            <img class="eyeIcon" src="../assets/eye.png" alt=""
                                @click="togglePasswordVisibility('password')">
                        </ion-col>

                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">Yeni parola tekrar</ion-label>
                        </ion-col>

                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input v-model="formData.password_confirmation"
                                :type="showPassword.password_confirmation ? 'text' : 'password'" placeholder="******"
                                class="form-control inputStyle"></ion-input>
                            <img class="eyeIcon" src="../assets/eye.png" alt=""
                                @click="togglePasswordVisibility('password_confirmation')">
                        </ion-col>

                    </ion-row>
                    <ion-row class="ion-justify-content-center">
                        <ion-col size="6" style=" display: flex; justify-content: center;">
                            <ion-button @click="editPassword">Güncelle</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </div>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonCol, IonGrid, IonLabel, IonRow, IonPage, IonInput, IonInfiniteScroll, IonButton, IonIcon } from '@ionic/vue';
import { defineComponent, computed, onMounted, ref, watch } from 'vue';
import Header from "@/components/Header.vue";
import { useRoute } from 'vue-router';

import useUserInfoStore from '@/stores/userInfoStore';
import userEditApi from "../../../services/userEditApi"
import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";

const route = useRoute();
const store = useUserInfoStore()
// const productCode = ref<string>(route?.params? as string);

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

const userData = ref<any[]>([]);

const formData = ref<any>({
    token: localStorage.getItem('access_token'),
    current_password: '',
    password: '',
    password_confirmation: ''
})

let user = ref<any>({
    name: 'sdf',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    photo:''
})

const showPassword = ref<any>({
    password: false,
});

const togglePasswordVisibility = (fieldName: string) => {
    showPassword.value[fieldName] = !showPassword.value[fieldName];
};


const editPassword = () => {
    userEditApi.editUser(formData.value)
    $toast.success('Parolanız güncellenmistir.', {
        position: 'top-right',
    });

}


watch(() => route.path, (newPath) => {
    if (newPath === '/EditPassword') {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            user.value.name = userData.name
            user.value.photo = userData.photo
        }
    }
})

onMounted(() => {
  

    const userDataString = localStorage.getItem("user");
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        user.value.name = userData.name
        user.value.photo = userData.photo
    }

})

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .content {
        width: 90%;
        height: 100%;
        justify-content: center;
        align-items: center;

        .ion-bg-padding {
            padding-left: 10px;

            .labelStyle {
                color: rgb(49, 49, 49);
                font-size: 14px;
            }
        }
        .eyeIcon {
            position: absolute;
            right: 10px;
            z-index: 99;
            height: 15px;
            cursor: pointer;
        }
    }



    .inputStyle {
        width: 100%;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #F3F2F7;
        border: none;
    }

    .ion-input-container {
        display: flex;
        align-items: center;
        position: relative;
    }

    ion-input {
        --padding-start: 15px;
    }




}
</style>