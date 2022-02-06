const socket = io();
const user_id = document.querySelector('.passDataUserIdSub').value;

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
    console.log(data);
    data.forEach(e => {
        var elementLeftChat = document.querySelector(`#contact-id-${e}`);
        elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
    })
})

socket.on('sendMeOnline', data => {
    var elementLeftChat = document.querySelector(`#contact-id-${data}`);
    elementLeftChat.querySelector(".user-status").style.backgroundColor = "#06d6a0";
})

socket.on('userOff', user => {
    var elementLeftChat = document.querySelector(`#contact-id-${user.userId}`);
    elementLeftChat.querySelector(".user-status").style.backgroundColor = "#495057";
})

