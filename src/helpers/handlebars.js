const Handlebars = require('handlebars');
var moment = require('moment');
module.exports = {
    isSame: (a, b) => {
        return a == b;
    },
    compareID: (string, objectID) => {
        return string.equals(objectID)
    },
    notSameId: (string, objectID) => {
        return !string.equals(objectID)
    },
    areMessageActive: (a, b) => {
        if (a.equals(b)) {
            return 'active';
        }
        return '';
    },
    areMessageRead: (a, b) => {
        if (a !== b) {
            return 'unread-msg-user';
        }
        return '';
    },
    numMessageRead: (a, b) => {
        if (a == b) {
            return '';
        }
        return a
    },
    convertTime: (time) => {
        var hour = moment(time).format("HH:mm");
        var date = moment(time).format("DD/MM");
        return hour + ' | ' + date;
    },
    isEmptyArr: (arr) => {
        return arr.length === 0;
    }
};