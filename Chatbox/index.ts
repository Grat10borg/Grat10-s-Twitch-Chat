"use strict";

var chat = document.querySelector("#chat>ul") as HTMLElement;

//#region Basic Settings
let ClearOldChatMSGsAfter = 11 as number;
let BadgeSizeGet = "medium"; // Small, Medium, Large, Note some badges look different on differet sizes, normally pixelart badges changes

//@ts-expect-error
let AppAcessToken = config.MY_API_TOKEN;
var broadcaster_id: string;
var playclips = false;

let AclientId = "";
let Webparent = "localhost";

// Arrays that save data on users.
var AllBadges = Array() as Array<any>; // Gets filled with all of twitches badge data
let ChatNames = Array(); // Filled with Chatters names so we can find their profile pictues in ChatProfileLink
let ChatProfileLink = Array(); // holds links to Chatters ProfilePictures.
let BetterTTVEmotes = Array(); // holds all BetterTV emotes!
validateToken();

//#endregion

//@ts-expect-error
ComfyJS.onChat = (
  user: any,
  message: any,
  flags: any,
  self: any,
  extra: any
) => {
  // console.log(user);
  // console.log(message);
  // console.log(flags);
  // console.log(self);
  // console.log(extra);

  CreateChatText(message, user, extra.userColor, extra);
};

// Command Handling
//@ts-expect-error
ComfyJS.onCommand = (
  user: any,
  command: any,
  message: any,
  flags: any,
  extra: any
) => {
  if (command.toLowerCase() === "lurk") {
    //@ts-expect-error
    ComfyJS.Say("Have a nice lurk @" + user + "!! 🌺🌸");
  }
  if (command.toLowerCase() === "dice") {
    //@ts-expect-error
    ComfyJS.Say(
      "The Dices rolls... " + Math.floor(Math.random() * 6 + 1) + "!! 🌺🌸"
    );
  }
  if (flags.broadcaster || flags.mod) {
    if (command.toLowerCase() === "display") {
      var chatDiv = document.querySelector("#chat") as HTMLElement;
      chatDiv.classList.add("Display");
    }
    if (command.toLowerCase() === "clear") {
      chat.innerHTML = "";
      //@ts-expect-error
      ComfyJS.Say("Cleared On-Screen Chatbox! 🧹🤖");
    }
    if (command.toLowerCase() === "clip") {
      Clipper(extra); // clipping function
    }
    if (command.toLowerCase() === "marker" || command.toLowerCase() === "mark") {
      CreateStreamMarker("Marker Command Ran", true);
    }
    if (command.toLowerCase() === "playclips") {
      playclips = true;
    }
  }
};

//@ts-expect-error
ComfyJS.onMessageDeleted = (id: any, extra: any) => {
  console.log(id, extra);

  // for now..
  chat.innerHTML = "";
};

//@ts-expect-error
ComfyJS.Init(
  //@ts-expect-error
  config.BOTLOGIN,
  //@ts-expect-error
  config.BOTOAUTH,
  //@ts-expect-error
  config.TWITCH_LOGIN
);

// FUNCTIONS

async function CreateChatText(
  message: string,
  user: string,
  colour: string,
  extra: any
) {
  // Getting Profile picture
  let profilePicIMG = document.createElement("img") as HTMLImageElement;
  if (ChatNames.lastIndexOf(user) == -1) {
    let User = await HttpCalling(
      "https://api.twitch.tv/helix/users?login=" + user,
      true
    );
    profilePicIMG.src = User["data"][0]["profile_image_url"];
    ChatNames.push(user);
    ChatProfileLink.push(User["data"][0]["profile_image_url"]);
  } else {
    profilePicIMG.src = ChatProfileLink[ChatNames.indexOf(user)];
  }

  // Vars
  let newMessage = document.createElement("li") as HTMLLIElement;
  let chatBorder = document.createElement("div") as HTMLDivElement;
  let UserprofileLine = document.createElement("div") as HTMLDivElement;
  let BadgeDiv = document.createElement("div") as HTMLDivElement;

  let Username = document.createElement("div") as HTMLDivElement;
  let messageP = document.createElement("p") as HTMLParagraphElement;

  // Attributes
  chatBorder.classList.add("ChatBorder");
  UserprofileLine.classList.add("UserProfileLine");
  profilePicIMG.classList.add("ProfilePicture");
  Username.classList.add("Username");
  messageP.classList.add("Message");
  BadgeDiv.classList.add("BadgeLine");


  // Testing message!
  if(message.match(/[<>]/i)) {
    console.log(message);
    message = message.replace(/</g, "＜"); 
    message = message.replace(/>/g, "＞");
  } // stops HTML from being written in messages
  if(message.match(/javascript:.*/g)) {message = message.replace(":", "⋮");} // don't know how to protect against javascript attacks
  if (message.match(/#[A-Za-zåøæ]+/i)) {
    let Hashtags = /#[A-Za-zåøæ]+/i.exec(message) as any;
    console.log(Hashtags.length);
    for (let index = 0; index < Hashtags.length; index++) {
      message = message.replace(
        Hashtags[Hashtags.length - 1],
        camelize(Hashtags[Hashtags.length - 1])
      );
    }
    console.log(Hashtags);
    console.log(message);
  }

  // Badge Handling
  if (extra.userState["badges-raw"] != null) {
    // Only runs when not initialized.
    if (AllBadges.length == 0) {
      var TwitchGlobalBadges: any;
      var ChannelBadges: any;
      if (
        broadcaster_id == "" ||
        broadcaster_id == undefined ||
        broadcaster_id == null
      ) {
        let BroadcasterData = await HttpCalling(
          "https://api.twitch.tv/helix/users?login=" + extra["channel"],
          true
        );
        broadcaster_id = BroadcasterData["data"][0]["id"];
      }

      TwitchGlobalBadges = await HttpCalling(
        "https://api.twitch.tv/helix/chat/badges/global",
        true
      );
      ChannelBadges = await HttpCalling(
        "https://api.twitch.tv/helix/chat/badges?broadcaster_id=" +
          broadcaster_id,
        true
      );
      // !! CHANNEL BADGES ARE UNTESTED !!
      if (ChannelBadges["data"].length == 0) {
        // no channel badges gets globals only instead
        AllBadges = TwitchGlobalBadges["data"];
      } else {
        AllBadges = ChannelBadges["data"].concat(TwitchGlobalBadges["data"]);
      }
    }

    // you can only equip TWO badges at one time. pretty sure
    let badges = extra.userState["badges-raw"].split(",");
    for (let badgeIndex = 0; badgeIndex < badges.length; badgeIndex++) {
      let res = badges[badgeIndex].split("/");
      for (
        let AllBadgeIndex = 0;
        AllBadgeIndex < AllBadges.length;
        AllBadgeIndex++
      ) {
        if (res[0] == AllBadges[AllBadgeIndex]["set_id"]) {
          let Badge = document.createElement("img");
          Badge.classList.add("Badge");
          if (BadgeSizeGet.toLowerCase() == "small") {
            Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_1x"];
          } else if (BadgeSizeGet.toLowerCase() == "medium") {
            Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_2x"];
          } else {
            Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_4x"];
          }
          // Add a badge at either badge placement badgeIndex (0-1)
          BadgeDiv.append(Badge);
        }
      }
    }
  }

  // Clipping Styling Handling
  // Alowed links: 
  // https://www.twitch.tv/grat_grot10_berg/clip/AmusedSwissHerringFUNgineer-fTHk-6W3xRf_-shq
  // https://clips.twitch.tv/KitschyShakingGnatPeoplesChamp-N6cpe9XPohQTOMmv
  // Not alowed aka ignored links
  // all not twitch links and non clip links
  if (/https\:\/\/clips\.twitch\.tv\/[A-z-0-9]*/gi.test(message) == true || /https\:\/\/www\.twitch\.tv\/[A-z-0-9]*\/clip\/[A-z-0-9]*/gi.test(message) == true) {
    let ClipUrl = message.split("/") as Array<string>;
    let correctIndex = 0 as number;
    if(ClipUrl[5] != null && ClipUrl[5] != "clip" && ClipUrl[5]!="" && ClipUrl[5]!="www.twitch.tv" && ClipUrl[5]!="https") {
      correctIndex = 5;
    }
    else if (ClipUrl[3] != null && ClipUrl[3]!="clips.twitch.tv" && ClipUrl[3]!="" &&ClipUrl[3]!="https") {
      correctIndex = 3;
    }
    
    if(correctIndex != 0) {
      let Slug = ClipUrl[correctIndex];
      wait(2000); // wait 2 sec,, maybe make it wait Longer after running the !clip command
  
      let Thumbnail = await HttpCalling(
        "https://api.twitch.tv/helix/clips?id=" + Slug,
        true
      );
      message =
        "<a target='_blank' href= 'https://clips.twitch.tv/" +
        Slug +
        "'>(@" +
        Thumbnail["data"][0]["broadcaster_name"] +
        ") <br>''" +
        Thumbnail["data"][0]["title"] +
        "''</a></br>" +
        "<img class='ClipThumbnail' src='" +
        Thumbnail["data"][0]["thumbnail_url"] +
        "'></img>";
    }
  }

  // MessageEmote Handling
  if (extra.isEmoteOnly == true) {
    let newMSG = message;
    let rawEmotes = extra.userState["emotes-raw"].split("/");
    for (
      let DifferentEmotes = 0;
      DifferentEmotes < rawEmotes.length;
      DifferentEmotes++
    ) {
      let Emote = rawEmotes[DifferentEmotes].split(":");
      let EmoteIndex = Emote[1].split(",");
      let EmoteIndexI = EmoteIndex[0].split("-");
      let EmoteName = message.substring(
        parseInt(EmoteIndexI[0]),
        parseInt(EmoteIndexI[1]) + 1
      );
      // Replaces all ocerances
      newMSG = newMSG.replaceAll(
        EmoteName,
        "<img class='imgEmoteBig' src='https://static-cdn.jtvnw.net/emoticons/v2/" +
          Emote[0] +
          "/default/dark/4.0" +
          "'></img>"
      );
    }
    message = newMSG;
  } else if (extra.userState["emotes-raw"] != null) {
    let newMSG = message;
    let rawEmotes = extra.userState["emotes-raw"].split("/");
    for (
      let DifferentEmotes = 0;
      DifferentEmotes < rawEmotes.length;
      DifferentEmotes++
    ) {
      let Emote = rawEmotes[DifferentEmotes].split(":");
      let EmoteIndex = Emote[1].split(",");
      let EmoteIndexI = EmoteIndex[0].split("-");
      let EmoteName = message.substring(
        parseInt(EmoteIndexI[0]),
        parseInt(EmoteIndexI[1]) + 1
      );
      // Replaces all ocerances
      newMSG = newMSG.replaceAll(
        EmoteName,
        "<img src='https://static-cdn.jtvnw.net/emoticons/v2/" +
          Emote[0] +
          "/default/dark/1.0" +
          "'></img>"
      );
    }
    message = newMSG;
  }

  // BetterTTV Emote Handling
  if (BetterTTVEmotes.length == 0) {
    if (
      broadcaster_id == "" ||
      broadcaster_id == undefined ||
      broadcaster_id == null
    ) {
      let BroadcasterData = await HttpCalling(
        "https://api.twitch.tv/helix/users?login=" + extra["channel"],
        true
      );
      broadcaster_id = BroadcasterData["data"][0]["id"];
    }
    BetterTTVEmotes = await HttpCalling(
      "https://api.betterttv.net/3/cached/emotes/global",
      false
    );
    console.log(
      "Note: BetterTV Emotes will not work unless you are running a HTTPS local server, Http doesnt work."
    );
  }
  for (let index = 0; index < BetterTTVEmotes.length; index++) {
    message = message.replaceAll(
      BetterTTVEmotes[index]["code"],
      "<img src='https://cdn.betterttv.net/emote/" +
        BetterTTVEmotes[index]["id"] +
        "/1x." +
        BetterTTVEmotes[index]["imageType"] +
        "'></img>"
    );
  }

  // Color selecting:
  if (extra.userState["color"] != null) {
    switch (colour) {
      case "#FF0000": // Red
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#0000FF": // Blue
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#008000": // Green
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#B22222": // BrickColored / MurstensFarvet
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#FF7F50": // CoralRed
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#9ACD32": // YellowGreen / GulGrøn
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#FF4500": // OrangeRed
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#2E8B57": // SeaWeed Color
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#DAA520": // Gyldenris
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#D2691E": // Chocolade
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#5F9EA0": // KadetBlå
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#1E90FF": // DodgerBlue
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#FF69B4": // Pink
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#8A2BE2": // Blåviolet
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      case "#00FF7F": // SpringGreen / forårsgrøn
        ChangeColor(colour, chatBorder, Username, messageP);
        break;
      default:
        // Twitch turbo colours (untested)
        chatBorder.style.cssText = `color:${colour}`;
        Username.style.cssText = `color:${colour}`;
        messageP.style.cssText = `color:${colour}`;
        break;
    }
  }

  // Values
  Username.innerHTML = user + ":";
  messageP.innerHTML = message;

  // Appending
  UserprofileLine.append(profilePicIMG);
  UserprofileLine.append(Username);
  UserprofileLine.append(BadgeDiv);
  chatBorder.append(UserprofileLine);
  chatBorder.append(messageP);
  newMessage.append(chatBorder);
  chat.append(newMessage);

  // removes old chat messages outside of view.
  if (chat.getElementsByTagName("li").length > ClearOldChatMSGsAfter) {
    chat.firstElementChild?.remove();
  }
}

// Ran when !clip is typed.
async function Clipper(extra: any) {
  if (
    broadcaster_id == "" ||
    broadcaster_id == undefined ||
    broadcaster_id == null
  ) {
    let BroadcasterData = await HttpCalling(
      "https://api.twitch.tv/helix/users?login=" + extra["channel"],
      true
    );
    broadcaster_id = BroadcasterData["data"][0]["id"];
  }


  const ClipCall = await fetch(
    "https://api.twitch.tv/helix/clips?broadcaster_id=" + broadcaster_id,
    {
      method: "POST",
      headers: {
        //@ts-expect-error
        Authorization: "Bearer " + config.MY_API_TOKEN, // Api Token Needs Scope Clip:edit
        "Client-ID": AclientId,
        "Content-Type": "application/json"
      },
    }
  )
    .then((respon) => respon.json())
    .then((respon) => {
      // Return Response on Success
      return respon;
    })
    .catch((err) => {
      // Print Error if any. And return 0
      console.log(err);
    });
  if (ClipCall["error"] == "Not Found") {
    //@ts-expect-error
    ComfyJS.Say("⚠ You cannot clip an Offline Channel!! :<");
  } else if (ClipCall["data"][0]["id"] != null) {
    CreateStreamMarker(
      "AutoClip-" + ClipCall["data"][0]["title"],
      false
    );

    wait(2000); // wait 2 sec
    //@ts-expect-error
    ComfyJS.Say(
      "Clipped!: https://clips.twitch.tv/" + ClipCall["data"][0]["id"]
    );
    console.log(ClipCall["data"][0]["edit_url"]);
  }
}

async function CreateStreamMarker(
  Description: string,
  PrintSuccess: boolean
) {
  if (
    broadcaster_id == "" ||
    broadcaster_id == undefined ||
    broadcaster_id == null
  ) {
    let BroadcasterData = await HttpCalling( //@ts-expect-error
      "https://api.twitch.tv/helix/users?login=" + config.TWITCH_LOGIN,
      true
    );
    broadcaster_id = BroadcasterData["data"][0]["id"];
  }
  let payload = {"user_id": broadcaster_id};
  let body: any;
  body = JSON.stringify(payload);
  let StreamMakerCall = await fetch(
    "https://api.twitch.tv/helix/streams/markers?broadcaster_id=" +
      broadcaster_id,
    {
      method: "POST",
      headers: {
        //@ts-expect-error
        Authorization: "Bearer " + config.MY_API_TOKEN, // Api Token Needs Scope Clip:edit
        "Client-ID": AclientId,
        "Content-Type": "application/json",
        // 'user_id': broadcaster_id,
        // "description":Description,
      },
      body: body,
    }
  )
    .then((respon) => respon.json())
    .then((respon) => {
      // Return Response on Success
      console.log("Successfully marked the stream right here right now");
      if (PrintSuccess == true) {
        //@ts-expect-error
        ComfyJS.Say("i've Marked this now! :>");
      }
      return respon;
    })
    .catch((err) => {
      // Print Error if any. And return 0
      console.log(err);
      console.log("https://dev.twitch.tv/docs/api/reference/#create-stream-marker");
      //@ts-expect-error
      ComfyJS.Say(
        "ERROR!! I wasn't alowed to create a stream maker, check your API token scopes & the webconsol of the chat website :<"
      );
    });
}

//#region validateToken() Validates Token if sucessful returns 1 if not 0
// Calls the Twitch api with Out App Acess Token and returns a ClientId and tells us if the App Acess Token is Valid or Not
async function validateToken() {
  if (
    AppAcessToken != undefined &&
    AppAcessToken != "" &&
    AppAcessToken != null
  ) {
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
  } else {
    return 0;
  }
}
//#endregion

//#region [async] HttpCaller(HttpCall) multipurpose HttpCaller calls the Httpcall returns The Response if Success if not: 0
// This makes most calls, intead of a lot of differnt functions this does them instead.
// TO find out what is called look where its called as the HTTPCALL would need to be sent over.
async function HttpCalling(HttpCall: string, Twitch: boolean) {
  if (Twitch == true) {
    const respon = await fetch(`${HttpCall}`, {
      headers: {
        Authorization: "Bearer " + AppAcessToken,
        "Client-ID": AclientId, // can also use Tclient_id. !! comment out Tclient if not being used !!
      },
    })
      .then((respon) => respon.json())
      .then((respon) => {
        // Return Response on Success
        return respon;
      })
      .catch((err) => {
        // Print Error if any. And return 0
        console.log(err);
        return err;
      });
    return respon;
  } else {
    const respon = await fetch(`${HttpCall}`)
      .then((respon) => respon.json())
      .then((respon) => {
        // Return Response on Success
        return respon;
      })
      .catch((err) => {
        // Print Error if any. And return 0
        console.log(err);
        return err;
      });
    return respon;
  }
}
//#endregion

function ChangeColor(
  colour: string,
  chatBorder: HTMLDivElement,
  Username: HTMLParagraphElement,
  messageP: HTMLParagraphElement
) {
  chatBorder.classList.add("HEX" + colour.replace("#", ""));
  Username.classList.add("HEX" + colour.replace("#", ""));
  messageP.classList.add("HEX" + colour.replace("#", ""));
}

// misc function, make javascript wait
function wait(ms: number) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
}

// Makes any String sent into camelCase
function camelize(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
