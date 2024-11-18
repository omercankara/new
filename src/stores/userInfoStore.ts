import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

// Store tanımı
const useUserInfoStore = defineStore("userInfoStore", () => {
   
    const userInfo = useStorage<any>('userInfo', { });


    const setUserInfo = (value: any) => {
        userInfo.value = value; // State'i güncelle
    };
    const getUserInfo = async () => {
        return userInfo.value;
    }

    const clearUserInfo = () => {
        userInfo.value = {};
    }

    return {
        userInfo,
        setUserInfo,
        getUserInfo,
        clearUserInfo
    };
});

export default useUserInfoStore;
