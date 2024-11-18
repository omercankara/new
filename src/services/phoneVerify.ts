import api from "./api.js"




 const phoneVerify = async (payload: any) => {
    return api.post('/auth/phone-verify', payload)    
}       

const phoneCodeVerify = async (payload: any) => {
    return api.post('/auth/phone-verify-code', payload)    
}



export default {
    phoneVerify,
    phoneCodeVerify
}