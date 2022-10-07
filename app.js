const { Client, Intents, User } = require("discord.js");
const client = new Client({ intents: new Intents(3243773) });

const gMap = new Map();
const gUserResponse = {}
const gUser = {}
const prefixMsg = `היי, 
אני דבי, הבוט של
 Dev Online`

const gMsg = [
  'מי אתה?',
  `מהו הנושא שתרצה לפרסם בו?\n
  \t2️⃣ Javascrip \n
  \t3️⃣ Python\n 
  \t4️⃣ C++\n `,
  'מהי הכותרת של הפוסט שלך?',
  'מהו תוכן הפוסט?',
  `תודה לך! אלו הפרטים שנקלטו:\n`
]

let gUserInput = true
let currOpt = 0


client.on("ready", () => {
  console.log("im online");
});

client.on("messageCreate", async (msg) => {

  if (msg.content === '%') {
    gMap.set(msg.author.id, { currOpt: 0, answers: {} });
    msg.channel.send(prefixMsg)
    msg.channel.send(gMsg[gMap.get(msg.author.id).currOpt++])
    return
  }

  try {
    const currOpt = gMap.get(msg.author.id).currOpt
    gMap.get(msg.author.id).answers[currOpt] = msg.content
    msg.channel.send(gMsg[gMap.get(msg.author.id).currOpt++])

    if (gMsg.length === gMap.get(msg.author.id).currOpt) {

      msg.channel.send(JSON.stringify(gMap.get(msg.author.id).answers))
      const attachments = JSON.parse(JSON.stringify(msg.attachments))
      if (attachments.length > 0) {
        console.log(attachments[0].url)
        gMap.get(msg.author.id).attachments = (attachments[0].url)
        msg.channel.send(JSON.stringify(gMap.get(msg.author.id).attachments))
      }
      gMap.delete(msg.author.id)
   
    }
  } catch (err) {
    return
  } 
})

client.login("**********");
