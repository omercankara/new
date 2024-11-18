import { orderBy } from "lodash"
import api from "./api.js"



const sendMessage = async (payload: any) => {
    return api.post('messages', payload)
}
const sendSingleMessage = async (payload: any) => {
    return api.post('message-detail', payload)
}

const getMessageList = async () => {

    let orderBy = [
        `{"k":"created_at","v":"DESC"}`
    ];
    
    return api.get(`messages`, {
        params: {
            orderBy: orderBy
            
        }
    })
}


const getMessageDetails = async (payload: any, messageCode: any) => {
    let filter = [
        `{"k": "message_code", "o": "=", "v": "${payload}"}`,
    ]

    return api.get(`messages`, {
        params: {
            //filter: filter,
        }
    })
}

const getChatDetails = async (page: any, payload: any) => {
    let filter = [
        `{"k": "message_code", "o": "=", "v": "${payload}"}`,
    ],
        orderBy = [`{"k":"created_at","v":"ASC"}`]


    return api.get(`message-detail?page=${page}`, {
        params: {
            filter: filter,
            orderBy: orderBy
        }
    })
}



const updateSwapStatus = async (payload: any) => {
    return api.put('message-detail', payload)
}




const deleteMessage = async (payload: any) => {
    return api.put('messages', payload);
};





export default {
    sendMessage,
    getMessageList,
    getMessageDetails,
    getChatDetails,
    sendSingleMessage,
    updateSwapStatus,
    deleteMessage
}