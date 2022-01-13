// npm install net prompt crypto-js readline

const nickname = '';
const host = ''
const port = ''
const key = ''
const time = 1000         //enter refresh time in ms

var net = require('net');
const prompt = require('prompt');
var CryptoJS = require("crypto-js");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`\x1b[35m%s\x1b[0m`, "Type 1 for send message")
console.log(`\x1b[35m%s\x1b[0m`, "Type 2 for read message")
readline.question('Type: ', start => {
    readline.close();

    if (start === "1") {
        prompt.start();

        prompt.get(['message'], function (err, result) {
            if (err) { return onErr(err); }

            var send = getConn('Send');
            var p = 1;
            function getConn(connName){
                var option = {
                    host: `${host}`,
                    port: `${port}`
                }
                var client = net.createConnection(option, function () {
                    console.log(`\x1b[32m%s\x1b[0m`, `Successfully sent message`)
                });
                client.setTimeout(5000);
                client.setEncoding('utf8');

                client.on('data', function (data) {
                    console.log(data)
                });
                client.on('end',function () {
                    //console.log('Client socket disconnect. ');
                });
                client.on('timeout', function () {
                    //console.log('Client connection timeout. ');
                });
                client.on('error', function (err) {
                    //console.error(JSON.stringify(err));
                });
                return client;
            } 
            var hash = CryptoJS.AES.encrypt(`${nickname}:${result.message}`, `${key}`).toString();
            send.write(`${hash}`)
        });
    }
    if (start === "2") {
        console.log('\x1b[31m%s\x1b[0m',"Credits: trosecnik13")

        setInterval(picovina, time)

        function picovina() {
            var listen = getConn('Listen');
    
            function getConn(connName){
                var option = {
                    host: `${host}`,
                    port: `${port}`
                }
                var client = net.createConnection(option, function () {
                });
                client.setTimeout(1500);
                client.setEncoding('utf8');
        
                client.on('data', function (data) {
                    
                    var original = (CryptoJS.AES.decrypt(data, `${key}`).toString(CryptoJS.enc.Utf8));
                    var zpravy = original.split("\n")

                    var pocet = 1
                    console.clear()
                    console.log(`\x1b[31m%s\x1b[0m`, "---------------------------------------------------")

                    while (pocet < 18) {
                        var pole = zpravy[pocet].split(";")
                        console.log('\x1b[33m', pole[0], '\x1b[0m' + '\x1b[32m', pole[1], '\x1b[0m' + ":" + '\x1b[36m', pole[2], '\x1b[0m')

                        pocet = pocet + 1;
                    }

                    console.log(`\x1b[31m%s\x1b[0m`, "---------------------------------------------------")
                    console.log('\x1b[31m%s\x1b[0m', "Press CTRL+C to end!");  
                });
                client.on('end',function () {
                  //  console.log('Client socket disconnect. ');
                });
                client.on('timeout', function () {
                  //  console.log('Client connection timeout. ');
                });
                client.on('error', function (err) {
                  //  console.error(JSON.stringify(err));
                });
                return client;
            } 
            listen.write(`request`)
        }
    }
});