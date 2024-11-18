<template>
    <ion-page content-id="main-content">
        <ion-menu menu-id="account-menu" content-id="main-content">
            <ion-content>
                <MyAccountHeader @click="closeAccountMenu()" :user="user" class="m-l-10 m-r-10" >
                    <template #close >
                        <ion-icon color="primary" :icon="closeOutline" size="large" @click="closeAccountMenu()" />
                    </template>
                </MyAccountHeader>
                
                <div class="message" v-if="user?.phone == ''" >
                    İlan ve teklif oluşturabilmek için <span>cep telefonu numarınızı ekleyin.</span>
                </div>
                <ion-list :inset="true">
                    <ion-item v-for="(accountMenuItem, accountMenuKey) in accountMenus" :key="accountMenuKey"
                        :detail="true" lines="full" :button="true" @click="accountMenuItem.handler">
                        <div slot="start">
                            <img v-if="accountMenuItem.image" :src="getImageUrl(accountMenuItem.image)"
                                :class="accountMenuItem.imageWidth" />
                        </div>
                        <ion-label>{{ accountMenuItem.title }}</ion-label>
                    </ion-item>
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-page id="main-content">
            <ion-tabs>
                <ion-router-outlet :animated="false" />
                <ion-tab-bar slot="bottom" v-show="showIonTabBar">
                    <ion-tab-button tab="tab1" @click="router.push({ name: 'home' })">
                        <img src="@/assets/tabbar/home.png" />
                        <ion-label>Vitrin</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tab2" @click="router.push({ name: 'categories' })">
                        <img src="@/assets/tabbar/categories.svg" />
                        <ion-label>Kategoriler</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tab3" @click="router.push({ name: 'product-create-category' })">
                        <div class="icon-wrapper">
                            <img src="@/assets/takasimo-icon.png" class="w-7" />
                        </div>
                        <ion-label>İlan Ver</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tab4" href="/my-ads">
                        <img src="@/assets/tabbar/ads.svg" />
                        <ion-label>İlanlarım</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tab5" @click="openAccountMenu()">
                        <img src="@/assets/tabbar/account.svg" />
                        <ion-label>Hesabım</ion-label>
                    </ion-tab-button>
                    <div class="icon-tab-bar-background"></div>
                </ion-tab-bar>
            </ion-tabs>
        </ion-page>
    </ion-page>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import useUserInfoStore from "@/stores/userInfoStore";

import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, menuController } from '@ionic/vue';

import { closeOutline } from "ionicons/icons";

// Components
import MyAccountHeader from "@/modules/myAccount/components/MyAccountHeader.vue";

// Helpers
import { getImageUrl } from "@/assets/helpers/getImageUrl";

// Services

// Other
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();


// Data
const accountMenus = ref<any[]>([
    {
        title: 'Öne Çıkar',
        image: "account/star.png",
        handler: () => {
            closeAccountMenu();
            router.push('/dopings');
        }
    },
    {
        title: 'Profil Bilgilerim',
        image: "account/account.png",
        handler: () => {
            closeAccountMenu();
            router.push("/profile")
        }
    },
    {
        title: 'İlanlarım',
        image: "account/products.png",
        handler: () => {
            closeAccountMenu();
            router.push('/my-ads');
        }
    },
    {
        title: 'Tekliflerim',
        image: "account/hand-shake.png",
        handler: () => {
            router.push('messages')
            closeAccountMenu()
        }
    },
    {
        title: 'Mesajlarım',
        image: "account/chat.png",
        imageWidth: "w-8",
        handler: () => {
            router.push('messages')
            closeAccountMenu()
        }
    },
    {
        title: 'Favorilerim',
        image: "account/heart.png",
        handler: () => {
            closeAccountMenu();
            router.push('/my-favorites');
        }
    },
    {
        title: 'Bildirimler',
        image: "account/bell.png",
        handler: () => {
            closeAccountMenu();
            router.push('/my-notifications');
        }
    },
    {
        title: 'Nasıl Çalışır?',
        image: "account/question.png",
        handler: () => {
            closeAccountMenu();
            router.push('/how-it-works');
        }
    },
    {
        title: 'Takasimo Destek',
        image: "account/takasimo-icon-color.png",
        handler: () => {
            closeAccountMenu();
            router.push('/support');
        }
    },
    {
        title: 'Çıkış Yap',
        image: "account/logout.svg",
        handler: () => {
            closeAccountMenu()
            authStore.accessTokenClear()
            authStore.userClear()
            router.push('/login')

            if (router.currentRoute.value.name != 'home') {
                router.push('/home')
            }
        }
    }
])

interface PhoneVerifiedAt {
   phone_verified_at: string
}

interface User {
    email?: string; // Bu bir string olmalı, düzeltildi
    name?: string;
    phone?: string;
    photo?: string;
    user_code?: string;
    phone_verified_at?: PhoneVerifiedAt;
}

const user = ref<User>({
    email: '',
    name: '',
    phone: '',
    user_code: '',
    photo: '',
    
});

const userProfile = () => {
    closeAccountMenu()
    //router.push({ name: 'userDetails', params: { code: user.value.user_code } });
}


// Functions
const openAccountMenu = async () => {
    if (authStore.isAuthenticated()) {
        await menuController.open('account-menu');
    }
    else {
        router.push('/login')
    }
}
const closeAccountMenu = async () => {
    await menuController.close('account-menu');
}

// Computed
const showIonTabBar = computed(() => {
    if (route.name) {
        return ['login', 'register', 'product-create', 'product-detail', 'dopings', 'doping-select-product', 'doping-select-plan'].indexOf(route.name as string) === -1;
    }
    return true;
})



const getLocalStorageItem = () => {
    let item = localStorage.getItem('user');
    if (item) {
        try {
            const data = JSON.parse(item) as User;
            user.value = data;
            console.log("user",user.value);
        } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
        }
    }
}

watch(() => route.path, (newPath) => {
    if (newPath === '/home') {
        getLocalStorageItem()
    }
});


onMounted(() => {
  getLocalStorageItem()
  //console.log("header",user.value)
});






</script>

<style lang="scss" scoped>
ion-tab-bar {
    display: flex;
    justify-content: space-between;
    align-items: end;
    width: 100%;
    position: relative;
    background: transparent;
    border: none;
    contain: none;

    ion-tab-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        flex: 1;
        cursor: pointer;
        background: transparent;
        height: 55px;

        img {
            width: 16px;
            margin-bottom: 5px;
        }

        ion-label {
            font-size: 12px;
            color: #000000;
            padding-bottom: 7px;
        }

        &:nth-child(3) {
            height: 112px;

            .icon-wrapper {
                background-color: var(--primary);
                border-radius: 50%;
                width: 55px;
                height: 55px;
                position: absolute;
                bottom: 25px;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 35px;
                    margin: 0;
                    padding: 0;
                }
            }
        }
    }

    .icon-tab-bar-background {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 55px;
        background: #fff;
        z-index: -1;
        border-top: 1px solid #dfdede;
    }
}

ion-menu {
    --width: 100%;
    --height: 100vh;
    top: 0px;

    ion-icon {
        svg {
            width: 60px;
            height: 60px;
        }
    }

    .message {
        padding: 30px;
        background-color: #f3f2f7;
        font-family: var(--font-regular), serif;
        font-size: 14px;
        border-top: 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;

        span {
            color: var(--primary);
            font-family: var(--font-bold), serif
        }
    }

    ion-item {
        --color: #000;
        cursor: pointer;

        img {
            width: 26px;
            margin-right: 10px;
            margin-top: 2px;
        }
    }
}
</style>
