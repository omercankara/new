<template>
  <ion-page>
    <ion-content>
      <Header/>
      <PageHeader title="Veri Silme"/>
      <div class="delete-data">
        <ion-grid>
          <ion-row>
            <ion-col size="12">
              <p>
                <strong>Aramızdan ayrıldığınız için üzgünüz.</strong>
              </p>
              <p>
                <strong>Veri silme işlemi öncesi hesap silme işlemi gereklidir.</strong>
              </p>
            </ion-col>
          </ion-row>

      

          <ion-row>
            <ion-col size="12">
              <p>
                Veri silme işlemini başlatmadan önce hesabınızın silinmesi gerekmektedir. Eğer hesap silme işleminiz tamamlanmadıysa, hesap silme talebinizi başlatmak için takasimo.com'da kayıtlı e-posta adresinizden <strong>destek@takasimo.com</strong> adresine bir e-posta göndererek talebinizi iletebilirsiniz.
              </p>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="12">
              <p>
                <strong>Hesabınız silindiyse ve verilerinizi silmek istiyorsanız...</strong><br />
                Veri silme işlemini başlatmak için, <strong>takasimo.com</strong>'da kayıtlı e-posta adresinizden <strong>destek@takasimo.com</strong> adresine bir e-posta göndererek talebinizi iletebilirsiniz. Talebiniz alındıktan sonra, işlemleriniz başlatılacak ve size onay verilecektir.
              </p>
            </ion-col>
          </ion-row>

      

          <ion-row>
            <ion-col size="12">
              <p>
                <strong>Unutmayın!</strong>
              </p>
              <p>
                Veri silme işleminin geri alınamayacağını ve platformdaki tüm bilgilerinizin tamamen silineceğini unutmayın. Platformumuza her zaman yeniden katılabilir ve hesap oluşturabilirsiniz, ancak silinen veriler geri getirilemez.
              </p>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';   
import PageHeader from '@/components/page/PageHeader.vue';
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
</script>

<style scoped>
.delete-data {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  margin: 0;
  padding: 10px;
}

ion-grid {
  padding: 0 10px;
}

ion-row {
  margin-bottom: 10px;
}

p {
  color: #333;
  font-size: 14px;  /* Daha büyük font boyutu ile okuma kolaylığı */
  margin-bottom: 1;
  text-align: left;
}

strong {
  font-weight: bold;
}

a {
  color: #007bff;
  text-decoration: none;
}
</style>
