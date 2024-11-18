<template>
    <ion-page>
        <Header />
        <PageHeader title="Mesajlar" />
        <ion-segment :value="selectedTab" @ionChange="changeTab">
            <ion-segment-button :value="tab.value" v-for="(tab, tabKey) in tabs" :key="tabKey">
                <ion-label>{{ tab.label }}</ion-label>
            </ion-segment-button>
        </ion-segment>
        <ion-content>
            <ion-list lines="full">
                <ion-item-sliding>
                    <ion-item-options class="start-options" side="start">
                        <ion-item-option class="unread" color="primary" expandable>
                            Okunmadı Olarak İşaretle
                        </ion-item-option>
                    </ion-item-options>
                    <ion-item :detail="true">
                        <div class="item-wrapper">
                            <div class="item-left">
                                <img src="https://picsum.photos/300/200">
                            </div>
                            <div class="item-center">
                                <div class="user-name">
                                    Ali Öztürk
                                </div>
                                <div class="product-name">
                                    asasdasd
                                </div>
                                <div class="date-time">
                                    <span>12.12.2021</span>
                                    <span>12:12</span>
                                </div>
                            </div>
                            <div class="item-action">
                                <ion-buttons slot="primary">
                                    <ion-button @click="showItemAction(1)">
                                        <ion-icon slot="icon-only" :icon="ellipsisHorizontal" />
                                    </ion-button>
                                </ion-buttons>
                            </div>
                        </div>
                    </ion-item>
                    <ion-item-options side="end">
                        <ion-item-option class="add-favorite" color="primary" expandable>
                            <ion-icon :icon="star" />
                            Yıldızla
                        </ion-item-option>
                    </ion-item-options>
                </ion-item-sliding>
            </ion-list>
            <ion-action-sheet :is-open="itemActionStatus" :buttons="itemActions"
                @didDismiss="itemActionStatus = false" />
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonItemOptions, IonItemOption, IonItemSliding, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, IonActionSheet } from '@ionic/vue';
import { ellipsisHorizontal, star } from "ionicons/icons";

// Components
import Header from "@/components/Header.vue";
import PageHeader from "@/components/page/PageHeader.vue";
import messageApi from '@/services/messageApi';

// Data
const selectedTab = ref<string>('all');
const tabs = ref<any[]>([
    {
        value: 'all',
        label: 'Hepsi'
    },
    {
        value: 'incoming',
        label: 'Gelen Teklifler'
    },
    {
        value: 'outcoming',
        label: 'Giden Teklifler'
    }
])

const itemActions = [
    {
        text: 'Düzenle',
        data: {
            action: 'edit'
        }
    },
    {
        text: 'Sil',
        data: {
            action: 'delete'
        }
    }
];
const itemActionId = ref<number | null>(null);
const itemActionStatus = ref(false);

// Function
const changeTab = (e: any) => {
    selectedTab.value = e?.detail?.value;
}
const showItemAction = (id: number) => {
    itemActionId.value = id;
    itemActionStatus.value = true;
}

// OnMounted
onMounted(() => {

})  
</script>

<style lang="scss" scoped>
ion-segment {
    --background: var(--white);

    ion-segment-button {
        --indicator-height: 4px;
        text-transform: none;
        letter-spacing: 0;
        font-family: var(--font-medium), sans-serif;
        color: var(--black);
        border-bottom: 1px solid #e9e9e9;
        border-radius: 0;
        font-size: 16px;

        ion-label {
            --margin-top: 8px;
            --margin-bottom: 8px;
        }
    }
}

ion-item {
    --background: var(--primary-gray);
    --padding-start: 15px;
    position: relative;

    .item-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
        justify-content: space-between;
        padding-top: 7px;
        padding-bottom: 2px;

        .item-left {
            padding: 0;

            img {
                width: 140px;
                height: 100px;
                object-fit: cover;
            }
        }

        .item-center {
            flex-grow: 1;

            .user-name {
                font-size: 18px;
                font-family: var(--font-bold);
                color: var(--black);
            }

            .product-name {
                font-size: 14px;
                font-family: var(--font-medium);
                color: var(--black);
                margin-bottom: 5px;
            }

            .date-time {
                font-size: 12px;
                font-family: var(--font-regular);
                color: var(--black);
                display: flex;
                gap: 5px;
            }
        }

        .item-action {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}

.unread {
    text-transform: none !important;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    font-size: 18px;
}

.add-favorite {
    text-transform: none !important;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    font-size: 18px;

    ion-icon {
        margin-right: 10px;
        margin-bottom: 3px;
    }
}
</style>
