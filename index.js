"use strict";
var chat = document.querySelector("#chat>ul");
let ClearOldChatMSGsAfter = 11;
let BadgeSizeGet = "Medium";
let AppAcessToken = config.MY_API_TOKEN;
var broadcaster_id;
let AclientId = "";
var AllBadges = Array();
let ChatNames = Array();
let ChatProfileLink = Array();
validateToken();
ComfyJS.onChat = (user, message, flags, self, extra) => {
    console.log(user);
    console.log(message);
    console.log(flags);
    console.log(self);
    console.log(extra);
    if (flags.broadcaster || flags.mod) {
        CreateChatText(message, user, extra.userColor, extra);
    }
    else {
        CreateChatText(message, user, extra.userColor, extra);
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
    chat.innerHTML = "";
    ComfyJS.Say("Cleared On-Screen Chatbox! ..to clear away the nasty stuff they said 🧹🤖");
};
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);
async function CreateChatText(message, user, colour, extra) {
    let profilePicIMG = document.createElement("img");
    if (ChatNames.lastIndexOf(user) == -1) {
        let User = await HttpCalling("https://api.twitch.tv/helix/users?login=" + user);
        profilePicIMG.src = User["data"][0]["profile_image_url"];
        ChatNames.push(user);
        ChatProfileLink.push(User["data"][0]["profile_image_url"]);
    }
    else {
        profilePicIMG.src = ChatProfileLink[ChatNames.indexOf(user)];
    }
    let newMessage = document.createElement("li");
    let chatBorder = document.createElement("div");
    let UserprofileLine = document.createElement("div");
    let BadgeDiv = document.createElement("div");
    let Username = document.createElement("div");
    let messageP = document.createElement("p");
    chatBorder.classList.add("ChatBorder");
    UserprofileLine.classList.add("UserProfileLine");
    profilePicIMG.classList.add("ProfilePicture");
    Username.classList.add("Username");
    messageP.classList.add("Message");
    BadgeDiv.classList.add("BadgeLine");
    if (extra.userState["badges-raw"] != null) {
        if (AllBadges.length == 0) {
            var TwitchGlobalBadges;
            var ChannelBadges;
            if (broadcaster_id == "" || broadcaster_id == undefined || broadcaster_id == null) {
                let BroadcasterData = await HttpCalling("https://api.twitch.tv/helix/users?login=" + extra["channel"]);
                broadcaster_id = BroadcasterData["data"][0]["id"];
            }
            TwitchGlobalBadges = await HttpCalling("https://api.twitch.tv/helix/chat/badges/global");
            ChannelBadges = await HttpCalling("https://api.twitch.tv/helix/chat/badges?broadcaster_id=" + broadcaster_id);
            if (ChannelBadges["data"].length == 0) {
                AllBadges = TwitchGlobalBadges["data"];
            }
            else {
                AllBadges = ChannelBadges["data"].concat(TwitchGlobalBadges["data"]);
            }
        }
        let badges = extra.userState["badges-raw"].split(",");
        for (let badgeIndex = 0; badgeIndex < badges.length; badgeIndex++) {
            let res = badges[badgeIndex].split("/");
            for (let AllBadgeIndex = 0; AllBadgeIndex < AllBadges.length; AllBadgeIndex++) {
                if (res[0] == AllBadges[AllBadgeIndex]["set_id"]) {
                    let Badge = document.createElement("img");
                    Badge.classList.add("Badge");
                    if (BadgeSizeGet == "Small") {
                        Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_2x"];
                    }
                    else if (BadgeSizeGet == "Medium") {
                        Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_4x"];
                    }
                    else {
                        Badge.src = AllBadges[AllBadgeIndex]["versions"]["3"];
                    }
                    BadgeDiv.append(Badge);
                }
            }
        }
    }
    if (extra.userState["emotes-raw"] != null) {
        let newMSG = message;
        let rawEmotes = extra.userState["emotes-raw"].split("/");
        for (let DifferentEmotes = 0; DifferentEmotes < rawEmotes.length; DifferentEmotes++) {
            let Emote = rawEmotes[DifferentEmotes].split(":");
            let EmoteIndex = Emote[1].split(",");
            let EmoteIndexI = EmoteIndex[0].split("-");
            let EmoteName = message.substring(parseInt(EmoteIndexI[0]), parseInt(EmoteIndexI[1]) + 1);
            newMSG = newMSG.replaceAll(EmoteName, "<img src='https://static-cdn.jtvnw.net/emoticons/v2/" +
                Emote[0] +
                "/default/dark/1.0" +
                "'></img>");
        }
        message = newMSG;
    }
    if (extra.userState["color"] != null) {
        switch (colour) {
            case "#FF0000":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#0000FF":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#008000":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#B22222":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#FF7F50":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#9ACD32":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#FF4500":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#2E8B57":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#DAA520":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#D2691E":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#5F9EA0":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#1E90FF":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#FF69B4":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#8A2BE2":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            case "#00FF7F":
                ChangeColor(colour, chatBorder, Username, messageP);
                break;
            default:
                chatBorder.style.cssText = `color:${colour}`;
                Username.style.cssText = `color:${colour}`;
                messageP.style.cssText = `color:${colour}`;
                break;
        }
    }
    Username.innerHTML = user + ":";
    messageP.innerHTML = message;
    UserprofileLine.append(profilePicIMG);
    UserprofileLine.append(Username);
    UserprofileLine.append(BadgeDiv);
    chatBorder.append(UserprofileLine);
    chatBorder.append(messageP);
    newMessage.append(chatBorder);
    chat.append(newMessage);
    if (chat.getElementsByTagName("li").length > ClearOldChatMSGsAfter) {
        chat.firstElementChild?.remove();
    }
}
async function validateToken() {
    if (AppAcessToken != undefined &&
        AppAcessToken != "" &&
        AppAcessToken != null) {
        await fetch("https://id.twitch.tv/oauth2/validate", {
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
}
async function HttpCalling(HttpCall) {
    const respon = await fetch(`${HttpCall}`, {
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
}
function ChangeColor(colour, chatBorder, Username, messageP) {
    chatBorder.classList.add("HEX" + colour.replace("#", ""));
    Username.classList.add("HEX" + colour.replace("#", ""));
    messageP.classList.add("HEX" + colour.replace("#", ""));
}
