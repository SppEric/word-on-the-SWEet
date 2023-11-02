const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {
  guessResponse, 
  gameStartResponse,
  victoryResponse,
  timeoutResponse,
  getActivePlayers
} = require('./helpers/gameLogic')
const {
  UserHelper
} = require('./helpers/userHelper');
const {
  DataHandler
} = require('./helpers/dataHandler.js');
const { disconnect } = require('process');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//NEW DEMO CODE ==============================================================
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});
//Everything else is from backend=============================================

const dataHandler = new DataHandler();
dataHandler.preprocess("data/dict.txt")

//Initialize user data
const userHelper = new UserHelper();

// this block will run when the client connects
io.on('connection', socket => {
  console.log("connected")

  socket.on('joinRoom', ({ username, room }) => {
    const user = userHelper.newUser(socket.id, username, room, 3);
    console.log("New user joined room " + room + "!")

    socket.join(user.room);
    
    // Current active users and room name
    //Don't send newUser when game has already started
    if (!userHelper.rooms.has(user.room)) {
      io.to(user.room).emit('roomUsers', 
      {
        nextPlayer: null,
        validGuess: null,
        newStarterWord: null,
        users: userHelper.getIndividualRoomUsers(user.room)
      });
    }
  });

  // Listen for client message
  socket.on('guess', guess => { 
    const user = userHelper.getActiveUser(socket.id);
    io.to(user.room).emit('guessResponse', guessResponse(user, guess, dataHandler, userHelper));  

  });

  socket.on('gameStart', () => {
    const user = userHelper.getActiveUser(socket.id);
    io.to(user.room).emit('gameStartResponse', gameStartResponse(user, dataHandler, userHelper));  
    console.log("Starting game")
  });

  socket.on('timeup', () => {
    const user = userHelper.getActiveUser(socket.id);
    //if win
                          // ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠉⠙⠛⠛⠛⠛⠻⢿⣿⣷⣤⡀⠀⠀⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⠋⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠈⢻⣿⣿⡄⠀⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⣸⣿⡏⠀⠀⠀⣠⣶⣾⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣄⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠁⠀⠀⢰⣿⣿⣯⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣷⡄⠀
                          // ⠀⠀⣀⣤⣴⣶⣶⣿⡟⠀⠀⠀⢸⣿⣿⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⠀
                          // ⠀⢰⣿⡟⠋⠉⣹⣿⡇⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣤⣤⣶⣶⣶⣶⣿⣿⣿⠀
                          // ⠀⢸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃⠀
                          // ⠀⣸⣿⡇⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠉⠻⠿⣿⣿⣿⣿⡿⠿⠿⠛⢻⣿⡇⠀⠀
                          // ⠀⣿⣿⠁⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣧⠀⠀
                          // ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
                          // ⠀⣿⣿⠀⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⠀
                          // ⠀⢿⣿⡆⠀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⡇⠀⠀
                          // ⠀⠸⣿⣧⡀⠀⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⠃⠀⠀
                          // ⠀⠀⠛⢿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⣰⣿⣿⣷⣶⣶⣶⣶⠶⠀⢠⣿⣿⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⣽⣿⡏⠁⠀⠀⢸⣿⡇⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⠀⠀⠀⣿⣿⡇⠀⢹⣿⡆⠀⠀⠀⣸⣿⠇⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⢿⣿⣦⣄⣀⣠⣴⣿⣿⠁⠀⠈⠻⣿⣿⣿⣿⡿⠏⠀⠀⠀⠀
                          // ⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⠿⠿⠿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

    if (userHelper.rooms.get(user.room).activePlayers.length == 2 && user.numLives == 1) {
      io.to(user.room).emit('victoryRoyale', victoryResponse(user, userHelper));

    //otherwise, remove a life or eliminate player
    } else {
      io.to(user.room).emit('guessResponse', timeoutResponse(user, dataHandler, userHelper));  
    }
  });


  // Runs when client disconnects
  //TODO: when someone disconnects, check for win, remove from activePlayers
  socket.on('disconnect', () => {
    const user = userHelper.exitRoom(socket.id);
    if (user) {
      console.log(userHelper.rooms)
      if(userHelper.rooms.has(user.room)) {
        theATeam = getActivePlayers(user, userHelper)
        if(theATeam) {
          if(theATeam.includes(user)) {
            if(theATeam.length > 2) {
              user.numLives = 1
              io.to(user.room).emit('guessResponse', timeoutResponse(user, dataHandler, userHelper));
            }
            else if(theATeam.length == 2) {
              io.to(user.room).emit('victoryRoyale', victoryResponse(user, userHelper));
            }
          }
        }
      }

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: userHelper.getIndividualRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 9797;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));