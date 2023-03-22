const wpp = require('./services/wppweb');
const qrcode = require('qrcode');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) =>{

    res.sendFile('index.html', {root: __dirname});
    
});

// Socket IO
io.on('connection', function(socket){
    socket.emit('message', 'Conectando...');

    wpp.client.on('qr', (qr) => {
        // qrcode.generate(qr);
        console.log('QR RECEIVED', qr);
        
        qrcode.toDataURL(qr, (err, url)=> {
            socket.emit('qr', url);
            socket.emit('message', 'Codigo QR recivido, por favor escanearlo.');
        });
    });

    wpp.client.on('ready', () => {
        socket.emit('message', 'Whatsapp conectado!');
    });

});


//Enviar mensajes
app.post('/send-message', async (req, res) => {
    const number =  req.body.number;
    const message = req.body.message;

    const isRegisterdNumber = await wpp.checkNumber(number);
    if(!isRegisterdNumber){
        return res.status(402).json({
            status: false,
            response: 'Número no registrado'
        });
    }

    wpp.client.sendMessage(wpp.formatNumber( number ), message).then(response => {
        res.status(200).json({
            status: true,
            response: response
        });
    }).catch(err => {
        res.status(500).json({
            status: false,
            response: err
        });
    });
});

// app.post('/send-message', (req, res) => {
//     const number = req.body.number;
//     const message = req.body.message;
//     const msn =  wpp.sendMessage(number, message);
    
//     if(msn == 'enviado'){
//         res.status(200).json({
//             status: true,
//             response: msn
//         });
//     }else{
//         res.status(500).json({
//             status: false,
//             response: msn
//         });
//     }
// });

// Verificar numero Wpp
app.get('/verify/:number', async (req, res) => {
    const number = req.params.number;
    const isRegisterdNumber = await wpp.checkNumber(number);

    if(!isRegisterdNumber){
        res.status(402).json({
            status: false,
            response: 'Número no registrado'
        });
    }else{
        res.status(200).json({
            status: true,
            response: 'Número registrado'
        });
    }
    
});

server.listen(8000, function(){
    console.log('App corriendo en *: 8000');
})