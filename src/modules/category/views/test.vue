<template>
    sdfdsf
</template>

<!-- <template>
    <ion-page>
        <Header/>
        <PageHeader :title="computedTitle">
            <template #start-action>
                <ion-button @click="handleGoToBack()">
                    <ion-icon slot="icon-only"
                              :icon="chevronBackOutline"
                    />
                </ion-button>
            </template>
        </PageHeader>
        <ion-content>
            <ion-list lines="full">
                <ion-item v-for="(item, itemKey) in computedCategoryTreeList"
                          :key="itemKey"
                          :detail="item.hasChildren"
                          @click="handleCategory(item)"
                          button
                >
                    <div class="item-label">
                        {{ item?.name }}
                    </div>
                </ion-item>
            </ion-list>


            <ion-list lines="full" v-if="categoryParentData != null">
                <ion-item v-for="(item, itemKey) in categoryParentData"
                          :key="itemKey"
                          :detail="item.hasChildren"
                          @click="handleCategory(item)"
                          button
                >
                    <div class="item-label">
                        {{ item?.name }}
                    </div>
                </ion-item>
            </ion-list>


        </ion-content>
    </ion-page>
</template>

<script setup
        lang="ts"
>
    import {computed, onMounted, ref} from 'vue';
    import {useRoute, useRouter} from "vue-router";
    import {IonButton, IonContent, IonIcon, IonItem, IonList, IonPage} from '@ionic/vue';
    import {chevronBackOutline} from 'ionicons/icons';
    import categoryApi from '@/services/categoryApi';
    //api



    // Components
    import Header from "@/components/Header.vue";
    import PageHeader from "@/components/page/PageHeader.vue";
    
    // Stores
    import {useCategoryStore} from "@/stores/categoryStore";
    
    // Other
    const categoryStore = useCategoryStore();
    const router = useRouter();
    const route = useRoute();
    
    // Data
    const categoryTreeList = ref<any[]>([]);
    const categoryCode = ref<string>('');

    const categoryParentData=ref<any[]>([]);


    if (route.params.code) {
        categoryCode.value = route.params.code as string;
    }
    
    // Functions
    const handleGoToBack = () => {
        if (categoryCode.value === '') {
            router.push({name: 'categories'});
        }
        else {
            const parentCategory = categoryTreeList.value.find((item) => item.categoryCode === categoryCode.value)?.parentCode ?? '';
            router.push({name: 'category', params: {code: parentCategory}});
            
        }
    }
    const handleCategory = (item: any) => {
        if (item.hasChildren) {
            router.push({name: 'category', params: {code: item.categoryCode}});
        }
        else {
            router.push({name: 'category',params:{code: item.categoryCode}});
            categoryApi.getCategoriDetails(item.categoryCode).then(res => {
                console.log(res.data.data)
                // categoryParentData.value = res.data
                // console.log(categoryParentData.value.data)
            })
        }
    }
    
    
    // Computed
    const computedTitle = computed(() => {
        if (categoryCode.value === '') {
            return 'Kategori Seçimi';
        }
        return categoryTreeList.value.find((item) => item.categoryCode === categoryCode.value)?.name ?? 'Kategori Seçimi';
    })
    const computedCategoryTreeList = computed(() => {
        if (categoryTreeList.value.length === 0) {
            return [];
        }
        if (categoryCode.value === '') {
            return categoryTreeList.value.filter((item) => item.parentCode == 'root');
        }
        return categoryTreeList.value.filter((item) => item.parentCode == categoryCode.value);
    })
    
    // On Mounted
    onMounted(() => {
        categoryStore.getCategoryTreeList()
            .then((res) => {
                categoryTreeList.value = res ?? [];
                //console.log(res)
            })
    })

</script>

<style lang="scss"
       scoped
>
    ion-button {
        --background: transparent;
        --background-hover: red;
        --box-shadow: none;
        --border-width: 0px;
        
        ion-icon {
            color: var(--primary);
        }
    }
    
    ion-list {
        margin-bottom: 30px;
        --padding-start: 0px;
        --padding-end: 0px;
        
        ion-item {
            --background-hover: var(--primary-gray);
            --background-hover-opacity: 1;
            --min-height: 46px;
            cursor: pointer;
            font-size: 16px;
            
            &::part(detail-icon) {
                opacity: 1;
                font-size: 20px;
                color: var(--primary);
            }
            
            .item-label {
                margin-left: 33px;
                font-size: 15px;
                font-family: var(--font-medium);
            }
        }
    }
</style> -->