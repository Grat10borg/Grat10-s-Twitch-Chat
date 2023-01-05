"use strict";
var chat = document.querySelector("#chat>ul");
ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log(user, message, flags, self, extra);
    var newMessage = document.createElement("li");
    var text = document.createElement("blockquote");
    newMessage.innerText = user;
    text.innerText = message;
    newMessage.append(text);
    chat.append(newMessage);
};
ComfyJS.Init("grat_grot10_berg");
