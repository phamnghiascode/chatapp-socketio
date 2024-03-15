let usersList = [
    // {
    //     id: 1,
    //     userName: "Nghia Pham Trong",
    //     room: "1"
    // },
    // {
    //     id: 2,
    //     userName: "Ha Trang Tran",
    //     room: "2"
    // }
]

const addUser = (newUser) => {
    return usersList = [...usersList, newUser]
}
const getUserList = () => {
    return usersList
}

const getListUsersByRoomId = (room) => { return usersList.filter((user) => { return user.room === room }) }

const removeUser = (id) => {
    return usersList = usersList.filter((user) => {
        return user.id !== id
    })
}
const findUserById = (id) => usersList.find((user) => user.id = id)

module.exports = {
    getUserList,
    getListUsersByRoomId,
    addUser,
    removeUser,
    findUserById
}