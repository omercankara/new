import api from "../api.js"
import endpoints from "../endpoints.js"

const getCities = async () => {
  const response = await api.get(endpoints.MISC.GET_CITIES, {
    params: {
      filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
    },
  })
  return response.data
}

const getDistricts = async (id) => {
  const response = await api.get(endpoints.MISC.GET_DISTRICTS, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "city_code", o: "=", v: id }),
      ],
    },
  })
  return response.data
}

const getLocalities = async (id) => {
  const response = await api.get(endpoints.MISC.GET_LOCALITIES, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "district_code", o: "=", v: id }),
      ],
    },
  })
  return response.data
}

export default {
  getCities,
  getDistricts,
  getLocalities,
}
