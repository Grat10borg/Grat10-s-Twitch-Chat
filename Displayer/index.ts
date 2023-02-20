console.log("JS connected");

//@ts-expect-error
ComfyJS.onCommand = (
  user: any,
  command: any,
  message: any,
  flags: any,
  extra: any
) => {
    // if command contains watch something like !watch https://www.youtube.com/watch?v=GGTSzvlbBkE or the same with any twitch clip
  if (command.toLowerCase() === "Watch") {
    //@ts-expect-error
    ComfyJS.Say("Have a nice lurk @" + user + "!! 🌺🌸");
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
