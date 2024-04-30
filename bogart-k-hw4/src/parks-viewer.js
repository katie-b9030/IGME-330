/* #1 - The Firebase setup code goes here  - both imports, `firebaseConfig` and `app` */
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
        import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

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

  const db = getDatabase();
  const scoresRef = ref(db, 'park-favorites');

  const favoritesChanged = (snapshot) => {
    let finalHtml = ``;
    snapshot.forEach(park => {
      const childKey = park.key;
      const childData = park.val();
      console.log(childKey,childData);
      let html = `<li>${childData.name} - ${childData.id} - ${childData.likes}</li>`
      finalHtml += html;
    });
    document.querySelector("#list-parks").innerHTML = finalHtml;
  }

  const init = () => {
    const db = getDatabase();
    const favoritesRef = ref(db, 'favorites/');
    onValue(favoritesRef,favoritesChanged);
  };
  
  init();

  onValue(scoresRef,favoritesChanged);