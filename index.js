"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var chat = document.querySelector("#chat>ul");
let ClearOldChatMSGsAfter = 11;
let AppAcessToken = "gksx1g5gtd21dukq6t3cdafslng28t";
let AclientId = "";
validateToken();
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
        ComfyJS.Say("Have a nice lurk @" + user + "!! 🌺🌸");
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
ComfyJS.Init("illu_illusion", "oauth:ittskpnutx42o6zlmps13yotc9zylg", "grat_grot10_berg");
var ChatProfiles = Array();
function CreateChatText(message, user, colour, profilePic, emotes) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let profilePicIMG = document.createElement("img");
        if (ChatProfiles.indexOf(user) == -1) {
            let User = yield HttpCalling("https://api.twitch.tv/helix/users?login=" + user);
            console.log(User);
            profilePicIMG.src = User["data"][0]["profile_image_url"];
            ChatProfiles.push(User["data"][0]["login"] + "#" + User["data"][0]["profile_image_url"]);
        }
        else {
            console.log(ChatProfiles);
            profilePicIMG.src = ChatProfiles[ChatProfiles.indexOf(user)];
        }
        let newMessage = document.createElement("li");
        let chatBorder = document.createElement("div");
        let UserprofileLine = document.createElement("div");
        let Username = document.createElement("div");
        let messageP = document.createElement("p");
        chatBorder.classList.add("ChatBorder");
        UserprofileLine.classList.add("UserProfileLine");
        profilePicIMG.classList.add("ProfilePicture");
        Username.classList.add("Username");
        messageP.classList.add("Message");
        Username.innerHTML = user + ":";
        messageP.innerHTML = message;
        UserprofileLine.append(profilePicIMG);
        UserprofileLine.append(Username);
        chatBorder.append(UserprofileLine);
        chatBorder.append(messageP);
        newMessage.append(chatBorder);
        chat.append(newMessage);
        if (chat.getElementsByTagName("li").length > ClearOldChatMSGsAfter) {
            (_a = chat.firstElementChild) === null || _a === void 0 ? void 0 : _a.remove();
        }
    });
}
function validateToken() {
    return __awaiter(this, void 0, void 0, function* () {
        if (AppAcessToken != undefined &&
            AppAcessToken != "" &&
            AppAcessToken != null) {
            yield fetch("https://id.twitch.tv/oauth2/validate", {
                headers: {
                    Authorization: "Bearer " + AppAcessToken,
                },
            })
                .then((resp) => resp.json())
                .then((resp) => {
                if (resp.status) {
                    if (resp.status == 401) {
                        console.log("This token is invalid ... " + resp.message);
                        return 0;
                    }
                    console.log("Unexpected output with a status");
                    return 0;
                }
                if (resp.client_id) {
                    AclientId = resp.client_id;
                    console.log("Token Validated Sucessfully");
                    return 1;
                }
                console.log("unexpected Output");
                return 0;
            })
                .catch((err) => {
                console.log(err);
                return 0;
            });
            return 1;
        }
        else {
            return 0;
        }
    });
}
function HttpCalling(HttpCall) {
    return __awaiter(this, void 0, void 0, function* () {
        const respon = yield fetch(`${HttpCall}`, {
            headers: {
                Authorization: "Bearer " + AppAcessToken,
                "Client-ID": AclientId,
            },
        })
            .then((respon) => respon.json())
            .then((respon) => {
            return respon;
        })
            .catch((err) => {
            console.log(err);
            return err;
        });
        return respon;
    });
}
