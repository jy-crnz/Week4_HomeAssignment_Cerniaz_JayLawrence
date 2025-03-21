document.addEventListener("DOMContentLoaded", async function () {
    if (typeof firebase === "undefined") {
        console.error("🔥 Firebase SDK not loaded! Check your <script> imports in index.html.");
        return;
    }
    
    console.log("✅ Firebase SDK loaded successfully.");

    // ✅ Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBHtgGwGSpb555ExubiAHtzTvgAPn0oBOo",
        authDomain: "gymtracker-a0f90.firebaseapp.com",
        projectId: "gymtracker-a0f90",
        storageBucket: "gymtracker-a0f90.appspot.com",
        messagingSenderId: "60918974046",
        appId: "1:60918974046:web:7ebbea13fb8f8e624696cf",
        measurementId: "G-ZEBZ4RPBK5"
    };

    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
    const db = firebase.firestore();
    console.log("🔥 Firebase initialized successfully!");

    // ✅ Load Workouts from Firestore
    async function loadWorkouts() {
        try {
            const snapshot = await db.collection("workouts").orderBy("timestamp", "desc").get();
            const workoutList = document.getElementById("workout-list");
            workoutList.innerHTML = ""; // Clear previous list

            snapshot.forEach(doc => {
                const workout = doc.data();
                const workoutItem = document.createElement("li");
                workoutItem.textContent = `${workout.exercise}: ${workout.sets} sets x ${workout.reps} reps @ ${workout.weight}kg`;
                workoutList.appendChild(workoutItem);
            });

            console.log("📥 Workouts loaded from Firestore.");
        } catch (error) {
            console.error("❌ Error loading workouts:", error);
            document.getElementById("message").textContent = "❌ Failed to load workouts.";
            document.getElementById("message").style.display = "block";
        }
    }

    // ✅ Log Workout to Firestore
    document.getElementById("workout-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const exercise = document.getElementById("exercise").value;
        const sets = document.getElementById("sets").value;
        const reps = document.getElementById("reps").value;
        const weight = document.getElementById("weight").value;

        if (exercise && sets && reps && weight) {
            try {
                await db.collection("workouts").add({
                    exercise,
                    sets: parseInt(sets),
                    reps: parseInt(reps),
                    weight: parseFloat(weight),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Sort by time
                });

                document.getElementById("message").textContent = "✅ Workout logged successfully!";
                document.getElementById("message").style.color = "green";
                document.getElementById("message").style.display = "block";

                document.getElementById("workout-form").reset();
                loadWorkouts(); // Reload from Firestore
            } catch (error) {
                document.getElementById("message").textContent = "❌ Error saving to Firestore!";
                document.getElementById("message").style.color = "red";
                console.error("❌ Firestore error:", error);
            }
        }
    });

    // ✅ Load workouts on page load
    loadWorkouts();
});
