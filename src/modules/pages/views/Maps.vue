<template>
    <ion-page>
        <Header/>
        <PageHeader title="Takasimo Destek"/>
        <ion-content>
            <div>Marker Position: {{ markerInfo }}</div>
            <div>Address Info</div>
            {{ addressInfo }}
            <GMapMap
                :center="center"
                :zoom="12"
                style="width: 100%; height: 400px"
                @click="mapClicked"
            >
                <GMapMarker
                    v-if="marker.position"
                    :position="marker.position"
                    :draggable="true"
                    @click="mapClicked"
                />
            </GMapMap>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { IonContent, IonPage } from '@ionic/vue';
    import Header from '@/components/Header.vue';
    import PageHeader from '@/components/page/PageHeader.vue';
    import axios from 'axios'; // Assuming axios is used for HTTP requests
    
    const router = useRouter();
    const center = ref({ lat: 51.093048, lng: 6.84212 });
    const marker = ref<any>({ position: null });
    const markerInfo = ref<any>('');
    const addressInfo = ref<any>('');
    
    const mapClicked = async (event:any) => {
        console.log('Map clicked:', event.latLng.lat(), event.latLng.lng());
        marker.value.position = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        }
        await getAddress(marker.value.position.lat, marker.value.position.lng);
    };
    
    const updateMarkerInfo = () => {
        if (marker.value.position) {
            markerInfo.value = `Latitude: ${marker.value.position.lat}, Longitude: ${marker.value.position.lng}`;
        }
    };
    
    const getAddress = async (lat:any, lng:any) => {
        const apiKey = 'AIzaSyDwWL08MSWk__QbN0wgcMCSHNjE_eflzOA';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            if (response.data.results.length > 0) {
                addressInfo.value = response.data.results;
            }
            else {
                addressInfo.value = []
            }
        } catch (error) {
            addressInfo.value = 'Error fetching address';
        }
    };
</script>

<style lang="scss" scoped>
    /* Your existing styles */
</style>