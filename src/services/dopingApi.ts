import api from "./api.js"

const getDopings = () => {
    let filter = [
        {k: "is_deleted", o: "=", v: false},
    ];
    return api.get(`dopings`, {
        params: {
            filter: JSON.stringify(filter),
        }
    })
}


const createProductDopings = async (payload:any) => {
    return await api.post('payment/get-token', payload)
}



const createOrderCode = async (payload:any) => {
    return await api.post('orders', payload)
}




export default {
    getDopings,
    createProductDopings,
    createOrderCode
}
