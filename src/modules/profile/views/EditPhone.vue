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
              <ion-label style="margin-bottom: 0px;" class="labelStyle">Yeni Cep Telefonu</ion-label>
            </ion-col>

            <ion-col size="12" style="display: flex; align-items: center; position: relative; margin-bottom: 0px;">
              <!-- <ion-input style="margin-bottom: 0px;" v-model="formData.phone"
                placeholder="Yeni Telefon numaranızı giriniz" class="form-control inputStyle"></ion-input> -->
                <ion-input
                                  :maxlength="15"
                                  placeholder="Giriş alanı"
                                  :value="formattedPhone"
                                  @input="onPhoneInput"
                                  @keydown="preventNonNumericInput"
                                  inputmode="numeric"
                                  clear-input
                                ></ion-input>
              </ion-col>

            <ion-col size="12" class="ion-justify-content-center" style="text-align: center;">
              <ion-row class="ion-justify-content-center" style="margin-bottom: 0px; margin: 0px;">
                <ion-label style="font-size: 12px">Yeni Telefon numaranıza gönderdiğimiz doğrulama kodunu aşağıdaki
                  alana giriniz.</ion-label>

                <ion-col class="resetMargin" size="12"
                  style="display: flex; flex-direction: row; justify-content: center; margin-bottom: 10px;">
                  <ion-button class="" @click="resendVerificationCode">Doğrulama Kodu Gönder</ion-button>
                </ion-col>


                <ion-col size="12" class="resetMargin" style="display: flex; height: 30px; justify-content: center;">
                  <ion-label class="resetMargin">Doğrulama Kodu</ion-label>
                </ion-col>

                <ion-col size="12" class="resetMargin" style="display: flex; justify-content: center;">
                  <ion-input class="resetMargin" style="border:1px solid purple; width: 50%; border-radius: 10px;"
                    v-model="changePhone.code"></ion-input>
                </ion-col>


                <ion-col class="resetMargin" size="7"
                  style="display: flex; flex-direction: row; justify-content: space-around;">
                  <button class="resetMargin" @click="savePhone">Gönder</button>
                  <button class="resetMargin" @click="resendVerificationCode">Yeni Kod Al</button>
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
import { IonCol, IonGrid, IonLabel, IonRow, IonPage, IonInput, IonButton, IonIcon } from '@ionic/vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'; // Sadece useRoute'ü import ettik
import Header from "@/components/Header.vue";
import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";
import useUserInfoStore from '@/stores/userInfoStore';
import userEditApi from "@/services/userEditApi";
import phoneVerify from '@/services/phoneVerify';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
const $toast = useToast();

const route = useRoute(); // useRoute ile mevcut rotayı al
const store = useUserInfoStore();
const formattedPhone = ref('');
const isPhoneValid = ref(true);


const userData = ref<any[]>([]);

const formData = ref({
  phone: '',
});


const onPhoneInput = (event: { target: { value: string } }) => {
  let value = event.target.value.replace(/\D/g, ''); // Sadece rakamları tutar

  // Eğer kullanıcı başta 0 eklemeye çalıştıysa, baştaki 0'ı kaldırıyoruz
  if (value[0] === '0') {
    value = value.slice(1); // Başındaki 0'ı kaldır
  }

  // Telefon numarasını formData'ya atıyoruz (sadece rakam)
  formData.value.phone = value; 

  // Telefon numarasını formatlıyoruz
  formattedPhone.value = formatPhoneNumber(value); 

  // Telefon numarası 11 haneli mi kontrolü
  isPhoneValid.value = value.length <= 11; // 11 haneden fazlasını kabul etmiyoruz
};

// Telefon numarasını yazarken anında (XXX) XXX XX XX formatında göster
const formatPhoneNumber = (value: string) => {
  const phone = value.replace(/\D/g, ''); // Sadece rakamları tutar

  // Eğer telefon numarası 1 haneden küçükse sadece rakamı göster
  if (phone.length <= 1) {
    return phone;
  }

  // Eğer telefon numarası 4 haneye kadar geldiyse
  if (phone.length <= 3) {
    return phone.slice(0, 3); // İlk 3 rakamı göster
  }

  // Eğer telefon numarası 7 haneye kadar geldiyse
  if (phone.length <= 6) {
    return `${phone.slice(0, 3)} (${phone.slice(3, 6)})`; // XXX (XXX)
  }

  // Eğer telefon numarası 8 haneye kadar geldiyse
  if (phone.length <= 8) {
    return `${phone.slice(0, 3)} (${phone.slice(3, 6)}) ${phone.slice(6, 8)}`; // XXX (XXX) XX
  }

  // Eğer telefon numarası 10 haneye kadar geldiyse
  return `${phone.slice(0, 3)} (${phone.slice(3, 6)}) ${phone.slice(6, 8)} ${phone.slice(8, 10)}`; // XXX (XXX) XX XX
};



const preventNonNumericInput = (event: KeyboardEvent) => {
  const key = event.key;

  // Eğer girilen tuş rakam değilse, girdiyi engelle
  if (!/^[0-9]$/.test(key) && key !== 'Backspace' && key !== 'Delete') {
    event.preventDefault();
  }
};


let user = ref<any>({
  name: '',
  last_name: '',
  email: '',
  phone: '',
  photo:'',
  password: ''
});



import { computed } from 'vue';

// ...



const changePhone = computed(() => ({
  phone: formData.value.phone,
  code: '',
}));

// ...

const savePhone = () => {
  if (changePhone.value.code === '' || formData.value.phone === '') {
    $toast.error('Doğrulama kodu ve telefon numarası alanları boş bırakılamaz', {
      position: 'top',
    })
  }
  else {
    console.log(changePhone.value); // Burada phone güncel olacak
    phoneVerify.phoneCodeVerify(changePhone.value).then(res => {
      let item = res.data
      if (item) {
        userEditApi.editUser(formData.value)
          .then(response => {
            console.log('Phone number updated successfully:', response);
            $toast.success('Telefon numaranız başarıyla güncellendi', {
              position: 'top',
            })
          })
          .catch(error => {
            console.error('Error updating phone number:', error);
          });
      } else {
        alert('Hatalı Kod Girdiniz:');
      }
    }).catch(error => {
      console.error('Error verifying phone code:', error);
    });
  }
};



// Route değiştiğinde çalışacak olan işlev
watch(() => route.path, (newPath) => {
  if (newPath === '/EditPhone') {
    const userDataString = localStorage.getItem("user");

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      console.log(userData);

      user.value.name = userData.name;
      user.value.photo = userData.photo;
    }
  }
});

const resendVerificationCode = () => {
  if (formData.value.phone === '') {
    $toast.error('Lütfen telefon numarasınızı giriniz', {
      position: 'top',
    })
  } else {
    phoneVerify.phoneVerify(formData.value).then(res => {
      //verifyCode.value = res.data;
      $toast.success('Yeni telefon numaranıza kod gönderildi.', {
        position: 'top',
      })
    })
  }

};




onMounted(() => {
  const userDataString = localStorage.getItem("user");

  if (userDataString) {
    const userData = JSON.parse(userDataString);
    console.log(userData);

    user.value.name = userData.name;
    user.value.photo = userData.photo
  }
  store.getUserInfo().then(res => {
    userData.value.push(res.data);
  });
});
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .resetMargin {
    color: #901B6A;
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

    // Butonların stilleri
    button {
      background-color: white; // Arka plan rengini beyaz yap
      color: #901B6A; // Yazı rengini pembe yap
    }
  }
}
</style>
