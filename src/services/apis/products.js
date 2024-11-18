import api from "../api.js"
import endpoints from "../endpoints.js"

const getProducts = async () => {
  const response = await api.get(endpoints.PRODUCTS.GET_PRODUCTS, {
    params: {
      filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
      with: ["images"],
    },
  })
  return response.data
}

const createProduct = async (payload) => {
  const response = await api.post(endpoints.PRODUCTS.CREATE_PRODUCT, payload)
  return response.data
}

const updateProductImages = async (payload) => {
  const response = api.post(endpoints.PRODUCTS.UPDATE_PRODUCT_PHOTOS, payload)
  return response.data
}

export default {
  getProducts,
  createProduct,
  updateProductImages
}
