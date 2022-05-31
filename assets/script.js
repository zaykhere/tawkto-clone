  

  let div = document.createElement("div");  

  //First Div that is chat-bubble  
  let elem1 = document.createElement("div");
  elem1.classList.add('chat-bubble');
 
  
  let elem1Msgs = document.createElement("div");
  elem1Msgs.classList.add('msgs');

  let elem1Status = document.createElement("div");
  elem1Status.classList.add('status');

  elem1.appendChild(elem1Msgs);
  elem1.appendChild(elem1Status);

  document.body.appendChild(elem1);

  //Second document.createElement("div").... chatbox hide
  let elem2 = document.createElement("div");
  elem2.classList.add("chat-box", "hide");
  document.body.appendChild(elem2);

  //Create Messages document.createElement("div")
  let elem2Messages = document.createElement("div");
  elem2Messages.classList.add('messages');
  elem2.appendChild(elem2Messages);

  let elem2Msg = document.createElement("div");
  elem2Msg.classList.add("msg");
  elem2Msg.textContent = "Kathlyn : Hey! what's up?";
  elem2Messages.appendChild(elem2Msg);

  //Elem 2 input holder
  let elem3 = document.createElement("div");
  elem3.classList.add('input-holder');
  elem2.appendChild(elem3);

  //control element
  let elem3Control = document.createElement("div");
  elem3Control.classList.add("control");
  elem3.appendChild(elem3Control);

  let elem3Input = document.createElement("input");
  elem3Input.type = "text";
  elem3Input.classList.add("chat-input");

  let elem3Button = document.createElement("button");
  elem3Button.textContent = "Send";
  elem3Button.classList.add('chat-btn');

  //Adding input and button to elem3
  elem3Control.appendChild(elem3Input);
  elem3Control.appendChild(elem3Button);

  var chatBubble = document.querySelector(".chat-bubble");
  var chatBox = document.querySelector('.chat-box');

    chatBubble.addEventListener("click", function(e){
	chatBox.classList.toggle('hide');
	chatBubble.classList.toggle('chat-bubble-hover');
})  
  var socket = io("http://localhost:3000/chat");

  var chatBtn = document.querySelector('.chat-btn');
  var input = document.querySelector('.chat-input');
  var messages = document.querySelector(".messages");

  input.addEventListener("keypress", function(event){
    if (event.key === "Enter") {
        event.preventDefault();
        if (input.value) {
      socket.emit('chat-message', input.value);
      input.value = '';
    }
    }
  })

  chatBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat-message', input.value);
      input.value = '';
    }
  });

  socket.on('chat-message', function(msg) {
    var item = document.createElement('div');
    item.classList.add('msg');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
