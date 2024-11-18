<template>
    <ion-app>
        <ion-router-outlet></ion-router-outlet>
    </ion-app>
</template>

<script lang="ts"
        setup
>
    import {IonApp, IonRouterOutlet,IonRefresher, IonRefresherContent} from '@ionic/vue';


    const handleRefresh = (event: CustomEvent) => {
        
    }


</script>
<style>
    .example-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>
