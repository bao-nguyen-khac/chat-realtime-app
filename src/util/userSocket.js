var users = [];
module.exports = {

    addUser: (userId, socketId) => {
        !users.some((user) => user.userId === userId) &&
            users.push({ userId, socketId });
    },

    removeUser: (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    },

    getUser: (userId) => {
        return users.find((user) => user.userId === userId);
    },
    getUserBySocketId: (socketId) => {
        return users.find((user) => user.socketId === socketId);
    },
    getStatusUsers: (listUser) => {
        var result = [];
        listUser.forEach(element => {
            if (users.find((user) => user.userId === element)) {
                result.push(element)
            }
        })
        return result;
    }
}