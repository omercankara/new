<template>
    <ion-page>

        <!-- PAROLA SIFIRLAMA EKRANI-->
        <ion-content class="ion-content" v-if="choiceScreen == 'infoSetPage'">
            <div class="auth-wrapper">
                <div class="auth-window">
                    <img src="@/assets/logo.png" alt="Takasimo" class="logo" />
                    <ion-label class="auth-title">Şifre Sıfırlama yöntemi seçiniz</ion-label>
                    <p style="text-align: center;">Lütfen e-posta adresinizi  girerek devam
                        ediniz.</p>
                   
                    <form @submit.prevent="recoveryChoicePage">
                        <div class="m-b-5">
                            <ion-input type="email" placeholder="E Posta Adresinizi girniz"
                                :value="loginData.email" @input="loginData.email = $event.target.value">
                                <div class="icon" slot="start">
                                    <img src="@/assets/auth/email.svg" class="email-icon">
                                </div>
                            </ion-input>
                            <validationError :errors="validation.email.$errors" />
                        </div>

                        <div>
                            <ion-button @click="sendEmail" type="submit" shape="round" expand="full">
                                <ion-spinner name="dots" v-if="loginLoading"></ion-spinner>
                                Devam Et
                            </ion-button>
                        </div>
                    </form>
                </div>
            </div>
        </ion-content>


        <!---SIFIRLAMA SEÇENEGİ EKRANI -->
        <ion-content class="ion-content" v-if="choiceScreen == 'recoveryChoicePage'">
            <div class="auth-wrapper">
                <div class="auth-window">
                    <img src="@/assets/logo.png" alt="Takasimo" class="logo" />
                    <ion-label class="auth-title"></ion-label>
                    <p style="text-align: center;">Şifrenizi nasıl degiştirmek istersiniz</p>
                    <ion-label style="margin-bottom: 15px; font-size: 12px">E posta veya cep telefonu</ion-label>



                    <form @submit.prevent="notificationPage">
                        <ion-radio-group>
                            <div
                                style="display: flex; margin-bottom: 15px; flex-direction: row; align-items: center; justify-content: space-around;">
                                <ion-radio style="padding-right: 8px;" label-placement="end"></ion-radio>
                                <p style="font-size: 12px; margin: 0px; padding: 0px">
                                   {{ loginData.email }} E Posta onay kodu gönder
                                </p>
                            </div>

                            <!-- <div
                                style="display: flex; flex-direction: row; align-items: center; justify-content: space-around;">
                                <ion-radio style="padding-right: 8px;" label-placement="end"></ion-radio>
                                <p style="font-size: 12px; margin: 0px; padding: 0px">
                                    0552*****34 Numaralı cep telefonuma SMS ile onay kodu gönder
                                </p>
                            </div> -->
                        </ion-radio-group>
                        <div>
                            <ion-button type="submit" shape="round" expand="full">
                                <ion-spinner name="dots" v-if="loginLoading"></ion-spinner>
                                <template v-else>Devam Et</template>
                            </ion-button>
                        </div>
                    </form>
                    <div class="third-party-auths">
                        <!-- <button>
                            <img src="@/assets/google.svg"
                                 alt=""
                                 class="w-4"
                            />
                            Google ile giriş yap
                        </button> -->
                        <!-- <button>
                            <img src="@/assets/facebook.svg"/>
                            Facebook ile giriş yap
                        </button> -->
                        <!-- <button>
                            <img src="@/assets/auth/apple.svg"/>
                            Apple ile giriş yap
                        </button> -->
                    </div>
                </div>
            </div>
        </ion-content>



        <!--SIFIRLAMA BAĞLANTISI BİLDİRİSİ EKRANI-->

        <ion-content class="ion-content" v-if="choiceScreen == 'notificationPage'">
            <div class="auth-wrapper">
                <div class="auth-window">
                    <img src="@/assets/logo.png" alt="Takasimo" class="logo" />
                    <ion-label class="auth-title"></ion-label>
                    <ion-label style="margin-bottom: 10px; font-size: 17px; text-align: center"><span
                            style="font-weight:bold;">{{ loginData.email }}</span> Adresinize bir e posta
                        gönderdik</ion-label>
                    <ion-label style="text-align: center; margin-bottom: 10px; font-size: 13px;">Bu e-postadaki
                        bağlantıya
                        tıklayarak
                        şifrenizi
                        değiştirebilirsiniz</ion-label>
                    <form @submit.prevent="goBackPage">
                        <div class="m-b-5">

                        </div>

                        <div>
                            <ion-button type="submit" shape="round" expand="full">
                                <ion-spinner name="dots" v-if="loginLoading"></ion-spinner>
                                <template v-else>Devam Et</template>
                            </ion-button>
                        </div>
                    </form>
                </div>
            </div>
        </ion-content>


    </ion-page>

</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import {
    IonButton,
    IonCheckbox,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonLabel,
    IonPage,
    IonSpinner,
    IonTitle,
    IonRadioGroup,
    IonRadio

} from '@ionic/vue';
import { email, helpers, required } from '@vuelidate/validators';

// Components
import ValidationError from "@/components/form/ValidationError.vue";

// Services
import authApi from "@/services/authApi";

// Stores
import { useAuthStore } from "@/stores/authStore";

// Other
const router = useRouter();
const authStore = useAuthStore();

// Data
let choiceScreen = ref<String>('');




const referrerUrl = ref<string>('');
if (router?.currentRoute?.value?.query?.referrerUrl) {
    referrerUrl.value = router.currentRoute.value.query.referrerUrl as string
}

const loginDataRules = {
    email: {
        required: helpers.withMessage('Lütfen email adresinizi girin', required),
        email: helpers.withMessage('Lütfen geçerli bir email adresi girin', email)
    },
    password: {
        required: helpers.withMessage('Lütfen şifrenizi girin', required)
    }
}
const loginData = reactive<any>({
    email: '',
})
const validation = useVuelidate(loginDataRules, loginData);
const loginLoading = ref<boolean>(false);

// Functions
const recoveryChoicePage = async () => {
    choiceScreen.value = 'recoveryChoicePage'
    // validation.value.$touch();
    // if (validation.value.$invalid) {
    //     return;
    // }

    // loginLoading.value = true;
    // return authApi.login(loginData)
    //     .then(async (res: any) => {
    //         const resData = res?.data ?? null;
    //         if (resData?.access_token) {
    //             authStore.accessTokenSet(resData.access_token);
    //         }
    //         await authApi.me()
    //             .then((res: any) => {
    //                 const resData = res?.data ?? null;
    //                 if (resData.user_code) {
    //                     authStore.userSet(resData);
    //                 }
    //             });

    //         // ReferrerUrl
    //         if (referrerUrl.value) {
    //             router.push(referrerUrl.value)
    //         }
    //         else {
    //             router.push('/home')
    //         }
    //     })
    //     .finally(() => {
    //         loginLoading.value = false;
    //     })
}

const notificationPage = () => {
    choiceScreen.value = 'notificationPage'
}

const goBackPage = () => {
    router.push("/login")
    choiceScreen.value = 'infoSetPage'
}

onMounted(() => {
    choiceScreen.value = 'infoSetPage'
})




const sendEmail = async () => {
    authApi.forgotPasswordEmail(loginData).then((res: any) => {
        console.log(res)
    })
}

</script>

<style lang="scss" scoped>
.ion-content {
    &::part(background) {
        background-image: url("@/assets/auth/bg.jpeg");
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
    }

    .auth-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        // background-color: red;
        width: 100%;
        height: 100%;

        .auth-window {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 80%;
            max-width: 340px;
            background-color: rgb(255 255 255 / 0.6);
            border-radius: 50px;
            height: 40%;
            padding: 60px 40px 40px 40px;

            .auth-title {
                font-size: 15px;
                font-family: var(--font-bold), serif;
                margin-bottom: 10px;
            }

            .logo {
                width: 150px;
                margin-bottom: 10px;
            }

            form {
                width: 100%;

                ion-input {
                    min-height: 40px;
                    border-bottom: 1px solid var(--primary);
                    font-size: 14px;

                    .icon {
                        width: 20px;

                        .email-icon {
                            width: 18px;
                        }

                        .password-icon {
                            width: 14px;
                            margin-left: 2px;
                        }
                    }
                }

                .forgot-password {
                    width: 100%;
                    text-align: center;
                    font-size: 12px;
                    margin-bottom: 15px;
                }

                .no-account {
                    margin-top: 10px;
                    margin-bottom: 10px;
                    font-size: 12px;
                    text-align: center;

                    span {
                        color: var(--black);
                    }
                }
            }

            .third-party-auths {
                width: 100%;
                margin-top: 15px;

                button {
                    width: 100%;
                    text-align: center;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                    border-radius: 18px;
                    background: #ffffff;

                    &:hover {
                        background-color: #f5f5f5;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }

                    img {
                        width: 16px;
                        margin-right: 10px;
                    }
                }
            }
        }
    }
}

// ion-checkbox {
//     --background: var(--white);
//     --border-color: var(--primary);
//     --border-width: 1px;
//     --border-radius: 20px;
//     font-size: 14px;
// }

// ion-checkbox::part(container) {
//     border-radius: 20px;
// }

.text-divider {
    margin-left: -40px;
    margin-right: -40px;
    margin-top: 20px;
    margin-top: 20px;
}



/******************SIFIRLAMA SEÇENEGİ EKRANI*********************/
</style>
