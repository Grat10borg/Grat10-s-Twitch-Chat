"use strict";
var chat = document.querySelector("#chat>ul");
let ClearOldChatMSGsAfter = 11;
let BadgeSizeGet = "medium";
let AppAcessToken = config.MY_API_TOKEN;
var broadcaster_id;
var playclips = false;
let AclientId = "";
let Webparent = "localhost";
var AllBadges = Array();
let ChatNames = Array();
let ChatProfileLink = Array();
let BetterTTVEmotes = Array();
validateToken();
ComfyJS.onChat = (user, message, flags, self, extra) => {
    CreateChatText(message, user, extra.userColor, extra);
};
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (command.toLowerCase() === "lurk") {
        ComfyJS.Say("Have a nice lurk @" + user + "!! 🌺🌸");
    }
    if (command.toLowerCase() === "dice") {
        ComfyJS.Say("The Dices rolls... " + Math.floor(Math.random() * 6 + 1) + "!! 🌺🌸");
    }
    if (flags.broadcaster || flags.mod) {
        if (command.toLowerCase() === "display") {
            var chatDiv = document.querySelector("#chat");
            chatDiv.classList.add("Display");
        }
        if (command.toLowerCase() === "clear") {
            chat.innerHTML = "";
            ComfyJS.Say("Cleared On-Screen Chatbox! 🧹🤖");
        }
        if (command.toLowerCase() === "clip") {
            Clipper(extra);
        }
        if (command.toLowerCase() === "marker") {
            CreateStreamMarker(extra, "Marker Command Ran", true);
        }
        if (command.toLowerCase() === "playclips") {
            playclips = true;
        }
    }
};
ComfyJS.onMessageDeleted = (id, extra) => {
    console.log(id, extra);
    chat.innerHTML = "";
};
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);
async function CreateChatText(message, user, colour, extra) {
    let profilePicIMG = document.createElement("img");
    if (ChatNames.lastIndexOf(user) == -1) {
        let User = await HttpCalling("https://api.twitch.tv/helix/users?login=" + user, true);
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
    if (message.match(/#[A-Za-zåøæ]+/i)) {
        let Hashtags = /#[A-Za-zåøæ]+/i.exec(message);
        console.log(Hashtags.length);
        for (let index = 0; index < Hashtags.length; index++) {
            message = message.replace(Hashtags[Hashtags.length - 1], camelize(Hashtags[Hashtags.length - 1]));
        }
        console.log(Hashtags);
        console.log(message);
    }
    if (extra.userState["badges-raw"] != null) {
        if (AllBadges.length == 0) {
            var TwitchGlobalBadges;
            var ChannelBadges;
            if (broadcaster_id == "" ||
                broadcaster_id == undefined ||
                broadcaster_id == null) {
                let BroadcasterData = await HttpCalling("https://api.twitch.tv/helix/users?login=" + extra["channel"], true);
                broadcaster_id = BroadcasterData["data"][0]["id"];
            }
            TwitchGlobalBadges = await HttpCalling("https://api.twitch.tv/helix/chat/badges/global", true);
            ChannelBadges = await HttpCalling("https://api.twitch.tv/helix/chat/badges?broadcaster_id=" +
                broadcaster_id, true);
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
                    if (BadgeSizeGet.toLowerCase() == "small") {
                        Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_1x"];
                    }
                    else if (BadgeSizeGet.toLowerCase() == "medium") {
                        Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_2x"];
                    }
                    else {
                        Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_4x"];
                    }
                    BadgeDiv.append(Badge);
                }
            }
        }
    }
    if (/https\:\/\/clips\.twitch\.tv\/[A-z-0-9]*/gi.test(message) == true) {
        let ClipUrl = /https\:\/\/clips\.twitch\.tv\/[A-z-0-9]*/gi.exec(message);
        let Slug = ClipUrl[0].split("/");
        wait(2000);
        let Thumbnail = await HttpCalling("https://api.twitch.tv/helix/clips?id=" + Slug[3], true);
        message =
            "<a target='_blank' href= 'https://clips.twitch.tv/" +
                Slug[3] +
                "'>(@" +
                Thumbnail["data"][0]["broadcaster_name"] +
                ") <br>''" +
                Thumbnail["data"][0]["title"] +
                "''</a></br>" +
                "<img class='ClipThumbnail' src='" +
                Thumbnail["data"][0]["thumbnail_url"] +
                "'></img>";
    }
    if (extra.isEmoteOnly == true) {
        let newMSG = message;
        let rawEmotes = extra.userState["emotes-raw"].split("/");
        for (let DifferentEmotes = 0; DifferentEmotes < rawEmotes.length; DifferentEmotes++) {
            let Emote = rawEmotes[DifferentEmotes].split(":");
            let EmoteIndex = Emote[1].split(",");
            let EmoteIndexI = EmoteIndex[0].split("-");
            let EmoteName = message.substring(parseInt(EmoteIndexI[0]), parseInt(EmoteIndexI[1]) + 1);
            newMSG = newMSG.replaceAll(EmoteName, "<img class='imgEmoteBig' src='https://static-cdn.jtvnw.net/emoticons/v2/" +
                Emote[0] +
                "/default/dark/4.0" +
                "'></img>");
        }
        message = newMSG;
    }
    else if (extra.userState["emotes-raw"] != null) {
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
    if (BetterTTVEmotes.length == 0) {
        if (broadcaster_id == "" ||
            broadcaster_id == undefined ||
            broadcaster_id == null) {
            let BroadcasterData = await HttpCalling("https://api.twitch.tv/helix/users?login=" + extra["channel"], true);
            broadcaster_id = BroadcasterData["data"][0]["id"];
        }
        BetterTTVEmotes = await HttpCalling("https://api.betterttv.net/3/cached/emotes/global", false);
        console.log("Note: BetterTV Emotes will not work unless you are running a HTTPS local server, Http doesnt work.");
    }
    for (let index = 0; index < BetterTTVEmotes.length; index++) {
        message = message.replaceAll(BetterTTVEmotes[index]["code"], "<img src='https://cdn.betterttv.net/emote/" +
            BetterTTVEmotes[index]["id"] +
            "/1x." +
            BetterTTVEmotes[index]["imageType"] +
            "'></img>");
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
async function Clipper(extra) {
    if (broadcaster_id == "" ||
        broadcaster_id == undefined ||
        broadcaster_id == null) {
        let BroadcasterData = await HttpCalling("https://api.twitch.tv/helix/users?login=" + extra["channel"], true);
        broadcaster_id = BroadcasterData["data"][0]["id"];
    }
    const ClipCall = await fetch("https://api.twitch.tv/helix/clips?broadcaster_id=" + broadcaster_id, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + config.MY_API_TOKEN,
            "Client-ID": AclientId,
            "Content-Type": "application/json"
        },
    })
        .then((respon) => respon.json())
        .then((respon) => {
        return respon;
    })
        .catch((err) => {
        console.log(err);
    });
    if (ClipCall["error"] == "Not Found") {
        ComfyJS.Say("⚠ You cannot clip an Offline Channel!! :<");
    }
    else if (ClipCall["data"][0]["id"] != null) {
        CreateStreamMarker(extra, "AutoClip-" + ClipCall["data"][0]["title"], false);
        wait(2000);
        ComfyJS.Say("Clipped!: https://clips.twitch.tv/" + ClipCall["data"][0]["id"]);
        console.log(ClipCall["data"][0]["edit_url"]);
    }
}
async function CreateStreamMarker(extra, Description, PrintSuccess) {
    if (broadcaster_id == "" ||
        broadcaster_id == undefined ||
        broadcaster_id == null) {
        let BroadcasterData = await HttpCalling("https://api.twitch.tv/helix/users?login=" + extra["channel"], true);
        broadcaster_id = BroadcasterData["data"][0]["id"];
    }
    let payload = { "user_id": broadcaster_id };
    let body;
    body = JSON.stringify(payload);
    let StreamMakerCall = await fetch("https://api.twitch.tv/helix/streams/markers?broadcaster_id=" +
        broadcaster_id, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + config.MY_API_TOKEN,
            "Client-ID": AclientId,
            "Content-Type": "application/json",
        },
        body: body,
    })
        .then((respon) => respon.json())
        .then((respon) => {
        console.log("Successfully marked the stream right here right now");
        if (PrintSuccess == true) {
            ComfyJS.Say("i've Marked this now! :>");
        }
        return respon;
    })
        .catch((err) => {
        console.log(err);
        console.log("https://dev.twitch.tv/docs/api/reference/#create-stream-marker");
        ComfyJS.Say("ERROR!! I wasn't alowed to create a stream maker, check your API token scopes & the webconsol of the chat website :<");
    });
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
async function HttpCalling(HttpCall, Twitch) {
    if (Twitch == true) {
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
    else {
        const respon = await fetch(`${HttpCall}`)
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
}
function ChangeColor(colour, chatBorder, Username, messageP) {
    chatBorder.classList.add("HEX" + colour.replace("#", ""));
    Username.classList.add("HEX" + colour.replace("#", ""));
    messageP.classList.add("HEX" + colour.replace("#", ""));
}
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
function camelize(str) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
        .replace(/\s+/g, "");
}
