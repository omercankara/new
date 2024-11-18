import api from "../api.js"
import endpoints from "../endpoints.js"

const getFQA = async () => {
  const response = await api.get(endpoints.PROFILE.SUPPORT.GET_FAQ, {
    params: {
      filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
    },
  })
  return response.data
}

const getFavoriteProducts = async () => {
  const response = await api.get(endpoints.PROFILE.GET_FAVORITES, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "product_code", o: "!=", v: null }),
      ],
      with: ["products"],
    },
  })
  return response.data
}

const getFavoriteSearches = async () => {
  const response = await api.get(endpoints.PROFILE.GET_FAVORITES, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "search", o: "!=", v: null }),
      ],
    },
  })
  return response.data
}

const getFavoriteSellers = async () => {
  const response = await api.get(endpoints.PROFILE.GET_FAVORITES, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "seller_code", o: "!=", v: null }),
      ],
    },
  })
  return response.data
}

export default {
  getFQA,
  getFavoriteProducts,
  getFavoriteSearches,
  getFavoriteSellers,
}
