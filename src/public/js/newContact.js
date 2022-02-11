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
                    <span style="margin-left: 10px;">${data.user.fullname} </span> <span>(not contacted yet)</span>`;
                modalUser.innerHTML = output;
            }
        },
    })
})
formContact.onsubmit = (e) => {
    if (!checkSearch) {
        e.preventDefault();
        document.querySelector('.form-message').innerHTML = 'You must search to find user';
    } else {
        if (!checkPhone) {
            e.preventDefault();
            if (notFound) {
                document.querySelector('.form-message').innerHTML = '';
            } else {
                document.querySelector('.form-message').innerHTML = 'You and he (she) are contacted';
            }
        }
    }
}