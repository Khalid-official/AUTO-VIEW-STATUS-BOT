const makeWASocket = require("@whiskeysockets/baileys").default; 
  
 const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@whiskeysockets/baileys"); 
  
 const util = require("util"); 
  
 const { useMultiFileAuthState, jidDecode, makeInMemoryStore, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys"); 
 const logger = require("@whiskeysockets/baileys/lib/Utils/logger").default; 
 const pino = require("pino"); 
 const gp = ["254736958034"];  
 const fs = require("fs"); 
 const figlet = require("figlet"); 
 const chalk = require("chalk"); 
 const os = require("os"); 
 const speed = require("performance-now"); 
 const timestampe = speed(); 
   const dreadedspeed = speed() - timestampe 
  
 const spinnies = new(require('spinnies'))(); 
  
 const { Boom } = require("@hapi/boom"); 
 const color = (text, color) => { 
   return !color ? chalk.green(text) : chalk.keyword(color)(text); 
 }; 
  
  
    
 // const { Socket } = Extra; 
 global.store = makeInMemoryStore({ 
  logger: pino().child({ 
     level: 'silent', 
     stream: 'store'  
   }) 
 }); 
  
 function smsg(m, conn) { 
   if (!m) return; 
   let M = proto.WebMessageInfo; 
   if (m.key) { 
     m.id = m.key.id; 
     m.isBaileys = m.id.startsWith("BAE5") && m.id.length === 16; 
     m.chat = m.key.remoteJid; 
     m.fromMe = m.key.fromMe; 
     m.isGroup = m.chat.endsWith("@g.us"); 
     m.sender = conn.decodeJid((m.fromMe && conn.user.id) || m.participant || m.key.participant || m.chat || ""); 
     if (m.isGroup) m.participant = conn.decodeJid(m.key.participant) || ""; 
   } 
   return m; 
 } 
 async function main () { 
 // const main = async () => { 
  
   const { state, saveCreds } = await useMultiFileAuthState('session'); 
 console.log( 
     color( 
       figlet.textSync("KHALID AUTOVIEW-STATUS", { 
         font: "Standard", 
         horizontalLayout: "default", 
         vertivalLayout: "default", 
         whitespaceBreak: false, 
       }), 
       "blue" 
     ) 
   ); 
        
      
    
  
   const dreaded = makeWASocket({  
           logger: pino({ 
          level: 'silent' 
       }), 
     printQRInTerminal: true, 
     browser: ['khalid AutoView', 'safari', '1.0.0'], 
     auth: state, 
qrTimeout: 20000000,
      
   }); 
  
                        
    
   
  
 dreaded.ev.on('messages.upsert', async chatUpdate => { 
   
           m = chatUpdate.messages[0] 
  m.chat = m.key.remoteJid; 
  m.fromMe = m.key.fromMe; 
  m.sender = dreaded.decodeJid((m.fromMe && dreaded.user.id) || m.participant || m.key.participant || m.chat); 
   
   
           const groupMetadata = m.isGroup ? await dreaded.groupMetadata(m.chat).catch((e) => {}) : ""; 
  const groupName = m.isGroup ? groupMetadata.subject : ""; 
   
   
  if (!m.message) return 
  if (m.chat.endsWith('broadcast')) { 
          dreaded.readMessages([m.key]); 

  } 
  
   
   
     
       
  
  }); 
   
  dreaded.decodeJid = (jid) => { 
     if (!jid) return jid; 
     if (/:\d+@/gi.test(jid)) { 
       let decode = jidDecode(jid) || {}; 
       return (decode.user && decode.server && decode.user + "@" + decode.server) || jid; 
     } else return jid; 
   }; 
     
  
    
   dreaded.ev.on('connection.update', async (update) => { 
       const { 
          connection, 
          lastDisconnect, 
          qr 
       } = update 
       if (lastDisconnect == 'undefined' && qr != 'undefined') { 
          qrcode.generate(qr, { 
             small: true 
          }) 
       } 
       if (connection === 'connecting') { 
        spinnies.add('start', { 
          text: 'Connecting Now. . .' 
       }) 
      } else if (connection === 'open') { 
          spinnies.succeed('start', { 
             text: `Successfully Connected. You have logged in to Khalid autoview bot as ${dreaded.user.name}` 
          }) 
       } else if (connection === 'close') { 
          if (lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) { 
             spinnies.fail('start', { 
                text: `Can't connect, check if bot account is active!` 
             }) 
             
             process.exit(0) 
          } else { 
             main().catch(() => main()) 
          } 
       } 
    }) 
  
    
   dreaded.ev.on('creds.update', saveCreds); 
    
 }; 
  
 main();
