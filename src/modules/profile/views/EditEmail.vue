<template>
  <ion-page>
    <div class="container">
      <div class="content">
        <Header />
        <ion-grid>
          <MyAccountHeader class="m-l-6 m-r-10" style="margin-bottom: 0px;">
            <template #close>
              <ion-icon color="primary" size="small" />
            </template>
          </MyAccountHeader>
          <ion-row class="ion-justify-content-start">
            <ion-col class="ion-bg-padding" size="6">
              <ion-label class="labelStyle">Mevcut E Posta</ion-label>
            </ion-col>

            <ion-col size="12" style="display: flex; align-items: center; position: relative; margin-bottom: 0px;">
              <ion-input style="margin-bottom: 0px;" placeholder="test@gmail.com" class="form-control inputStyle">
              </ion-input>
            </ion-col>

            <ion-col class="ion-bg-padding" size="6">
              <ion-label style="margin-bottom: 0px;" class="labelStyle">Yeni E Posta</ion-label>
            </ion-col>

            <ion-col size="12" style="display: flex; align-items: center; position: relative; margin-bottom: 0px;">
              <ion-input style="margin-bottom: 0px;" v-model="formData.newEmail" placeholder="test@gmail.com"
                         class="form-control inputStyle"></ion-input>
            </ion-col>

            <ion-col size="12" class="ion-justify-content-center" style="text-align: center;">
              <ion-row class="ion-justify-content-center" style="margin-bottom: 0px; margin: 0px;">
                <ion-label style="font-size: 14px">Yeni Email Adresinize gönderilen kodu buraya giriniz</ion-label>

                <ion-col size="12" class="resetMargin"
                         style="display: flex; height: 30px; justify-content: center;">
                  <ion-label class="resetMargin">Doğrulama Kodu</ion-label>
                </ion-col>

                <ion-col size="12" class="resetMargin" style="display: flex; justify-content: center;">
                  <ion-input class="resetMargin" style="border:1px solid purple; width: 50%; border-radius: 10px;"
                             v-model="formData.verificationCode"></ion-input>
                </ion-col>

                <ion-col size="12"
                         style="display: flex; flex-direction: column; justify-content: center; margin: 0px;">
                  <p class="resetMargin" style="font-size:13px;">Eğer mesaj almadıysanız Lütfen tekrar deneyin veya
                    alternatif bir numara giriniz</p>
                </ion-col>

                <ion-col class="resetMargin" size="12"
                         style="display: flex; flex-direction: column; justify-content: center;">
                  <ion-button class="resetMargin" @click="resendVerificationCode">Tekrar kod al</ion-button>
                  <ion-button class="resetMargin" @click="saveEmail">Kaydet</ion-button>
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
import { ref, onMounted } from 'vue';
import Header from "@/components/Header.vue";
import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";
import useUserInfoStore from '@/stores/userInfoStore';
import userEditApi from "@/services/userEditApi";

const store = useUserInfoStore();

const userData = ref<any[]>([]);

const formData = ref({
  token: localStorage.getItem('access_token'),
  newEmail: '',
  verificationCode: '',
});

const editPassword = () => {
  userEditApi.editPassword(formData.value)
      .then(response => {
        console.log('Password updated successfully:', response);
      })
      .catch(error => {
        console.error('Error updating password:', error);
      });
};

const resendVerificationCode = () => {
  // Kod yeniden gönderme işlevselliği
  console.log('Verification code resent');
};

const saveEmail = () => {
  // E-posta kaydetme işlevselliği
  console.log('Email saved');
};

onMounted(() => {
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
  }
}
</style>
