<template>
    <ion-page>
        <ion-content class="ion-content">
            <div class="auth-wrapper">
                <div class="auth-window">
                    <img src="@/assets/logo.png" alt="Takasimo" class="logo" />

                    <form @submit.prevent="login">

                        <p style="margin: 0px; margin-left:90px;  " class="auth-title">Giriş Yap</p>
                        <div class="m-b-5">
                            <ion-input placeholder="E-Mail" :value="loginData.email"
                                @input="loginData.email = $event.target.value">
                                <div class="icon" slot="start">
                                    <img src="@/assets/auth/email.svg" class="email-icon">
                                </div>
                            </ion-input>
                            <validationError :errors="validation.email.$errors" />
                        </div>
                        <div class="m-b-5">
                            <ion-input type="password" placeholder="Şifre" :value="loginData.password"
                                @input="loginData.password = $event.target.value">
                                <div class="icon" slot="start">
                                    <img src="@/assets/auth/lock.svg" class="password-icon">
                                </div>
                                <ion-input-password-toggle slot="end" v-if="loginData.password" />
                            </ion-input>
                            <validationError :errors="validation.password.$errors" />
                        </div>
                        <div class="forgot-password">
                            <a @click="forgotPasswordPage" class="">Şifremi unuttum</a>
                        </div>
                        <div class="m-b-20">
                            <ion-checkbox justify="start" label-placement="end"
                                @input="loginData.rememberMe = $event.target.value">
                                Beni hatırla
                            </ion-checkbox>
                        </div>
                        <div>
                            <ion-button type="submit" shape="round" expand="full">
                                <ion-spinner name="dots" v-if="loginLoading"></ion-spinner>
                                <template v-else>Giriş yap</template>
                            </ion-button>
                        </div>
                        <div class="no-account">
                            <span>Hesabın yok mu?</span>
                            <span>
                                <a class="is-cursor-pointer" @click="router.push({ name: 'signup' })">
                                    Hesap oluştur
                                </a>
                            </span>
                        </div>
                        <div class="text-divider">veya</div>
                    </form>
                    <div class="third-party-auths">

                        <!-- <GoogleLogin :callback="handleGoogleCallback" prompt auto-login @success="onSuccess" /> -->
                       
                        <!--<button>
                            <img src="@/assets/facebook.svg" />
                            <span>Facebook ile giriş yap</span>
                        </button>-->

                        <GoogleLogin style="margin-left: 15px;" :callback="handleGoogleCallback" prompt auto-login @success="onSuccess"/>
                         
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>

</template>

<script lang="ts" setup>

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

import { GoogleLogin } from 'vue3-google-login';
import { decodeCredential } from 'vue3-google-login';

import { reactive, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import {
    IonButton,
    IonCheckbox,
    IonContent,
    IonInput,
    IonInputPasswordToggle,
    IonPage,
    IonSpinner,
    IonTitle
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
const referrerUrl = ref<string>('');
if (router?.currentRoute?.value?.query?.referrerUrl) {
    referrerUrl.value = router.currentRoute.value.query.referrerUrl as string
}


const onSuccess = (response: any) => {
    console.log('Giriş başarılı:', response);
    console.log(response)

    // Token veya gerekli bilgileri almak için response'u incele
    const token = response.credential; // Veya uygun alan
    if (token) {
        console.log(token)
        // Token ile API'ye giriş yapma çağrısı yapabilirsin
        // authApi.loginWithGoogle veya benzeri bir metot kullan
    } else {
        console.log("Token bulunamadı.");
    }
};


const handleGoogleCallback = (response: any) => {
    const googleToken = response.credential; // Google'dan dönen id_token
    sendTokenToBackend(googleToken);
};



const forgotPasswordPage = () => {
    router.push({ name: 'forgotPassword' })
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
    password: '',
    rememberMe: ''
})
const validation = useVuelidate(loginDataRules, loginData);
const loginLoading = ref<boolean>(false);

// Functions
// const login = async () => {
//     validation.value.$touch();
//     if (validation.value.$invalid) {
//         return;
//     }

//     loginLoading.value = true;
//     return authApi.login(loginData)
//         .then(async (res: any) => {
//             const resData = res?.data ?? null;
//             if (resData?.access_token) {
//                 authStore.accessTokenSet(resData.access_token);
//             }
//             await authApi.me()
//                 .then((res: any) => {
//                     const resData = res?.data ?? null;
//                     if (resData.user_code) {
//                         authStore.userSet(resData);
//                     }
//                 });

//             // ReferrerUrl
//             if (referrerUrl.value) {
//                 router.push(referrerUrl.value)
//             }
//             else {
//                 router.push('/home')
//             }
//         })
//         .finally(() => {
//             loginLoading.value = false;
//         })
// }


const sendTokenToBackend = async (googleToken: string) => {
    let token = {
        token: googleToken
    };
    try {
        let adsToken = "";
        await authApi.loginSocial(token).then(res => {
            adsToken = res.data.access_token;
            console.log("access_token", res.data.access_token);
            authStore.accessTokenSet(res.data.access_token);
        });

        // Kullanıcı bilgilerini al
        const userRes = await authApi.me();
        const userResData = userRes?.data ?? null;

        if (userResData?.user_code) {
            authStore.userSet(userResData);
            router.push('/home');
        } else {
            console.log("test");
        }

        // Referrer URL varsa yönlendir, yoksa /home sayfasına yönlendir
        if (referrerUrl.value) {
            router.push(referrerUrl.value);
            console.log("test");
        } else {
            router.push('/home');
        }

    } catch (error: any) {
        if (error.response?.status === 401) {
            $toast.error("Kullanıcı adınız veya parolanız hatalı", {
                position: 'top',
            });
        } else {
            $toast.error("Bir hata oluştu", {
                position: 'top',
            });
        }
    } finally {
        loginLoading.value = false;
    }
};




const login = async () => {
    validation.value.$touch();
    if (validation.value.$invalid) {
        // Validasyon hatası varsa işleme devam etmeyin
        console.log("error");
        return;
    }

    loginLoading.value = true;

    try {
        // Auth API çağrısı yapıyoruz
        const res = await authApi.login(loginData);
        const resData = res?.data ?? null;
        console.log("donen", resData)

        // Eğer access_token varsa, store'a ekleyin
        if (resData?.access_token) {
            authStore.accessTokenSet(resData.access_token);
        }

        // Kullanıcı bilgilerini almak için API çağrısı yapıyoruz
        const userRes = await authApi.me();
        const userResData = userRes?.data ?? null;
        console.log("test", userResData)

        // Eğer user_code varsa, store'a ekleyin
        if (userResData?.user_code) {
            authStore.userSet(userResData);
        } else {
            console.log("test");
        }

        // Referrer URL varsa yönlendirin, yoksa varsayılan olarak '/home' sayfasına yönlendirin
        if (referrerUrl.value) {
            router.push(referrerUrl.value);
            console.log("test");
        } else {
            router.push('/home');
        }

    } catch (error: any) {
        // Eğer API çağrısından 401 hatası alırsak, konsola uygun mesajı yazdırıyoruz
        if (error.response?.status === 401) {
            $toast.error("Kullanıcı adınız veya parolanız hatalı", {
                position: 'top', // Üst sağda gösterilecek
            });
        } else {
            console.log("Bir hata oluştu:", error.message);
        }
    } finally {
        loginLoading.value = false;
    }
}


onMounted(() => {
    (window as any).handleGoogleCallback = handleGoogleCallback;
})

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
        width: 100%;
        height: 100%;

        .auth-window {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 80%;
            max-width: 340px;
            background-color: rgb(255 255 255 / 0.6);
            border-radius: 50px;
            padding: 60px 40px 40px 40px;

            .auth-title {
                //font-size: 20px;
                font-family: var(--font-bold), serif;
                //margin-bottom: 20px;
                //margin-left: 20px;
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
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 8px;
                    border-radius: 18px;
                    background: #ffffff;
                    position: relative;
                    display: flex !important;
                    flex-direction: row;

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

ion-checkbox {
    --background: var(--white);
    --border-color: var(--primary);
    --border-width: 1px;
    font-size: 14px;
}

ion-checkbox::part(container) {
    border-radius: 5px;
}

.text-divider {
    margin-left: -40px;
    margin-right: -40px;
    margin-top: 20px;
    margin-top: 20px;
}
</style>
