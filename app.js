const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

Http.listen(3000, () => {
    console.log("Listening at :3000...");
});

var players = []

var player_starting_hand = {
    queen: 1,
    ants: 4,
    grasshoppers: 3
};

Socketio.on("connection", socket => {
    if (players.length < 2){
        players.push(socket)
    } else {
        socket.emit("error", "Game full");
    }

    if (players.length == 2){
        players.forEach(socket => {
            socket.emit("game_start", player_starting_hand);
        });

        let player_one_hand = Object.assign({}, player_starting_hand)
        let player_two_hand = Object.assign({}, player_starting_hand)
        let board = []
    
        // Pick first player ?
        Socketio.emit("play", position);

        let play = data => {
    
            // data -> board, hand, play?
            
            // play validation??
    
            board = data.board
            player_one_hand = data.player_one_hand
            player_two_hand = data.player_two_hand

            //TODO

            // emit to other player

        }
        
        socket_player_one = players[0]
        socket_player_one.on("play", play)

        socket_player_one = players[1]
        socket_player_one.on("play", play)

    }

});

