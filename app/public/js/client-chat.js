const socket = io()
const autoScrollToTheBottomOfTheDiv = () => {
    const elem = document.getElementById('app__messages');
    elem.scrollTop = elem.scrollHeight

}
//send message client form to server
document.getElementById("form-messages").addEventListener("submit", (e) => {
    // prevent load page
    e.preventDefault()

    const messageText = document.getElementById("input-messages").value
    // const ackknowledgements = (cleanedMessage) => {
    //     // console.log(cleanedMessage)
    // }
    socket.emit(
        "send message from client to server", messageText)
    // ,ackknowledgements)
})

//receive message fron server
socket.on("server send message to client", (messageText) => {
    const { createAt, message, userName } = messageText
    const htmlContent = document.getElementById("app__messages").innerHTML
    const messageElement = `
                <div class="message-item">
                    <div class="message__row1">
                        <p class="message__name">${userName}</p>
                        <p class="message__date">${createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                            ${message}
                        </p>
                    </div>
                </div>
    `
    let renderContent = htmlContent + messageElement
    document.getElementById("app__messages").innerHTML = renderContent
    autoScrollToTheBottomOfTheDiv()
    //clear input
    document.getElementById("input-messages").value = ""
})

//send location
document.getElementById("btn-share-location").addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Your browser doesnt support this feature")
    }
    navigator.geolocation.getCurrentPosition((position) => {

        const { latitude, longitude } = position.coords
        //send to server
        socket.emit("share location from client to server", { latitude, longitude })
    })
})

socket.on("share location to other client", (data) => {
    const { userName, createAt, message } = data
    const htmlContent = document.getElementById("app__messages").innerHTML

    const messageElement = `
                <div class="message-item">
                    <div class="message__row1">
                        <p class="message__name">${userName}</p>
                        <p class="message__date">${createAt}</p>
                    </div>
                    <div class="message__row2">
                        <p class="message__content">
                        <a href=" ${message}" target="_blank">
                            Click here to see location
                        </a>
                           
                        </p>
                    </div>
                </div>
    `
    let renderContent = htmlContent + messageElement

    document.getElementById("app__messages").innerHTML = renderContent
    autoScrollToTheBottomOfTheDiv()


})

// handle qurey string
const queryString = location.search;
const params = Qs.parse(queryString, { ignoreQueryPrefix: true })
const { room, userName } = params


//send params to server
socket.emit("client join room", { room, userName })

// display room name
document.getElementById("app__title").innerHTML = room


//handle users list
socket.on("send user list to client", (usersList) => {
    let contentHTML = ''
    usersList.map((user) => {
        contentHTML += `<li class="app__item-user">${user.userName}</li>`
    })
    document.getElementById("app__list-user--content").innerHTML = contentHTML
})

//remove user 
