
//We don't need moment --------------------------------------

function guessResponse(user, guess, dataHandler, userHelper) {

  let room = userHelper.rooms.get(user.room)
  let roomUsers = userHelper.getIndividualRoomUsers(user.room)
  let currStarterWord = room.currStarterWord
  let difficulty = room.difficulty
  let currPlayerIndex = room.currPlayerIndex
  let isValid = dataHandler.isValid(guess, currStarterWord)
  let activePlayers = room.activePlayers

  let newStarterWord 
  let nextPlayer
  if (isValid) {
    //update starter word
    newStarterWord = dataHandler.getStarterWord(difficulty)
    room.currStarterWord = newStarterWord

    //update turn
    newPlayerIndex = (currPlayerIndex + 1) % activePlayers.length
    nextPlayer = activePlayers[newPlayerIndex]
    room.currPlayerIndex = newPlayerIndex

  } else {
    //Do nothing
    newStarterWord = currStarterWord
    nextPlayer = user
  }
  
  console.log(room.currPlayerIndex)
  console.log("next Player:")
  console.log(nextPlayer)
  console.log(activePlayers)

  return {
    nextPlayer: nextPlayer,
    validGuess: isValid,
    substring: newStarterWord,
    users: activePlayers
  }
}

function getActivePlayers(user, userHelper) {
  let room = userHelper.rooms.get(user.room)
  let activePlayers = room.activePlayers
  return activePlayers
}

function gameStartResponse(user, dataHandler, userHelper) {

  let roomUsers = userHelper.getIndividualRoomUsers(user.room)
  let difficulty = "easy"
  let newStarterWord = dataHandler.getStarterWord(difficulty)

  //making the new room
  userHelper.rooms.set(user.room, {currStarterWord: newStarterWord, difficulty: difficulty, activePlayers: roomUsers, currPlayerIndex: 0})

  let nextPlayer = roomUsers[0] //currPlayerIndex is 0
  return {
    nextPlayer: nextPlayer,
    validGuess: null,
    substring: newStarterWord,
    users: roomUsers
  }
}

function victoryResponse(user, userHelper) {
  let room = userHelper.rooms.get(user.room)

  //removing eliminated player
  let id = user.id
  const index = room.activePlayers.findIndex(user => user.id === id);
  room.activePlayers.splice(index, 1)
  userHelper.rooms.delete(user.room)
  return {
    nextPlayer: null,
    validGuess: null,
    substring: null,
    users: room.activePlayers
  }
}

function timeoutResponse(user, dataHandler, userHelper) {
  let room = userHelper.rooms.get(user.room)
  let newStarterWord = dataHandler.getStarterWord(room.difficulty)
  room.currStarterWord = newStarterWord //update currStarterWord

  //If one life left, eliminate player
  if (user.numLives == 1) {
    let id = user.id
    const index = room.activePlayers.findIndex(user => user.id === id);
    room.activePlayers.splice(index, 1)
    room.currPlayerIndex = room.currPlayerIndex % room.activePlayers.length //update currPlayerIndex

  } else {
    //Otherwise, remove life
    user.numLives = user.numLives-1 //update player's lives
    room.currPlayerIndex = (room.currPlayerIndex + 1) % room.activePlayers.length //update currPlayerIndex
  }
  let nextPlayer = room.activePlayers[room.currPlayerIndex]
  
  console.log(room.currPlayerIndex)
  console.log(nextPlayer)
  console.log(room.activePlayers)
  return {
    nextPlayer: nextPlayer,
    validGuess: null, //does front end need this
    substring: room.currStarterWord,
    users: room.activePlayers
  }
}

module.exports = {
  guessResponse, 
  gameStartResponse,
  victoryResponse,
  timeoutResponse,
  getActivePlayers
}
