function getUsernameFromSocketId(users, socketId){
    for(let username in users){
        if(users[username].socketId === socketId){
            return username;
        }
    }
    return null;
}

module.exports = {
    getUsernameFromSocketId
}