<template>
    <ion-page>
        <Header />
        <ion-content>
            <ion-grid>
                <ion-row style="margin-bottom: 30px;">
                    <ion-col size="2" style="position: relative; display: inline-block;">
                        <img v-if="photo == null" src="@/assets/no-avatar.png" alt="Avatar"
                            style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
                        <img v-else :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + photo"
                            style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
                        <img v-if="isEditButton" @click="profilSection = !profilSection" src="@/assets/edit.png"
                            alt="Edit"
                            style="position: absolute; bottom: 10px; right: 4px; width: 20px; height: 20px; cursor: pointer;" />
                    </ion-col>



                    <ion-col size="10" class="userInfo">
                        <ion-label style="font-weight: bold; margin-left: 5px; display: flex;  margin-bottom: 8px;">
                            <p style="margin-right: 15px;">{{ name }} </p>
                            <ion-icon color="primary" style="margin-top: 0px; font-size:20px;" :icon="heart"
                                v-if="isLiked == true" @click="deleteFavorites()" />
                            <ion-icon color="primary" :icon="heartOutline" style="margin-top: 0px; font-size:20px;"
                                v-if="isLiked == false" @click="addFavorite()" />
                        </ion-label>
                        <ion-label style="font-size: 11px; margin-left: 5px">Doğrulanmış kullanıcı</ion-label>

                    </ion-col>
                </ion-row>

                <ion-row style="margin-bottom: 10px;">
                    <ion-col size="12" style="background-color: #F3F2F7; padding-left: 30px;">
                        <ion-label style="font-weight: bold;">Kullanıcının tüm İlanları</ion-label>
                    </ion-col>
                </ion-row>

                <ion-row style="margin-bottom: 10px;">
                    <ion-col size="12"
                        style="background-color: #F3F2F7; border-radius: 1vh; height: 35px; padding-left: 30px; position: relative;">
                        <img src="../assets/search.png" alt=""
                            style="position: absolute; left: 10px; top: 35%; transform: translateY(-50%); height: 50px;">
                        <input v-model="searchQuery" placeholder="Ürün ara..."
                            style="font-weight: bold; height: 100%; border: none; background-color: transparent; width: 100%; outline: none; padding-left: 30px;">
                        </input>
                    </ion-col>
                </ion-row>

                <ion-row>
                    <ion-col v-for="(product, productKey) in filteredProducts" :key="productKey" size="6">
                        <ProductCard :product="product" />
                    </ion-col>
                </ion-row>

                <div v-if="profilSection"
                    style="position: fixed; display: flex; align-items: center; justify-content: flex-start; width: 100%; bottom: 0; background-color: #F3F2F7; height: 70px; padding: 10px;"
                    @click="openFileInput">
                    <img style="height: 20px; margin-top: -10px; margin-right: 10px;" src="@/assets/uploads.png"
                        alt="Upload Icon" />
                    <p style="margin-top: 0; font-size: 14px;">Profil Fotoğrafı Yükle</p>
                    <!-- Gizli dosya yükleme inputu -->
                    <input accept="image/jpeg,image/png,image/jpg" multiple style="display: none;" ref="fileInput"
                        @change="mountImages($event)" type="file" />
                </div>

            </ion-grid>
        </ion-content>

    </ion-page>
</template>



<script lang="ts" setup>
import { IonPage, IonGrid, IonRow, IonCol, IonContent, IonLabel } from '@ionic/vue';
import { calendarOutline, closeOutline, heart, heartOutline, timeOutline, eyeOutline, logoFacebook, logoInstagram, logoWhatsapp, mail } from 'ionicons/icons';
import Header from '@/components/Header.vue';
import { computed, onMounted, ref } from 'vue';
import productApi from '@/services/productApi';
import { useRoute } from "vue-router";
import ProductCard from '@/modules/product/components/ProductCard.vue';
import favoritesApi from '@/services/favoritesApi';


const isLiked = ref<boolean>(false);
let route = useRoute();
let routeParams = ref<string>(route.params.code as string);


let userInfo = {
    product_code: null,
    search: null,
    seller_code: "290f0ba0-852c-41e4-b23a-bbe0b0c85d1c",
    is_deleted: false
}

const profilSection = ref<boolean>(false);

import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import userEditApi from '@/services/userEditApi';
import authApi from '@/services/authApi';
const $toast = useToast();

const addFavorite = () => {
    isLiked.value = !isLiked.value
    favoritesApi.favoritesSettings(userInfo).then((res) => {
        console.log(res)
    })
    $toast.success("Favorilere eklendi", { position: 'top' });
}

const deleteFavorites = () => {
    isLiked.value = !isLiked.value
}

const isEditButton = ref<boolean>(false);

//Data
let name = ref<string>('');
let photo = ref<string>('');
let products = ref<any>([]);
let searchQuery = ref<string>('');

onMounted(() => {
    // route.params.code değerini string olarak tanımlama

    interface User {
    user_code: string; // 'user_code' özelliği olmalı
    // Diğer kullanıcı verileri burada olabilir...
}
let item: string = String(route.params.code);

productApi.getOwnerProducts(item).then(res => {
   

    userInfo.seller_code = res.data.data[0].owner.user_code
    console.log("owner",userInfo.seller_code)
    console.log(userInfo)
    name.value = res.data.data[0].owner.name
    photo.value = res.data.data[0].owner.photo
    let items = res.data.data;
    products.value = items.map((element: any) => element.product); // product dizisini atama

    async function fetchUserData() {
    try {
        // 'user' verisini localStorage'dan al
        let item = localStorage.getItem("user");

        // Eğer localStorage'da 'user' verisi yoksa, hata mesajı göster ve fonksiyonu sonlandır
        if (!item) {
            console.error("User verisi localStorage'da bulunamadı.");
            return;
        }

        // item'i User türüne göre parse et
        const parsedItem: User = JSON.parse(item);

        // localStorage'dan alınan 'user_code' değerini al
        const userCode = parsedItem.user_code;
        console.log("User Code from localStorage:", userCode); // Konsola 'user_code' yazdır

        // API çağrısını yap
        const res = await authApi.me();
        console.log("x",res.data)
        
        // API'den dönen veriyi kontrol et
        if (res.data.user_code === userInfo.seller_code) {
            // Eğer API'den gelen user_code ile localStorage'dan alınan user_code eşleşiyorsa
           
            console.log("seller", userInfo.seller_code)
            isEditButton.value = true; // 'isEditButton' butonunu aktif et
        } else {
            // Eğer eşleşmiyorsa, buton aktif olmasın
            isEditButton.value = false;
        }

    } catch (error) {
        console.error("Kullanıcı verisini alırken bir hata oluştu:", error); // Hata mesajını logla
        isEditButton.value = false; // Hata durumunda butonu pasif yap
    }
}


    // Call the function to execute
    fetchUserData();
}).catch(err => {
    console.error("API hatası:", err);
});






});



const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase();

    // Arama sorgusu boşsa, orijinal ürünleri döndür
    if (!query) {
        return products.value;
    }

    // Arama sorgusu varsa, filtreleme işlemi yap
    return products.value.filter((product: { name: string; }) => {
        return product.name.toLowerCase().includes(query);
    });
});

const uploadFiles = ref<FileList | null>(null);
const openFileInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg';
    input.multiple = true;
    input.style.display = 'none';
    input.onchange = (event: Event) => {
        mountImages(event);
    };
    document.body.appendChild(input);
    input.click();
};


const mountImages = (event: Event) => {

    const formImagesData = new FormData();
    // const uploadFiles = ref<FileList | null>(null); // uploadFiles'e uygun tür
    uploadFiles.value = (event.target as HTMLInputElement).files;
    if (uploadFiles.value) {
        for (let i = 0; i < uploadFiles.value.length; i++) {
            const reader = new FileReader();
            const file = uploadFiles.value[i];
            formImagesData.append('images[]', file);
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64Image = reader.result as string;
                formImagesData.append('images[]', base64Image);
            };
        }

        ;
        productApi.productImageCreate(formImagesData)
            .then((response: { data: { files: any; }; }) => {
                try {
                    let item = response.data.files;
                    let photo = {
                        photo: response.data.files[0].original
                    }
                    userEditApi.editUser(photo).then(res => {
                        console.log("edit", res)
                    })

                    $toast.success("Profil resmi yüklendi", { position: "top-right" });


                } catch (error) {
                    $toast.error("Bu Dosya Türü Desteklenmemektedir.", {
                        position: "top-right",
                    });
                    alert("bu dosya türü desteklenmiyor")
                    console.error('Veri işleme sırasında bir hata oluştu:', error);

                }
            })
            .catch((error: { response: { status: number; }; }) => {
                if (error.response && error.response.status === 401) {
                    // 401 hatası alındığında giriş sayfasına yönlendir

                } else {
                    $toast.error("Bu Dosya formatında resim yükleme desteklenmiyor", {
                        position: "top-right",
                    });
                    console.error('Yükleme işlemi sırasında bir hata oluştu:', error);
                }


            });
    }
};


</script>





<style scoped>
.userInfo {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
}
</style>