import api from "./api.js"


const getCity = async () => {
    return api.get('cities', {
        params: {
            filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
            limit:100
        
        }
    })
}

const getDistrict = async (cityCode: any) => {
    return api.get('districts', {
        params: {
            filter: [JSON.stringify({ k: "city_code", o: "=", v: `${cityCode}` })],
            limit:100
        }
    })
}

const getLocalizitions = async (localityCode: any) => {
    return api.get('localizations', {
        params: {
            filter: [JSON.stringify({ k: "district_code", o: "=", v: `${localityCode}` })],
            limit:100
        }
    })
}


export default {
    getCity,
    getDistrict,
    getLocalizitions
}