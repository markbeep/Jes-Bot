# Jes Discord Bot

## How To Run:
1. Make sure you have Node.js Version **`16.x.x`** or newer
2. Clone with `git clone git@github.com:markbeep/Jes-Bot.git`
3. Install required packages using `npm install`
4. Start the bot with `node .`  
The first run will make sure you have all the files you need.  
Insert the bot token you got from [Discord Developers](https://discord.com/developers) in `config.json`:
```json
{
  "token": "INSERT TOKEN HERE",
  "prefix": ";"
}
```
5. Run `node .` again. This will start the bot for real and you're done!

>Additionally add the ID of a reaction which will be added to quotes being added by reactions to signal that the message was quoted in the config. Example in the `config.json`:  
`"addedQuoteId": "840985556304265237"`

## Notes
You might notice when looking at the code that I've tried to pre-generate everything from aliases to the embeds of help pages, which makes calling functions faster by a big amount. The only limiting factor is the ping at this point. The drawback is that the code is a bit more confusing though.