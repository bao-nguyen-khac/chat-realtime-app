var btnInfo = document.querySelector('.icon-show-info');
var userInfo = document.querySelector('.user-profile-sidebar');
var btnCloseInfo = document.querySelector('.btn-close-user-info');
var iconCloseInfo = document.querySelector('.icon-close-user-info');
var btnCloseResponsive = document.querySelector('.btn-close-responsive');
var listElementChat = document.querySelectorAll('.chat-element-user');
var listElementMess = document.querySelectorAll('.user-chat-content');

btnInfo?.addEventListener('click', () => {
    if(userInfo.classList.contains('d-block')){
        userInfo.classList.remove('d-block')
    }else{
        userInfo.classList.add('d-block')
    }
})
btnCloseInfo.addEventListener('click', () => {
    userInfo.classList.remove('d-block')
})
iconCloseInfo.addEventListener('click', () => {
    userInfo.classList.remove('d-block')
})
btnCloseResponsive.addEventListener('click', () => {
    document.querySelector('.user-chat').classList.remove('user-chat-show');
})
listElementChat.forEach(element => {

    element.addEventListener('click', () => {
        if(!document.querySelector('.user-chat').classList.contains('user-chat-show')){
            document.querySelector('.user-chat').classList.add('user-chat-show');
        }
    })
});

