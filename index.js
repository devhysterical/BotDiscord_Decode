require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActivityType,
} = require("discord.js");

// Khởi tạo Discord client với các intent cần thiết
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message],
});

const PREFIX = process.env.PREFIX || "!";

// Sự kiện khi bot đã sẵn sàng
client.on("ready", () => {
  console.log(`Bot đã đăng nhập thành công với tên ${client.user.tag}`);
  client.user.setActivity("!decode help", { type: ActivityType.Playing });
});

// Hàm decode Base64
function decodeBase64(text) {
  try {
    return Buffer.from(text, "base64").toString("utf-8");
  } catch (error) {
    return "Không thể decode Base64: Đầu vào không hợp lệ";
  }
}

// Hàm decode URL
function decodeURL(text) {
  try {
    return decodeURIComponent(text);
  } catch (error) {
    return "Không thể decode URL: Đầu vào không hợp lệ";
  }
}

// Hàm decode Hex
function decodeHex(text) {
  try {
    // Loại bỏ khoảng trắng và kiểm tra xem có bắt đầu bằng "0x" không
    text = text.replace(/\s+/g, "");
    if (text.startsWith("0x")) {
      text = text.substring(2);
    }

    // Kiểm tra xem chuỗi có chứa các ký tự hex hợp lệ không
    if (!/^[0-9A-Fa-f]+$/.test(text)) {
      return "Chuỗi Hex không hợp lệ";
    }

    let result = "";
    for (let i = 0; i < text.length; i += 2) {
      if (i + 1 < text.length) {
        const charCode = parseInt(text.substring(i, i + 2), 16);
        result += String.fromCharCode(charCode);
      }
    }
    return result;
  } catch (error) {
    return "Không thể decode Hex: Đầu vào không hợp lệ";
  }
}

// Hàm decode Binary
function decodeBinary(text) {
  try {
    // Loại bỏ khoảng trắng và kiểm tra xem có chứa chỉ 0 và 1 không
    text = text.replace(/\s+/g, "");
    if (!/^[01]+$/.test(text)) {
      return "Chuỗi nhị phân không hợp lệ";
    }

    let result = "";
    for (let i = 0; i < text.length; i += 8) {
      const byte = text.substring(i, i + 8);
      if (byte.length === 8) {
        const charCode = parseInt(byte, 2);
        result += String.fromCharCode(charCode);
      }
    }
    return result;
  } catch (error) {
    return "Không thể decode Binary: Đầu vào không hợp lệ";
  }
}

// Hàm decode ASCII
function decodeASCII(text) {
  try {
    // Kiểm tra xem chuỗi có chứa các số ASCII hợp lệ không
    const asciiCodes = text.split(/\s+/).map(Number);
    if (
      asciiCodes.some(isNaN) ||
      asciiCodes.some((code) => code < 0 || code > 127)
    ) {
      return "Các mã ASCII không hợp lệ";
    }

    return asciiCodes.map((code) => String.fromCharCode(code)).join("");
  } catch (error) {
    return "Không thể decode ASCII: Đầu vào không hợp lệ";
  }
}

// Hàm decode Morse
function decodeMorse(text) {
  const morseCodeMap = {
    ".-": "A",
    "-...": "B",
    "-.-.": "C",
    "-..": "D",
    ".": "E",
    "..-.": "F",
    "--.": "G",
    "....": "H",
    "..": "I",
    ".---": "J",
    "-.-": "K",
    ".-..": "L",
    "--": "M",
    "-.": "N",
    "---": "O",
    ".--.": "P",
    "--.-": "Q",
    ".-.": "R",
    "...": "S",
    "-": "T",
    "..-": "U",
    "...-": "V",
    ".--": "W",
    "-..-": "X",
    "-.--": "Y",
    "--..": "Z",
    ".----": "1",
    "..---": "2",
    "...--": "3",
    "....-": "4",
    ".....": "5",
    "-....": "6",
    "--...": "7",
    "---..": "8",
    "----.": "9",
    "-----": "0",
    "--..--": ",",
    ".-.-.-": ".",
    "..--..": "?",
    "-..-.": "/",
    "-.--.": "(",
    "-.--.-": ")",
    ".-...": "&",
    "---...": ":",
    "-.-.-.": ";",
    "-...-": "=",
    ".-.-.": "+",
    "-....-": "-",
    "..--.-": "_",
    ".-..-.": '"',
    "...-..-": "$",
    ".--.-.": "@",
    "...---...": "SOS",
  };

  try {
    // Tách các từ và ký tự trong mã Morse
    const words = text.trim().split("   ");
    let result = "";

    for (const word of words) {
      const characters = word.split(" ");
      for (const char of characters) {
        if (char === "") continue;
        if (morseCodeMap[char]) {
          result += morseCodeMap[char];
        } else {
          result += "?"; // Ký tự không xác định
        }
      }
      result += " ";
    }

    return result.trim();
  } catch (error) {
    return "Không thể decode Morse: Đầu vào không hợp lệ";
  }
}

// Hàm cung cấp ví dụ cho từng loại decode
function getExampleForType(type) {
  switch (type.toLowerCase()) {
    case "base64":
      return `\`${PREFIX}decode base64 SGVsbG8gV29ybGQ=\``;
    case "url":
      return `\`${PREFIX}decode url Hello%20World\``;
    case "hex":
      return `\`${PREFIX}decode hex 48656C6C6F20576F726C64\``;
    case "binary":
      return `\`${PREFIX}decode binary 01001000 01100101 01101100 01101100 01101111\``;
    case "ascii":
      return `\`${PREFIX}decode ascii 72 101 108 108 111\``;
    case "morse":
      return `\`${PREFIX}decode morse .... . .-.. .-.. ---\``;
    default:
      return `\`${PREFIX}decode help\` để xem danh sách lệnh hợp lệ`;
  }
}

// Hàm hiển thị trợ giúp
function showHelp(message) {
  const helpEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("🔍 Discord Decode Bot - Hướng dẫn sử dụng")
    .setDescription(
      "Bot có thể giải mã nhiều loại mã khác nhau. Sử dụng các lệnh sau:"
    )
    .addFields(
      {
        name: "📋 Các lệnh có sẵn:",
        value: `Sử dụng prefix \`${PREFIX}\` trước mỗi lệnh.`,
      },
      {
        name: `🔹 ${PREFIX}decode base64 <text>`,
        value:
          "Decode chuỗi Base64\nVí dụ: " +
          getExampleForType("base64").replace(/`/g, ""),
      },
      {
        name: `🔹 ${PREFIX}decode url <text>`,
        value:
          "Decode chuỗi URL\nVí dụ: " +
          getExampleForType("url").replace(/`/g, ""),
      },
      {
        name: `🔹 ${PREFIX}decode hex <text>`,
        value:
          "Decode chuỗi Hex\nVí dụ: " +
          getExampleForType("hex").replace(/`/g, ""),
      },
      {
        name: `🔹 ${PREFIX}decode binary <text>`,
        value:
          "Decode chuỗi nhị phân\nVí dụ: " +
          getExampleForType("binary").replace(/`/g, ""),
      },
      {
        name: `🔹 ${PREFIX}decode ascii <text>`,
        value:
          "Decode chuỗi mã ASCII\nVí dụ: " +
          getExampleForType("ascii").replace(/`/g, ""),
      },
      {
        name: `🔹 ${PREFIX}decode morse <text>`,
        value:
          "Decode chuỗi mã Morse\nVí dụ: " +
          getExampleForType("morse").replace(/`/g, ""),
      }
    )
    .setFooter({
      text: "💡 Gõ !decode <loại> để xem cú pháp cụ thể cho từng loại decode",
    });

  message.channel.send({ embeds: [helpEmbed] });
}

// Xử lý tin nhắn
client.on("messageCreate", async (message) => {
  // Bỏ qua tin nhắn từ bot và tin nhắn không bắt đầu bằng prefix
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  // Phân tích nội dung tin nhắn
  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Xử lý lệnh decode
  if (command === "decode") {
    const type = args.shift()?.toLowerCase();
    const content = args.join(" ");

    // Nếu không có type hoặc type là "help", hiển thị trợ giúp
    if (!type || type === "help") {
      return showHelp(message);
    }

    // Nếu có type nhưng không có content, hiển thị thông báo lỗi và gợi ý cú pháp
    if (!content) {
      const typeHelpEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setTitle("Lỗi: Thiếu nội dung để giải mã")
        .setDescription(
          `Bạn cần cung cấp nội dung để giải mã với lệnh \`${PREFIX}decode ${type}\`.`
        )
        .addFields(
          {
            name: "Cú pháp đúng",
            value: `\`${PREFIX}decode ${type} <nội dung cần giải mã>\``,
          },
          {
            name: "Ví dụ",
            value: getExampleForType(type),
          }
        )
        .setFooter({
          text: `Sử dụng ${PREFIX}decode help để xem tất cả các lệnh`,
        });

      return message.channel.send({ embeds: [typeHelpEmbed] });
    }

    let result = "";
    let title = "";

    switch (type) {
      case "base64":
        result = decodeBase64(content);
        title = "Base64 Decode";
        break;
      case "url":
        result = decodeURL(content);
        title = "URL Decode";
        break;
      case "hex":
        result = decodeHex(content);
        title = "Hex Decode";
        break;
      case "binary":
        result = decodeBinary(content);
        title = "Binary Decode";
        break;
      case "ascii":
        result = decodeASCII(content);
        title = "ASCII Decode";
        break;
      case "morse":
        result = decodeMorse(content);
        title = "Morse Code Decode";
        break;
      default:
        result =
          "Loại decode không được hỗ trợ. Sử dụng `!decode help` để xem danh sách các loại được hỗ trợ.";
        title = "Lỗi";
        break;
    }

    const resultEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(title)
      .addFields(
        { name: "Đầu vào", value: "```" + content + "```", inline: false },
        { name: "Kết quả", value: "```" + result + "```", inline: false }
      )
      .setTimestamp();

    message.channel.send({ embeds: [resultEmbed] });
  }
});

// Đăng nhập Bot
client.login(process.env.TOKEN).catch((error) => {
  console.error("Lỗi khi đăng nhập:", error);
});

// nothing special here
