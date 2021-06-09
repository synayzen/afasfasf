const discord = require('discord.js');
const fs = require('fs');
const http = require('http');
const db = require('quick.db');
const moment = require('moment')
const express = require('express');
const ayarlar = require('./ayarlar.json');
const app = express();
app.get("/", (request, response) => {
response.sendStatus(200);
});
app.listen(process.env.PORT);


//READY.JS

const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}!`);
console.log("Streamstatus synayzen")

client.user.setActivity(`Synayzen lvar 💕 𒋝 BİENVENİDOS`, {
type: "STREAMING",
url: "https://www.twitch.tv/synayzen"})
    .then(presence => console.log(`Your Status has been set to  ${presence.game ? presence.game.none : 'none'}`))
    .catch(console.error);
});

const log = message => {
  console.log(` ${message}`);
};
require('./util/eventLoader.js')(client);

//READY.JS SON

//KOMUT ALGILAYICI

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});




client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
           reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

//KOMUT ALGILAYICI SON

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};
client.login(process.env.TOKEN)


//-----------------------KOMUTLAR-----------------------\\
//EVERYONE-HERE ENGEL
client.on("message", async message => {
  let ever = await db.fetch(`ever_${message.guild.id}`);
  let sayı = await db.fetch(`sayi_${message.author.id}`);
  if (ever === "acik") {
    const a = message.content;
    if (a === "@everyone" || a === "@here") {
      if (message.member.hasPermission("BAN_MEMBERS")) return;
      db.add(`sayi_${message.author.id}`, 1);
      if (sayı == null) {
        const embed = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(
            "Bu 1. uyarın! Lütfen tekrarlama! Aksi taktirde atılacaksın!\n(1/3)"
          )
          .setFooter(client.user.username, client.user.avatarURL());
        message.channel.send(embed);
        message.delete();
        return;
      }
      if (sayı === 1) {
        const embed = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription(
            "Bu 2. uyarın! Lütfen tekrarlama! Aksi taktirde atılacaksın!\n(2/3)"
          )
          .setFooter(client.user.username, client.user.avatarURL());
        message.channel.send(embed);
        message.delete();
        return;
      }
      if (sayı > 2) {
        message.delete();
        const embed = new Discord.MessageEmbed()
          .setColor("BLACK")
          .setDescription("Sunucudan atılıyorsun!")
          .setFooter(client.user.username, client.user.avatarURL());
        message.channel.send(embed);
        db.delete(`sayi_${message.author.id}`);
        message.member.ban();
        return;
      }
    }
  } else {
    return;
  }
});
//client.on("message", async msg => {
  
///let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`)
 ///if (hereengelle == 'acik') {
   
      ///const here = ["@here", "@everyone"];
  ///if (here.some(word => msg.content.toLowerCase().includes(word)) ) {
    ///if (!msg.member.permissions.has("ADMINISTRATOR")) {
     /// msg.delete()
       ///return msg.reply('Yakaladım Seni! Everyone ve Here Etiketlemek Yasak <a:yeil_alev:836538102310240296> ').then(nordx => nordx.delete({timeout: 5000}))
      ///  }
    ///}
/// } else if (hereengelle == 'kapali') {
 
///}
///});
    
//EVERYONE-HERE ENGEL SON

// küfür-engel

client.on("message", async (msg, member) => {
 const i = await db.fetch(`${msg.guild.id}.kufur`)
    if (i) {
        const kufur = ["oç","o.ç", "amk", "oruspu","Oruspu","ananı sikiyim", "ananıskm", "piç", "amk","amını","ibne", "ibine", "amsk", "sikim", "sikiyim","a m k","orospu çocuğu", "piç kurusu", "kahpe", "orospu","yarak", "yarrak","amcık", "skrm", "amık", "yarram", "sikimi ye", "aq", "amq",];
      if (kufur.some(word => msg.content.toLowerCase().includes(word))) {
          try {
            if(!msg.member.roles.cache.has(db.fetch(`engellenmeyecekrol${msg.guild.id}`)) && !msg.member.hasPermission('ADMINISTRATOR')) {
                  msg.delete();
               return msg.reply('Yakaladım seni! Küfür Yasak <a:ban1:849561993341304862>').then(nordx => nordx.delete({timeout: 50000}))
              
            }              
          } catch(err) {
            console.log(err);
          }
        }
     }
    if (!i) return;
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
 const i = db.fetch(`${oldMsg.guild.id}.kufur`)
    if (i) {
        const kufur = ["oç","o.ç","amk","oruspu","Oruspu", "ananı sikiyim", "ananıskm", "piç", "amk", "amsk","amını","ibne","ibine", "sikim", "sikiyim","a m k","orospu çocuğu", "piç kurusu", "kahpe", "orospu","yarak","yarrak","amcık", "amık", "skrm", "yarram", "sikimi ye", "aq","amq",];
        if (kufur.some(word => newMsg.content.toLowerCase().includes(word))) {
          try {
            if(!newMsg.member.roles.cache.has(db.fetch(`engellenmeyecekrol${newMsg.guild.id}`)) && !newMsg.member.hasPermission('ADMINISTRATOR')) {
                  newMsg.delete();   
                      return oldMsg.reply('Mesajı Düzenlediğini Yakaladım! Küfür yasak <a:ban1:849561993341304862> ').then(jkood => jkood.delete({timeout: 50000}))
            }              
          
        } catch(err) {
            console.log(err);
          }
        }
  
    }
    if (!i) return;
});

// küfür-engel


// reklam-engel

client.on('message', async message => {
let aktif = await db.fetch(`reklamEngelcodework_${message.guild.id}`)
if (!aktif) return 
let kanal = "848880870491553833"
let reklamlar = ["discord.app", "discord.gg" ,"discordapp","discordgg",  ".xyz", ".tk", ".pw", ".io", ".me", ".gg",".gl", ".biz" , ".party", ".rf.gd", ".az", ".cf", ".me",]
let kelimeler = message.content.slice(" ").split(/ +/g)
if (reklamlar.some(word => message.content.toLowerCase().includes(word))) {
if(message.member.roles.cache.has(db.fetch(`engellenmeyecekrol${message.guild.id}`)) ) return; message.delete()
message.reply('Reklamları engelliyorum! <a:ban:836249026499837982>').then(jkood => jkood.delete({timeout: 7000}))
message.guild.channels.cache.get(kanal).send(new Discord.MessageEmbed().setColor("FF0000")
.setAuthor(`${client.user.username} │ Reklam Yapıldı`, client.user.avatarURL())
.setThumbnail(message.author.avatarURL())
.setDescription(`
Kişi Adı » **${message.author.username}** (\`${message.author.id}\`)
Kişi Etiket » <@${message.author.id}>
Mesajı: ↴ \`\`\`${message.content}\`\`\``))
}
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
let aktif = await db.fetch(`reklamEngelcodework_${oldMsg.guild.id}`)
if(!aktif) return
let kanal2 = "848880870491553833"
let reklamlar = ["discord.app", "discord.gg","discordapp","discordgg",  ".xyz", ".tk", ".pw", ".io", ".me", ".gg",  ".gl", ".biz", ".party", ".rf.gd", ".az", ".cf", ".me",]
let kelimeler = newMsg.content.slice(" ").split(/ +/g)
if (reklamlar.some(word => newMsg.content.toLowerCase().includes(word))) {
if(newMsg.member.roles.cache.has(db.fetch(`engellenmeyecekrol${newMsg.guild.id}`)) ) return; newMsg.delete()
oldMsg.reply('Mesajı Düzenlediğini Yakaladım! Reklam Yapmak Yasak. <a:ban:836249026499837982>').then(jkood => jkood.delete({timeout: 7000})) 
newMsg.guild.channels.cache.get(kanal2).send(new Discord.MessageEmbed().setColor("FF0000")
.setAuthor(`${client.user.username} │ Mesajını Düzenledi Ve Reklam Yapıldı`, client.user.avatarURL())
.setThumbnail(newMsg.author.avatarURL())
.setDescription(`
Kişi Adı » **${newMsg.author.username}** (\`${newMsg.author.id}\`)
Kişi Etiket » <@${newMsg.author.id}>
Mesajı: ↴ \`\`\`${newMsg.content}\`\`\``))
}
});

// reklam-engel


// caps-engel

client.on("message", async msg => {
  if (msg.channel.type === "dm") return;
  if (msg.author.bot) return;
  if (msg.content.length > 1) {
    if (db.fetch(`capslock_${msg.guild.id}`)) {
      let caps = msg.content.toUpperCase();
      if (msg.content == caps) {
        if(!msg.member.roles.cache.has(db.fetch(`engellenmeyecekrol${msg.guild.id}`)) && !msg.member.hasPermission('ADMINISTRATOR')) {
          if (!msg.mentions.users.first()) {
            msg.delete();
            return msg.channel.send(`${msg.member}, Capslock Kapat Lütfen! <a:alev:836538220744671232>`).then(nordx => nordx.delete({timeout: 5000}))
              
          }
        }
      }
    }
  }
});

client.on("messageUpdate", async (oldMsg, newMsg) => {
  if (newMsg.channel.type === "dm") return;
  if (newMsg.author.bot) return;
  if (newMsg.content.length > 1) {
    if (db.fetch(`capslock_${oldMsg.guild.id}`)) {
      let caps = newMsg.content.toUpperCase();
      if (newMsg.content == caps) {
        if(!newMsg.member.roles.cache.has(db.fetch(`engellenmeyecekrol${newMsg.guild.id}`)) && !newMsg.member.hasPermission('ADMINISTRATOR')) {
          if (!oldMsg.mentions.users.first()) {
            newMsg.delete();
            return oldMsg.channel.send(`${oldMsg.member}, Mesajı Düzenlediğini Yakaladım! CapsLock Kullanımı Yasak. <a:alev:836538220744671232>`).then(nordx => nordx.delete({timeout: 5000}))
              
          }
        }
      }
    }
  }
});

// caps-engel

// emoji-koruma

client.on("emojiDelete", async (emoji, message, channels) => {
  let emojik = await db.fetch(`emojik_${emoji.guild.id}`)
  if (emojik) {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE" }).then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id)
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == emoji.guild.owner.id) return;
  if (!emoji.guild.members.cache.get(entry.executor.id).hasPermission('ADMINISTRATOR')) {
  emoji.guild.emojis.create(`${emoji.url}`, `${emoji.name}`).catch(console.error);
    const embed = new Discord.MessageEmbed()
    .setColor("GRAY")
    .addField(`Bir Emoji Silindi`, `**${emoji.name}** Adlı Emoji Başarıyla Oluşturuldu.`)
    .addField(`Silen Kişi`, `<@${user.id}>`)
    .setTimestamp()
    client.channels.cache.get(db.fetch(`sistemlogkanalı${emoji.guild.id}`)).send(embed)  
  
  }
  }
});

client.on("emojiCreate", async (emoji, message, channels) => {
  let emojik = await db.fetch(`emojik_${emoji.guild.id}`)
  if (emojik) {
  const entry = await emoji.guild.fetchAuditLogs({ type: "EMOJI_CREATE" }).then(audit => audit.entries.first());
  let user = client.users.cache.get(entry.executor.id)
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.id == emoji.guild.owner.id) return;
  if (!emoji.guild.members.cache.get(entry.executor.id).hasPermission('ADMINISTRATOR')) {
  emoji.delete().catch(console.error);
    const embed = new Discord.MessageEmbed()
    .setColor("GRAY")
    .addField(`Bir Emoji Oluşturuldu`, `**${emoji.name}** Adlı Emoji Başarıyla Silindi.`)
    .addField(`Oluşturan Kişi`, `<@${user.id}>`)
    .setTimestamp()
    client.channels.cache.get(db.fetch(`sistemlogkanalı${emoji.guild.id}`)).send(embed)  
  
  }
  }
});

// emoji-koruma

// Anti-Raid (Bot Koruma)

client.on("guildMemberAdd", async member => {
let kanal = await db.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-aç"
  if (!kanal) return;  
  if (member.user.bot === true) {
     if (db.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
    let darknesguardv2 = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL({dynamic:true}))
      .setDescription(`**${member.user.tag}** (${member.id}) adlı bota bir yetkili izin verdi eğer kaldırmak istiyorsanız **!bot-izni kaldır <botid>**.`);
    client.channels.cache.get(db.fetch(`sistemlogkanalı${member.guild.id}`)).send(darknesguardv2)
     } else {
       let izinverilmemişbot = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL({dynamic:true}))
      .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "**yandaki bilgilere ait bot sunucuya eklendi ve banlandı. <a:ban:836249026499837982> **")
       member.ban();
       client.channels.cache.get(db.fetch(`sistemlogkanalı${member.guild.id}`)).send(izinverilmemişbot)
       client.channels.cache.get(db.fetch(`sistemlogkanalı${member.guild.id}`)).send("<@&844277646014677034>")
}
  }
});

// Anti-Raid (Bot Koruma)

//--------------------BOTU_KANALA_SOKMA-------------------------//

client.on("ready", () => {
  client.channels.cache.get("844277647344533545").join();
});

//------------------------------------------------------------//

//FAKE HESAP CEZA

client.on("guildMemberAdd", member => {
  var moment = require("moment")
  require("moment-duration-format")
  moment.locale("tr")
   var {Permissions} = require('discord.js');
   var x = moment(member.user.createdAt).add(14, 'days').fromNow()
   var user = member.user
   x = x.replace("birkaç saniye önce", " ")
   if(!x.includes("önce") || x.includes("sonra") ||x == " ") {
   var rol = member.guild.roles.cache.get("844277645986496525") //Cezalı Rol İD
   var kayıtsız = member.guild.roles.cache.get("844277645683195936") //Alınacak Rol İD
   member.roles.add(rol)
member.user.send('●▬▬▬▬▬▬▬[ 𒋝 BİENVENİDOS ]▬▬▬▬▬▬▬▬● \n <a:Assassinsok:836253273169854464> Selam Dostum Ne Yazık ki Sana Kötü Bir Haberim Var. \n <a:Assassinsok:836253273169854464> Hesabın 14 Gün Gibi Kısa Bir Sürede Açıldığı İçin Fake Hesap Katagorisine Giriyorsun. \n <a:Assassinsok:836253273169854464> Lütfen Bir Yetkiliyle İletişime Geç Onlar Sana Yardımcı Olucaktır. \n ●▬▬▬▬▬▬▬[ 𒋝 BİENVENİDOS ]▬▬▬▬▬▬▬▬●')
setTimeout(() => {

        member.roles.remove(kayıtsız.id);

}, 1000)

  
    
   }
        else {

        }  
    });

//FAKE HESAP CEZA SON
client.on("guildBanAdd", async (guild, user) => {
  let kontrol = await db.fetch(`dil_${guild.id}`);
  let kanal = await db.fetch(`bank_${guild.id}`);
  let rol = await db.fetch(`banrol_${guild.id}`);
  if (!kanal) return;
  if (kontrol == "agayokaga") {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor(0x36393F)
      .addField(`Yasaklayan:`, entry.executor.tag)
      .addField(`Yasaklanan Kişi:`, user.name)
      .addField(
        `Sonuç:`,
        `Yasaklayan kişi sunucudan açıldı!\nve yasaklanan kişinin yasağı kalktı!`
      );
    client.channels.cache.get(kanal).send(embed);
  } else {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor(0x36393F)
      .addField(`Yasaklayan:`, entry.executor.tag)
      .addField(`Yasaklanan Kişi:`, user.name)
      .addField(
        `Sonuç:`,
        `Yasaklayan kişi sunucudan atıldı ve yasaklanan kişinin yasağı kalktı. `
      );
    client.channels.cache.get(kanal).send(embed);
  }
});


/// modlog sistemi

client.on("messageDelete", async (message) => {

  if (message.author.bot || message.channel.type == "dm") return;

  let loger = "844277649165123637"

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "")

 client.channels.cache.get(loger).send(embed)

})

client.on("messageUpdate", async (oldMessage, newMessage) => {

  let modlog = "844277649165123637"

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

  .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

  .addField("**Eylem:**", "Mesaj Düzenleme")

  .addField("**Mesajın sahibi:**", `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`)

  .addField("**Eski Mesajı:**", `${oldMessage.content}`)

  .addField("**Yeni Mesajı:**", `${newMessage.content}`)

  .setTimestamp()

  .setColor(0x36393F)

  .setFooter(`Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`, oldMessage.guild.iconURL())

  .setThumbnail(oldMessage.guild.iconURL)

  client.channels.cache.get(modlog).send(embed)

});


client.on("emojiCreate", async(emoji) => {

let modlog = await db.fetch(`log_${emoji.guild.id}`);

if (!modlog) return;

const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Emoji Oluşturma")

.addField("**Emojiyi oluşturan kişi:**", `<@${entry.executor.id}>`)

.addField("**Oluşturulan emoji:**", `${emoji} - İsmi: \`${emoji.name}\``)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`, emoji.guild.iconURL)

.setThumbnail(emoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiDelete", async(emoji) => {

let modlog = await db.fetch(`log_${emoji.guild.id}`);

if (!modlog) return;

const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Emoji Silme")

.addField("**Emojiyi silen kişi:**", `<@${entry.executor.id}>`)

.addField("**Silinen emoji:**", `${emoji}`)

.setTimestamp()

.setFooter(`Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`, emoji.guild.iconURL)

.setColor(0x36393F)

.setThumbnail(emoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("emojiUpdate", async(oldEmoji, newEmoji) => {

let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

if (!modlog) return;

const entry = await oldEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Emoji Güncelleme")

.addField("**Emojiyi güncelleyen kişi:**", `<@${entry.executor.id}>`)

.addField("**Güncellenmeden önceki emoji:**", `${oldEmoji} - İsmi: \`${oldEmoji.name}\``)

.addField("**Güncellendikten sonraki emoji:**", `${newEmoji} - İsmi: \`${newEmoji.name}\``)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`, oldEmoji.guild.iconURL)

.setThumbnail(oldEmoji.guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("guildBanAdd", async(guild, user) => {

let modlog = await db.fetch(`log_${guild.id}`);

if (!modlog) return;

const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Yasaklama")

.addField("**Kullanıcıyı yasaklayan yetkili:**", `<@${entry.executor.id}>`)

.addField("**Yasaklanan kullanıcı:**", `**${user.tag}** - ${user.id}`)

.addField("**Yasaklanma sebebi:**", `${entry.reason}`)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

.setThumbnail(guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})

client.on("guildBanRemove", async(guild, user) => {

let modlog = await db.fetch(`log_${guild.id}`);

if (!modlog) return;

const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE"}).then(audit => audit.entries.first());

let embed = new Discord.MessageEmbed()

.setAuthor(entry.executor.username, entry.executor.avatarURL())

.addField("**Eylem:**", "Yasak kaldırma")

.addField("**Yasağı kaldıran yetkili:**", `<@${entry.executor.id}>`)

.addField("**Yasağı kaldırılan kullanıcı:**", `**${user.tag}** - ${user.id}`)

.setTimestamp()

.setColor(0x36393F)

.setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

.setThumbnail(guild.iconURL)

client.channels.cache.get(modlog).send(embed)

})
// mod log son ///

client.on("message", msg => {
var dm = client.channels.cache.get("845235521810857994")
if(msg.channel.type === "dm") {
if(msg.author.id === client.user.id) return;
const botdm = new Discord.MessageEmbed()
.setTitle(`${client.user.username} Dm`)
.setTimestamp()
.setColor("#8cc0f7")
.setThumbnail(`${msg.author.avatarURL()}`)
.addField("Gönderen", msg.author.tag)
.addField("Gönderen ID", msg.author.id)
.addField("Gönderilen Mesaj", msg.content)
dm.send("<@&844277645995016208>")
dm.send(botdm)

}
if(msg.channel.bot) return;
});


 
