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
let currentDate = '2024-12-20';
const startDate = '2024-12-20';
const endDate = '2025-01-03';

window.initializeMap = function() {
    const center = { lat: 36.5, lng: 127.5 }; // Centered on Korea
    map = new google.maps.Map(document.getElementById("map"), {
        center: center,
        zoom: 7,
        styles: nightModeStyles, // Apply night mode styles
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

    document.getElementById('prevDate').addEventListener('click', function() {
        changeDate(-1);
    });

    document.getElementById('nextDate').addEventListener('click', function() {
        changeDate(1);
    });

    document.getElementById('seeAllDates').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('selectedDate').textContent = 'See All Activities';
            loadMarkers();
        } else {
            document.getElementById('selectedDate').textContent = formatDate(currentDate);
            loadMarkersForDate(currentDate);
        }
    });
};

function changeDate(delta) {
    const currentDateObj = new Date(currentDate);
    currentDateObj.setDate(currentDateObj.getDate() + delta);
    currentDate = currentDateObj.toISOString().split('T')[0];

    if (currentDate < startDate) currentDate = startDate;
    if (currentDate > endDate) currentDate = endDate;

    document.getElementById('selectedDate').textContent = formatDate(currentDate);
    loadMarkersForDate(currentDate);
}

function formatDate(dateStr) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateStr).toLocaleDateString('en-GB', options);
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
    removeMarkers();
    try {
        const querySnapshot = await getDocs(collection(db, 'markers'));
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const location = new google.maps.LatLng(data.lat, data.lng);
            const marker = new google.maps.Marker({
                position: location,
                map: map,
                title: `${data.name} (${data.date})`,
                icon: getMarkerIcon(data.category)
            });

            markers.push(marker);
            google.maps.event.addListener(marker, 'click', () => {
                infowindow.setContent(data.name);
                infowindow.open(map, marker);
            });
        });
    } catch (error) {
        console.error('Error loading markers: ', error);
    }
}

async function loadMarkersForDate(date) {
    removeMarkers();
    try {
        const querySnapshot = await getDocs(collection(db, 'markers'));
        querySnapshot.forEach(doc => {
            const data = doc.data();
            if (data.date === date) {
                const location = new google.maps.LatLng(data.lat, data.lng);
                const marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    title: `${data.name} (${data.date})`,
                    icon: getMarkerIcon(data.category)
                });

                markers.push(marker);
                google.maps.event.addListener(marker, 'click', () => {
                    infowindow.setContent(data.name);
                    infowindow.open(map, marker);
                });
            }
        });
    } catch (error) {
        console.error('Error loading markers: ', error);
    }
}

function removeMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}

async function clearMarkersFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'markers'));
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log('All markers removed from Firebase');
    } catch (error) {
        console.error('Error removing markers: ', error);
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

const nightModeStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

window.initMap = initializeMap;
