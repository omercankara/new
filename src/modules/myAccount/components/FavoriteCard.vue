<template>
    <ion-card :class="props.cardType" @click="goToProductDetail(product.product_code)">
        <div class="deActive" v-if="props.deActive"></div>
        <div class="deActiveText" v-if="props.deActive && deActiveText">
            {{ deActiveText }}
        </div>
        <img alt="Silhouette of mountains"
            :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + product.showcase_image"
            v-if="product && product.showcase_image" />
        <img alt="No Image" v-else />
        <ion-card-header>
            <ion-card-title>{{ product?.name }}</ion-card-title>
            <div class="ion-card-subtitles">
                <ion-card-subtitle>Maltepe / Istanbul</ion-card-subtitle>
                <ion-card-subtitle class="price" v-if="product && product.price">
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

// Other
const router = useRouter()

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

<style lang="scss" scoped>
ion-card {
    margin: 0;
    padding: 15px 15px 5px 15px;
    border-radius: 15px;
    background: var(--background-grey);
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

    &:hover {
        background: var(--primary);

        ion-card-title,
        ion-card-subtitle,
        ion-card-subtitle.price {
            color: var(--white);
        }
    }

    img {
        border-radius: 15px;
        width: 100%;
        height: 100px;
        object-fit: cover;
    }

    ion-card-header {
        padding: 0;

        ion-card-title {
            text-align: center;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
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
            font-size: 14px;

            &.price {
                color: var(--black);
                font-family: var(--font-medium), sans-serif;
                font-size: 18px;
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
</style>