
import api from "./api.js"


const getNotification = (page:any) => {
   return api.get(`notifications?page=${page}`)
}

const getNotificationCount = () => {
    return api.get('notifications/count')
 }

export default {
    getNotification,
    getNotificationCount
}