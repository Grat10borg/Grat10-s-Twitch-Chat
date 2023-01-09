"use strict";
var chat = document.querySelector("#chat>ul");
ComfyJS.onChat = (user, message, flags, self, extra) => {
    if (extra["userBadges"]["broadcaster"] == 1 || extra["userBadges"]["mod"] == 1) {
        CreateChatText(message, user, "none", "none", ["none", "none"]);
    }
    else {
        CreateChatText(message, user, "none", "none", ["none", "none"]);
    }
};
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (flags.broadcaster && command === "test") {
        console.log("!test was typed in chat");
    }
};
ComfyJS.Init("grat_grot10_berg");
function CreateChatText(message, user, colour, profilePic, emotes) {
    var _a;
    var newMessage = document.createElement("li");
    var text = document.createElement("blockquote");
    newMessage.innerText = user;
    text.innerText = message;
    newMessage.append(text);
    chat.append(newMessage);
    if (chat.getElementsByTagName("li").length > 19) {
        (_a = chat.firstElementChild) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
