<template>
    <ion-page>
        <Header />
        <PageHeader title="Öne Çıkar" />
        <ion-content class="ion-padding">
            <div class="dopings-wrapper">
                <div class="doping-item" v-for="(doping, dopingKey) in dopings" :key="dopingKey">
                    <div class="doping-header">
                        <div class="doping-title">
                            {{ doping.title }}
                        </div>
                        <div class="doping-checkbox">
                            <ion-checkbox color="primary"  @ion-change="changeBox(doping)"  v-model="doping.checked" />
                        </div>
                    </div>
                    <div class="doping-content">
                        <!-- <div class="doping-content-left">
                            <div class="m-b-30">{{ doping.description }}</div>
                            <div class="m-b-5">Doping yayınlanma süresi:</div>
                            <div class="m-b-30" v-if="doping?.periods">
                                <span v-for="(periodItem, periodKey) in JSON.parse(doping.periods)" :key="periodKey">
                                    <span>{{ periodItem.period_name }}</span>
                                    <span v-if="JSON.parse(doping.periods).length > (periodKey + 1)">, </span>
                                </span>
                            </div>
                        </div> -->

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


                    
                        <div class="doping-content-right">
                            <img src="@/assets/doping.png" alt="Doping Image" />
                        </div>
                    </div>
                    <div class="doping-footer">
                        <ion-button  color="primary" @click="select(doping)" >
                            Seç
                        </ion-button>
                    </div>
                </div>
            </div>
        </ion-content>
        <ion-footer>
            <div class="selected-dopings">
                <div class="count">{{ computedCheckedCount() }}</div>
                doping seçildi.
            </div>
            <ion-button color="primary" @click="goTo()">
                İlan Seç
            </ion-button>
        </ion-footer>
    </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from "vue-router";
import { IonButton, IonCheckbox, IonContent,IonItem, IonFooter,IonAccordion, IonAccordionGroup, IonPage } from '@ionic/vue';

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";

// Services
import dopingApi from "@/services/dopingApi";

// Store
import { useDopingStore } from "@/stores/dopingStore";
import { FetchMessageList } from '@/helpers/messageCount';

// Other
const dopingStore = useDopingStore();
const router = useRouter();

// Data
const dopingsLoading = ref<boolean>(false);
const dopings = ref<any[]>([]);

const comRefs: any = {};

const changeBox = (event: any) => {
  
    setComponents(event.doping_code, comRefs[event.doping_code]);
    if (comRefs[event.doping_code].$el && event.checked == true) {
        comRefs[event.doping_code].$el.value = 'first';
    }else{
        comRefs[event.doping_code].$el.value = undefined
    }
}

const setComponents = (code: any, el: any) => {
    if (!comRefs[code]) {
        comRefs[code] = el; // İlk kez ekleniyor
        console.log(`Yeni veri eklendi: [${code},`, el.$el, `]`);
    } 
};


const select = (event:any) => {
    event.checked = !event.checked;
    changeBox(event);
}




const getDopings = () => {
    dopingsLoading.value = true;
    return dopingApi.getDopings()
        .then((res: any) => {
            dopings.value = res?.data?.data ?? [];
            // Varsayılan olarak tüm dopings'leri seçili yapma
            dopings.value.forEach(doping => {
                doping.checked = false;
            });
        })
        .finally(() => {
            dopingsLoading.value = false;
        });
}


const computedCheckedCount = () => {
    let count = 0;
    if (dopings.value.length > 0) {
        dopings.value.forEach((doping) => {
            if (doping.checked) {
                count++;
            }
        })
    }
    return count;
}

// Data
onMounted(() => {
    getDopings();
    FetchMessageList().then(() => {
        console.log("Mesaj listesi başarıyla alındı.");
    }).catch(error => {
        console.error("Mesaj listesi alınırken hata oluştu:", error);
    });
})


let user = localStorage.getItem("user");
let userCode = user ? JSON.parse(user).user_code : null;
let createDoping = {
    user_code: userCode, // localStorage'dan gelen user_code
    doping_code: "dd877b04-1cc9-4832-b884-8acac30f76f8",
    time: 10080,
    price: 700
}

const selectDopingPeriod = (doping: any, period: any) => {
    doping.selectedPeriod = period; // Önce period'u seçelim
    createDoping.doping_code = doping.doping_code;
    createDoping.price = period.price; // Burada period'dan alıyoruz
    createDoping.time = period.time;   // Burada da period'dan alıyoruz
    //console.log("Selected Doping:", doping);
    console.log("createDoping:", createDoping);
    doping.checked = true;
    //dopingStore.setCreatedProductDoping(createDoping);
    //setComponents(doping.doping_code, comRefs[doping.doping_code]);
    setComponents(doping.doping_code, comRefs[doping.doping_code]);
    if (comRefs[doping.doping_code].$el) {
        comRefs[doping.doping_code].$el.value = undefined
    }
}

const goTo = () => {
    dopingStore.setSelectedDopings(dopings.value.filter((doping) => doping.checked));
    dopingStore.setCreatedProductDoping(createDoping);
    router.push({ name: 'doping-select-product' })
   
}


</script>

<style lang="scss" scoped>
.dopings-wrapper {
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
            justify-content: space-between;
            align-items: center;

            .doping-title {
                font-family: var(--font-medium);
                font-size: 20px;
            }
        }

        .doping-content {
            display: grid;
            grid-template-columns: 1fr 140px;
            gap: 10px;

            .doping-content-left {
                padding-top: 10px;
                font-family: var(--font-medium);
                font-size: 16px;
            }

            .doping-content-right {
                img {
                    width: 100%;
                    object-fit: cover;
                }
            }
        }
    }
}
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
    padding: 0px;
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
            align-items: flex-start;

            .doping-checkbox {
                margin-right:10px;
            }

            .doping-title {
                font-family: var(--font-medium);
                font-size: 20px;
                color: var(--primary);
            }
        }

        .doping-content {
            padding-left: 0px;

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


ion-button {
    --border-radius: 20px;
    --padding-start: 60px;
    --padding-end: 60px;
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

    ion-button {
        --border-radius: 20px;
        font-size: 16px;
    }
}
</style>
