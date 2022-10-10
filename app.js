const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const dotenv = require('dotenv');
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const gInProggres = new Map();
const gClients = new Map();
const gChannels = new Map();



const State = {
  Ignore: -1,
  New: 0,
  Idle: 1,
  InPost: 2
}
const welcomeMsg = `היי, 
אני דבי, הבוט של
Dev Online`

const letsMeetMsg = "נעים להכיר, ומי אתם?"
const letsMeetAgainMsg = "איך נקרא לך מעכשיו?"

const letsStartMsg = `כדי להתחיל לרשום פוסט שלחו #start\n
לעזרה בכל שלב שלחו #help`

const callManager = `<@&1000492244085768223>`
const whatsappBotID = '1028194439606317077'

const optionsMsg = `להתחיל לרשום פוסט - $start \n
לביטול #stop \n
לשינוי שם #rename \n
לקריאה למנהל #manager \n
להצגת התפריט הזה #help \n`
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

client.once('ready', () => {
  console.log('I am Ready master!');
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot && msg.author.id !== whatsappBotID) return
  if ((msg.channel.parent == null) || (msg.channel.parent.name == null)) return
  if (!(msg.channel.parent.name.toLowerCase() === `whatsapp`)) return
  let userId = msg.author.id;
  let channelId = msg.channelId;
  if (!gClients.has(userId)) {
    gClients.set(userId, { clientName: ``, state: State.New })
    gChannels.set(channelId, { state: State.Idle })
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
      }
    case `#help`:
      {
        msg.channel.send(optionsMsg)
        return
      }
    case `#rename`:
      {
        msg.channel.send(letsMeetAgainMsg)
        gClients.get(userId).state = State.New
        return
      }
    case `#manager`:
      {
        msg.channel.send(callManager)
        return
      }
    case `#silence`:
      {
        gChannels.get(channelId).state = State.Ignore
        return
      }
    case `#reactive`:
      {
        gChannels.get(channelId).state = State.Idle
      }
    /*case `#list`:
      {
        const guild = msg.guild;
        const categoryChannels = guild.channels
        msg.channel.send(categoryChannels)
        return
      }*/
  }

  switch (gChannels.get(channelId).state) {
    case State.Ignore:
      {
        return
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

client.login(token)
