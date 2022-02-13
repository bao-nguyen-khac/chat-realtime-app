const btnNewGroup = document.querySelector('.btn-new-group');
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