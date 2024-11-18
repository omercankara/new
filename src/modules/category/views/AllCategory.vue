<template>
    <ion-page>
        <Header />
        <PageHeader title="Kategori Seçimi" />
        <ion-content class="ion-padding">
            <div class="category-wrapper">
                <template v-if="categoriesLoading">
                    <div class="category-item loading" v-for="number in 11" :key="number">
                        <ion-skeleton-text :animated="true" class="loading-image" />
                        <ion-skeleton-text :animated="true" class="loading-title" />
                    </div>
                </template>
                <template v-else>
                    <!-- <div class="category-item ripple-parent ion-activatable" v-for="category in categoryList"
                        :key="category.id"
                        @click="router.push({ name: 'category', params: { code: category.category_code } })">
                        <img :src="category?.image" alt="category.name" />
                        <div>{{ category?.name }}</div>
                        <ion-ripple-effect type="bounded" />
                    </div> -->



                    <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
                        <ion-refresher-content></ion-refresher-content>
                    </ion-refresher>



                    <div
                        style="display: flex; align-items: center; margin-bottom: 10px; background-color: #F3F2F7; border-radius: 1vh; padding: 5px;">
                        <img src="../assets/src.png" alt="Search Icon"
                            style="margin-right: 10px; width: 7%; height: 100%;" />
                        <input type="text" placeholder=" ürün adı, kategori arayın"
                            style="width: 100%; border: none; outline: none; background: transparent;"
                            v-model="searchTerm" />
                    </div>
                    <ion-list lines="full">
                        <ion-item v-for="category in filteredCategories">
                            <div style="  width: 100%; height: 100%;     position: relative; display: flex; flex-direction: column;"
                                class="item-label"
                                @click="router.push({ name: 'category', params: { code: category.category_code } })">
                                <span style="
    margin: auto 0;
">{{ category?.name }}</span>
                            </div>
                        </ion-item>
                        <ion-item @click="suggestion">
                            <p style="margin-left:0px; color:purple; font-size:15px; font-weight:bold;">Kategori
                                Önerisinde bulun</p>
                        </ion-item>
                    </ion-list>

                    <ion-modal id="product-detail-modal" ref="suggestModal" :is-open="isSuggestModalOpen"
                        @did-dismiss="closeFirstModal">
                        <div class="wrapper">

                            <div class="modal-close-button ion-activatable ripple-parent">
                                <span> <ion-icon color="primary" @click="closeFirstModal" :icon="closeOutline"
                                        size="large" /></span>

                                <ion-ripple-effect></ion-ripple-effect>
                            </div>

                            <ion-label>
                                <div class="label2">
                                    <p>Takasimo'da <br> görmek istediginiz yeni kategoriyi önerin</p>
                                </div>
                            </ion-label>


                            <ion-grid>
                                <!-- Kategori adı -->
                                <ion-row>
                                    <ion-col size="12">
                                        <div class="input-group">
                                            <ion-label>Kategori</ion-label>
                                            <input v-model="formData.category_name"
                                                style="width: 60%; border-radius:1vh; border:none; height:30px; background-color:gainsboro;"
                                                type="text"></input>
                                        </div>
                                    </ion-col>
                                </ion-row>

                                <!-- Örnek Ürünler -->
                                <ion-row>
                                    <ion-col size="12">
                                        <div class="input-group">
                                            <ion-label>Örnek Ürünler</ion-label>
                                            <input v-model="formData.product"
                                                style="width: 60%; border-radius:1vh; border:none; height:30px; background-color:gainsboro;"
                                                type="text"></input>
                                        </div>
                                    </ion-col>
                                </ion-row>

                                <!-- Açıklama -->
                                <ion-row>
                                    <ion-col size="12">
                                        <div class="input-group">
                                            <ion-label>Açıklama</ion-label>
                                            <input v-model="formData.description"
                                                style="width: 60%; border-radius:1vh; border:none; height:30px; background-color:gainsboro;"
                                                type="text"></input>
                                        </div>
                                    </ion-col>
                                </ion-row>

                                <ion-row>
                                    <ion-col size="12">
                                        <div class="button-group">
                                            <button @click="onSecondModal" color="primary">Gönder</button>
                                        </div>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </div>
                    </ion-modal>

                    <ion-modal id="product-detail-success-modal" ref="secondModal" :is-open="isSuggestSuccesModalOpen"
                        @did-dismiss="closeSecondModal">
                        <div class="wrapper">

                            <div class="modal-close-button ion-activatable ripple-parent">
                                <span> <ion-icon color="primary" @click="closeSecondModal" :icon="closeOutline"
                                        size="large" /></span>

                                <ion-ripple-effect></ion-ripple-effect>
                            </div>
                            <div class="takasimo-logo">
                                <img src="@/assets/takasimo-icon.png" />
                            </div>


                            <ion-label>
                                <div class="label2" style="font-size: 16px;">
                                    <p style="font-size: 20px; margin-bottom: 10px;">Teşekkürler</p>
                                    <p style="margin-left:30px; color:black; font-size:15px; ">Önerin bizim için çok
                                        değerli <br>Kategori öneriniz başarıyla alınmıştır</p>
                                </div>
                            </ion-label>
                        </div>
                    </ion-modal>

                </template>
            </div>
        </ion-content>
    </ion-page>
</template>


<script lang="ts" setup>
import Header from '@/components/Header.vue';
import { IonPage, IonGrid, IonRow, IonCol, IonSearchbar, IonItem, IonModal, IonList, IonContent, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { calendarOutline, closeOutline, heart, heartOutline, timeOutline, eyeOutline, logoFacebook, logoInstagram, logoWhatsapp, mail } from 'ionicons/icons';
import { computed, onMounted, ref, watch } from 'vue';
import categoryApi from '@/services/categoryApi';


import { useRouter } from 'vue-router';
const router = useRouter();
const categoryList = ref<any[]>([]);



let formData = ref<any>({
    parent_code: null,
    category_name: '',
    product: "",
    description: "",
    status: true
});



const searchTerm = ref<string>('');
const filteredCategories = computed(() => {
    if (!searchTerm.value) {
        return categoryList.value;
    }
    return categoryList.value.filter(category =>
        category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
});




const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
        // Any calls to load data go here
        (event.target as HTMLIonRefresherElement).complete();
        categoryApi.getAllCategories(null, 17).then((res) => {
            categoryList.value = res.data.data
           
        })

    }, 2000);
};


const categoriesLoading = ref<boolean>(false);
const isSuggestSuccesModalOpen = ref<boolean>(false);
const isSuggestModalOpen = ref<boolean>(false);

onMounted(() => {
    searchTerm.value = '';
    categoryApi.getAllCategories(null, 17).then((res) => {
        categoryList.value = res.data.data
        
    })








})

const suggestion = () => {
    isSuggestModalOpen.value = true
}


const closeFirstModal = () => {
    isSuggestModalOpen.value = false
}

const closeSecondModal = () => {
    isSuggestSuccesModalOpen.value = false
}





const onSecondModal = async ()  => {
    await categoryApi.createCategorySuggestion(formData.value).then((res) => {
        console.log(res.data)
    });
    isSuggestModalOpen.value = false
    isSuggestSuccesModalOpen.value = true
    isSuggestModalOpen.value = false
    isSuggestSuccesModalOpen.value = true
}

</script>

<style lang="scss" scoped>
// .category--rapper {
//     display: grid;
//     grid-template-columns: 1fr 1fr 1fr;
//     gap: 10px;
//     margin-bottom: 20px;

//     .category-item {
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;
//         border-radius: 20px;
//         background-color: var(--primary-gray);
//         cursor: pointer;

//         &.loading {
//             background-color: var(--primary-gray);
//             padding: 8px 10px;

//             .loading-image {
//                 width: 100%;
//                 height: 124px;
//                 border-radius: 15px;
//                 margin: 0 0 5px 0;
//             }

//             .loading-title {
//                 width: 80%;
//                 height: 16px;
//                 border-radius: 10px;
//                 margin: 0;
//             }
//         }

//         img {
//             width: 100%;
//             height: 120px;
//             object-fit: cover;
//             border-radius: 10px;
//         }

//         div {
//             margin-top: 10px;
//             font-size: 13px;
//             font-family: var(--font-bold);
//             padding: 5px 10px 10px 10px;
//             text-align: center;
//         }
//     }
// }

// .ripple-parent {
//     position: relative;
//     overflow: hidden;
// }


// ion-button {
//     --background: transparent;
//     --background-hover: red;
//     --box-shadow: none;
//     --border-width: 0px;

//     ion-icon {
//         color: var(--primary);
//     }
// }

ion-list {
    margin-bottom: 30px;
    --padding-start: 0px;
    --padding-end: 0px;

    ion-item {
        --background-hover: var(--primary-gray);
        --background-hover-opacity: 1;
        --min-height: 46px;
        cursor: pointer;
        font-size: 16px;

        &::part(detail-icon) {
            opacity: 1;
            font-size: 20px;
            color: var(--primary);
        }

        .item-label {
            margin-left: 0px;
            font-size: 15px;
            font-family: var(--font-medium);
        }
    }
}

ion-modal#product-detail-modal {
    --width: 380px;
    --height: fit-content;
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 30px 10px 20px 10px;

        .modal-close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 20003;
            cursor: pointer;
            height: 32px;
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .input-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            /* Adjust this based on spacing preference */
        }

        .button-group {
            display: flex;
            align-items: center;
            justify-content: center;

            /* Adjust this based on spacing preference */
            button {
                width: 60%;
                height: 35px;
                border-radius: 1vh;
                background-color: #901B6A;
                color: white;
            }
        }

        ion-label {
            margin-right: 10px;
            /* Optional: space between label and input */
        }

        .label1 {
            font-size: 14px;
            font-family: var(--font-medium), sans-serif;
            text-align: center;
            line-height: 18px;
            margin-bottom: 10px;
        }

        .label2 {
            font-size: 18px;
            font-family: var(--font-bold), sans-serif;
            margin-bottom: 20px;
            text-align: center;
        }

        ion-button {
            --background: #d7d2d2;
            --color: var(--black);
            --padding-top: 15px;
            --padding-bottom: 15px;
            --padding-start: 60px;
            --padding-end: 60px;
            --border-radius: 30px;
            --box-shadow: none;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
        }
    }
}





ion-modal#product-detail-success-modal {
    --width: 380px;
    --height: fit-content;
    --border-radius: 30px;
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
    --overflow: visible;

    .wrapper {
        padding: 90px 10px 20px 10px;

        .takasimo-logo {
            position: absolute;
            top: -50px;
            left: calc(50% - 50px);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
            background: var(--primary);
            width: 100px;
            height: 100px;
            border-radius: 50px;
            z-index: 20003;

            img {
                width: 60px;
                height: 60px;
            }
        }

        .modal-close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 20003;
            cursor: pointer;
            height: 32px;
            width: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        ion-label {
            margin-right: 10px;
            /* Optional: space between label and input */
        }

        .label1 {
            font-size: 14px;
            font-family: var(--font-medium), sans-serif;
            text-align: center;
            line-height: 18px;
            margin-bottom: 10px;
        }

        .label2 {
            font-size: 18px;
            font-family: var(--font-bold), sans-serif;
            margin-bottom: 20px;
            text-align: center;
        }

        ion-button {
            --background: #d7d2d2;
            --color: var(--black);
            --padding-top: 15px;
            --padding-bottom: 15px;
            --padding-start: 60px;
            --padding-end: 60px;
            --border-radius: 30px;
            --box-shadow: none;
            font-family: var(--font-bold), sans-serif;
            font-size: 16px;
        }
    }
}
</style>