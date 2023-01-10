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
    if (command === "lurk") {
        ComfyJS.Say("Have a nice lurk @" +
            user +
            "!! 🌺🌸");
    }
    if (flags.broadcaster || flags.mod) {
        if (command === "test") {
            ComfyJS.Say("replying to !test");
        }
        if (command === "clear") {
            chat.innerHTML = "";
            ComfyJS.Say("Cleared On-Screen Chatbox! 🧹🤖");
        }
    }
};
ComfyJS.onMessageDeleted = (id, extra) => {
    console.log(id, extra);
};
ComfyJS.Init("illu_illusion", "", "grat_grot10_berg");
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
