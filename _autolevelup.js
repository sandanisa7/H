import { canLevelUp } from '../lib/levelling.js'

export async function before(m, { conn }) {
    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    }

    let user = global.db.data.users[m.sender]
    
    // Set default autolevelup if it's undefined
    if (user.autolevelup === undefined) {
        user.autolevelup = true;
    }

    if (!user.autolevelup) return true;

    let before = user.level * 1;

    // Debugging: Log current level and experience
    console.log(`Before Level: ${before}, XP: ${user.exp}`);

    while (canLevelUp(user.level, user.exp, global.multiplier)) {
        user.level++;
    }

    if (before !== user.level) {
        let bkp = (`
*「 LEVEL UP 」*

➤ *Name*: *${user.registered ? user.name : conn.getName(m.sender)}* 
➤ *XP*: *${user.exp}*
➤ *Level:* *${before}* -> *${user.level}*
➤ *Role:* *${user.role}*
 
Note: Semakin sering berinteraksi dengan bot, semakin tinggi level kamu!
        `);

        // Debugging: Log level-up message
        console.log(bkp);

        conn.reply(m.chat, bkp, m, {quoted: fkontak});
    } else {
        // Debugging: Log if no level-up occurred
        console.log(`No level-up. Current level: ${user.level}, XP: ${user.exp}`);
    }
}
/* JANGAN HAPUS INI 
SCRIPT BY © VYNAA VALERIE 
•• recode kasih credits 
•• contacts: (6282389924037)
•• instagram: @vynaa_valerie 
•• (github.com/VynaaValerie) 
*/
