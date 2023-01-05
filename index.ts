"use strict";
var chat = document.querySelector("#chat>ul") as HTMLElement;
//@ts-expect-error
ComfyJS.onChat = (user:any, message:any, flags:any, self:any, extra:any) => {
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