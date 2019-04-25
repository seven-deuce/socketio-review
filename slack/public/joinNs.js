function joinNs( endpoint ) {
   console.log( "i am joined", Math.random() )
   if ( nsSocket ) {
      nsSocket.close;
      document.querySelector( "#user-input").removeEventListener( "submit", formSubmission )

   }
   nsSocket = io( 'http://localhost:9000' + endpoint )
   nsSocket.on( "nsRoomLoad", ( rooms ) => {
      const roomList = document.querySelector( ".room-list" )
      roomList.innerHTML = ""
      rooms.forEach( item => {
         roomList.innerHTML += `<li class="room"><span class="glyphicon 
   glyphicon-${item.privateRoom ? `lock` : `globe`}"></span>${item.roomTitle}</li>`
      } )
      const roomNodes = document.querySelectorAll( "li.room" )
      Array.from( roomNodes ).forEach( item => {
         item.addEventListener( "click", ( event ) => {
            joinRoom(event.target.innerText)
         } )
      } )
      const topRoomName = document.querySelector( "li.room" ).innerText
      // joinRoom( topRoomName )
   } )
   nsSocket.on( "messageToClients", ( msg ) => {
    console.log(msg)
      document.querySelector( "#messages" ).innerHTML += buildHTML( msg )
   } )
   document.querySelector( "#user-input" ).addEventListener( "submit", formSubmission )
}

function formSubmission( event ) {
   event.preventDefault()
   const newMessage = document.querySelector( "#user-message" ).value
   nsSocket.emit( "newMessageToServer", { text: newMessage, 
    roomName: document.querySelector( "span.curr-room-text" ).innerText } )

}

function buildHTML( msg ) {
   return `<li>
    <div class="user-image">
    <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
    <div class="user-name-time">${msg.username} <span>${new Date(msg.time).toLocaleTimeString().match(/\d+:\d+/)}    </span></div>
    <div class="message-text">${msg.text.toString()}</div>
    </div>
    </li>`

}