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


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = firebase_functions.region('europe-west1').https.onRequest((request, response) => {
    firebase_functions.logger.log("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

export const match_create = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {
    try{
        firebase_functions.logger.log("Match creation initiated");
        const matchesDb = admin_db.collection('matches');
        // generate id TODO
        let id = 1
        let gameJson = {
            "hand_1": ["ant"]
        }
        let match = await matchesDb.doc(id).set(gameJson);

        firebase_functions.logger.log("Match created", {structuredData: true});
        response.send(match);
    } catch (error){
        firebase_functions.logger.error(error)
    }
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


