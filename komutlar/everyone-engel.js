const db = require("quick.db");
const Discord = require("discord.js");

exports.run = async (client, message, args) => {
  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || "!";
  if (!message.member.hasPermission("BAN_MEMBERS")) {
    const embed = new Discord.MessageEmbed()
      .setDescription(`Ne yazık ki bu komutu kullanmaya yetkin yok.`)
      .setColor("BLACK")
      .setFooter(client.user.username, client.user.avatarURL());
    message.channel.send(embed);
    return;
  }
  if (!args[0]) {
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setTitle("Ever-Engel sistemi! <a:nlemm:842300606815535115>")
      .setDescription(`Hatalı kullanım! örnek: ${prefix}ever-engel aç && kapat`)
      .setFooter(client.user.username, client.user.avatarURL());

    message.channel.send(embed);
    return;
  }
  let kufur = await db.fetch(`ever_${message.guild.id}`);
  if (args[0] == "aç") {
    if (kufur) {
      const embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setTitle("Ever-Engel sistemi!")
        .setDescription("Görünüşe göre everyone filtresi zaten aktif! <:mavitickkk:842034257698226176>")
        .setFooter(client.user.username, client.user.avatarURL());

      message.channel.send(embed);
      return;
    } else {
      db.set(`ever_${message.guild.id}`, "acik");
      const embed = new Discord.MessageEmbed()
        .setColor("BLACK")
        .setTitle("Ever-Engel sistemi!")
        .setDescription("Ever filtresi başarıyla açıldı!  <a:on:838420767371821096>")
        .setFooter(client.user.username, client.user.avatarURL());

      message.channel.send(embed);
    }
  } else if (args[0] == "kapat") {
    db.delete(`ever_${message.guild.id}`);
    const embed = new Discord.MessageEmbed()
      .setColor("BLACK")
      .setTitle("Ever-Engel sistemi!")
      .setDescription("Ever filtresi başarıyla kapandı! <:kapal:842300224915505152>")
      .setFooter(client.user.username, client.user.avatarURL());

    message.channel.send(embed);
  }
};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ever"],
  permLevel: 2,
  kategori: "sunucu"
};

exports.help = {
  name: "ever-engel",
  description: "ever engeli aktif edersiniz.",
  usage: "ever-engel"
};