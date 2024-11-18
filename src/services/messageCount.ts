import api from "./api.js"

const getMessageLength = () => {
    return api.get('messages/count')
 }
 

export default {
    getMessageLength
}