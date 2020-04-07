var request = require('request');
var cheerio = require('cheerio');


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
        const status = $(".fulfillment-add-to-cart-button div button").text().trim();
        const disabled = $(".fulfillment-add-to-cart-button div button").prop("disabled");
        console.log("Checking availablity for : " + url);
        console.log("Inventory status: " + status);
        console.log("Button is disabled: " + disabled);
        console.log("time: " + (new Date).toUTCString() + "\n");
        if (status !== "Sold Out" && !disabled) {
            const { WebClient } = require('@slack/web-api');
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
    const color = "https://www.bestbuy.com/site/nintendo-switch-32gb-console-neon-red-neon-blue-joy-con/6364255.p?skuId=6364255"
    const ac = "https://www.bestbuy.com/site/nintendo-switch-animal-crossing-new-horizons-edition-32gb-console-multi/6401728.p?skuId=6401728"
    const grey = "https://www.bestbuy.com/site/nintendo-switch-32gb-console-gray-joy-con/6364253.p?skuId=6364253"
    const pink = "https://www.bestbuy.com/site/nintendo-switch-32gb-lite-coral/6257148.p?skuId=6257148"

    const urls = [color, ac, grey, pink]
    urls.forEach(checkAvailability)
}
console.log("Script starting...")
setInterval(checkInventory, 30000);