console.log("JS connected");

let YT_VideoID = "" as string;

// clear this everytime we complete or want a video gone.
let Clear = document.getElementById("Displayer") as HTMLElement;

//@ts-expect-error
ComfyJS.onCommand = (
  user: any,
  command: any,
  message: any,
  flags: any,
  extra: any
) => {
  // if command contains watch something like !watch https://www.youtube.com/watch?v=GGTSzvlbBkE or the same with any twitch clip
  if (flags.broadcaster || flags.mod) {
    // \:\/\
    console.log(command);
    console.log(message);
    // /https\:\/\/clips\.twitch\.tv\/[A-z-0-9]*/gi.test(message) == true
    if (
      command.toLowerCase() == "watch" ||
      command.toLowerCase() == "play" ||
      (command.toLowerCase() == "display" &&
        /https\:\/\/www.youtube.com\/watch?.*/.test(message.toLowerCase()) ==
          true)
    ) {
      let res = message.split("=");
      YT_VideoID = res[1];
      Clear.innerHTML=""; // incase its not cleared already
      let ContentDiv = document.createElement("div") as HTMLElement;
      ContentDiv.id = "Content";
      let InContentdivDiv = document.createElement("div") as HTMLElement;
      let playerDiv = document.createElement("div") as HTMLElement;
      playerDiv.id = "player";
      InContentdivDiv.append(playerDiv);
      ContentDiv.append(InContentdivDiv);
      Clear.append(ContentDiv);

      //@ts-expect-error
      ComfyJS.Say("playing video on the displayer!! :>");
      let script = document.createElement("script") as HTMLScriptElement;
      script.src = "https://www.youtube.com/iframe_api";
      script.type = "text/javascript";
      let ScriptDIV = document.getElementById(
        "RemovePlaceScriptDiv"
      ) as HTMLElement;

      ScriptDIV.append(script);
    }
  }
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

// YOUTUBE IFRAMES
// https://developers.google.com/youtube/iframe_api_reference
// Automaticly runs once the Iframe API is ready.
var player;
function onYouTubeIframeAPIReady() {
  if (YT_VideoID != "") {
    // @ts-expect-error
    player = new YT.Player("player", {
      height: window.innerHeight,
      width: window.innerWidth,
      videoId: YT_VideoID,
      playerVars: {
        playsinline: 1,
        autoplay: 1, // autoplay video once ready
        controls: 1, // gives you control to see length of video and muted and etc
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }
  
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event: any) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event: any) {
  changeBorderColor(event.data);
  console.log(event);
  if (event.data == 0) {

    Clear.innerHTML = "";
  }
  // if (event.data == YT.PlayerState.PLAYING && !done) {
  //   setTimeout(stopVideo, 6000);
  //   done = true;
  // }
}
// function stopVideo() {
//   player.stopVideo();
// }

function changeBorderColor(playerStatus: any) {
  var color;
  if (playerStatus == -1) {
    color = "#37474F"; // unstarted = gray
  } else if (playerStatus == 0) {
    color = "#FFFF00"; // ended = yellow
  } else if (playerStatus == 1) {
    color = "#33691E"; // playing = green
  } else if (playerStatus == 2) {
    color = "#DD2C00"; // paused = red
  } else if (playerStatus == 3) {
    color = "#AA00FF"; // buffering = purple
  } else if (playerStatus == 5) {
    color = "#FF6DOO"; // video cued = orange
  }
  if (color) {
    let res = document.getElementById("player") as HTMLElement;
    res.style.borderColor = color;
  }
}