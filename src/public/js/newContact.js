var notFound = false;
var checkPhone = false;
var checkSearch = false;
var btnSearch = document.querySelector('.modal-contact-btn-search');
var modalUser = document.querySelector('.modal-contact-avatar');
var formContact = document.querySelector('#form-1');
btnSearch.addEventListener('click', () => {
    var searchValue = document.querySelector('#addcontactphone-input').value;
    $.ajax({
        url: "/user/search-contact",
        method: "POST",
        data: {
            phone: searchValue,
        },
        success: function (data) {
            document.querySelector('.form-message').innerHTML = '';
            notFound = true;
            checkPhone = false;
            checkSearch = true;
            if (data === 'Not found') {
                var output = `<span style="color: #f33a58;"> This phone number is not activated on this app </span>`;
                modalUser.innerHTML = output;
            } else if (data.contacted == 1) {
                document.querySelector('.form-message').innerHTML = '';
                notFound = false;
                checkPhone = false;
                checkSearch = true;
                var output = `<img src="${data.user.avatar}" alt="" class="rounded-circle avatar-sm">
                    <span style="margin-left: 10px;">${data.user.fullname} </span> <span>(contacted)</span>`;
                modalUser.innerHTML = output;
            } else {
                document.querySelector('.form-message').innerHTML = '';
                notFound = false;
                checkPhone = true;
                checkSearch = true;
                var output = `<img src="${data.user.avatar}" alt="" class="rounded-circle avatar-sm">
                    <span style="margin-left: 10px;">${data.user.fullname} </span> <span>(not contacted yet)</span>
                    <input type="hidden" class="passReceiverIdNewContact" value="${data.user._id}">`;
                modalUser.innerHTML = output;
            }
        },
    })
})
formContact.onsubmit = (e) => {
    e.preventDefault();
    if (!checkSearch) {
        document.querySelector('.form-message').innerHTML = 'You must search to find user';
    } else {
        if (!checkPhone) {
            if (notFound) {
                document.querySelector('.form-message').innerHTML = '';
            } else {
                document.querySelector('.form-message').innerHTML = 'You and he (she) are contacted';
            }
        } else {
            var receiverIdNewContact = document.querySelector('.passReceiverIdNewContact')?.value;
            var message = document.querySelector('#addcontact-invitemessage-input').value;
            var today = new Date();
            var hour = moment(today).format("HH:mm");
            var date = moment(today).format("DD/MM");
            var dateTime = hour + ' | ' + date;
            var phone = document.querySelector('#addcontactphone-input').value;
            $.ajax({
                url: "/user/new-contact",
                method: "POST",
                data: {
                    phone: phone,
                    message: message,
                },
                success: function (data) {
                    if (data) {
                        for (member of data.member) {
                            if (member._id == user_id) {
                                socket.emit('sendNewContact', {
                                    senderId: user_id,
                                    fullname: member.fullname,
                                    avatar: member.avatar,
                                    receiverId: receiverIdNewContact,
                                    message: message,
                                    messId: data._id,
                                    time: dateTime,
                                })
                                location.reload();
                            }
                        }
                    }
                }
            })
        }
    }
}
socket.on('getNewContact', (data) => {
    var eleParentLeftChat = $('#favourite-users');
    var elementLeftChat = `
    <li id="contact-id-${data.senderId}"
        class="chat-element-user ">
        <a href="/message?id=${data.messId}" class="unread-msg-user">
            <div class="d-flex align-items-center">
                <div class="chat-user-img online align-self-center me-2 ms-0">
                    <img src="${data.avatar}" class="rounded-circle avatar-xs" alt="">
                    <span class="user-status"></span>
                </div>
                <div class="overflow-hidden">
                    <p class="text-truncate mb-0">${data.fullname}</p>
                </div>
                <div class="ms-auto"><span class="badge badge-soft-dark rounded p-1">1</span>
                </div>
            </div>
        </a>
    </li>
    `;
    eleParentLeftChat.prepend(elementLeftChat);
})