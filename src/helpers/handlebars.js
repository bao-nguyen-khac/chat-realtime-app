const Handlebars = require('handlebars');
module.exports = {
    isSame: (a, b) => {
        return a == b;
    },
    compareID: (string, objectID) => {
        return string.equals(objectID)
    }
};