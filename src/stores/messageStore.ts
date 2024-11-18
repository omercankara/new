import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

// Message Store
export const useMessageStore = defineStore("messageStore", () => {
    // `messages` için tip güvenliğini artırdık
    const messages = useStorage<string[]>('messages', []);
    const messageCount = ref<number | null>(null);

    const setMessageCount = (count: number) => {
        messageCount.value = count;
        //console.log(count)
        //console.log("mesaj sayısı",messageCount.value)
    };

    // `message_code` tipini string olarak değiştirdik, `any` yerine
    const messageSet = (message_code: string) => {
        // messages dizisini sıfırla ve yalnızca en son gelen message_code'u ekle
        messages.value = [message_code];
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
    return { messages,messageCount, messageSet, userInfo, setUserInfo,setMessageCount };
});
