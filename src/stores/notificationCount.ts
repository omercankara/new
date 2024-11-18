import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

// Message Store
export const useNotificationStore = defineStore("notificationStore", () => {
    // `notifications` için tip güvenliğini artırdık
    const notifications = useStorage<string[]>('notifications', []);
    const notificationCount = ref<number | null>(null);

    const setNotificationsCount = (count: number) => {
        notificationCount.value = count;
        //console.log(count)
        //console.log("mesaj sayısı",messageCount.value)
    };

    // `message_code` tipini string olarak değiştirdik, `any` yerine
    const notificationset = (message_code: string) => {
        // notifications dizisini sıfırla ve yalnızca en son gelen message_code'u ekle
        notifications.value = [message_code];
    };

    // `userInfo` arayüzü ile kullanıcı bilgilerini tanımladık
    interface UserInfo {
        product_code: string;
        image: string;
        _to: string;
        user_code?: string;
    }

    // `user_code` değişkeninin adını `userInfo` olarak değiştirdik ve tip güvenliğini artırdık
    const userInfo = useStorage<UserInfo[]>('userInfo', []);

    // `productCodes` parametresinin tipi `UserInfo` olarak belirledik
    const setUserInfo = (userInfoArray: UserInfo[]) => {
       userInfo.value = userInfoArray;
    };

    // Fonksiyonları ve değişkenleri dışa aktarıyoruz
    return { notifications,notificationCount, notificationset, userInfo, setUserInfo,setNotificationsCount };
});
