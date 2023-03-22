const { Client, LocalAuth } = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
// const qrcode = require('qrcode');

// var respons = '';

// const client = new Client();
const client = new Client({
    authStrategy: new LocalAuth()
});

client.initialize();

const formatNumber = function (number){
    let formatted = '57'+number+'@c.us';
    return formatted;
}

// function return number is registered
const checkRegisteredNumber = async function(number){
    const isRegistered = await client.isRegisteredUser(formatNumber(number));
    return isRegistered;
}

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

// const sendMessage = function (number, message){
//     const num = formatNumber(number);
    
//     client.sendMessage(num, message).then(response => {
//         respons = 'enviado'
//     }).catch(err => {
//         return err;
//     });
//     return respons;
// }

module.exports.client = client;
module.exports.checkNumber  = checkRegisteredNumber;
module.exports.formatNumber  = formatNumber;
// module.exports.sendMessage = sendMessage;