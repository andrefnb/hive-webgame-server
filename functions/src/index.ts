import * as firebase_functions from "firebase-functions";
const firebase_admin = require("firebase-admin");

// Add this in firebase.json, predeploy on top of the build line - to enable linter
// "npm --prefix \"$RESOURCE_DIR\" run lint",

// Firebase setup

let path_to_sa_key = "../../hive-webgame-firebase-adminsdk-p2nyv-052d7a54e1.json"
let serviceAccount = require(path_to_sa_key);

firebase_admin.initializeApp({
    credential: firebase_admin.credential.cert(serviceAccount),
    databaseURL: 'https://hive-webgame.firebaseio.com'
});

const admin_db = firebase_admin.firestore();


// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = firebase_functions.region('europe-west1').https.onRequest((request, response) => {
    firebase_functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
});

export const match_create = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {
    try{
        const matchesDb = admin_db.collection('matches');
        // generate id TODO
        let id = 1
        let gameJson = {
            "hand_1": ["ant"]
        }
        let match = await matchesDb.doc(id).set(gameJson);

        firebase_functions.logger.info("Match created", {structuredData: true});
        response.send(match);
    } catch (error){
        firebase_functions.logger.error(error)
    }
});




        

