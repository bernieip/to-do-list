// create function to get the current "date" and export it to it app.js
exports.getDate = function () {
    const today = new Date();
    const options = {
        weekday: "long", // Saturday
        day: "numeric", // 17
        month: "long" // September
    };
// "en-US = 9/17/2016, options = Saturday, September 17, 2016
    return today.toLocaleDateString("en-US", options);
};

// create function to get the current "day" and export it to it app.js
exports.getDay = function() {
    const today = new Date();
    const options = {
        weekday: "long", // Saturday
    };
// "en-US = 9/17/2016, options = Saturday, September 17, 2016
    return today.toLocaleDateString("en-US", options);
};

