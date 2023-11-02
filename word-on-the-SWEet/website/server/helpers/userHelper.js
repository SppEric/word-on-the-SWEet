// helper/userHelper.js


function UserHelper() {
  //user list
  this.users = [];
  //room list. Maps room id to room object
  this.rooms = new Map();
}

// Join user to chat
UserHelper.prototype.newUser = function(id, username, room, numLives) {
  const user = { id, username, room, numLives };

  this.users.push(user);

  return user;
}

// Get current user
UserHelper.prototype.getActiveUser = function(id) {
  return this.users.find(user => user.id === id);
}

// User leaves chat
//TODO: remove empty rooms
UserHelper.prototype.exitRoom = function(id) {
  const index = this.users.findIndex(user => user.id === id);

  if (index !== -1) {
    return this.users.splice(index, 1)[0];
  }
}

// Get room users
UserHelper.prototype.getIndividualRoomUsers = function(room) {
  return this.users.filter(user => user.room === room);
}

module.exports = {
  UserHelper
};