const { Client, Intents, User } = require("discord.js");
const client = new Client({ intents: new Intents(3243773) });

const gInProggres = new Map();
const gClients = new Map();
const gUserResponse = {}
const gUser = {}

let gUserInput = true
let currOpt = 0


const State = {
  New: 0,
  Idle: 1,
  InPost: 2
}
const welcomeMsg = `היי, 
אני דבי, הבוט של
Dev Online`

const letsMeetMsg = "נעים להכיר, ומי אתם?"

const letsStartMsg = `כדי להתחיל לרשום פוסט שלחו #start\n
לעזרה בכל שלב שלחו #help`

const optionsMsg = `להתחיל לרשום פוסט - $start \n
לביטול #stop \n
להצגת התפריט הזה #help`
const stopProggress = `אין בעיה, ביטלתי את הפוסט`
const gMsg = [
  `מהו הנושא שתרצה לפרסם בו?\n
\t2️⃣ Javascrip \n
\t3️⃣ Python\n 
\t4️⃣ C++\n `,
  'מהי הכותרת של הפוסט שלך?',
  'מהו תוכן הפוסט?',
  `תודה לך! אלו הפרטים שנקלטו:\n`
]

client.on("ready", () => {
  console.log("im online");
})

client.on("messageCreate", async (msg) => {
  if (msg.author.id === '1025672251850375188') return
  if ((msg.channel.parent == null) || (msg.channel.parent.name == null)) return
  if (!(msg.channel.parent.name.toLowerCase() === `whatsapp`)) return
  let userId = msg.author.id;
  if (!gClients.has(userId)) {
    gClients.set(userId, { clientName: ``, state: State.New })
    welcomeTxt = welcomeMsg
    msg.channel.send(welcomeMsg)
    msg.channel.send(letsMeetMsg)
    return
  }

  switch (msg.content.toLowerCase()) {
    case `#start`:
      {
        gInProggres.set(userId, { currOpt: 0, answers: {} });
        gClients.get(userId).state = State.InPost
        break
      }
    case `#stop`:
      {
        gInProggres.delete(userId)
        gClients.get(userId).state = State.Idle
        msg.channel.send(stopProggress)
        return
        break
      }
    case `#help`:
      {
        msg.channel.send(optionsMsg)
        break
      }
  }

  switch (gClients.get(userId).state) {
    case State.New:
      {
        gClients.get(userId).clientName = msg.content
        gClients.get(userId).state = State.Idle

        msg.channel.send(letsStartMsg)
        break
      }
    case State.Idle:
      {
        msg.channel.send(`היי ${gClients.get(userId).clientName}`)
        msg.channel.send(letsStartMsg)
        break
      }
    case State.InPost:
      {
        try {
          const currOpt = gInProggres.get(userId).currOpt
          gInProggres.get(userId).answers[currOpt] = msg.content
          msg.channel.send(gMsg[gInProggres.get(userId).currOpt++])

          if (gMsg.length === gInProggres.get(userId).currOpt) {

            msg.channel.send(JSON.stringify(gInProggres.get(userId).answers))
            const attachments = JSON.parse(JSON.stringify(msg.attachments))
            if (attachments.length > 0) {
              console.log(attachments[0].url)
              gInProggres.get(userId).attachments = (attachments[0].url)
              msg.channel.send(JSON.stringify(gInProggres.get(userId).attachments))
            }
            gInProggres.delete(userId)
            gClients.get(userId).state = State.Idle
          }
        } catch (err) {
          return
        }
        break
      }
  }
  
})

client.login("<Your login info here>")
