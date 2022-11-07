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

export class Hex {
    q: number;
    r: number
    constructor(q: number, r: number) {
        this.q = q;
        this.r = r;
    }
}

export class Piece {
    piece: string;
    position: Hex | null;

    constructor(piece: string, position: Hex | null) {
        this.piece = piece;
        this.position = position;
    }

    getPiece() : string {
        return this.piece;
    }
    getPosition() : Hex | null {
        return this.position;
    }
}

const hand_start = [
    new Piece("bee", null),
    new Piece("ant", null),
    new Piece("ant", null),
    new Piece("ant", null),
    new Piece("grasshopper", null),
    new Piece("grasshopper", null),
    new Piece("grasshopper", null),
    new Piece("spider", null),
    new Piece("spider", null),
    new Piece("beetle", null),
    new Piece("beetle", null),
    new Piece("mosquito", null),
    new Piece("ladybug", null),
    new Piece("pillbug", null)
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

export const get_match = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {
    
    const matchesDb = admin_db.collection('matches');
    let match = await matchesDb.doc(String(request.body.match_id));
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

// const q = 0
// const r = 1

var axial_direction_vectors = [
    new Hex(+1, 0), new Hex(+1, -1), new Hex(0, -1), new Hex(-1, 0), new Hex(-1, +1), new Hex(0, +1)
]

// function axial_direction(direction: number): Hex{
//     return axial_direction_vectors[direction]
// }

function axial_add(hex: Hex, vec: Hex): Hex{
    return new Hex(hex.q + vec.q, hex.r + vec.r)
}

// function axial_neighbor(hex: Hex, direction: number): Hex{
//     return axial_add(hex, axial_direction(direction))
// }

export const play = firebase_functions.region('europe-west1').https.onRequest(async (request, response) => {

    // Fetch game instance
    const match = admin_db.collection('matches').doc(request.body.match_id);

    let request_body = request.body
    let piece = request_body.piece
    
    // Validate play
    // TODO
    
    

    // If first play, add position origin
    if (match.n_pieces_in_play == 0){
        piece.position = new Hex(0, 0)
    } else if (match.n_pieces_in_play == 1) {
        piece.position = axial_add(new Hex(0, 0), axial_direction_vectors[1])
    } else {
        piece.position = piece.position
    }

    let hand_property = "hand_2"
    if (request_body.is_first_player) {
        hand_property = "hand_1"
    }
    let player_hand = match[hand_property]
    player_hand[request_body.piece_index] = piece

    // Get possible plays for each hand piece?

        // Returns all possible positions
        // Then, apply a filter for each kind of piece
    let hand_1 = match.hand_1
    let hand_2 = player_hand
    if (request_body.is_first_player) {
        hand_1 = player_hand
        hand_2 = match.hand_2
    }

    return admin_db.collection('matches').doc(request.body.match_id).set({
        hand_1: hand_1,
        hand_2: hand_2
    })

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


