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
                            <ion-label class="labelStyle">İsim</ion-label>
                        </ion-col>
                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input disabled style="max-height: 100% !important" v-model="formData.name"
                                placeholder="Ömercan Kara" class="form-control inputStyle"></ion-input>
                            <img @click="editProfile('name')" class="editIcon" src="../assets/edit.png" alt="">
                        </ion-col>
                    </ion-row>

                    <ion-row class="ion-justify-content-start">
                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">E Posta</ion-label>
                        </ion-col>
                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input disabled v-model="formData.email" placeholder="omercankara@gmail.com"
                                class="form-control inputStyle"></ion-input>
                           
                        </ion-col>
                    </ion-row>

                    <ion-row class="ion-justify-content-start">
                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">Cep Telefonu</ion-label>
                        </ion-col>
                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input disabled v-model="formData.phone" size="12" placeholder="552*****"
                                class="form-control inputStyle"></ion-input>
                            <img @click="editProfile('phone')" class="editIcon" src="../assets/edit.png" alt="">
                        </ion-col>
                    </ion-row>
                    <ion-row class="ion-justify-content-start">
                        <ion-col class="ion-bg-padding" size="6">
                            <ion-label class="labelStyle">Parola</ion-label>
                        </ion-col>
                        <ion-col size="12" style="display: flex; align-items: center; position: relative;">
                            <ion-input disabled :type="showPassword.password ? 'text' : 'password'"
                                placeholder="*******" class="form-control inputStyle"></ion-input>
                            <img @click="editProfile('password')" class="editIcon" src="../assets/edit.png" alt="">
                            <!-- <img class="eyeIcon" @click="togglePasswordVisibility('password')" src="../assets/eye.png" alt=""> -->
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </div>
        </div>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonCol, IonGrid, IonLabel, IonRow, IonPage, IonInput, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { defineComponent, computed, watch, onMounted, ref } from 'vue';
import Header from "@/components/Header.vue";
import authApi from "../../../services/authApi"
import useUserInfoStore from '@/stores/userInfoStore';

import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";
import { useRouter,useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

import 'vue-toast-notification/dist/theme-sugar.css';
import { useToast } from 'vue-toast-notification';
const $toast = useToast();

const store = useUserInfoStore()
const userInfo = store.getUserInfo();



const formData = ref<any>({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    password: ''
})

let user =  ref<any>({
    name: 'sdf',
    last_name: '',
    email: '',
    phone: '',
    photo:'',
    password: ''
})

const editProfile = (item: any) => {

    if (item == 'phone') {
        router.push("/EditPhone");

    }
    if (item == 'name') {
        router.push("/EditName");

    }
    if (item == 'name') {
        router.push("/EditName");

    }

    if (item == 'email') {
        router.push("/EditEmail");

    }


    if (item == 'password') {
        router.push("/EditPassword");
        console.log(item);
    }
}

const showPassword = ref<any>({
    password: false,
});

const togglePasswordVisibility = (fieldName: string) => {
    showPassword.value[fieldName] = !showPassword.value[fieldName];
};

const loadUserData = () => {
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        formData.value.name = userData.name;
        formData.value.email = userData.email;
        formData.value.phone = userData.phone;
    }
};





watch(() => route.path, (newPath) => {

    loadUserData();
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log(userData)
        formData.value.name = userData.name;
        user.value.name = userData.name
        user.value.photo = userData.photo
        formData.value.email = userData.email;
        formData.value.phone = userData.phone;
        console.log(formData.value.phone)
    }


    // meProduct.value = [];
    // targetProduct.value = [];
    if (newPath === '/profile') {
        checkAuth()
        console.log("profil")
    }
});



const checkAuth = async () => {
  try {
    const response = await authApi.me();
    console.log(response.data); // Başarılı yanıt alındığında veriyi konsola yazdır
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // 401 hatası alındığında giriş sayfasına yönlendir
      try {
        $toast.error('Oturumunuz sonlandırıldı giriş ekranına yönlendiriliyorsunuz.!',{position:'top-right'});
        setTimeout(() => {
          router.push('/login'); // Yönlendirme işlemini bekleyin
        }, 2000)
      } catch (routingError) {
        console.error('Yönlendirme hatası:', routingError);
      }
    } else {
      console.error('Auth API çağrısı sırasında bir hata oluştu:', error);
    }
  }
};






onMounted(() => {
    const userDataString = localStorage.getItem("user");
   
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        console.log(userData)
        formData.value.name = userData.name;
        user.value.name = userData.name
        user.value.photo = userData.photo
        formData.value.email = userData.email;
        formData.value.phone = userData.phone;
        console.log(formData.value.phone)
    }
})

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 50%;
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
        background-color: #f7eeee;
        font-weight: bold;
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