<template>
    <ion-page>
        <Header />
        <PageHeader title="Ödeme">
            <template #start-action>
                <ion-button class="back-button" @click="handleGoToBack()">
                    <ion-icon slot="icon-only" :icon="chevronBackOutline" />
                </ion-button>
            </template>
        </PageHeader>
        <ion-content class="ion-padding">
            <ion-grid>
                <ion-row
style="background-color: white; display: flex; justify-content: flex-start; margin-bottom: 20px;">

                    <ion-col style="margin-bottom: 20px" size="4" v-for="i in selectedPlan" :key="i">
                        <ion-row>
                            <ion-col size="12">
                                <p style="margin:0; font-weight:bold; font-size:12px;">{{ i.title }}</p>
                            </ion-col>
                            <ion-col size="12">
                                <p style="margin:0; padding:10px; border-radius:5px; width: 100px; background-color: #f5f5f5;">
                                    {{ i.selectedPeriod.period_name }}</p>
                            </ion-col>
                        </ion-row>
                    </ion-col>

                    <ion-col size="4" style="border-radius: 1vh; margin-top: 4px; padding: 0; margin-bottom: 10px;">
                        <ion-row>
                            <ion-col size="12">
                                <p style="color: black; margin: 0; font-weight:bold; font-size:12px;">Ödenecek Tutar </p>
                            </ion-col>
                            <ion-col size="12">
                                <p style="color: black; margin: 0; font-size:15px;">{{ totalPrice }} ₺</p>
                            </ion-col>
                        </ion-row>
                    </ion-col>

                </ion-row>

                <div>
                    <img v-if="!token || JSON.stringify(token) === '{}'" style="width: 30px; height: 30px;" src="../../../../src/assets/loadingicon.svg">
                  
                    <div v-else class="iframe-container">
                        <iframe
                            ref="paytrIframe"
                            :src="`https://www.paytr.com/odeme/guvenli/${token}`" 
                            frameborder="0"
                            scrolling="yes">
                        </iframe>
                    </div>
                </div>
                
               
            </ion-grid>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonButton, IonContent, IonIcon, IonGrid, IonRefresher,IonSelectOption, IonSelect, IonItem, IonList, IonInput, IonCol, IonPage, IonRow, IonLabel } from '@ionic/vue';
import { chevronBackOutline, constructOutline } from 'ionicons/icons';
import { computed, onMounted, ref,watch } from 'vue';
import { usePaymentStore } from '@/stores/paymentToken';
import PageHeader from "@/components/page/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { useDopingStore } from "@/stores/dopingStore";
import Header from "@/components/Header.vue";
const dopingStore = useDopingStore();
const router = useRouter();
const route = useRoute();

const paymentToken = usePaymentStore()


const token = ref<string>('');

// Data
const productCode = ref<string>((route?.params?.code as string) ?? '');
const selectedPlan = ref<any[]>([]);

// Load plan from localStorage
const loadPlanFromLocalStorage = () => {
    const storedData = localStorage.getItem('selected-dopings');
    if (storedData) {
        selectedPlan.value = JSON.parse(storedData);
    }
}

// Total price computation
const totalPrice = computed(() => {
    return selectedPlan.value.reduce((total: number, i: { selectedPeriod: { price: number; }; }) => {
        return total + (i.selectedPeriod.price || 0);
    }, 0);
});

// Handle back navigation
const handleGoToBack = () => {
    selectedPlan.value = [];
    dopingStore.setSelectedDopings([]);
    router.replace({ name: 'doping-select-plan', params: { code: productCode.value } });
}


watch(() => route.path, (newPath) => {
    if (newPath === '') {
        //token.value = paymentToken.createdProductDoping; // Access the token here
         //loadPlanFromLocalStorage();
        console.log("watch ile gelen token", token.value);
    } else {
        // You can handle other paths if needed
        token.value = paymentToken.createdProductDoping; // Access the token here
        loadPlanFromLocalStorage();
    }
});

// On mounted, load plans and setup iframe
onMounted(async () => {
    await loadPlanFromLocalStorage(); // Ensure this function returns a Promise if it's async

    // Assuming paymentToken is an async function or requires some async operation
    token.value = await paymentToken.createdProductDoping; 
    console.log("deneme", token.value);

    // Dynamically load the iframeResizer script
    const script = document.createElement('script');
    script.src = "https://www.paytr.com/js/iframeResizer.min.js";
    script.onload = () => {
        iFrameResize({}, '#paytrIframe');
    };
    document.body.appendChild(script);
});


function iFrameResize(arg0: {}, arg1: string) {
    // This function is implemented by the loaded script.
}
</script>

<style lang="scss" scoped>
ion-button.back-button {
    --background: transparent;
    --background-hover: red;
    --box-shadow: none;
    --border-width: 0px;

    ion-icon {
        color: var(--primary);
    }
}


ion-button {
    text-transform: none;
    --padding-start: 20px;
    --padding-end: 20px;
    font-size: 14px;
}

ion-searchbar {
    padding-left: 10px;
    padding-right: 10px;
    --border-radius: 20px;
    --box-shadow: none;
    --background: var(--primary-gray);
}

ion-card {
    display: grid;
    grid-template-columns: 2fr 3fr;
    padding: 20px 20px 20px 20px;
    background: var(--primary-gray);
    border-radius: var(--border-radius-large);
    box-shadow: none;
    gap: 20px;
    align-items: center;

    .card-left {
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: var(--border-radius-large);
        }

        ion-skeleton-text.image {
            width: 100%;
            height: 140px;
            border-radius: var(--border-radius-large);
        }
    }

    .card-right {
        ion-card-title {
            font-size: 15px;
            margin-bottom: 5px;
        }

        ion-skeleton-text {
            border-radius: var(--border-radius);
            height: 20px;
            margin-bottom: 5px;

            &:nth-child(1) {
                width: 60%;
            }

            &:nth-child(2) {
                width: 50%;
            }

            &:nth-child(3) {
                width: 50%;
            }

            &:nth-child(5) {
                border-radius: 20px;
                width: 100px;
                height: 30px;
            }
        }

        .card-action {
            position: absolute;
            top: 10px;
            right: 10px;
        }
    }
}
.iframe-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height:400px;/* Set a height for the iframe container */
    overflow: auto; /* Hide overflow */
    border: 1px solid #ddd; /* Add a subtle border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    margin-top: 20px; /* Space above the iframe */
}

iframe {
    width: 100%; /* Full width */
    height: 100%; /* Full height of the container */
    border: none; /* Remove default border */
}
</style>
