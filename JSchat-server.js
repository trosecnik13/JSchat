var net = require('net');
const fs = require("fs");
var CryptoJS = require("crypto-js");

const key = ''

var server = net.createServer(function(client) {
    console.log(`New connection, local address: ${client.localAddress}:${client.localPort} , Remote address: ${client.remoteAddress}:${client.remotePort}`)
    client.setEncoding('utf-8');
    client.setTimeout(1000);

    client.on('data', function (data) {

        if (data === "request") {

            fs.readFile('.txt', (err, number) => {
                if (err) throw err;
                console.log(parseInt(number))
    
                console.log(data)
                fs.readFile('.txt', (err, txt) => {
                    if (err) throw err;

                    var pole = String(txt).split("\n")
                    //console.log(pole[parseInt(number) - 9] + "\n" + pole[parseInt(number) - 8] + "\n" + pole[parseInt(number) - 7] + "\n" + pole[parseInt(number) - 6] + "\n" + pole[parseInt(number) - 5] + "\n" + pole[parseInt(number) - 4] + "\n" + pole[parseInt(number) - 3] + "\n" + pole[parseInt(number) - 2] + "\n" + pole[parseInt(number) - 1] + "\n" + pole[parseInt(number)])
                    var content = (pole[parseInt(number) - 19] + "\n" + pole[parseInt(number) - 18] + "\n" + pole[parseInt(number) - 17] + "\n" + pole[parseInt(number) - 16] + "\n" + pole[parseInt(number) - 15] + "\n" + pole[parseInt(number) - 14] + "\n" + pole[parseInt(number) - 13] + "\n" + pole[parseInt(number) - 12] + "\n" + pole[parseInt(number) - 11] + "\n" + pole[parseInt(number) - 10] + pole[parseInt(number) - 9] + "\n" + pole[parseInt(number) - 8] + "\n" + pole[parseInt(number) - 7] + "\n" + pole[parseInt(number) - 6] + "\n" + pole[parseInt(number) - 5] + "\n" + pole[parseInt(number) - 4] + "\n" + pole[parseInt(number) - 3] + "\n" + pole[parseInt(number) - 2] + "\n" + pole[parseInt(number) - 1] + "\n" + pole[parseInt(number)])
                    var hash = CryptoJS.AES.encrypt(`${content}`, `${key}`).toString();
                    client.end(hash)
                })
            })
        }
        else {
            console.log("data: " + data)
            var original = (CryptoJS.AES.decrypt(data, `${key}`).toString(CryptoJS.enc.Utf8));

            console.log("original: " + original)
            var split = original.split(":")
            var name = split[0]
            var message = split[1]

            fs.readFile('.txt', (err, number) => {
                if (err) throw err;
                var numbr = (parseInt(number) + 1)
                console.log(numbr)

                fs.writeFile('.txt', String(numbr), function (error) { 
                    if (error) return console.log(error);  
                 })

                const currentdate = new Date(); 
                const den = currentdate.getDate() + ","
                + (currentdate.getMonth()+1);
                const datetime = "" + currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate() + "/"  
                + (currentdate.getHours() + 1) + ":" 
                + currentdate.getMinutes();
                

                fs.appendFile('.txt', "[" + datetime + "]" + ";" + name + ";" + message.toString() + '\n', { replace: false, append: true }, function (error) { 
                   if (error) return console.log(error);  
                })
    
                client.end()
            })
        }
    });

    client.on('end', function () {
     //   console.log('Client disconnect.');

        server.getConnections(function (err, count) {
            if(err)
            {
                console.error(JSON.stringify(err));
            }
        });
    });
    client.on('timeout', function () {
        console.log('Client request time out. ');
    })
});

server.listen(9696, function () {
    var serverInfo = server.address();
    var serverInfoJson = JSON.stringify(serverInfo);
    console.log('TCP server listen on address : ' + serverInfoJson);
    server.on('close', function () {
        console.log('TCP server socket is closed.');
    });
    server.on('error', function (error) {
        console.error(JSON.stringify(error));
    });
});