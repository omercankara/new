import api from "../api.js"
import endpoints from "../endpoints.js"

const uploadPhoto = async (formData) => {
  const response = await api.post(endpoints.PHOTO_UPLOAD.UPLOAD, formData)
  return response.data
}

export default {
  uploadPhoto,
}
