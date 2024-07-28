import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYzrFlKp-lrgUisQwWezfZTPdN-NJvBvE",
    authDomain: "expense-f7fb3.firebaseapp.com",
    projectId: "expense-f7fb3",
    storageBucket: "expense-f7fb3.appspot.com",
    messagingSenderId: "240992662446",
    appId: "1:240992662446:web:b06e29ebefe8fa1e7f4e3f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let map;
let markers = [];

window.initializeMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.5665, lng: 126.9780 },
        zoom: 8
    });

    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationName'));
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            return;
        }

        document.getElementById('locationForm').addEventListener('submit', async function (e) {
            e.preventDefault();
            const locationName = place.name;
            const date = document.getElementById('date').value;
            const category = document.getElementById('category').value;

            const location = place.geometry.location;
            const marker = new google.maps.Marker({
                map: map,
                position: location,
                label: {
                    text: category.charAt(0).toUpperCase(),
                    color: getCategoryColor(category),
                },
            });
            markers.push(marker);

            await addDoc(collection(db, 'markers'), {
                locationName,
                date,
                category,
                position: {
                    lat: location.lat(),
                    lng: location.lng()
                }
            });
        });
    });

    document.getElementById('removeMarkersButton').addEventListener('click', async function () {
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        const querySnapshot = await getDocs(collection(db, 'markers'));
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    });

    loadMarkers();
}

function getCategoryColor(category) {
    switch (category) {
        case 'food': return 'blue';
        case 'activity': return 'red';
        case 'drinks': return 'green';
        case 'treatment': return 'pink';
        default: return 'black';
    }
}

async function loadMarkers() {
    const querySnapshot = await getDocs(collection(db, 'markers'));
    querySnapshot.forEach(doc => {
        const data = doc.data();
        const marker = new google.maps.Marker({
            map: map,
            position: data.position,
            label: {
                text: data.category.charAt(0).toUpperCase(),
                color: getCategoryColor(data.category),
            },
        });
        markers.push(marker);
    });
}
