const fs = require('fs');

function getInstagramCode(msg = "") {
    return msg.replace("is your Instagram code", "").trim();
}

function writeFile(filename, content) {
    fs.writeFile("./results/" + filename + ".json", JSON.stringify(content, undefined, 4), function(err) {
        if (err) return console.log(err);
        console.log("File writed in 'results' folder");
    });
}

function sleepTime(time) {
    return new Promise((resolve) => {
        setTimeout(e => resolve(), time);
    })
}

module.exports = { getInstagramCode, writeFile, sleepTime };