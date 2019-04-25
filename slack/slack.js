const express = require( 'express' );
const app = express();
const socketio = require( 'socket.io' )
const fs = require( "fs" )


function* generator() { yield fs.readFileSync( "./db.json", "utf8", ( err, res ) => res ) }
const namespaces = JSON.parse( generator().next().value )

app.use( express.static( __dirname + '/public' ) );
const expressServer = app.listen( 9000 );
const io = socketio( expressServer );

io.on( "connection", ( socket ) => { console.log(Math.random())
    let nsData = namespaces.map( item => {
        return {
            img: item.img,
            endpoint: item.endpoint
        }
    } )
    socket.emit( "nsList", nsData )
} )

namespaces.forEach( ns => {
    io.of( ns.endpoint ).on( "connection", nsSocket => {
        console.log( `${nsSocket.id} has joined ${ns.endpoint}` )
        nsSocket.emit( "nsRoomLoad", ns.rooms )
        nsSocket.on( "joinRoom", ( roomToJoin, numberOfUsersCallback ) => {
            const roomTitle = Object.keys(nsSocket.rooms)[1]
            nsSocket.leave(roomTitle)
            nsSocket.join( roomToJoin )

            ns.rooms.forEach(item => {
                if(item.roomTitle == roomToJoin) {
                    nsSocket.emit("historyCatchUp", item.history)
                } 
            }) 
            io.of(ns.endpoint).in(roomToJoin).clients( (err, clients) => {
                io.of(ns.endpoint).in(roomToJoin).emit("updateMembers", clients.length)
            }) 
            

        } )
        nsSocket.on( "newMessageToServer", ( msg ) => {
         const roomTitle = Object.keys(nsSocket.rooms)[1]
         const fullMsg = {
            text:msg.text,
            time: new Date().getTime(),
            username: "mehdi",
            avatar: "https://via.placeholder.com/30"
        }

 nsSocket.emit("messageToClients", fullMsg)

        namespaces[ns.id].rooms.forEach(item => {
            if(item.roomTitle == msg.roomName) { 
                console.log(ns.endpoint, fullMsg)

                item.history.push(fullMsg)
                fs.writeFile("./db.json", JSON.stringify(namespaces, null, 2), (err) =>{ if(err) throw err
                else { io.of(ns.endpoint).in(msg.roomName).emit("messageToClients", fullMsg)} 
                 }) 
                

            }

        })
        



    } )
    } )

} )

