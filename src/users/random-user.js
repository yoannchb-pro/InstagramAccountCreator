const usersList = require('./names.json');

function* randomPasswordGenerator() {
    while (1) {
        let length = 9,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            pwd = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            pwd += charset.charAt(Math.floor(Math.random() * n));
        }
        yield pwd;
    }
}

const randomPassword = randomPasswordGenerator();

function getRandomUser() {
    const firstName = usersList[~~(Math.random() * usersList.length)];
    const lastName = usersList[~~(Math.random() * usersList.length)];
    const username = firstName + lastName + ~~(Math.random() * 1e3);
    return {
        firstName: firstName,
        lastName: lastName,
        username: username.toLowerCase(),
        fullName: firstName + " " + lastName,
        password: randomPassword.next().value
    }
}

module.exports = { getRandomUser };