import { filter } from "ionicons/icons";
import api from "./api.js"

//ilan oluşturmadan geliyorsa buranın limit 100 olcak,

//kategorilerden gidiyorsa 11 olarak gidicek
const getMainCategories = () => {
    let filter = [
        '{"k": "is_deleted", "o": "=", "v": false}',
        '{"k": "parent_code", "o": "=", "v": null}'
    ];
    return api.get(`categories`, {
        params: {
            filter: (filter),
            limit: 11,
            orderBy: [
                '{"k": "sequence", "v": "asc"}',
                '{"k": "name", "v": "asc"}',
            ],

            //with: ["images"]
        }
    })
}




const getSearchCategoryResult = (searchText: string) => {
    return api.get(`categories`, {
        params: {
            filter: [
                `{"k": "name", "o": "like", "v": "%${searchText}%"}`
            ],
            orderBy: ['{"k": "created_at", "v": "ASC"}'],
            with: ['children']
        }
    })
}

const getProductCreateMainCategories = () => {
    let filter = [
        '{"k": "is_deleted", "o": "=", "v": false}',
        '{"k": "parent_code", "o": "=", "v": null}'
    ];
    return api.get(`categories`, {
        params: {
            filter: (filter),
            limit: 1000,
            orderBy: [
                '{"k": "sequence", "v": "asc"}',
                '{"k": "name", "v": "asc"}',
            ],
            //with: ["images"]
        }
    })
}



const getCategoryTreeList = () => {
    return api.get(`categories/get-tree-list`)
}


const getCategoriDetails = (category_code: any) => {
    if (category_code == '') {
        category_code = null
    }
    let filter = [
        '{"k": "is_deleted", "o": "=", "v": false}',
        `{"k": "parent_code", "o": "=", "v": "${category_code}"}`
    ];


    return api.get('categories?limit=1000', {
        params: {
            filter: filter,
            orderBy: [
                '{"k": "sequence", "v": "asc"}',
                '{"k": "name", "v": "asc"}',
            ],
            with: ['children']
        }
    });
};


const getHeaderTitle = (category_code: any) => {
    if (category_code == '') {
        category_code = null
    }
    let filter = [
        '{"k": "is_deleted", "o": "=", "v": false}',
        `{"k": "category_code", "o": "=", "v": "${category_code}"}`
    ];


    return api.get('categories?limit=1000', {
        params: {
            filter: filter,
            orderBy: [
                '{"k": "sequence", "v": "asc"}',
                '{"k": "name", "v": "asc"}',
            ],
            with: ['children']
        }
    });
};




const getAllCategories = (parentCode: null, limit: 17) => {
    let filter = [
        `{"k": "parent_code", "o": "=", "v": ${parentCode}}`
    ];

    return api.get('categories', {
        params: {
            limit: limit,
            filter: filter,
            orderBy: [
                '{"k": "sequence", "v": "asc"}',
                '{"k": "name", "v": "asc"}',
            ],
        }
    })
}

const createCategorySuggestion = (payload: any) => {
    return api.post(`category-suggest`, payload)
}



export default {
    getCategoryTreeList,
    getMainCategories,
    getCategoriDetails,
    getAllCategories,
    getProductCreateMainCategories,
    getHeaderTitle,
    getSearchCategoryResult,
    createCategorySuggestion
}
