import { applicationDefault } from "firebase-admin/app";
import * as firebase_functions from "firebase-functions";
const firebase_admin = require("firebase-admin");

// Add this in firebase.json, predeploy on top of the build line - to enable linter
// "npm --prefix \"$RESOURCE_DIR\" run lint",

// Firebase setup
firebase_admin.initializeApp({
    credential: applicationDefault(),
    databaseURL: 'https://hive-webgame.firebaseio.com'
});

const admin_db = firebase_admin.firestore();

const hand_start = {
    "bees": 1,
    "ants": 3,
    "grasshopers": 3,
    "spider": 2,
    "beetle": 2,
    "mosquitoes": 1,
    "ladybug": 1,
    "pillbug": 1
}

class Piece {

    move(distanceInMeters: number = 0) {
      console.log(`Animal moved ${distanceInMeters}m.`);
    }
  }

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = firebase_functions.region('europe-west1').https.onRequest((request, response) => {
    firebase_functions.logger.log("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

export const match_create = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {
    
    firebase_functions.logger.log("Match creation initiated");
    const matchesDb = admin_db.collection('matches');
    
    // generate id TODO
    let id = 3
    let gameJson = {
        "player_1": request.body.player_one_uid,
        "player_2": request.body.player_two_uid,
        "hand_1": JSON.parse(JSON.stringify(hand_start)),
        "hand_2": JSON.parse(JSON.stringify(hand_start))
    }
    let match = await matchesDb.doc(String(id)).set(gameJson);

    firebase_functions.logger.log("Match created");
    response.send(match);

});

export const play_validation = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {
    
    // Validate play

    // Get possible plays for each hand piece?

        // Returns all possible positions
        // Then, apply a filter for each kind of piece

});

// AUTH
// Create
export const newUserSignup = firebase_functions.region('europe-west1').auth.user().onCreate(user => {
    // firebase_functions.logger.log("User created", {email: user.email, uid:user.uid});
    return admin_db.collection('users').doc(user.uid).set({
        email: user.email
    })
})
// Delete
export const userDeleted = firebase_functions.region('europe-west1').auth.user().onDelete(user => {
    // firebase_functions.logger.log("User deleted", {email: user.email, uid:user.uid});
    const to_delete = admin_db.collection('users').doc(user.uid);
    return to_delete.delete();
})


