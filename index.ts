"use strict";
var chat = document.querySelector("#chat>ul") as HTMLElement;
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

  if (
    extra["userBadges"]["broadcaster"] == 1 || extra["userBadges"]["mod"] == 1) {
      // MOD or Broadcaster color adding
      CreateChatText(message,user, "none", "none", ["none", "none"]);  
  } 
  else {
    // Normal User adding
    CreateChatText(message,user, "none", "none", ["none", "none"]);
  }
};

// Command Handling
//@ts-expect-error
ComfyJS.onCommand = ( user:any, command:any, message:any, flags:any, extra:any ) => {
  if( flags.broadcaster && command === "test" ) {
    console.log( "!test was typed in chat" );
  }
}
//@ts-expect-error
ComfyJS.Init("grat_grot10_berg");

function CreateChatText(message:string, user: string, colour: string, profilePic:string, emotes:Array<string>) {
  var newMessage = document.createElement("li");
    var text = document.createElement("blockquote");
    newMessage.innerText = user;
    text.innerText = message;
    newMessage.append(text);
    chat.append(newMessage);

    
    // removes old chat messages outside of view.
    if(chat.getElementsByTagName("li").length > 19) {
      chat.firstElementChild?.remove();
    }
}
