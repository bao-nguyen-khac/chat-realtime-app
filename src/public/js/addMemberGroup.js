const btnAddNewMem = document.querySelector('.btn-chat-add-member');
var listMembers = [];
var listMemberSelect = document.querySelectorAll('.passMembersId')
listMemberSelect.forEach(memId => {
    listMembers.push(memId.value)
});
btnAddNewMem.addEventListener('click', () => {
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
                if (listMembers.some(a => a == e.id)) {
                    output += `
                            <li>
                                <div class="form-check">
                                    <input type="checkbox" value="${e.id}" class="form-check-input" checked disabled>
                                    <label class="form-check-label">${e.fullname} (joined)</label>
                                </div>
                            </li>
                        `;
                } else {
                    output += `
                            <li>
                                <div class="form-check">
                                    <input type="checkbox" id="memberCheck${e.id}" name="list_member_add" value="${e.id}" class="form-check-input">
                                    <label for="memberCheck${e.id}" class="form-check-label">${e.fullname}</label>
                                </div>
                            </li>
                        `;
                }

            })
            output += '</ul>';
            document.querySelector('.contacts-add-new-mem').innerHTML = output;
        }
    })
})