var request = require('request');
var cheerio = require('cheerio');
var { WebClient } = require('@slack/web-api');

function checkAvailability(url) {
    //Paste the cookie of your browser when you manually check website with a browser
    const cookie = ""
    const req = {
        url: url,
        headers: {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "axios/0.18.0",
            "Cookie": cookie
        }
    }
    request(req, (error, response, body) => {
        if (error) {
            console.log(error);
        }
        console.log("Status code: " + response.statusCode);
        const $ = cheerio.load(body);

        const onlineStatus = $(".addToCartLabel_1eyxz").text().trim();
        const onlineDisabled = $(".button_1XJDJ.primary_1csTK.addToCartButton_1DQ8z.addToCartButton.regular_1e4gO.disabled_1VcOk").prop("disabled");
        const storeStatus = $(".content_3dXxd").text().trim();
        const storeDisabled = $(".button_2Xgu4.secondary_3qojI.x-reserveInStoreButton.button_3DPJc.reserveInStoreButton_1lmvr.undefined.regular_cDhX6.disabled_XY3i_").prop("disabled");
        console.log("Checking availablity for : " + url);
        console.log("Online status: " + onlineStatus);
        console.log("Add to Cart is disabled: " + onlineDisabled);
        console.log("Store status: " + storeStatus);
        console.log("Reserve In Store is disabled: " + storeDisabled);
        console.log("time: " + (new Date).toUTCString() + "\n");
        if (!onlineDisabled || !storeDisabled) {
            // An access token (from your Slack app or custom integration - xoxp, xoxb)
            // Choose one of following and paste your token value:
            // 1) create access tokens:
            // https://api.slack.com/legacy/custom-integrations/legacy-tokens
            // https://slack.com/help/articles/215770388-Create-and-regenerate-API-tokens
            // 2) create slack app
            // https://api.slack.com/start/overview#creating
            const token = "";

            const web = new WebClient(token);

            // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
            const conversationId = "";

            (async () => {
              // See: https://api.slack.com/methods/chat.postMessage
              const msg = "your product is available: " + url
              const res = await web.chat.postMessage({ channel: conversationId, text: msg});

              // `res` contains information about the posted message
              console.log("Message sent: ", res.ts);
            })();
        }
    });
}

const checkInventory = () => {
    //Paste the url for the product you want
    const color = "https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625"
    const grey = "https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-grey-joy-con/13817626"
    const urls = [color, grey]

    urls.forEach(checkAvailability)
}
console.log("Script starting...")
setInterval(checkInventory, 30000);