"use strict";
var chat = document.querySelector("#chat>ul") as HTMLElement;

//#region Basic Settings
let ClearOldChatMSGsAfter = 11 as number;
let BadgeSizeGet = "Medium"; // Small, Medium, Large

let AppAcessToken = "gksx1g5gtd21dukq6t3cdafslng28t";
let UserID = "485848067";
let AclientId = "";

var AllBadges = Array() as Array<any>;

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
  console.log(user);
  console.log(message);
  console.log(flags);
  console.log(self);
  console.log(extra);

  if (flags.broadcaster || flags.mod) {
    // MOD or Broadcaster color adding
    CreateChatText(message, user, extra.userColor, extra);
  } else {
    // Normal User adding
    CreateChatText(message, user, extra.userColor, extra);
  }
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
  if (command === "lurk") {
    //@ts-expect-error
    ComfyJS.Say("Have a nice lurk @" + user + "!! 🌺🌸");
  }
  if (flags.broadcaster || flags.mod) {
    if (command === "test") {
      //@ts-expect-error
      ComfyJS.Say("replying to !test");
    }
    if (command === "clear") {
      chat.innerHTML = "";
      //@ts-expect-error
      ComfyJS.Say("Cleared On-Screen Chatbox! 🧹🤖");
    }
  }
};

//@ts-expect-error
ComfyJS.onMessageDeleted = (id: any, extra: any) => {
  console.log(id, extra);
};

//@ts-expect-error
ComfyJS.Init(
  "illu_illusion",
  "oauth:ittskpnutx42o6zlmps13yotc9zylg",
  "grat_grot10_berg"
);

// FUNCTIONS

// Later make this into a bigger multidim object or array!
let ChatNames = Array();
let ChatProfileLink = Array();

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
      "https://api.twitch.tv/helix/users?login=" + user
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

  // Badge Handling
  if (extra.userState["badges-raw"] != null) {
    // Only runs when not initialized.
    if (AllBadges.length == 0) {
      var TwitchGlobalBadges: any;
      var ChannelBadges: any;
      TwitchGlobalBadges = await HttpCalling(
        "https://api.twitch.tv/helix/chat/badges/global"
      );
      ChannelBadges = await HttpCalling(
        "https://api.twitch.tv/helix/chat/badges?broadcaster_id=" + UserID
      );
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
          if (BadgeSizeGet == "Small") {
            Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_2x"];
          } else if (BadgeSizeGet == "Medium") {
            Badge.src = AllBadges[AllBadgeIndex]["versions"][0]["image_url_4x"];
          } else {
            Badge.src = AllBadges[AllBadgeIndex]["versions"]["3"];
          }
          // Add a badge at either badge placement badgeIndex (0-1)
          BadgeDiv.append(Badge);
        }
      }
    }
  }

  // MessageEmote Handling
  if (extra.userState["emotes-raw"] != null) {
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
async function HttpCalling(HttpCall: string) {
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
