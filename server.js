const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON

// ✅ API Endpoint: Fetch all workouts
app.get("/workouts", async (req, res) => {
    try {
      const snapshot = await db.collection("workouts").orderBy("timestamp", "desc").get();
      const workouts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp ? new Date(data.timestamp._seconds * 1000).toISOString() : null
        };
      });
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: "Error fetching workouts" });
    }
  });
  
// ✅ API Endpoint: Add a new workout
app.post("/workouts", async (req, res) => {
    try {
      const { exercise, sets, reps, weight } = req.body;
  

      if (!exercise || isNaN(sets) || isNaN(reps) || isNaN(weight)) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      const newWorkout = {
        exercise,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };
  
      const docRef = await db.collection("workouts").add(newWorkout);
      res.json({ id: docRef.id, ...newWorkout });
    } catch (error) {
      res.status(500).json({ error: "Error adding workout" });
    }
  });
  


const PORT = 5000;
app.get("/", (req, res) => {
    console.log("✅ Root route accessed");
    res.send("Welcome to GymTracker API!");
});

app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));
