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

const hand_start = [
    {"piece":"bee", position:null},
    {"piece":"ant", position:null},
    {"piece":"ant", position:null},
    {"piece":"ant", position:null},
    {"piece":"grasshopper", position:null},
    {"piece":"grasshopper", position:null},
    {"piece":"grasshopper", position:null},
    {"piece":"spider", position:null},
    {"piece":"spider", position:null},
    {"piece":"beetle", position:null},
    {"piece":"beetle", position:null},
    {"piece":"mosquito", position:null},
    {"piece":"ladybug", position:null},
    {"piece":"pillbug", position:null}
]


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
        "n_pieces_in_play": 0,
        "player_1": request.body.player_one_uid,
        "player_2": request.body.player_two_uid,
        "hand_1": JSON.parse(JSON.stringify(hand_start)),
        "hand_2": JSON.parse(JSON.stringify(hand_start))
    }
    let match = await matchesDb.doc(String(id)).set(gameJson);

    firebase_functions.logger.log("Match created");
    response.send(match);

});

// var axial_direction_vectors = [
//     Hex(+1, 0), Hex(+1, -1), Hex(0, -1), 
//     Hex(-1, 0), Hex(-1, +1), Hex(0, +1), 
// ]

// function axial_direction(direction):
//     return axial_direction_vectors[direction]

// function axial_add(hex, vec):
//     return Hex(hex.q + vec.q, hex.r + vec.r)

// function axial_neighbor(hex, direction):
//     return axial_add(hex, axial_direction(direction))


// Basic functions for hexagonal positions

const q = 0
const r = 1

var axial_direction_vectors = [
    [+1, 0], [+1, -1], [0, -1], [-1, 0], [-1, +1], [0, +1]
]

function axial_direction(direction: number): Array<number>{
    return axial_direction_vectors[direction]
}

function axial_add(hex: Array<number>, vec: Array<number>): Array<number>{
    return [hex[q] + vec[q], hex[r] + vec[r]]
}

function axial_neighbor(hex: Array<number>, direction: number): Array<number>{
    return axial_add(hex, axial_direction(direction))
}

export const play_validation = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {

    // Fetch game instance
    const match = admin_db.collection('matches').doc(request.body.match_id);
    
    // Validate play
    // TODO

    var piece_obj = {}
    // If first play, add position origin
    if (match.n_pieces_in_play == 0){
        // piece_obj["piece"] = request.body.piece,
        // piece_obj["posotion"] = [0,0]
    }

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


