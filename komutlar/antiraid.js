const Discord = require("discord.js");
const db = require("quick.db");
exports.run = async (client, message, args) => {
 if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply("bu komutu kullanmak için `Yönetici` yetkisine sahip olmalısın. <a:nlemm:842300606815535115>")
let sistemlog = await db.fetch(`sistemlogkanalı${message.guild.id}`)
if(!sistemlog) return message.reply('Lütfen Bir Log kanalı ayarlayınız! **!sistemlog #kanal** şeklinde ayarlayabilirsiniz.<a:nlemm:842300606815535115>')
  
  if (args[0] == "aç") {
    if (db.has(`antiraidK_${message.guild.id}`) === true) {
      return message.channel.send("Anti-raid zaten açılmış. <:mavitickkk:842034257698226176>");
    }
    db.set(`antiraidK_${message.guild.id}`, "anti-raid-aç");
    message.reply("Anti-raid sistemi başarıyla açıldı <a:on:838420767371821096> ");
  }
 
  if (args[0] == "kapat") {
    if (db.has(`antiraidK_${message.guild.id}`) === false) {
      return message.channel.send(
        "Anti-raid açılmamış. Açmak için **!anti-raid aç <a:nlemm:842300606815535115>**"
      );
    }
    db.delete(`antiraidK_${message.guild.id}`, "anti-raid-aç");
    message.reply("Anti-raid sistemi başarıyla kapatıldı <:kapal:842300224915505152>");
  }
  if (!args[0])
    return message.reply(
      "Lütfen geçerli işlem girin. Örnek: **!anti-raid aç/kapat <a:nlemm:842300606815535115>**"
    );
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['antiraid'],
  permLevel: 0
};
exports.help = {
  name: "anti-raid"
};