var btnInfo = document.querySelector('.icon-show-info');
var userInfo = document.querySelector('.user-profile-sidebar');
var btnCloseInfo = document.querySelector('.btn-close-user-info');
var iconCloseInfo = document.querySelector('.icon-close-user-info');
var btnCloseResponsive = document.querySelector('.btn-close-responsive');
var listElementChat = document.querySelectorAll('.chat-element-user');
var listElementMess = document.querySelectorAll('.user-chat-content');
var reactionIcon = document.querySelectorAll('.reaction-icon');
listElementMess[listElementMess.length - 1].scrollIntoView();
btnInfo.addEventListener('click', () => {
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

reactionIcon.forEach(ele => {
    ele.addEventListener('click', (e) => {
        if(e.target.style.backgroundImage == '' || e.target.style.backgroundImage == 'url("https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png")'){
            e.target.style.backgroundImage = "url('https://i.pinimg.com/originals/39/44/6c/39446caa52f53369b92bc97253d2b2f1.png')"
        }else{
            e.target.style.backgroundImage = "url('https://icones.pro/wp-content/uploads/2021/04/icone-noire-noir.png')"
        }
    })
})