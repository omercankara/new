import api from "./api.js"

const homepageSlider = (code:string) => {
    return api.get(`sliders/${code}`, {
        params: {
            filter: [JSON.stringify({k: "is_deleted", o: "=", v: false})],
            with: ["images"]
        }
    })
}
export default {
    homepageSlider,
}
