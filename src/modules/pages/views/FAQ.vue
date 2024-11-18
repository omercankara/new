<template>
    <ion-page>
        <Header/>
        <PageHeader title="Sıkça Sorulan Sorular"/>
        <ion-content class="ion-padding">
            <ion-searchbar class="header-search"
                           placeholder="Arama"
                           @ionInput="setToSearch($event)"
            />
            <div class="faq-wrapper">
                <div class="faq-item"
                     v-for="(faq, faqKey) in computedFaqs"
                     :key="faqKey"
                >
                    <div class="title">
                        {{ faq.title }}
                    </div>
                    <div class="description">
                        {{ faq.description }}
                    </div>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts"
        setup
>
    import {computed, onMounted, ref} from 'vue';
    import {IonContent, IonPage, IonSearchbar} from '@ionic/vue';
    
    // Components
    import Header from "@/components/Header.vue";
    import PageHeader from "@/components/page/PageHeader.vue";
    
    // Services
    import faqApi from "@/services/faqApi";
    
    // Data
    const loading = ref<boolean>(false);
    const search = ref<string>('');
    const faqs = ref<any[]>([]);
    
    // Function
    const getFaqs = () => {
        loading.value = true;
        return faqApi.getAll()
            .then((res: any) => {
                faqs.value = res?.data?.data ?? null;
            })
            .finally(() => {
                loading.value = false;
            })
    }
    const setToSearch = (event: any) => {
        search.value = event?.detail?.value ?? '';
    }
    
    const computedFaqs = computed(() => {
        return faqs.value.filter((faq: any) => {
            return faq.title.toLowerCase().includes(search.value.toLowerCase()) || faq.description.toLowerCase().includes(search.value.toLowerCase())
        })
    })
    
    // Data
    onMounted(() => {
        getFaqs()
    })
</script>

<style lang="scss"
       scoped
>
    .faq-wrapper {
        display: flex;
        flex-direction: column;
        padding: 10px;
        
        .faq-item {
            display: flex;
            flex-direction: column;
            padding: 20px;
            border-radius: 15px;
            background-color: var(--ion-color-light);
            margin-bottom: 10px;
            
            .title {
                font-size: 14px;
                font-family: var(--font-bold);
                margin-bottom: 5px;
            }
            
            .description {
                font-size: 14px;
                color: var(--font-bold);
            }
        }
    }
    
    ion-searchbar {
        padding-left: 10px;
        padding-right: 10px;
        --border-radius: 10px;
        --box-shadow: none;
        --background: var(--primary-gray);
    }
</style>
