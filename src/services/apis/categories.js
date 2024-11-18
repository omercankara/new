import api from "../api.js"
import endpoints from "../endpoints.js"

const getList = async (page) => {
  const response = await api.get(endpoints.CATEGORIES.GET_LIST, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "parent_code", o: "=", v: null }),
      ],
      page
    },
  })
  return response.data
}

const getTreeList = async () => {
  const response = await api.get(endpoints.CATEGORIES.GET_TREE_LIST)
  return response.data
}

const getCategory = async (id) => {
  console.log(id, 'id');
  const response = await api.get(endpoints.CATEGORIES.GET_CATEGORY, {
    params: {
      filter: [
        JSON.stringify({ k: "is_deleted", o: "=", v: false }),
        JSON.stringify({ k: "parent_code", o: "=", v: id }),
      ],
    },
  })
  return response.data
}

const getCategoryProducts = async (code) => {
  const response = await api.get(endpoints.CATEGORIES.GET_CATEGORY_PRODUCTS, {
    params: {
      params: {
        filter: [JSON.stringify({ k: "is_deleted", o: "=", v: false })],
        filter: [JSON.stringify({ k: "category_code", o: "=", v: code })],
        with: ["images", "city", "district", "localities"],
      },
    }
  })
  return response.data
}

export default {
  getList,
  getTreeList,
  getCategory,
  getCategoryProducts
}
