function joinRoom(roomName){

	nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) =>{
		document.querySelector("span.curr-room-num-users").innerHTML = newNumberOfMembers + ` <span class="glyphicon glyphicon-user"></span>`
	})
	nsSocket.on("historyCatchUp", (history)=> {
		const messageUl = document.querySelector( "#messages" )
		messageUl.innerHTML = ""
		history.forEach(item=> {
			const newMsg = buildHTML(item)
			const currentMsg = messageUl.innerHTML
			messageUl.innerHTML = currentMsg + newMsg
		})
	})
	nsSocket.on("updateMembers", (num) => {
		document.querySelector("span.curr-room-num-users").innerHTML = num + ` <span class="glyphicon glyphicon-user"></span>` 
			document.querySelector("span.curr-room-text").innerHTML = roomName

	})
  
};