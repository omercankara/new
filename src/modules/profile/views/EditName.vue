<template>
    <ion-page>
        <div class="container">
            <div class="content">
                <Header />
                <ion-grid>
                    <MyAccountHeader :user="user" class="m-l-6 m-r-10" style="margin-bottom: 0px;">
                        <template #close>
                            <ion-icon color="primary" size="small" />
                        </template>
                    </MyAccountHeader>
                    <ion-row class="ion-justify-content-start">

                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">İsim</ion-label>
                        </ion-col>

                        <ion-col size="12"
                            style="display: flex; flex-direction: column; align-items:  center; position: relative; margin-bottom: 0px;">
                            <ion-input v-model="formData.name" class="form-control inputStyle">
                            </ion-input>
                            <!-- <ion-input placeholder="Yen isim" v-model="formData.last_name"
                                class="form-control inputStyle"> </ion-input> -->

                        </ion-col>





                        <ion-col size="12" class="ion-justify-content-center" style=" text-align: center;">
                            <ion-row class="ion-justify-content-center" style="margin-bottom: 0px; margin: 0px;">
                                <ion-col class="resetMargin" size="12"
                                    style=" display: flex; flex-direction: column; justify-content: center;">
                                    <ion-button class="resetMargin" @click="editUser">Kaydet</ion-button>
                                    <ion-button class="resetMargin" @click="historyPage">Profil Bilgilerime
                                        Dön</ion-button>
                                </ion-col>
                            </ion-row>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </div>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonCol, IonGrid, IonLabel, IonRow, IonPage, IonInput, IonInfiniteScroll, IonButton, IonIcon } from '@ionic/vue';
import { defineComponent, computed, watch, onMounted, ref } from 'vue';
import Header from "@/components/Header.vue";
import { useRoute, useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import useUserInfoStore from '@/stores/userInfoStore';
import userEditApi from "../../../services/userEditApi"
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();
const route = useRoute();
const router = useRouter();
const store = useUserInfoStore()
// const productCode = ref<string>(route?.params? as string);
import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";
import authApi from '@/services/authApi';
import { useAuthStore } from "@/stores/authStore";
const authStore = useAuthStore();

const formData = ref<any>({
    token: localStorage.getItem('access_token'),
    name: '',
    last_name: ''
})


const editUser = () => {
    userEditApi.editUser(formData.value).then(res => {
        authStore.userSet(res);
        $toast.success('Profil bilgileriniz güncellenmiştir.', {
            position: 'top',
        })
        router.push({ name: 'profile' })
    })
}

const historyPage = () => {
    router.push({ name: 'profile' })
}







let user = ref<any>({
    name: 'sdf',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    photo:''
})





watch(() => route.path, (newPath) => {
    if (newPath === '/EditName') {
        const userDataString = localStorage.getItem("user");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            user.value.name = userData.name
            user.value.photo = userData.photo
        }
    }
});


onMounted(() => {
    authApi.me().then(res => {
        formData.value.name = res.data.name

    })
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
    display: flex;
    align-items: flex-start;
    justify-content: center;

    .resetMargin {
        margin: 0px;
        margin-bottom: 5px;
    }

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

        .editIcon {
            position: absolute;
            right: 10px;
            z-index: 99;
            height: 15px;
            cursor: pointer;
        }

        .downIcon {
            position: absolute;
            right: 30px;
            z-index: 99;
            height: 15px;
            cursor: pointer;
        }

        .eyeIcon {
            position: absolute;
            right: 30px;
            z-index: 99;
            height: 13px;
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
        margin-bottom: 10px;
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