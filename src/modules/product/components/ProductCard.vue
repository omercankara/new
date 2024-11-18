<template>
    <ion-card 
      :class="[props.cardType, product?.doping?.some((d: Doping) => d.title === 'Renkli Çerçeve Dopingi') ? 'doping' : 'gray-bg']"
  
        @click="goToProductDetail(product.product_code)">
        <div class="deActive" v-if="props.deActive"></div>
        <div class="deActiveText" v-if="props.deActive && deActiveText">
            {{ deActiveText }}
        </div>
        <div class="img-content">
            <img alt="Silhouette of mountains"
                :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + product.showcase_image"
                v-if="product.showcase_image" />
            <img alt="No Image" v-else />
            <!-- <p style="position: absolute; background-color: rgb(148, 27, 159); padding: 2px; text-align: center; width: 40px; color:white;  top:0px; left:30px; transform: rotate(320deg);" v-if="product.doping?.title === 'Vitrin Dopingi'">Acil</p> -->
            <img  v-if="product.doping?.some((d: Doping) => d.title === 'Acil Dopingi')" style="position: absolute; top:9px; left:-17px; width: 100px; height: 40px" src="../../../assets/acil.png" alt="">
        </div>
       
        <ion-card-header style="position: relative; ">
            <ion-card-title>{{ product?.name }} </ion-card-title>
            
            <div class="ion-card-subtitles">
                <ion-card-subtitle>{{ product.district?.name + ' / ' + product.city?.name }}</ion-card-subtitle>
                <ion-card-subtitle class="price" v-if="product.price">
                    {{ moneyFormat(product.price, product.currency) }}
                </ion-card-subtitle>
            </div>
        </ion-card-header>
    </ion-card>
 
</template>
<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/vue";
import { useRouter } from "vue-router";

// Helpers
import { moneyFormat } from "@/helpers/moneyHelpers";
import { onMounted } from "vue";

// Other
const router = useRouter()
interface Doping {
  title: string;
  // Doping nesnesi için diğer özellikler varsa buraya ekleyebilirsin
}

// Props
interface propsInterface {
    product?: any
    cardType?: string
    deActive?: boolean
    deActiveText?: string
}

const props = withDefaults(defineProps<propsInterface>(), {
    cardType: 'cover',
    deActive: false
})

// Functions
const goToProductDetail = (code: string) => {
    router.push(`/product-detail/${code}`);
}



</script>



<!--  -->
<style lang="scss" scoped>
.purple-bg {
    background-color: purple;
    color: white !important;
}

.gray-bg {
    background: var(--background-grey);
}

.purple-bg .ion-card-title,
.purple-bg .ion-card-subtitle,
.gray-bg .ion-card-title,
.gray-bg .ion-card-subtitle {
  color: white !important; /* Metinler beyaz */
}


ion-card {
    margin: 0;
    padding: 10px;
    border-radius: 15px;

    box-shadow: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .deActive {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 100;
        background: var(--white);
        opacity: 0.6;
        top: 0;
        left: 0;
        border: 1px solid var(--primary-gray);
    }

    .deActiveText {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 101;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: var(--font-bold), sans-serif;
        font-size: 20px;
        color: var(--primary);
    }

    .img-content {
        width: 100%;
        height: 116px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        border-radius: 1vh;
        // background-color: red;
        padding: 0px
    }

    img {
        border-radius: 15px;
        width: 100%;
        height: 114px;
        object-fit: contain;
        //background-color: blue;
        border-radius: 20px;
    }

    ion-card-header {
        padding: 0;
        flex-direction: column;

        ion-card-title {
            text-align: center;
            font-family: var(--font-bold), sans-serif;
            font-size: 14px;
            margin-bottom: 1px;

            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;

        }

        ion-card-subtitle {
            margin-top: 0;
            margin-bottom: 1px;
            text-align: center;
            font-family: var(--font-medium), sans-serif;
            font-size: 10px;

            &.price {
                color: var(--black);
                font-family: var(--font-medium), sans-serif;
                font-size: 16px;
                margin-bottom: 0;
            }
        }
    }

    &.list {
        flex-direction: row;
        padding: 15px;

        img {
            width: 100px;
            height: 80px;
            object-fit: cover;
        }

        ion-card-header {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: start;

            ion-card-title {
                display: flex;
                align-items: center;
                font-size: 20px;
                flex-grow: 1;
                width: 100%;
            }

            .ion-card-subtitles {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 5px;
                width: 100%;

                ion-card-subtitle {
                    font-size: 14px;
                    font-family: var(--font-medium), sans-serif;

                    &.price {
                        color: var(--primary);
                        font-family: var(--font-bold), sans-serif;
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
}

ion-card.doping {
    background: var(--primary);

    ion-card-title,
    ion-card-subtitle,
    ion-card-subtitle.price {
        color: var(--white);
    }
}
</style>