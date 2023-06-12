"use strict";
let YT_VideoID = "";
let CurrentlyPlaying = false;
let Clear = $$.id("Displayer");
let ScriptDIV = $$.id("RemovePlaceScriptDiv");
ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (flags.broadcaster || flags.mod) {
        $$.log(command);
        $$.log(message);
        if (command.toLowerCase() == "watch" ||
            command.toLowerCase() == "play" ||
            (command.toLowerCase() == "display" && /https\:\/\/www.youtube.com\/watch?.*/.test(message.toLowerCase()) == true) || /https\:\/\/www.youtube.com\/clip?.*/.test(message.toLowerCase()) == true || /https\:\/\/www.twitch.tv\/?.*/.test(message.toLowerCase()) == true || /https\:\/\/clips.twitch.tv\/?.*/.test(message.toLowerCase()) == true) {
            if (CurrentlyPlaying != true)
                PlayVideoFromLink(message);
        }
        if (command.toLowerCase() == "stop") {
            pauseVideo();
<<<<<<< Updated upstream
            wait(2000);
=======
            $$.wait(2000);
>>>>>>> Stashed changes
            let DisplayerDisplaying = $$.id("Content");
            DisplayerDisplaying.classList.remove("ScrollDown");
            DisplayerDisplaying.offsetWidth;
            DisplayerDisplaying.classList.add("ScrollUp");
            stopVideo();
            player.destroy();
        }
        if (command.toLowerCase() == "pause")
            pauseVideo();
        if (command.toLowerCase() == "resume")
            resumeVideo();
        if (command.toLowerCase() == "mute")
            muteVideo();
        if (command.toLowerCase() == "unmute")
            unmuteVideo();
<<<<<<< Updated upstream
        if (command.toLowerCase() == "setvolume" || command.toLowerCase() == "volume" && message.toFixed) {
=======
        }
        if (command.toLowerCase() == "setvolume" ||
            command.toLowerCase() == "volume" && message.toFixed) {
>>>>>>> Stashed changes
            if (message > -1 && message < 101) {
                player.setVolume(message);
            }
            else {
                ComfyJS.Say("please only use numbers from 0 to 100 to set volume! :/");
            }
        }
    }
};
ComfyJS.Init(config.BOTLOGIN, config.BOTOAUTH, config.TWITCH_LOGIN);
var player;
function onYouTubeIframeAPIReady() {
    if (YT_VideoID != "") {
        player = new YT.Player("player", {
            height: window.innerHeight,
            width: window.innerWidth,
            videoId: YT_VideoID,
            playerVars: {
                playsinline: 1,
                autoplay: 1,
                controls: 1,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    }
}
function onPlayerReady(event) {
    event.target.playVideo();
}
var done = false;
function onPlayerStateChange(event) {
    $$.log(event);
    if (event.data == 0) {
<<<<<<< Updated upstream
        wait(2000);
=======
        $$.wait(2000);
>>>>>>> Stashed changes
        let DisplayerDisplaying = $$.id("Content");
        DisplayerDisplaying.classList.remove("ScrollDown");
        DisplayerDisplaying.offsetWidth;
        DisplayerDisplaying.classList.add("ScrollUp");
    }
}
function stopVideo() {
    player.stopVideo();
}
function pauseVideo() {
    player.pauseVideo();
}
function resumeVideo() {
    player.playVideo();
}
function muteVideo() {
    player.mute();
}
function unmuteVideo() { player.unMute(); }
;
function PlayVideoFromLink(Link) {
    $$.log(Link);
    if (Link.includes("youtube")) {
        let res = Link.split("=");
        YT_VideoID = res[1];
        Clear.innerHTML = "";
        let ContentDiv = $$.make("div");
        ContentDiv.id = "Content";
        ContentDiv.classList.add("ScrollDown");
        let InContentdivDiv = $$.make("div");
        let playerDiv = $$.make("div");
        playerDiv.id = "player";
        InContentdivDiv.append(playerDiv);
        ContentDiv.append(InContentdivDiv);
        Clear.append(ContentDiv);
        ComfyJS.Say("playing video on the displayer!! :>");
        let script = $$.make("script");
        script.src =
            "https://www.youtube.com/iframe_api" + `?v=${Math.random() * 10}`;
        script.type = "text/javascript";
        ScriptDIV.innerHTML = "";
        ScriptDIV.append(script);
        onYouTubeIframeAPIReady();
    }
    else if (Link.includes("twitch")) {
        if (Link.includes("clip")) {
            $$.log("clip.");
        }
        else if (Link.includes("videos")) {
            $$.log("videos.");
        }
        else {
            $$.log("stream.");
        }
        $$.log("In Twitch IF");
        let iframeID = "";
        Clear.innerHTML = "";
        let ContentDiv = $$.make("div");
        ContentDiv.id = "Content";
        let InContentdivDiv = $$.make("div");
        let playerDiv = $$.make("div");
        playerDiv.id = "player";
        InContentdivDiv.append(playerDiv);
        ContentDiv.append(InContentdivDiv);
        Clear.append(ContentDiv);
        if (Link.includes("clips.twitch.tv") ||
            /https\:\/\/www.twitch.tv\/.*\/clip\/.*/.test(Link) == true ||
            /https\:\/\/www.twitch.tv\/.*/.test(Link) == true) {
            let res = Link.split("/");
            console.log(res);
            iframeID = res[res.length - 1];
        }
        else {
            iframeID = "";
        }
        if (iframeID !== "") {
            var options;
            if (iframeID.match(/.*[A-Za-z].*/i)) {
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
            $$.log(options);
<<<<<<< Updated upstream
            wait(2000);
=======
            $$.wait(2000);
>>>>>>> Stashed changes
            var player = new Twitch.Embed("Displayer", options);
        }
    }
    else if (Link.includes("tumblr")) {
    }
}
function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "#37474F";
    }
    else if (playerStatus == 0) {
        color = "#FFFF00";
    }
    else if (playerStatus == 1) {
        color = "#33691E";
    }
    else if (playerStatus == 2) {
        color = "#DD2C00";
    }
    else if (playerStatus == 3) {
        color = "#AA00FF";
    }
    else if (playerStatus == 5) {
        color = "#FF6DOO";
<<<<<<< Updated upstream
        if (color) {
            let res = $$.id("player");
            res.style.borderColor = color;
        }
=======
    }
    if (color) {
        let res = $$.id("player");
        res.style.borderColor = color;
>>>>>>> Stashed changes
    }
}
