import messageApi from "@/services/messageApi";
import { useMessageStore } from "@/stores/messageStore";
import { useAuthStore } from "@/stores/authStore";
import { ref } from "vue";

export const store = useAuthStore();
let messageCount = ref<number>(0)
export const FetchMessageList = async () => {
    try {
        const response = await messageApi.getMessageList();
        const messages = response.data.data;

        //console.log("Mesaj Sayısı:", messages.length);

        const allFilteredDetails = []; // Tüm filtrelenmiş detayları saklayacak dizi

        // Mesajlar içinde döngü
        for (const message of messages) {
            const messageCode = message.message_code; // Mesajın messageCode değerini al
            //console.log("Mesaj Kodu:", messageCode);

            // GetChatDetails API'sini çağır
            const detailResponse = await messageApi.getChatDetails(1, messageCode);
            //console.log("dsgfsdfg", detailResponse.data.data)

            // Detayları kontrol et
            //console.log("Mesaj Detayları:", detailResponse.data.data);

            // Detaylar varsa filtreleme yap
            if (detailResponse.data && detailResponse.data.data) {
                const filteredDetails = detailResponse.data.data.filter((detail: { _from: any; offer_detail: { readStatus: boolean; }; }) =>
                    detail._from !== store.user.user_code && detail.offer_detail?.readStatus === false
                );

                // Filtrelenmiş detayları genel diziye ekle
                allFilteredDetails.push(...filteredDetails);
                messageCount.value = allFilteredDetails.length
                useMessageStore().setMessageCount(allFilteredDetails.length);
            } else {
                console.warn("Detaylar bulunamadı veya beklenmedik bir yapı var:", detailResponse.data);
            }
        }
      

        // console.log("Tüm User Code'a eşit olmayan ve readStatus'u true olan detaylar:", allFilteredDetails);
    } catch (error) {
        console.error("Hata:", error);
    }
};