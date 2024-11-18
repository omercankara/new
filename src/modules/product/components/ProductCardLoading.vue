<template>
    <ion-card :class="props.cardType">
        <ion-skeleton-text class="image"
                           :animated="true"
        />
        <ion-card-header>
            <ion-card-title>
                <ion-skeleton-text class="line-1"
                                   :animated="true"
                />
            </ion-card-title>
            <div class="ion-card-subtitles">
                <ion-card-subtitle>
                    <ion-skeleton-text class="line-2"
                                       :animated="true"
                    />
                </ion-card-subtitle>
                <ion-card-subtitle class="price">
                    <ion-skeleton-text class="line-3"
                                       :animated="true"
                    />
                </ion-card-subtitle>
            </div>
        </ion-card-header>
    </ion-card>
</template>
<script setup
        lang="ts"
>
    import {IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSkeletonText} from "@ionic/vue";
    
    // Props
    interface propsInterface {
        cardType?: 'cover' | 'list'
    }
    
    const props = withDefaults(defineProps<propsInterface>(), {
        cardType: 'cover'
    })
</script>

<style lang="scss"
       scoped
>
    ion-card {
        margin: 0;
        padding: 15px 15px 5px 15px;
        border-radius: 15px;
        background: var(--background-grey);
        box-shadow: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 9px;
        
        .image {
            width: 100%;
            height: 180px;
            margin: 0;
        }
        
        ion-card-header {
            padding: 0;
            text-align: center;
            
            .line-1 {
                width: 80%;
                height: 18px;
                margin: 0 auto 4px auto;
            }
            
            .line-2 {
                width: 60%;
                height: 14px;
                margin: 0 auto 4px auto;
            }
            
            .line-3 {
                width: 40%;
                height: 20px;
                margin: 0 auto;
            }
        }
    }
</style>