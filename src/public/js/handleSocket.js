const socket = io();
const user_id = document.querySelector('.passDataUserID').value;
const receiverId = document.querySelector('.passDataReceiverID').value;
const chatForm = document.querySelector('#chatinput-form');
const messageInput = document.querySelector('#chat-input');
const userConvensation = document.querySelector('#users-conversation');


const autoscroll = () => {
    // New message element
    var listElementMessNew = document.querySelectorAll('.user-chat-content');
    listElementMessNew[listElementMessNew.length - 1].scrollIntoView();
}
// autoscroll();
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth() + 1);
    var minutes = today.getMinutes() > 9 ? today.getMinutes() : '0' + today.getMinutes();
    var time = today.getHours() + ":" + minutes;
    var dateTime = time + ' | ' + date;
    socket.emit('sendMessage', {
        senderId: user_id,
        receiverId: receiverId,
        message: message,
        time: dateTime,
    })
    messageInput.value = '';
})

socket.on('getMessage', (data) => {
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
                                    <div class="reaction-icon"></div>
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
    }
    
})

socket.emit('join', user_id);

