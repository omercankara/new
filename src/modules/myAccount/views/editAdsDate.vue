<template>
    <ion-page>
        <Header />
        <ion-content>
            <ion-grid>
                <ion-row>
                    <ion-col size="12" style="padding: 0px;">


                        <ion-col size="12" style="display: flex;  width: 100%; padding: 10px; background-color: gainsboro;">
                            <h4 style="margin: 0px; margin-left: 10px; font-weight: bold;">İlan Tarihini Güncelle</h4>
                        </ion-col>

                        <ion-col size="12" style="display: flex; width: 100%; padding: 10px;">
                            <p style="margin: 0px; margin-left: 10px;">İlanın Tarihi Güncellenir, İlanınızın süresi
                                uzamaz
                                veya bitiş tarihi degişmez</p>
                        </ion-col>


                        <ion-row size="12" >
                            <ion-col size="12" style="background-color: ''; ">
                                <ion-row>
                                    <ion-col size="6"
                                        style="background-color: ''; display: flex; justify-content: flex-start;  align-items: flex-start">
                                        <div
                                            style="width: 50%; height: 60%; display: flex; justify-content: center; align-items: center; border-radius: 50px; background-color: gainsboro;">
                                            <p>1 Adet</p>
                                        </div>
                                    </ion-col>
                                    <ion-col size="6"
                                        style="background-color: ''; display: flex; justify-content: flex-start;  align-items: flex-start">
                                        <div
                                            style="width: 100%; height: 100%; display: flex; justify-content: flex-start; align-items: flex-start; border-radius: 0px; background-color: '';">
                                            <p style="margin: 0px;">Ödenecek Tutar <br>50₺</br></p>
                                        </div>
                                    </ion-col>
                                </ion-row>
                            </ion-col>
                        </ion-row>


                        <ion-row style="padding: 10px;">
                            <ion-col size="12" style="background-color: white; margin-bottom: 10px;    ">
                                
                                <ion-input type="text" placeholder="Kart Üzerindeki Ad Soyad" class="form-control "
                                    style="background-color: white;  border-bottom: 1px solid gray;" </ion-input>
                            </ion-col>

                            <ion-col size="12" style="background-color: white; margin-bottom: 10px;">
                                
                                <ion-input type="text" placeholder="Kart numaranız" class="form-control "
                                    style="background-color: white; border-bottom: 1px solid gray;" </ion-input>
                            </ion-col>

                            <ion-col size="4" style="background-color: #f5f5f5; margin-bottom: 10px;">
                                <ion-label>Ay</ion-label>
                                <ion-list>
                                    <ion-item>
                                        <ion-select placeholder="Ay">
                                            <ion-select-option v-for="i in MonthData" :value="i.id" :key="i.id">{{
                                                i.name }}</ion-select-option>
                                        </ion-select>
                                    </ion-item>
                                </ion-list>
                            </ion-col>

                            <ion-col size="4" style="background-color: #f5f5f5; margin-bottom: 10px;">
                                <ion-label>Yıl</ion-label>
                                <ion-list>
                                    <ion-item>
                                        <ion-select>
                                    <ion-select-option v-for="i in YearData" :value="i">{{ i }}</ion-select-option>
                                </ion-select>
                                    </ion-item>
                                </ion-list>
                            </ion-col>


                            <ion-col size="4" style="background-color: #f5f5f5; margin-bottom: 10px;">
                                <ion-label>CVV</ion-label>
                                <ion-input type="text" placeholder="Örn: 523" class="form-control"
                                    style="background-color: white; height: 70%;" inputmode="numeric"></ion-input>
                            </ion-col>

                            <ion-col size="12">
                                <PageHeader title="Fatura Bilgisi"></PageHeader>

                                <ion-col size="12">

                                </ion-col>
                            </ion-col>



                            <ion-col size="12">
                                <ion-button expand="block">Ödemeyi Tamamla</ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-content>
    </ion-page>
</template>



<script lang="ts" setup>
import { IonCol, IonPage, IonGrid, IonContent, IonRow, IonBadge } from '@ionic/vue';
import Header from '@/components/Header.vue';
import { ref } from 'vue';




const YearData = ref<any[]>([]);
for (let year = 2000; year <= 2050; year++) {
    YearData.value.push(year);
}
const MonthData = ref<{ id: number; name: string }[]>([
    { id: 1, name: 'Ocak' },
    { id: 2, name: 'Şubat' },
    { id: 3, name: 'Mart' },
    { id: 4, name: 'Nisan' },
    { id: 5, name: 'Mayıs' },
    { id: 6, name: 'Haziran' },
    { id: 7, name: 'Temmuz' },
    { id: 8, name: 'Ağustos' },
    { id: 9, name: 'Eylül' },
    { id: 10, name: 'Ekim' },
    { id: 11, name: 'Kasım' },
    { id: 12, name: 'Aralık' }
]);




</script>