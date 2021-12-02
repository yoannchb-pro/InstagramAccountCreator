const got = require("got");

async function getProxy(){
    const response = await got("http://pubproxy.com/api/proxy?last_check=60&speed=7").json();
    return response.data[0].ipPort;
}

module.exports = { getProxy };