"use strict";
var chat = document.querySelector("#chat>ul");
let ClearOldChatMSGsAfter = 11;
ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log(user);
    console.log(message);
    console.log(flags);
    console.log(self);
    console.log(extra);
    if (flags.broadcaster || flags.mod) {
        CreateChatText(message, user, "none", "none", ["none", "none"]);
    }
    else {
        CreateChatText(message, user, "none", "none", ["none", "none"]);
    }
};
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (flags.broadcaster || flags.mod && command === "test") {
        console.log("!test was typed in chat");
        ComfyJS.Say("replying to !test");
    }
};
ComfyJS.onMessageDeleted = (id, extra) => {
    console.log(id, extra);
};
ComfyJS.Init("illu_illusion", "oauth:ittskpnutx42o6zlmps13yotc9zylg", "grat_grot10_berg");
function CreateChatText(message, user, colour, profilePic, emotes) {
    var _a;
    var newMessage = document.createElement("li");
    var text = document.createElement("blockquote");
    newMessage.innerText = user;
    text.innerText = message;
    newMessage.append(text);
    chat.append(newMessage);
    if (chat.getElementsByTagName("li").length > ClearOldChatMSGsAfter) {
        (_a = chat.firstElementChild) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
