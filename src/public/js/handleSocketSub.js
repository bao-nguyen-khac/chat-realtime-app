const socket = io();
const user_id = document.querySelector('.passUserID').value;

$.ajax({
    url: `/message/get-all-contact`,
    method: "GET",
    success: function (allContact) {
        socket.emit('join', {
            userId: user_id,
            allContact: allContact
        });
    }
})
socket.on('sendUserOnline', data => {
    data.forEach(e => {
        if (e.type == 'single') {
            var elementLeftChat = document.querySelector(`#contact-id-${e.userId}`);
            elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
        } else {
            var elementLeftChat = document.querySelector(`#group-id-${e.messageId}`);
            elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
        }
    })
})

socket.on('sendMeOnline', data => {
    if (data.type == 'single') {
        var elementLeftChat = document.querySelector(`#contact-id-${data.userId}`);
        elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
    } else if (data.senderId != user_id) {
        var elementLeftChat = document.querySelector(`#group-id-${data.messId}`);
        elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
    }
})

socket.on('getMessageSingle', (data) => {
    var eleParentLeftChat = $('#favourite-users');
    var elementLeftChat = document.querySelector(`#contact-id-${data.senderId}`);
    elementLeftChat.querySelector('a').classList.add("unread-msg-user");
    var numUnRead = elementLeftChat.querySelector('.badge').innerHTML;
    numUnRead = numUnRead ? parseInt(numUnRead) + 1 : 1;
    elementLeftChat.querySelector('.badge').innerHTML = numUnRead;
    eleParentLeftChat.prepend(elementLeftChat);

})
socket.on('getMessageGroup', (data) => {
    var eleParentLeftChat = $('#favourite-users');
    var elementLeftChat = document.querySelector(`#group-id-${data.messId}`);
    elementLeftChat.querySelector('a').classList.add("unread-msg-user");
    var numUnRead = elementLeftChat.querySelector('.badge').innerHTML;
    numUnRead = numUnRead ? parseInt(numUnRead) + 1 : 1;
    elementLeftChat.querySelector('.badge').innerHTML = numUnRead;
    eleParentLeftChat.prepend(elementLeftChat);
})

socket.on('userOff', user => {
    var elementLeftChat = document.querySelector(`#contact-id-${user.userId}`);
    elementLeftChat.querySelector(".user-status").style.backgroundColor = "#495057";
})