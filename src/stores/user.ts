import { defineStore } from "pinia"
import { ref } from "vue"

export const useUserStore = defineStore("user", () => {
  const user = ref(null)
  const categoriesPageType = ref("default")


  return { user, categoriesPageType }
})
