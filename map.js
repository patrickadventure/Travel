import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyCZURzxdOwJauWX-CT8BYN1VSQ5a7JJWBk",
    authDomain: "expense-f7fb3.firebaseapp.com",
    projectId: "expense-f7fb3",
    storageBucket: "expense-f7fb3.appspot.com",
    messagingSenderId: "240992662446",
    appId: "1:240992662446:web:b06e29ebefe8fa1e7f4e3f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    loadHeaderFooter(); 
    initializeMap();
});

let map, service, infowindow, autocomplete;

function initializeMap() {
    const center = { lat: 36.5, lng: 127.5 }; // Centered on Korea
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 7,
    });

    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();

    const input = document.getElementById('locationName');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            alert("No details available for input: '" + place.name + "'");
            return;
        }

        const location = place.geometry.location;
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: place.name
        });

        infowindow.setContent(place.name);
        infowindow.open(map, marker);

        map.setCenter(location);
    });

    loadMarkers();

    document.getElementById('locationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const locationName = document.getElementById('locationName').value;
        const category = document.getElementById('category').value;

        const request = {
            query: locationName,
            fields: ["name", "geometry"],
        };

        service.findPlaceFromQuery(request, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const location = results[0].geometry.location;
                const marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: results[0].name,
                    icon: getMarkerIcon(category)
                });

                infowindow.setContent(results[0].name);
                infowindow.open(map, marker);

                map.setCenter(location);

                saveMarkerToFirebase(results[0].name, location.lat(), location.lng(), category);
            } else {
                alert('Location not found.');
            }
        });

        document.getElementById('locationForm').reset();
    });
}

async function saveMarkerToFirebase(name, lat, lng, category) {
    try {
        await addDoc(collection(db, 'markers'), {
            name: name,
            lat: lat,
            lng: lng,
            category: category
        });
        console.log('Marker saved to Firebase');
    } catch (error) {
        console.error('Error saving marker: ', error);
    }
}

async function loadMarkers() {
    try {
        const querySnapshot = await getDocs(collection(db, 'markers'));
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const location = new google.maps.LatLng(data.lat, data.lng);
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: data.name,
                icon: getMarkerIcon(data.category)
            });

            google.maps.event.addListener(marker, 'click', () => {
                infowindow.setContent(data.name);
                infowindow.open(map, marker);
            });
        });
    } catch (error) {
        console.error('Error loading markers: ', error);
    }
}

function getMarkerIcon(category) {
    const color = {
        food: 'blue',
        activity: 'red',
        drinks: 'green',
        treatment: 'pink'
    }[category];

    return {
        url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    };
}
