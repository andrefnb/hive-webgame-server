const path = require('path');
const express = require("express")();
const Http = require("http").Server(Express);
// const Socketio = require("socket.io")(Http);
const firebase = require('firebase');
const firebase_admin = require("firebase-admin");
// import { initializeApp } from 'firebase/app';z


// Firebase setup

var path_to_sa_key = "hive-webgame-firebase-adminsdk-p2nyv-052d7a54e1.json"
var serviceAccount = require(path_to_sa_key);

firebase_admin.initializeApp({
  credential: firebase_admin.credential.cert(serviceAccount),
  databaseURL: 'https://hive-webgame.firebaseio.com'
});

const db = firebase_admin.firestore();

// function writeUserData(userId, name, email, imageUrl) {
//     firebase.database().ref('users/' + userId).set({
//     username: name,
//     email: email,
//     profile_picture : imageUrl
// });
// }


// Server

var app = express();

// app.use(cors())
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


// function checkAuth(req, res, next) {
//     if (req.headers.authtoken) {
//         firebase_admin.auth().verifyIdToken(req.headers.authtoken).then(() => {
//           next()
//         }).catch(() => {
//           res.status(403).send('Unauthorized')
//         });
//     } else {
//       res.status(403).send('Unauthorized')
//     }
// }

// app.use('/', checkAuth)

// app.get('/', (req, res) => {
//     res.json({
//     message: 'Hello World!'
//     })
// })


// app.post('/', (req, res) => res.send(Matches.create()));

app.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const matchesDb = db.collection('matches');
        // generate id TODO
        var id = 1
        var gameJson = {
            "hand_1": ["ant"]
        }
        const response = await matchesDb.doc(id).set(gameJson);
        res.send(response);
    } catch(error) {
        res.send(error);
    }
});



// app.post('/user', async (req, res) => {
// try {
//     console.log(req.body);
//     const id = req.body.email;
//     const userJson = {
//     email: req.body.email,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName
//     };
//     const usersDb = db.collection('users'); 
//     const response = await usersDb.doc(id).set(userJson);
//     res.send(response);
// } catch(error) {
//     res.send(error);
// }
// });



// Socket.io

// Http.listen(3000, () => {
//     console.log("Listening at :3000...");
// });

// var players = []

// var player_starting_hand = {
//     queen: 1,
//     ants: 4,
//     grasshoppers: 3
// };

// Socketio.on("connection", socket => {
//     if (players.length < 2){
//         players.push(socket)
//     } else {
//         socket.emit("error", "Game full");
//     }

//     if (players.length == 2){
//         players.forEach(socket => {
//             socket.emit("game_start", player_starting_hand);
//         });

//         let player_one_hand = Object.assign({}, player_starting_hand)
//         let player_two_hand = Object.assign({}, player_starting_hand)
//         let board = []
    
//         // Pick first player ?
//         Socketio.emit("play", position);

//         let play = data => {
    
//             // data -> board, hand, play?
            
//             // play validation??
    
//             board = data.board
//             player_one_hand = data.player_one_hand
//             player_two_hand = data.player_two_hand

//             //TODO

//             // emit to other player

//         }
        
//         socket_player_one = players[0]
//         socket_player_one.on("play", play)

//         socket_player_one = players[1]
//         socket_player_one.on("play", play)

//     }

// });


// Expose Express API as a single Cloud Function:
exports.matches = functions.https.onRequest(app);

