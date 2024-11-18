<template>
    <ion-page>
        <Header />
        <div class="title">İlanınızı Öne Çıkarmak ister misiniz</div>
        <PageHeader title="Sizin için seçtiklerimiz" />
        <ion-content class="ion-padding">
            <div class="dopings-wrapper">
                <div class="doping-item" v-for="(doping, dopingKey) in dopings" :key="dopingKey">
                    <div class="doping-header">
                        <div class="doping-checkbox">
                            <ion-checkbox @ion-change="changeBox(doping)" color="primary" v-model="doping.checked" />
                        </div>
                        <div class="doping-title">
                            {{ doping.title }}
                        </div>
                    </div>
                    <div class="doping-content">
                        <div class="doping-description">{{ doping.description }}</div>
                        <div class="doping-details">
                            <ion-button color="primary" size="small" @click="showDopingDetails(doping)">
                                Dopingi İncele
                            </ion-button>
                        </div>
                        <div class="doping-periods">
                            <ion-accordion-group :key="doping.doping_code"
                                :ref="(el) => setComponents(doping.doping_code, el)">
                                <ion-accordion value="first">
                                    <ion-item slot="header">
                                        <div class="doping-period-header">
                                            <div class="doping-period-header-title">
                                                <span v-if="doping?.selectedPeriod">
                                                    {{ doping?.selectedPeriod?.period_name }} - {{
                                                        doping?.selectedPeriod?.price }} ₺
                                                </span>
                                                <span v-else>
                                                    Plan Seçiniz
                                                </span>
                                            </div>
                                        </div>
                                    </ion-item>
                                    <div class="doping-period-content" slot="content">
                                        <div class="period-item"
                                            v-for="(periodItem, periodKey) in JSON.parse(doping.periods)"
                                            :key="periodKey" @click="selectDopingPeriod(doping, periodItem)">
                                            <div class="label">{{ periodItem?.period_name }}</div>
                                            <div class="price">{{ periodItem?.price }} ₺</div>
                                        </div>
                                    </div>
                                </ion-accordion>
                            </ion-accordion-group>

                        </div>

                    </div>
                </div>
                <ion-row>
                    <ion-col size="12" style="display: flex; justify-content: center">
                        <ion-button v-if="!isDopingsNotEmpty" @click="noHighlight" color="primary">Öne çıkarma olmadan
                            ilerle</ion-button>
                    </ion-col>
                </ion-row>


            </div>
            <ion-modal id="doping-detail-modal" :is-open="dopingDetailsModal"
                @ionModalDidDismiss="dopingDetailsModal = false">
                <div class="doping-detail-wrapper">
                    <div class="doping-detail-header">
                        <h1 class="">{{ dopingDetail.title }}</h1>
                        <div class="">
                            <ion-button color="primary" @click="dopingDetailsModal = false">
                                Kapat
                            </ion-button>
                        </div>
                    </div>
                    <div class="doping-detail-content">
                        <div class="doping-detail-content-left">
                            <div class="description">
                                {{ dopingDetail.description }}
                            </div>
                            <div class="periods">
                                <div class="period-item"
                                    v-for="(periodItem, periodKey) in JSON.parse(dopingDetail.periods)"
                                    :key="periodKey">
                                    <div class="label">{{ periodItem?.period_name }}</div>
                                    <div class="price">{{ periodItem?.price }} ₺</div>
                                </div>
                            </div>
                        </div>
                        <div class="doping-detail-content-right">
                            <img src="">
                        </div>
                    </div>
                </div>
            </ion-modal>

            <ion-modal id="payment-modal" :is-open="paymentModals" @ionModalDidDismiss="dopingDetailsModal = false">
                <div class="doping-detail-wrapper">
                    <div class="doping-detail-header">
                        <img src="../../../assets/textlogo.png" alt="">
                    </div>
                    <div style="display: flex; justify-content:center; ">
                        <img style="height: 50px;" src="../../../assets/spinner.svg" alt="">
                    </div>
                    <div class="doping-detail-contents">
                        <p style="text-align: center; font-size:15px;">Ödeme ekranına yönlendiriliyorsunuz</p>
                    </div>
                </div>
            </ion-modal>

        </ion-content>
        <ion-footer v-if="computedTotalPrice() > 0">
            <div class="selected-dopings">
                <div class="count">{{ computedTotalPrice() }}</div>
                doping seçildi.
            </div>
            <ion-button color="primary" @click="goTo()">
                Ödemeye Geç
            </ion-button>
        </ion-footer>
    </ion-page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { IonAccordion, IonAccordionGroup, IonButton, IonCol, IonRow, IonCheckbox, IonContent, IonFooter, IonItem, IonModal, IonPage } from '@ionic/vue';
import paymentApi from "@/services/payment"


import Swal from 'sweetalert2'

import 'sweetalert2/src/sweetalert2.scss'

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Services
import dopingApi from "@/services/dopingApi";

// Store
import { useDopingStore } from "@/stores/dopingStore";
import { useProductsStore } from '@/stores/productsStore';
import { usePaymentStore } from '@/stores/paymentToken';
// Other
const paymentToken = usePaymentStore()
const dopingStore = useDopingStore();
const productStore = useProductsStore();
const router = useRouter();
const route = useRoute();

// Data
const selectedDopings = ref<any[]>([]);
const comRefs: any = {};
const productCode = ref<string>((route?.params?.code as string) ?? '');
const dopingsLoading = ref<boolean>(false);
const dopings = ref<any[]>([]);
const dopingDetailsModal = ref<boolean>(false);
const paymentModals = ref<boolean>(false);
const dopingDetail = ref<any>(null);

// Functions


const isDopingsNotEmpty = computed(() => {
    return selectedDopings.value.length > 0; // Dizi boş değilse true döner
});



const showDopingDetails = (doping: any) => {
    dopingDetailsModal.value = true;
    dopingDetail.value = doping;
}


const noHighlight = () => {
    // Swal.fire({
    //     title: "İlanınız onaya gönderildi..",
    //     heightAuto: false,
    //     icon: "success",
    //     confirmButtonText: "Öne Çıkart",
    //     cancelButtonText: "İlanlarımda görüntüle",
    //     showCancelButton: true,
    //     customClass: {
    //         confirmButton: 'swal2-confirm pink-button',
    //         cancelButton: 'swal2-cancel pink-button'
    //     }
    // }).then((result) => {
    //     if (result.isConfirmed) {
    //         // Onay butonuna tıklandığında yapılacak işlemler
    //     } else if (result.isDismissed) {
    //         router.push({ name: 'my-ads' })
    //     }
    // });
    router.push({ name: 'home' })
}



watch(
    () => route.params.code, // İzlemek istediğiniz parametreyi belirleyin
    (newValue, oldValue) => {
        if (newValue !== oldValue) {
            let productItem = localStorage.getItem('lastCreatedProduct');
            if (productItem) {
                let product = JSON.parse(productItem);
                let productCode = {
                    product_code: product.product_code
                }
                dopingApi.createOrderCode(productCode).then((res: any) => {
                    console.log("donen", res.data)
                })
               

            }
        }

    }
);


    // Route değişiminde yapılacak işlemler
    watch(
      () => route.fullPath,
      (newFullPath, oldFullPath) => {
        console.log('Route değişti!');
        console.log('Eski Path:', oldFullPath);
        console.log('Yeni Path:', newFullPath);

        // Eğer reloadCount 0 ise, sayfayı yenileme
        selectedDopings.value.forEach(doping => {
          doping.checked = false; // Her öğenin 'checked' değerini false yap
        });

        // Burada başka route değişim işlemleri yapılabilir
      },
      { immediate: true } // İlk sayfa yüklemesi için tetiklenmesi
    );






let user = localStorage.getItem("user");
let userCode = user ? JSON.parse(user).user_code : null;


console.log(productStore.lastCreatedProduct)


const getDopings = () => {
    dopingsLoading.value = true;
    return dopingApi.getDopings()
        .then((res: any) => {
            dopings.value = res?.data?.data ?? [];
        })
        .finally(() => {
            dopingsLoading.value = false;
        })
}

let createDoping = {
    user_code: userCode, // localStorage'dan gelen user_code
    product_code: productStore.lastCreatedProduct.product_code,
    doping_code: "dd877b04-1cc9-4832-b884-8acac30f76f8",
    time: 10080,
    price: 700
}



const changeBox = (event: any) => {
    console.log(event)
    setComponents(event.doping_code, comRefs[event.doping_code]);

    if (comRefs[event.doping_code].$el && event.checked == true) {
        comRefs[event.doping_code].$el.value = 'first';
        selectedDopings.value.push(event);
    } else {
        comRefs[event.doping_code].$el.value = undefined;
        // selectedDopings dizisinden ilgili öğeyi kaldır
        selectedDopings.value = selectedDopings.value.filter(doping => doping.doping_code !== event.doping_code);
    }
}







const setComponents = (code: any, el: any) => {
    if (!comRefs[code]) {
        comRefs[code] = el; // İlk kez ekleniyor
        //console.log(`Yeni veri eklendi: [${code},`, el.$el, `]`);
    }
};


const selectDopingPeriod = (doping: any, period: any) => {
    doping.selectedPeriod = period; // Önce period'u seçelim
    createDoping.doping_code = doping.doping_code;
    createDoping.price = period.price; // Burada period'dan alıyoruz
    createDoping.time = period.time;   // Burada da period'dan alıyoruz
    console.log("Selected Doping:", doping);
    console.log("createDoping:", createDoping);
    doping.checked = true;
    dopingStore.setCreatedProductDoping(createDoping);
    setComponents(doping.doping_code, comRefs[doping.doping_code]);
    if (comRefs[doping.doping_code].$el) {
        comRefs[doping.doping_code].$el.value = undefined
    }
}






const goTo = () => {
    dopingStore.setSelectedDopings(dopings.value.filter((doping) => doping.checked));


    interface ProductDoping {
        forEach(arg0: (element: any) => void): unknown;
        price: number; // veya uygun bir tip
        doping_code: string; // veya uygun bir tip
        time: number
    }

    // let orderCode = localStorage.getItem('createdOrderBy');
    // orderCode = orderCode ? JSON.parse(orderCode) : null;

    let productItem = localStorage.getItem('lastCreatedProduct');
    if (productItem) {
        let product = JSON.parse(productItem);
        let productCode = {
            product_code: product.product_code
        }
        dopingApi.createOrderCode(productCode).then((res: any) => {
            console.log("donen", res.data)
            let doping = {
                order_code: res.data.order_code,
                dopings: [] as ProductDoping[], // items dizisi ProductDoping türünde
            };
            let item = dopingStore.selectedDopings;
            item.forEach((element: any) => {
                let dp = element.selectedPeriod;
                dp.doping_code = element.doping_code
                doping.dopings.push(dp);
            });

            dopingApi.createProductDopings(doping).then((res: any) => {
                paymentToken.setCreatedProductDoping(res.data.token);
                paymentModals.value = true

                setTimeout(() => {
                    if (computedTotalPrice() > 0) {
                        dopingStore.setSelectedDopings(dopings.value.filter((doping) => doping.checked));
                        paymentModals.value = false
                        router.push({ name: 'doping-payment', params: { code: productCode.value } })
                    }
                }, 1000)


            }).catch((error: any) => {
                Swal.fire({
                    title: "Lütfen telefon numaranızı doğrulayınız",
                    heightAuto: false,
                    icon: "error"
                }).then(() => {
                    // dopingStore.setSelectedDopings(dopings.value.filter((doping) => doping.checked));
                    setTimeout(() => {
                        if (computedTotalPrice() > 0) {
                            // router.push({ name: 'doping-payment', params: { code: productCode.value } })
                        }
                    }, 1000)

                });
            });



        })

    }




}

// Computed
// const computedCheckedCount = () => {
//     let count = 0;
//     if (dopings.value.length > 0) {
//         dopings.value.forEach((doping) => {
//             if (doping.checked && doping?.selectedPeriod) {
//                 count++;
//             }
//         })
//     }
//     return count;
// }
const computedTotalPrice = () => {
    let totalPrice = 0;
    if (dopings.value.length > 0) {
        dopings.value.forEach((doping) => {
            if (doping.checked && doping?.selectedPeriod?.price) {
                totalPrice += parseFloat(doping?.selectedPeriod?.price);
            }
        })
    }
    return totalPrice;
}



// Data
onMounted(() => {
    getDopings()
    //window.location.reload();  // Sayfayı yenile
    // console.log(userInfo.value)
})


</script>

<style lang="scss">
.pink-button {
    background-color: rgb(115, 27, 173) !important;
    /* Arka plan rengi */
    color: white !important;
    /* Metin rengi */
    border: none !important;
    /* Kenarları kaldırmak için */
}

.pink-button:hover {
    background-color: darkpink !important;
    /* Hover durumunda renk değişimi */
}

.title {
    font-family: var(--font-medium);
    font-size: 18px;
    padding: 0 15px 5px 15px;
}

.dopings-wrapper {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .doping-item {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        gap: 10px;

        .doping-header {
            display: flex;
            align-items: center;

            .doping-checkbox {
                margin-right: 10px;
            }

            .doping-title {
                font-family: var(--font-medium);
                font-size: 20px;
                color: var(--primary);
            }
        }

        .doping-content {
            padding-left: 30px;

            .doping-description {
                font-family: var(--font-medium);
                font-size: 14px;
                margin-bottom: 10px;
                text-align: justify;
            }

            .doping-details {
                margin-bottom: 10px;

                ion-button {
                    font-size: 14px;
                    --padding-start: 60px;
                    --padding-end: 60px;
                    --padding-top: 0px;
                    --padding-bottom: 0px;
                    --border-radius: 10px;
                }
            }

            .doping-periods {
                ion-accordion {
                    border-radius: 10px;
                    border: 1px solid #f4f5f8;
                    background: var(--white);
                    padding: 0;

                    ion-item {
                        padding: 0;
                        font-size: 14px;
                    }
                }

                .doping-period-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;

                    .doping-period-header-title {
                        font-family: var(--font-medium);
                        font-size: 16px;
                    }
                }

                .doping-period-content {
                    border-top: 1px solid #f4f5f8;

                    .period-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #f4f5f8;
                        padding: 15px;
                        cursor: pointer;

                        &:hover {
                            background: #f4f5f8;
                        }

                        &:last-child {
                            border-bottom: 0;
                        }

                        .label {
                            font-family: var(--font-medium);
                            font-size: 16px;
                        }

                        .price {
                            font-family: var(--font-medium);
                            font-size: 16px;
                            color: var(--primary);
                        }
                    }
                }
            }
        }
    }
}

ion-footer {
    padding: 20px;
    background: var(--background-grey);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .selected-dopings {
        font-family: var(--font-medium);
        font-size: 16px;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: center;

        .count {
            background: var(--primary);
            color: var(--white);
            padding: 4px 8px 4px 8px;
            line-height: 1;
            border-radius: 50%;
            margin-right: 5px;
        }
    }
}

ion-modal#doping-detail-modal {
    --width: fit-content;
    --min-width: 300px;
    --height: fit-content;
    --border-radius: 6px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);

    .doping-detail-wrapper {
        padding: 20px;

        .doping-detail-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;

            h1 {
                font-size: 22px;
                font-family: var(--font-bold);
                margin: 0;
            }
        }

        .doping-detail-content {
            .doping-detail-description {
                font-family: var(--font-medium);
                font-size: 16px;
                margin-bottom: 20px;
                text-align: justify;
            }

            .doping-detail-periods {
                .period-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #f4f5f8;
                    padding: 15px;

                    &:last-child {
                        border-bottom: 0;
                    }

                    .label {
                        font-family: var(--font-medium);
                        font-size: 16px;
                    }

                    .price {
                        font-family: var(--font-medium);
                        font-size: 16px;
                        color: var(--primary);
                    }
                }
            }
        }
    }
}




ion-modal#payment-modal {
    --width: 300px;
    --min-width: 300px;
    --height: fit-content;
    --border-radius: 20px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);

    .doping-detail-wrapper {
        padding: 20px;

        .doping-detail-header {
            display: flex;
            justify-content: space-between;


            img {
                margin-left: 20px
            }
        }

        .doping-detail-contents {
            width: 100%;
            font-weight: bold;

        }
    }
}
</style>
