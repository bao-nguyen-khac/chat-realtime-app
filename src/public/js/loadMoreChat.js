const btnLoadMore = document.querySelector('.load-more-chat')
var page = 1;
function convertTime(time) {
    var hour = moment(time).format("HH:mm");
    var date = moment(time).format("DD/MM");
    return hour + ' | ' + date;
}
btnLoadMore.addEventListener('click', () => {
    page += 1;
    $.ajax({
        url: `/message/paging-chat?messId=${messageId}&page=${page}`,
        method: "GET",
        success: function (data) {
            if (data) {
                const chatContent = $('.chat--content');
                var output = ``;
                data.forEach(element => {
                    if (element.type == 'text') {
                        if (element.user_id._id == user_id) {
                            output += `
                            <li class="chat-list right">
                                <div class="conversation-list">
                                    <div class="user-chat-content">
                                        <div class="ctext-wrap">
                                            <div class="ctext-wrap-content">
                                                <p class="mb-0 ctext-content">${element.content}</p>
                                            </div>
                                            <div class="reaction-icon-block">`
                            if (element.like.length == 0) {
                                output += `<div class="reaction-icon-disable" data-chat-id="${element._id}"></div>`
                            } else {
                                output += `<div class="reaction-icon-disable" data-chat-id="${element._id}"
                                    style='background-image: url("/img/like.png");'>
                                </div>`
                            }
                            if (element.totalLike == 0) {
                                output += `<div class="total-reactions"></div>`
                            } else {
                                output += `<div class="total-reactions">${element.totalLike}</div>`
                            }
                            output += `</div>
                                        </div>
                                        <div class="conversation-name">
                                            <small class="text-muted time">${convertTime(element.time)}</small>
                                            <span class="text-success check-message-icon">
                                                <i class="fal fa-check"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>`;
                        } else {
                            output += `
                            <li class="chat-list left">
                            <div class="conversation-list">
                                <div class="chat-avatar"><img src="${element.user_id.avatar}" alt="">
                                </div>
                                <div class="user-chat-content">
                                    <div class="conversation-name">
                                        <small class="text-muted time">${element.user_id.fullname}</small>
                                    </div>
                                    <div class="ctext-wrap">
                                        <div class="ctext-wrap-content">
                                            <p class="mb-0 ctext-content">${element.content}</p>
                                        </div>
                                        <div class="reaction-icon-block">`
                            if (element.like.length == 0) {
                                output += `<div class="reaction-icon" data-chat-id="${element._id}"></div>`
                            } else {
                                output += `<div class="reaction-icon" data-chat-id="${element._id}"
                                    style='background-image: url("/img/like.png");'>
                                </div>`
                            }
                            if (element.totalLike == 0) {
                                output += `<div class="total-reactions"></div>`
                            } else {
                                output += `<div class="total-reactions">${element.totalLike}</div>`
                            }
                            output += `</div>
                                    </div>
                                    <div class="conversation-name">
                                        <small class="text-muted time">${convertTime(element.time)}</small>
                                    </div>
    
                                </div>
                            </div>
                        </li>
                            `;
                        }
                    } else if(element.type == 'notify') {
                        if (element.user_id._id == user_id){
                            output += `<li class="chat-list notify-chat">
                            <span>You ${element.content}</span>
                        </li>`
                        } else{
                            output += `<li class="chat-list notify-chat">
                            <span>${element.user_id.fullname} ${element.content}</span>
                        </li>`
                        }
                    } else {
                        if (element.user_id._id == user_id){
                            output += `<li class="chat-list notify-chat">
                            <span>You added ${element.content} to group</span>
                        </li>`
                        } else{
                            output += `<li class="chat-list notify-chat">
                            <span>${element.user_id.fullname} has added ${element.content} to group</span>
                        </li>`
                        }
                    }
                });
                chatContent.prepend(output);
            } else{
                btnLoadMore.innerHTML = '';
            }
        }
    })
})
