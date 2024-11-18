import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core";
import categoryApi from "@/services/categoryApi";
import { modifyTreeList } from "@/helpers/modifyHelper";

export const useCategoryStore = defineStore("categoryStore", () => {

    const categoryMainList = useStorage<any>('category-main-list', []);
    
    // const categoryTreeList = useStorage<any>('category-tree-list', []);
    // const setCategoryTreeList = (value: any) => {
    //     categoryTreeList.value = value
    // }
    // const getCategoryTreeList = async () => {
    //     if (categoryTreeList.value.length == 0) {
    //         await getCategoryTreeListFromApi();
    //     }
    //     //console.log(categoryTreeList.value)
    //     return categoryTreeList.value
    // }

    // const getCategoryTreeListFromApi = () => {
    //     setCategoryTreeList([])
    //     return categoryApi.getCategoryTreeList()
    //         .then((res: any) => {
    //             const data: any[] = modifyTreeList(res?.data || [])
    //             setCategoryTreeList(data)
    //         })
    // }



    const setCategoryMainList = (value: any) => {
        categoryMainList.value = value
    }
    const getCategoryMainList = async () => {
        if (categoryMainList.value.length == 0) {
            await getCategoryMainListFromApi();
        }
        return categoryMainList.value
    }

    const getCategoryMainListFromApi = async () => {
        setCategoryMainList([])
        const res = await categoryApi.getMainCategories();
        console.log(res);
        setCategoryMainList(res.data.data);
    }

    return {
        getCategoryMainList,
        //setCategoryMainList,
        // setCategoryTreeList,
        //getCategoryTreeList
    }
})


