"use strict";
let YT_VideoID = "";
let CurrentlyPlaying = false;
// clear this everytime we complete or want a video gone.
let Clear = document.getElementById("Displayer");
let ScriptDIV = document.getElementById("RemovePlaceScriptDiv");
//@ts-expect-error
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    // if command contains watch something like !watch https://www.youtube.com/watch?v=GGTSzvlbBkE or the same with any twitch clip
    if (flags.broadcaster || flags.mod) {
        // \:\/\
        console.log(command);
        console.log(message);
        // /https\:\/\/clips\.twitch\.tv\/[A-z-0-9]*/gi.test(message) == true
        if (command.toLowerCase() == "watch" ||
            command.toLowerCase() == "play" ||
            (command.toLowerCase() == "display" &&
                /https\:\/\/www.youtube.com\/watch?.*/.test(message.toLowerCase()) ==
                    true) ||
            /https\:\/\/www.youtube.com\/clip?.*/.test(message.toLowerCase()) ==
                true ||
            /https\:\/\/www.twitch.tv\/?.*/.test(message.toLowerCase()) == true ||
            /https\:\/\/clips.twitch.tv\/?.*/.test(message.toLowerCase()) == true) {
            if (CurrentlyPlaying != true) {
                PlayVideoFromLink(message); // play the video instantly.
            }
            else {
                // Add link to Qucue
            }
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
config.TWITCH_LOGIN);
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
                autoplay: 1,
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
function onPlayerReady(event) {
    event.target.playVideo();
}
// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
    changeBorderColor(event.data);
    console.log(event);
    if (event.data == 0) {
        Clear.innerHTML = "";
        ScriptDIV.innerHTML = "";
    }
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
}
// function stopVideo() {
//   player.stopVideo();
// }
// needs to accept links like:
// !watch https://www.youtube.com/watch?v=GGTSzvlbBkE
// !watch https://www.youtube.com/clip/UgkxqL1jdxVx8EgB1fBV-jpwmGA2Re9ltl-Q // youtube clips
// !watch https://www.tumblr.com/sloppystyle/672868385904787456?source=share // tumblr links
// !watch https://www.twitch.tv/grat_grot10_berg/clip/AmusedSwissHerringFUNgineer-fTHk-6W3xRf_-shq // Twitch links
// !watch https://clips.twitch.tv/KitschyShakingGnatPeoplesChamp-N6cpe9XPohQTOMmv
// !watch https://www.twitch.tv/grat_grot10_berg // should watch live stream.
// !watch https://www.twitch.tv/videos/1296188506 // not really needed but nice to have
function PlayVideoFromLink(Link) {
    console.log(Link);
    if (Link.includes("youtube")) {
        let res = Link.split("=");
        YT_VideoID = res[1];
        Clear.innerHTML = ""; // incase its not cleared already
        let ContentDiv = document.createElement("div");
        ContentDiv.id = "Content";
        let InContentdivDiv = document.createElement("div");
        let playerDiv = document.createElement("div");
        playerDiv.id = "player";
        InContentdivDiv.append(playerDiv);
        ContentDiv.append(InContentdivDiv);
        Clear.append(ContentDiv);
        //@ts-expect-error
        ComfyJS.Say("playing video on the displayer!! :>");
        let script = document.createElement("script");
        script.src =
            "https://www.youtube.com/iframe_api" + `?v=${Math.random() * 10}`;
        script.type = "text/javascript";
        ScriptDIV.innerHTML = "";
        ScriptDIV.append(script);
        onYouTubeIframeAPIReady();
    }
    else if (Link.includes("twitch")) {
        console.log("In Twitch IF");
        // setup
        let iframeID = "";
        //let IframeDiv = document.getElementById("RemovePlaceScriptDiv") as HTMLElement; // <div> // where the iframe gets placed
        Clear.innerHTML = ""; // incase its not cleared already
        let ContentDiv = document.createElement("div");
        ContentDiv.id = "Content";
        let InContentdivDiv = document.createElement("div");
        let playerDiv = document.createElement("div");
        playerDiv.id = "player";
        InContentdivDiv.append(playerDiv);
        ContentDiv.append(InContentdivDiv);
        Clear.append(ContentDiv);
        // splitting link to get ids or loginname
        if (Link.includes("clips.twitch.tv") ||
            /https\:\/\/www.twitch.tv\/.*\/clip\/.*/.test(Link) == true ||
            /https\:\/\/www.twitch.tv\/.*/.test(Link) == true) {
            let res = Link.split("/");
            console.log(res);
            iframeID = res[res.length - 1];
        }
        else {
            iframeID = ""; // nothing
        }
        if (iframeID != "") {
            // if ID is a channel: login_name or a video Id: id
            var options;
            if (iframeID.match(/.*[A-Za-z].*/i)) {
                // channel: 'marinemammalrescue',
                let channel = iframeID;
                options = {
                    height: 520,
                    width: 1080,
                    channel,
                    allowfullscreen: true,
                    layout: "video",
                    muted: false,
                    parent: ["localhost"],
                };
            }
            else {
                // video: '1567287413',
                let video = 1296188506;
                options = {
                    height: 520,
                    width: 1080,
                    video,
                    allowfullscreen: true,
                    layout: "video",
                    muted: false,
                    parent: ["localhost"],
                };
            }
            console.log(options);
            wait(2000);
            //@ts-ignore
            var player = new Twitch.Embed("Displayer", options);
        }
    }
    else if (Link.includes("tumblr")) {
        // does stuff to embed a tumblr post..
    }
}
function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
    }
    else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
    }
    else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
    }
    else if (playerStatus == 2) {
        color = "#DD2C00"; // paused = red
    }
    else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
    }
    else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
        let res = document.getElementById("player");
        res.style.borderColor = color;
    }
}
// misc function, make javascript wait
function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}
