<template>

  <ion-page>
    <ion-content>
      <Header/>
      <PageHeader title="Hesap silme"/>
      <ion-grid class="account-deletion">
        <ion-row>
          <ion-col size="12">
            <p class="message">
              <strong>Hesabınızı silmek istediğiniz için üzgünüz.</strong><br />
              Takasimo ailesinden ayrılmayı düşündüğünüzü duyduğumuz için üzgünüz. Size daha iyi hizmet verebilmek için
              her zaman buradayız ve platformumuzu sürekli olarak geliştirmeye çalışıyoruz. Hesabınızı silmeden önce,
              karşılaştığınız herhangi bir sorunu çözmek veya geri bildiriminizi almak isteriz.
              <strong>Lütfen bizimle deneyiminizi paylaşın!</strong> (Opsiyonel)
            </p>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <p class="message">
              <strong>Neden hesabınızı silmek istediğinizi bizimle paylaşır mısınız?</strong><br />
              Geri bildiriminiz bizim için çok değerli ve platformumuzu geliştirmemize yardımcı olabilir. Her türlü
              öneri ve geri bildirim için <strong>oneri@takasimo.com</strong> adresine ulaşabilirsiniz. Belki de
              yaşadığınız sorunları hızla çözebiliriz ve Takasimo'da kalmanızı sağlayabiliriz!
            </p>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <p class="message">
              <strong>Yine de devam etmek istiyorsanız...</strong><br />
              Hesap silme işlemini başlatmak için, <strong>takasimo.com</strong>'da kayıtlı e-posta adresinizden
              <strong>destek@takasimo.com</strong> adresine bir e-posta göndererek talebinizi iletebilirsiniz. Talebiniz
              alındıktan sonra, işlem başlatılacak ve size onay verilecektir.
            </p>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <p class="message">
              Unutmayın, platformumuza her zaman geri dönebilir ve dilediğiniz zaman yeniden hesap oluşturabilirsiniz.
              Sizi tekrar aramızda görmek isteriz!
            </p>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import PageHeader from '@/components/page/PageHeader.vue';

</script>

<style scoped>
.account-deletion {
  font-family: Arial, sans-serif;
  color: #333;
  font-size: 14px;
  margin: 20px;
}

.message {
  text-align: start;
  margin-bottom: 5px;
  line-height: 1.6;
}

strong {
  font-weight: bold;
  color: #333;
}

a {
  color: #007bff;
  text-decoration: none;
}

ion-col {
  display: flex;
  justify-content: center;
}
</style>
