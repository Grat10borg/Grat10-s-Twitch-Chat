"use strict";
var chat = document.querySelector("#chat>ul");
//@ts-expect-error
ComfyJS.onChat = function (user, message, flags, self, extra) {
    console.log(user, message);
    var newMessage = document.createElement("li");
    var text = document.createElement("blockquote");
    newMessage.innerText = user;
    text.innerText = message;
    newMessage.append(text);
    chat.append(newMessage);
};
//@ts-expect-error
ComfyJS.Init("grat_grot10_berg");
