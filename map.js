import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js';

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

let map, service, infowindow, autocomplete;
let markers = [];
let allMarkersData = [];

const styles = {
    default: [],
    silver: [
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
        { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
        { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
        { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    ],
    night: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
        { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
        { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
    ],
    retro: [
        { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b2a6" }] },
        { featureType: "administrative.land_parcel", elementType: "geometry.stroke", stylers: [{ color: "#dcd2be" }] },
        { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#ae9e90" }] },
        { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#93817c" }] },
        { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#a5b076" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#447530" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#f5f1e6" }] },
        { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#fdfcf8" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f8c967" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e9bc62" }] },
        { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#e98d58" }] },
        { featureType: "road.highway.controlled_access", elementType: "geometry.stroke", stylers: [{ color: "#db8555" }] },
        { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#806b63" }] },
        { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
        { featureType: "transit.line", elementType: "labels.text.fill", stylers: [{ color: "#8f7d77" }] },
        { featureType: "transit.line", elementType: "labels.text.stroke", stylers: [{ color: "#ebe3cd" }] },
        { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#dfd2ae" }] },
        { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#92998d" }] },
    ],
    hiding: [
        { featureType: "poi.business", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    ],
};

window.initializeMap = function() {
    const center = { lat: 36.5, lng: 127.5 }; // Centered on Korea
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 7,
        styles: styles.default,
        mapTypeControl: false
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

        markers.push(marker);
        infowindow.setContent(place.name);
        infowindow.open(map, marker);

        map.setCenter(location);
    });

    loadMarkers();

    document.getElementById('locationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const locationName = document.getElementById('locationName').value;
        const date = document.getElementById('date').value;
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
                    title: `${results[0].name} (${date})`,
                    icon: getMarkerIcon(category)
                });

                markers.push(marker);
                infowindow.setContent(results[0].name);
                infowindow.open(map, marker);

                map.setCenter(location);

                saveMarkerToFirebase(results[0].name, location.lat(), location.lng(), category, date);
            } else {
                alert('Location not found.');
            }
        });

        document.getElementById('locationForm').reset();
    });

    document.getElementById('removeMarkersButton').addEventListener('click', function() {
        removeMarkers();
    });

    document.getElementById('applyFiltersButton').addEventListener('click', function() {
        applyFilters();
    });

    document.getElementById('removeFiltersButton').addEventListener('click', function() {
        loadMarkers();
    });

    const styleSelector = document.getElementById("style-selector");
    styleSelector.addEventListener("change", () => {
        map.setOptions({ styles: styles[styleSelector.value] });
    });
}

async function saveMarkerToFirebase(name, lat, lng, category, date) {
    try {
        await addDoc(collection(db, 'markers'), {
            name: name,
            lat: lat,
            lng: lng,
            category: category,
            date: date
        });
        console.log('Marker saved to Firebase');
    } catch (error) {
        console.error('Error saving marker: ', error);
    }
}

async function loadMarkers() {
    try {
        const querySnapshot = await getDocs(collection(db, 'markers'));
        allMarkersData = [];
        querySnapshot.forEach(doc => {
            const data = doc.data();
            allMarkersData.push(data);
        });
        displayMarkers(allMarkersData);
    } catch (error) {
        console.error('Error loading markers: ', error);
    }
}

function displayMarkers(data) {
    removeMarkers();
    data.forEach(markerData => {
        const location = new google.maps.LatLng(markerData.lat, markerData.lng);
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: `${markerData.name} (${markerData.date})`,
            icon: getMarkerIcon(markerData.category)
        });

        markers.push(marker);
        google.maps.event.addListener(marker, 'click', () => {
            infowindow.setContent(markerData.name);
            infowindow.open(map, marker);
        });
    });
}

function removeMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
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

function applyFilters() {
    const filterDate = document.getElementById('filterDate').value;
    const filterCategory = document.getElementById('filterCategory').value;

    const filteredData = allMarkersData.filter(markerData => {
        let dateMatch = true;
        let categoryMatch = true;

        if (filterDate) {
            dateMatch = markerData.date === filterDate;
        }

        if (filterCategory !== 'all') {
            categoryMatch = markerData.category === filterCategory;
        }

        return dateMatch && categoryMatch;
    });

    displayMarkers(filteredData);
}
