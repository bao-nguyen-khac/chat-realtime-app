const btnNewGroup = document.querySelector('.btn-new-group');
const formNewGroup = document.querySelector('.form-new-group');
btnNewGroup.addEventListener('click', () => {
    $.ajax({
        url: "/message/get-all-contact-sort",
        method: "GET",
        success: function (data) {
            let output = '<ul class="list-unstyled contact-list">';
            let arrChar = [];
            data.forEach(e => {
                if (!arrChar.some(a => a === e.fullname[0])) {
                    arrChar.push(e.fullname[0]);
                    output += `
                            <div class="contact-list-title">
                                ${e.fullname[0]}
                            </div>
                        `;
                }
                output += `
                        <li>
                            <div class="form-check">
                                <input id="memberCheck${e.id}" type="checkbox" name="list_ids_group" value="${e.id}" class="form-check-input">
                                <label for="memberCheck${e.id}" class="form-check-label">${e.fullname}</label>
                            </div>
                        </li>
                    `;
            })
            output += '</ul>';
            document.querySelector('.contacts-modal-group').innerHTML = output;
        }
    })
})
formNewGroup.onsubmit = (e) => {
    e.preventDefault();
    var nodeListMember = document.querySelectorAll('input[name="list_ids_group"]:checked');
    var numberMember = document.querySelectorAll('input[name="list_ids_group"]:checked').length;
    if (numberMember >= 2) {
        var group_name = document.querySelector('input[name="group_name"]').value;
        var group_desc = document.querySelector('textarea[name="group_desc"]').value;
        var list_ids_group = []
        nodeListMember.forEach(e => list_ids_group.push(e.value))
        $.ajax({
            url: "/message/new-group",
            method: "POST",
            data: {
                group_name: group_name,
                group_desc: group_desc,
                list_ids_group: list_ids_group
            },
            success: function (data) {
                if (data) {
                    var arrMemIdAndAva = data.member.map(e => ({ id: e._id, avatar: e.avatar }))
                    socket.emit('sendNewGroup', {
                        senderId: user_id,
                        nameGroup: data.name,
                        messId: data._id,
                        memberIdAndAva: arrMemIdAndAva
                    })
                    location.reload();
                }
            }
        })
    } else {
        document.querySelector('.notify-member-invalid').innerHTML = 'Group member must be greater than 2'
    }
}

socket.on('getNewGroup', (data) => {
    var eleParentLeftChat = $('#favourite-users');
    var elementLeftChat = `
    <li id="group-id-${data.messId}"
        class="chat-element-user ">
        <a href="/message?id=${data.messId}" class="unread-msg-user">
            <div class="d-flex align-items-center">
                <div class="chat-user-img online align-self-center me-2 ms-0">
                    <div class="avatars-group-sm">`;
    data.memberIdAndAva.forEach(e => {
        if (e.id != user_id) {
            elementLeftChat += `<span class="each-avatar size-avatar-sm">
                <img src="${e.avatar}">
            </span>`
        }
    })
    elementLeftChat += `</div><span class="user-status"></span>
                </div>
                <div class="overflow-hidden">
                    <p class="text-truncate mb-0">${data.nameGroup}</p>
                </div>
                <div class="ms-auto"><span class="badge badge-soft-dark rounded p-1"></span>
                </div>
            </div>
        </a>
    </li>
    `;
    eleParentLeftChat.prepend(elementLeftChat);
})