<template>
    <div class="my-account-header">
        <div class="my-account-avatar" >
            <img v-if="user.photo == null || user.photo == ''"     
                             src="@/assets/no-avatar.png" 
                             alt="Avatar" 
                             style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
                        <img v-else   
                             :src="'https://takasimos3.s3.eu-north-1.amazonaws.com' + user.photo"
                             style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
        </div>
        <div @click="router.push({ name: 'userDetails', params: { code: user?.user_code } })" style="width: 50%;" >
            <div  class="font-size-18 is-font-bold">
               {{user?.name}}
             
            </div>
            <div>
                <a class="text-primary mt-1">
                    Takasimo Profili
                </a>
            </div>
        </div>
        <div class="my-account-close">
            <slot name="close" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { ref, onMounted, watch } from 'vue';



interface User {
    email?: string;
    name?: string;
    phone?: string;
    user_code?: string;
    photo?: string;
    
}

const props = defineProps<{
    user?: User;
}>();

const user = ref<User>(props.user || {}); 

watch(() => props.user, (newUser) => {
    user.value = newUser || {}; 
}, { immediate: true }); 


console.log("sdf",user.value)




</script>

<style lang="scss" scoped>
.my-account-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    .my-account-avatar {
        img {
            width: 70px;
            height: 70px;
            border-radius: 50%;
        }
    }

    .my-account-close {
        cursor: pointer;
    }
}
</style>
