const socket = io();
const user_id = document.querySelector('.passUserID').value;
const receiverId = document.querySelector('.passReceiverID')?.value;
const messageId = document.querySelector('.passMessID').value;
const messageType = document.querySelector('.passMessType').value;
const chatForm = document.querySelector('#chatinput-form');
const messageInput = document.querySelector('#chat-input');
const userConvensation = document.querySelector('#users-conversation');

const autoscroll = () => {
    // New message element
    var listElementMessNew = document.querySelectorAll('.user-chat-content');
    if(listElementMessNew.length != 0){
        listElementMessNew[listElementMessNew.length - 1].scrollIntoView();
    }
}
autoscroll()
$.ajax({
    url: `/message/get-all-contact`,
    method: "GET",
    success: function (allContact) {
        socket.emit('join', {
            userId: user_id,
            allContact: allContact,
        });
    }
})

socket.on('sendUserOnline', data => {
    data.forEach(e => {
        var elementLeftChat = document.querySelector(`#contact-id-${e.userId}`);
        elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
        if (receiverId == e.userId) {
            document.querySelector("#users-chat").querySelector(".user-status").style.backgroundColor = "#06d6a0";
            document.querySelector(".status-user-text").innerHTML = "Online";
        }
    })
})

socket.on('sendMeOnline', data => {
    var elementLeftChat = document.querySelector(`#contact-id-${data}`);
    elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
    if (receiverId == data) {
        document.querySelector("#users-chat").querySelector(".user-status").style.backgroundColor = "#06d6a0"
        document.querySelector(".status-user-text").innerHTML = "Online";
    }
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    var today = new Date();
    var hour = moment(today).format("HH:mm");
    var date = moment(today).format("DD/MM");
    var dateTime = hour + ' | ' + date;
    if(messageType == 'single'){
        socket.emit('sendMessageSingle', {
            senderId: user_id,
            receiverId: receiverId,
            message: message,
            messId: messageId,
            time: dateTime,
        })
    }else{
        socket.emit('sendMessageGroup', {
            senderId: user_id,
            message: message,
            messId: messageId,
            time: dateTime,
        })
    }
    messageInput.value = '';
})

socket.on('getMessageSingle', (data) => {
    var eleParentLeftChat = $('#favourite-users');
    var messageHtml = '';
    if (receiverId == data.senderId) {
        var elementLeftChat = document.querySelector(`#contact-id-${data.senderId}`);
        eleParentLeftChat.prepend(elementLeftChat);
        $.ajax({
            url: `/user/get-infor?id=${data.senderId}`,
            method: "GET",
            success: function (user) {
                messageHtml = `
                <li class="chat-list left">
                    <div class="conversation-list">
                        <div class="chat-avatar"><img src="${user.avatar}" alt="">
                        </div>
                        <div class="user-chat-content">
                            <div class="conversation-name">
                                <small class="text-muted time">${user.fullname}</small>
                            </div>
                            <div class="ctext-wrap">
                                <div class="ctext-wrap-content" id="1">
                                    <p class="mb-0 ctext-content">${data.message}</p>
                                </div>
                                <div class="reaction-icon-block">
                                    <div class="reaction-icon" data-chat-id="${data.chatId}"></div>
                                </div>
                            </div>
                            <div class="conversation-name">
                                <small class="text-muted time">${data.time}</small>
                            </div>

                        </div>
                    </div>
                </li>
                `;
                userConvensation.innerHTML += messageHtml;
                autoscroll();
                addEventReactChat();
            },
        })
    } else {
        var elementLeftChat = document.querySelector(`#contact-id-${data.receiverId}`);
        eleParentLeftChat.prepend(elementLeftChat);
        messageHtml = `
        <li class="chat-list right">
            <div class="conversation-list">
                <div class="user-chat-content">
                    <div class="ctext-wrap">
                        <div class="ctext-wrap-content" id="2">
                            <p class="mb-0 ctext-content">${data.message}</p>
                        </div>
                        <div class="reaction-icon-block">
                            <div class="reaction-icon" data-chat-id="${data.chatId}"></div>
                        </div>
                    </div>
                    <div class="conversation-name">
                        <small class="text-muted time">${data.time}</small>
                        <span class="text-success check-message-icon">
                            <i class="fal fa-check"></i>
                        </span>
                    </div>
                </div>
            </div>
        </li>`
        userConvensation.innerHTML += messageHtml;
        autoscroll();
        addEventReactChat();
    }

})

socket.on('getMessageGroup', (data) => {
    var eleParentLeftChat = $('#favourite-users');
    var messageHtml = '';
    var elementLeftChat = document.querySelector(`#group-id-${data.messId}`);
    eleParentLeftChat.prepend(elementLeftChat);
    if (user_id != data.senderId && messageId == data.messId) {
        $.ajax({
            url: `/user/get-infor?id=${data.senderId}`,
            method: "GET",
            success: function (user) {
                messageHtml = `
                <li class="chat-list left">
                    <div class="conversation-list">
                        <div class="chat-avatar"><img src="${user.avatar}" alt="">
                        </div>
                        <div class="user-chat-content">
                            <div class="conversation-name">
                                <small class="text-muted time">${user.fullname}</small>
                            </div>
                            <div class="ctext-wrap">
                                <div class="ctext-wrap-content" id="1">
                                    <p class="mb-0 ctext-content">${data.message}</p>
                                </div>
                                <div class="reaction-icon-block">
                                    <div class="reaction-icon" data-chat-id="${data.chatId}"></div>
                                </div>
                            </div>
                            <div class="conversation-name">
                                <small class="text-muted time">${data.time}</small>
                            </div>

                        </div>
                    </div>
                </li>
                `;
                userConvensation.innerHTML += messageHtml;
                autoscroll();
                addEventReactChat();
            },
        })
    } else if (user_id == data.senderId && messageId == data.messId){
        messageHtml = `
        <li class="chat-list right">
            <div class="conversation-list">
                <div class="user-chat-content">
                    <div class="ctext-wrap">
                        <div class="ctext-wrap-content" id="2">
                            <p class="mb-0 ctext-content">${data.message}</p>
                        </div>
                        <div class="reaction-icon-block">
                            <div class="reaction-icon" data-chat-id="${data.chatId}"></div>
                        </div>
                    </div>
                    <div class="conversation-name">
                        <small class="text-muted time">${data.time}</small>
                        <span class="text-success check-message-icon">
                            <i class="fal fa-check"></i>
                        </span>
                    </div>
                </div>
            </div>
        </li>`
        userConvensation.innerHTML += messageHtml;
        autoscroll();
        addEventReactChat();
    }

})

const addEventReactChat = () => {
    var reactionIcon = document.querySelectorAll('.reaction-icon')
    reactionIcon.forEach(ele => {
        ele.addEventListener('click', (e) => {
            chat_id = e.target.dataset.chatId;
            socket.emit('sendReactionChat', {
                senderId: user_id,
                receiverId: receiverId,
                chat_id: chat_id,
            })
            if (e.target.style.backgroundImage == '' || e.target.style.backgroundImage == 'url("https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png")') {
                e.target.style.backgroundImage = "url('https://i.pinimg.com/originals/39/44/6c/39446caa52f53369b92bc97253d2b2f1.png')"
            } else {
                e.target.style.backgroundImage = "url('https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png')"
            }
        })
    })
}
addEventReactChat();

socket.on('getReactionChat', (data) => {
    var chatElement = document.querySelector(`div[data-chat-id="${data.chat_id}"]`)
    if (chatElement.style.backgroundImage == '' || chatElement.style.backgroundImage == 'url("https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png")') {
        chatElement.style.backgroundImage = "url('https://i.pinimg.com/originals/39/44/6c/39446caa52f53369b92bc97253d2b2f1.png')";
    } else {
        chatElement.style.backgroundImage = "url('https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png')";
    }
})

socket.on('userOff', user => {
    var elementLeftChat = document.querySelector(`#contact-id-${user.userId}`);
    elementLeftChat.querySelector(".user-status").style.backgroundColor = "#495057";
    if (receiverId == user.userId) {
        document.querySelector("#users-chat").querySelector(".user-status").style.backgroundColor = "#495057"
        document.querySelector(".status-user-text").innerHTML = "Offline";
    }
})

