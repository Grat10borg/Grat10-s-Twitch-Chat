# Grat10-s-Twitch-Chat (Twitch Widgets)
Grat's Custome Chat and Bot Combo & Displayer.

These are made to be ran on a local server and displayed within [OBS](https://obsproject.com/) as part of an overlay.
use the Browser Source to place your widgets on stream.

Note: the website url needs to be HTTPS not HTTP, Twitch blocks HTTP websites

The widgets needs this to work.
- an Twitch API token
- your Twitch username
- your OAuth
- a Bot account OAuth (or your own again, it will just post under your name then)
- a Bot Twitch Username (or your own again)
- a Local Server or online server

## Chat & Bot
a simple chat that gets updated everytime anyone posts a message in the connected twitch chat.
it also accepts commands with !<YourCommand> and will post messages through a connected bot account.

 ![GratChat Displaying lots of messages](https://github.com/Grat10borg/Grat10-s-Twitch-Chat/assets/109081987/929e6601-2fd3-4f0f-9c74-670ccbfbac8e)
  
### Commands for Grat-Chat
// Anyone can use.
- !lurk (post thanks for lurking message)
- !dice (picks a random number between 1 & 6)
- !me (writes message *italicized*)
  
// Mods & Broadcaster Only
- !clear (clears chat)
- !clip (clips the last 30 seconds of stream)
- !marker (makes a stream marker for Twitch)
- !playclips (enables Twitch clips linked in chat play, but muted) <- may be removed
                                                                      
## Displayer
a Displayer meant to be able to display everything and anything the stream wants it to (currently only supports youtube vids)

![Grats Displayer Displaying a Youtube Video](https://github.com/Grat10borg/Grat10-s-Twitch-Chat/assets/109081987/e059052e-1030-4c00-a036-8901bfec3f1f)
                                                                                                                                   
### Commands for Displayer
// Mod & Broadcaster only.
- !play <Link> (plays linked video)
- !watch <Link>
- !display <Link>
they all do the same

  // youtube ONLY commands (currently)
- !stop (stops video and retracks displayer)
- !pause (pauses video)
- !resume (resumes video)
- !mute (mutes video)
- !unmute (unmutes video)
- !setvolume [0 - 100] (sets volume after number 0 nothing vs 100 max volume)
  
