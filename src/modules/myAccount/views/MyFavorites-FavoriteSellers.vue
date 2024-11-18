<template>
    <ion-list lines="full">
        <ion-item-sliding v-for="(user, userKey) in users" :key="userKey">
            <ion-item>
                <img src="@/assets/no-avatar.png" class="avatar">
                <ion-label @click="handleGoToProfile(user)" v-if="user && user.name" >{{ user.name }} </ion-label>
            </ion-item>
            <ion-item-options>
                <ion-item-option color="danger">Delete</ion-item-option>
            </ion-item-options>
        </ion-item-sliding>
    </ion-list>
</template>

<script lang="ts" setup>
import router from '@/router';
import favoritesApi from '@/services/favoritesApi';
import { IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonItem, IonList } from '@ionic/vue';
import { onMounted, ref } from 'vue';


// Data
const users = ref<any[]>([

]);

const handleGoToProfile = (user: any) => {
    console.log(user.user_code)

    router.push({ name: 'userDetails', params: { code: user.user_code } });
}

//functions
const getFavoritesSeller = () => {
    return favoritesApi.getFavoritesSeller()
        .then(res => {
            let item = res.data.data;
            item.forEach((element: any) => {
                if (element.seller !== null) { // Null kontrolü
                    users.value.push(element.seller);         
                }
            });
        });
}



// OnMounted
onMounted(() => {
    getFavoritesSeller()
    console.log(users.value)
})
</script>

<style lang="scss" scoped>
ion-list {
    padding-top: 0;
    padding-bottom: 0;

    ion-item {
        --inner-padding-top: 10px;
        --inner-padding-bottom: 10px;

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }
}
</style>
