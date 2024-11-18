<template>
    <ion-page>
        <ion-content class="ion-content">

            <div class="auth-wrapper">

                <div class="auth-window">
                   
                    <p class="auth-title">Hesap Aç</p>
                    <form @submit.prevent="register">
                        <div class="m-b-10">

                            <ion-input placeholder="E posta adresi" @input="formData.email = $event.target.value">

                            </ion-input>
                            <ion-input placeholder="Ad Soyad" @input="formData.name = $event.target.value">

                            </ion-input>

                            <!-- <ion-input
                                  :maxlength="17"
                                  placeholder="Telefon"
                                  :value="formattedPhone"
                                  @input="onPhoneInput"
                                  @keydown="preventNonNumericInput"
                                  inputmode="numeric"
                                  clear-input
                                ></ion-input> -->


                            <!-- <ion-input  type="password" placeholder="Parola"
                                @input="formData.password = $event.target.value">
                                <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                            </ion-input> -->

                            <ion-input type="password" placeholder="Parola " @input="onPasswordInput">
                               
                                <ion-input-password-toggle slot="end"></ion-input-password-toggle>
                            </ion-input>

                            <div v-if="passwordStrength">
                                <p>Parola seviyesi: {{ passwordStrength }}</p>
                                <div :style="{ width: passwordStrengthPercent + '%', backgroundColor: passwordStrengthColor, height: '5px' }"></div>
                            </div>


                            <ion-input type="password" placeholder="Parola doğrula"
                                @input="formData.password_confirmation = $event.target.value">
                                <ion-input-password-toggle slot="end"></ion-input-password-toggle>

                            </ion-input>



                            <validationError :errors="validation.email.$errors" />
                            <!-- <validationError :errors="validation.phone.$errors" /> -->
                        </div>

                        <div class="" style="margin-bottom: 20px; display: flex; flex-direction: row;">
                            <ion-checkbox v-model="agreementControl" @ionChange="logAgreementControl" justify="start"
                                label-placement="end">
                            </ion-checkbox>
                            <p style="margin: 0px; margin-left:10px; font-size: 10px;     line-height: 20px;"> <span
                                    style="color: purple; font-weight: bold"> hesap sözleşmesi ve eklerini</span> kabul
                                ediyorum </p>
                        </div>
                        <div class="" style="margin-bottom: 20px; display: flex; flex-direction: row;">
                            <ion-checkbox v-model="permissionCotrol" justify="start"
                                label-placement="end"></ion-checkbox>
                            <p style="margin: 0px; margin-left:10px; font-size: 10px"> İletşim bilgilerimi takasimo
                                tarafından <br> düzenlenen kampanyalar,
                                özel teklifler, <br> promosyonlar ve diğer pazarlama <br> içerikleri, hakkında
                                bilgilendirilmek üzere <br> kullanılmasına izin veriyorum</p>
                        </div>
                        <div>
                            <ion-button type="submit" shape="round" expand="full">
                                Hesap Aç
                            </ion-button>
                        </div>
                        <div class="no-account">
                            <span>Hesabın var mı?</span>
                            <span>
                                <a class="is-cursor-pointer" @click="router.push({ name: 'login' })">
                                    Giriş Yap
                                </a>
                            </span>
                        </div>

                        <div class="text-divider">veya</div>
                    </form>
                    <div class="third-party-auths">
                      <button>
                        <GoogleLogin :callback="handleGoogleCallback" prompt auto-login @success="onSuccess">
                          <img src="@/assets/google.svg" />
                          <span style="
    position: relative;
    top: -3px;
">Google ile giriş yap</span>
                        </GoogleLogin>
                      </button>

                    </div>
                  <div class="google-sub-text">
                    <span>Google ile bir sonraki adıma geçmeniz halinde <a href="#">Bireysel Hesap Sözleşmesi ve Ekleri</a>'ni kabul etmiş sayılırsınız.</span>
                  </div>
                </div>
            </div>
        </ion-content>
    </ion-page>

</template>

<script lang="ts" setup>
import { IonContent, IonInput, IonIcon, IonPage, IonButton, IonCheckbox, IonTitle } from '@ionic/vue';
import { useVuelidate } from '@vuelidate/core';
import { email, helpers, maxLength, required } from '@vuelidate/validators';
import { useRouter } from 'vue-router';
import { reactive, ref, watch } from 'vue';
import { GoogleLogin } from 'vue3-google-login';

import { closeOutline } from "ionicons/icons";

import ValidationError from "@/components/form/ValidationError.vue";
import authApi from '@/services/authApi';


import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

import { useAuthStore } from '@/stores/authStore';
const authStore = useAuthStore();

const router = useRouter();

let agreementControl = ref<boolean>(false);
const permissionCotrol = ref<boolean>(false);

const logAgreementControl = () => {
    console.log('Agreement Control:', agreementControl.value);
};


watch(agreementControl, (newValue) => {
    console.log('Agreement Control:', newValue);
});

const formData = ref<any>({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
})

const signupData = ref({
    email: '',
    password: '',
})

// const formattedPhone = ref('');
// const isPhoneValid = ref(true);

// // Kullanıcı telefon numarası girerken sadece rakamları kabul eder ve numarayı formatlar
// const onPhoneInput = (event: { target: { value: string } }) => {
//   let value = event.target.value.replace(/\D/g, ''); // Sadece rakamları tutar

//   // Başta `0` olduğundan emin olun
//   if (value[0] !== '0') {
//     value = '0' + value;
//   }

//   // Telefon numarası 11 haneli olana kadar formatla
//   formData.value.phone = value; // Sadece rakam içeren değeri formData.phone'a at
//   formattedPhone.value = formatPhoneNumber(value); // Görünen telefon numarasını formatlıyoruz

//   // Telefon numarası 11 haneli mi kontrolü (başında 0 olduğu için 11 haneli)
//   isPhoneValid.value = value.length <= 11; // 11 haneden fazlasını kabul etmiyoruz
// };

// // Telefon numarasını yazarken anında (XXXX) XXX XX XX formatında göster
// const formatPhoneNumber = (value: string) => {
//   const phone = value.replace(/\D/g, ''); // Sadece rakamları tutar

//   if (phone.length <= 1) {
//     return phone; // İlk karakter sadece 0 ise onu göster
//   }

//   if (phone.length <= 4) {
//     return `${phone[0]} (${phone.slice(1)}`; // İlk rakamdan sonra parantez aç
//   }

//   if (phone.length <= 7) {
//     return `${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4)}`; // 0 (XXX) XXX
//   }

//   if (phone.length <= 9) {
//     return `${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4, 7)} ${phone.slice(7)}`; // 0 (XXX) XXX XX
//   }

//   return `${phone[0]} (${phone.slice(1, 4)}) ${phone.slice(4, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)}`; // 0 (XXX) XXX XX XX
// };

// const preventNonNumericInput = (event: KeyboardEvent) => {
//   const key = event.key;

//   // Eğer girilen tuş rakam değilse, girdiyi engelle
//   if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete') {
//     event.preventDefault();
//   }
// };


// const phoneNumberValidator = helpers.withMessage(
//     'Telefon numarası yalnızca sayılardan oluşmalıdır',
//     (value: string) => /^\d+$/.test(value) // Bu regex sadece sayıları kabul eder
// );

const rules = {
    email: {
        required: helpers.withMessage('Lütfen e posta adresinizi giriniz.', required),
    },
};

const validation = useVuelidate(rules, formData);


const referrerUrl = ref<string>('');
if (router?.currentRoute?.value?.query?.referrerUrl) {
    referrerUrl.value = router.currentRoute.value.query.referrerUrl as string
}


const handleGoogleCallback = (response: any) => {
    const googleToken = response.credential; // Google'dan dönen id_token
    sendTokenToBackend(googleToken);
};

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
        //loginLoading.value = false;
    }
};


const onSuccess = (response: any) => {
    console.log('Giriş başarılı:', response);
    console.log(response)


    const token = response.credential; // Veya uygun alan
    if (token) {
        console.log(token)

    } else {
        console.log("Token bulunamadı.");
    }
};


const register = async () => {
    validation.value.$touch();
    if (validation.value.$invalid) return;

    // Check if name is provided
    if (!formData.value.name || formData.value.name.trim() === "") {
        $toast.error("Lütfen isminizi giriniz.", { position: 'top' });
        return;
    }

    if (formData.value.password !== formData.value.password_confirmation) {
        $toast.error("Şifre ve şifre onayı eşleşmiyor", { position: 'top' });
        return;
    }

    if (formData.value.password.length < 8) {
        $toast.error("Parola en az 8 karakter olmalıdır.", { position: 'top' });
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
    if (!emailPattern.test(formData.value.email)) {
        $toast.error("Lütfen geçerli bir e-posta adresi giriniz.", { position: 'top' });
        return;
    }

    if (!agreementControl.value) {
        $toast.error("Lütfen kayıt sözleşmesini onaylayınız", { position: 'top' });
        return;
    }

    signupData.value.email = formData.value.email;
    signupData.value.password = formData.value.password;

    try {
        const res = await authApi.register(formData.value);
        $toast.success("Kayıt işlemi tamamlandı..", { position: 'top' });

        const loginRes = await authApi.login(signupData.value);
        const resData = loginRes?.data ?? null;

        if (resData?.access_token) {
            authStore.accessTokenSet(resData.access_token);
        }

        const userRes = await authApi.me();
        const userResData = userRes?.data ?? null;

        if (userResData?.user_code) {
            authStore.userSet(userResData);
        }

        router.push(referrerUrl.value || '/home');
    } catch (error) {
        console.error("Registration error:", error);
        $toast.error("Bu e posta adresi kullanımda.", { position: 'top' });
    }
}


const passwordStrength = ref<string>('');
const passwordStrengthPercent = ref<number>(0);
const passwordStrengthColor = ref<string>('red');

const onPasswordInput = (event: any) => {
    const password = event.target.value;
    formData.value.password = password;
    evaluatePasswordStrength(password);
};

const evaluatePasswordStrength = (password: string) => {
    let strength = 'Zayıf';
    let percent = 0;

    if (password.length >= 8) {
        percent += 30;
        if (/[A-Z]/.test(password)) percent += 20; // Uppercase letter
        if (/[a-z]/.test(password)) percent += 20; // Lowercase letter
        if (/[0-9]/.test(password)) percent += 20; // Digit
        if (/[^A-Za-z0-9]/.test(password)) percent += 20; // Special character

        if (percent < 50) strength = 'Orta';
        else if (percent >= 50 && percent < 80) strength = 'İyi';
        else strength = 'Güçlü';
    }

    passwordStrength.value = strength;
    passwordStrengthPercent.value = percent;
    passwordStrengthColor.value = percent < 50 ? 'red' : percent < 80 ? 'orange' : 'green';
};

const goHome = () => {
    router.push({ name: 'home' });
}

</script>

<style lang="scss" scoped>
.google-sub-text {
  position: relative;
  display: block;
  top: 20px;
  font-size: 11px;
  text-align: center;
}
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
                font-size: 20px;
                font-family: var(--font-bold), serif;
                margin-bottom: 20px;
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

ion-button {
    text-transform: none;
}
</style>
