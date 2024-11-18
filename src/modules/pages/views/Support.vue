<template>
    <ion-page>
        <Header/>
        <PageHeader title="Takasimo Destek"/>
        <ion-content>
            <div class="box-wrapper">
                <div class="box ripple-parent ion-activatable"
                     @click="router.push('/faq')"
                >
                    <div class="icon">
                        <img src="@/assets/sss.svg">
                    </div>
                    <div class="title">
                        Sıkça Sorulan Sorular
                    </div>
                    <ion-ripple-effect type="bounded"/>
                </div>
                <div class="box ripple-parent ion-activatable">
                    <div class="icon">
                        <img src="@/assets/support.svg">
                    </div>
                    <div class="title">
                        Destek<br>
                        --Buraya telefon eklenecek--
                    </div>
                    <ion-ripple-effect type="bounded"/>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="ts"
        setup
>
    import {useRouter} from "vue-router";
    import {IonContent, IonPage, IonRippleEffect} from '@ionic/vue';
    
    // Components
    import Header from "@/components/Header.vue";
    import PageHeader from "@/components/page/PageHeader.vue";

    // Other
    const router = useRouter();
</script>

<style lang="scss"
       scoped
>
    ion-content {
        --padding-start: 30px;
        --padding-end: 30px;
        --padding-top: 30px;
        --padding-bottom: 20px;
    }
    
    .box-wrapper {
        display: flex;
        flex-direction: column;
        
        .box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 150px;
            border-radius: 30px;
            border-bottom: 1px solid #f0f0f0;
            background: var(--primary-gray);
            margin-bottom: 20px;
            cursor: pointer;
            
            .icon {
                width: 55px;
                margin-bottom: 10px;
                
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            
            .title {
                font-size: 18px;
                font-family: var(--font-regular);
                text-align: center;
            }
        }
    }
    
    .ripple-parent {
        position: relative;
        overflow: hidden;
    }

</style>
