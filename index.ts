"use strict";
var chat = document.querySelector("#chat>ul") as HTMLElement;

//#region Basic Settings
let ClearOldChatMSGsAfter = 11 as number;
//var ComfyJS = require("https://cdn.jsdelivr.net/npm/comfy.js@latest/dist/comfy.min.js");

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
    CreateChatText(message, user, "none", "none", ["none", "none"]);
  } else {
    // Normal User adding
    CreateChatText(message, user, "none", "none", ["none", "none"]);
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
    ComfyJS.Say(
      "Have a nice lurk @" +
        user +
        "!! 🌺🌸"
    );
  }
  if(flags.broadcaster || flags.mod) {
    if (command === "test") {
      //@ts-expect-error
      ComfyJS.Say("replying to !test");
    }
    if(command === "clear") {
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
  "",
  "grat_grot10_berg"
);

function CreateChatText(
  message: string,
  user: string,
  colour: string,
  profilePic: string,
  emotes: Array<string>
) {
  var newMessage = document.createElement("li");
  var text = document.createElement("blockquote");
  newMessage.innerText = user;
  text.innerText = message;
  newMessage.append(text);
  chat.append(newMessage);

  // removes old chat messages outside of view.
  if (chat.getElementsByTagName("li").length > ClearOldChatMSGsAfter) {
    chat.firstElementChild?.remove();
  }
}
