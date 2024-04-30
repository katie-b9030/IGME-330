import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, increment, set } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = ["p20", "p79", "p180", "p43"];
let activeId = null;

const favBtn = document.querySelector("#btn-favorite");
const delBtn = document.querySelector("#btn-delete");

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDw1B5GJmSzaWFPTPIqaxBWucwAhrdjq50",
	authDomain: "high-scores-61133.firebaseapp.com",
	projectId: "high-scores-61133",
	storageBucket: "high-scores-61133.appspot.com",
	messagingSenderId: "556191522403",
	appId: "1:556191522403:web:de87975c87d9576fb02256"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(app); // make sure firebase is loaded


// II. Functions
const setupUI = () => {


	favoriteIds = storage.readFromLocalStorage("favoriteIds");
	if (!Array.isArray(favoriteIds)) {
		favoriteIds = [];
	}

	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	};
	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	};
	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	};

	//favoriting
	favBtn.onclick = () => {
		favoriteIds.push(activeId);
		changeLikes(activeId, getFeatureById(activeId).properties.title, 1)
		refreshFavorites();
	}

	//deleting
	delBtn.onclick = () => {
		favoriteIds.splice(favoriteIds.indexOf(activeId), getFeatureById(activeId).properties.title, 1)
		changeLikes(activeId, -1)
		refreshFavorites();
	}

	refreshFavorites();
}

const getFeatureById = (id) => {
	for (let feature of geojson.features) {
		if (feature.id == id) {
			return feature;
		}
	}

}

const changeLikes = (id, name, val) => {
	const db = getDatabase();
	const favRef = ref(db, 'favorites/' + id);
	set(favRef, {
	  id,
	  name,
	  likes: increment(val)
	});
  };

const showFeatureDetails = (id) => {
	console.log(`showFeatureDetails - id=${id}`);
	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `<p><b>Address:</b> ${feature.properties.address}</p><p><b>Phone:</b> ${feature.properties.phone}</p><p><b>Website:</b> ${feature.properties.url}</p>`
	document.querySelector("#details-3").innerHTML = `<p>${feature.properties.description}</p>`

	activeId = id

	let favId = favoriteIds.indexOf(id);
	favBtn.style.display = "inline";
	delBtn.style.display = "inline";

	if (favoriteIds[favId] != undefined) {
		favBtn.disabled = true;
		delBtn.disabled = false;
	}
	else {
		favBtn.disabled = false;
		delBtn.disabled = true;
	}
};

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	}

	favBtn.disabled = true;
	favBtn.style.display = "none";
	delBtn.disabled = true;
	delBtn.style.display = "none";

	storage.writeToLocalStorage("favoriteIds", favoriteIds);
	if (activeId != null) {
		showFeatureDetails(activeId);
	}
}

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
};

const init = () => {
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails)
		setupUI();
	});
};

init();