const API_KEY = 'AIzaSyDwWL08MSWk__QbN0wgcMCSHNjE_eflzOA'; 

export function initMapAPI() {
    // Bu fonksiyon Google Maps API yüklenip callback olarak çağrılacaktır.
    console.log('Google Maps API callback fonksiyonu çağrıldı.');
    // Burada harita başlatma kodlarını yazabilirsiniz.
}

export function google() {
    return new Promise((resolve, reject) => {
        // Google Maps API'nin callback olarak `initMapAPI` fonksiyonunu kullanması için `window` nesnesine ekleyin
        window.initMapAPI = initMapAPI;

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMapAPI`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);

    });
}
