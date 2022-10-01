const { Client, Intents } = require("discord.js");
const client = new Client({ intents: new Intents(3243773) });

const gUser = {}
const gMsg = [
  'איך תרצה שנקרא לך?',
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
  if (msg.author.id === '1025672251850375188') return
  // console.log(msg);
  // console.log(msg.content);

  if (!currOpt) {
    if (msg.content === '%') {
      msg.channel.send(gMsg[currOpt])
      currOpt++
      return
    } else {
      // msg.channel.send('invalid prefix')
      return
    }
  }

  gUser[currOpt] = msg.content
  msg.channel.send(gMsg[currOpt])
  currOpt++

  if (gMsg.length === currOpt) {
    currOpt = 0
    msg.channel.send(JSON.stringify(gUser))
    const attachments = JSON.parse(JSON.stringify(msg.attachments))
    if (attachments.length > 0){
      msg.channel.send(`You are so hot!!\n ${attachments[0].attachment}`)
    }
  }

})

client.login("MTAyNTY3MjI1********************************");