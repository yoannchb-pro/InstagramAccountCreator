const { getProxy } = require('./proxy');

(async () => {
    console.log(await getProxy());
})();