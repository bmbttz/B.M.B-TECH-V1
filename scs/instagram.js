const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

// VCard Contact (optional)
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=254700000001:+254 700 000001\nEND:VCARD"
    }
  }
};

// Newsletter context
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
      serverMessageId: 1
    }
  }
};

bmbtz({
  nomCom: "instagram",
  categorie: "Download",
  reaction: "📸",
  alias: ["ig", "igdl"]
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;

  if (!arg[0]) return repondre("Please provide an Instagram post URL.");
  const url = arg.join(" ");
  if (!url.includes("instagram.com")) return repondre("Invalid Instagram URL provided.");

  try {
    await zk.sendMessage(dest, { react: { text: "⏳", key: ms.key } });

    const apiUrl = `https://api.delirius.store/download/igv2?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.url || data.url.length === 0) {
      return repondre("Failed to retrieve Instagram media.");
    }

    const mediaList = data.url;

    for (let media of mediaList) {
      if (media.includes(".mp4")) {
        await zk.sendMessage(dest, {
          video: { url: media },
          caption: "📥 Instagram Video",
          ...newsletterContext
        }, { quoted: quotedContact });
      } else {
        await zk.sendMessage(dest, {
          image: { url: media },
          caption: "📸 Instagram Image",
          ...newsletterContext
        }, { quoted: quotedContact });
      }
    }

  } catch (error) {
    console.error("Instagram Error:", error);
    repondre("❌ Error occurred while downloading from Instagram.");
  }
});
