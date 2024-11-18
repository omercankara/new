import api from "./api";


const payment = async (payload: any) => {    
    return api.post('/doping/pay', payload)
}

export default {
    payment
}