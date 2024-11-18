import api from "./api.js"

const getAll = () => {
    return api.get('faq', {
        params: {
            filter: [JSON.stringify({k: "is_deleted", o: "=", v: false})],
        }
    })
}

export default {
    getAll
}
