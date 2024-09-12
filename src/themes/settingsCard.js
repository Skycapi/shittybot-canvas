const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { fontRegister } = require("../utils/fontRegister");

async function settingsCard({
  guildName,
  guildId,
  totalSessions,
  embedColor,
  autoplay,
  volume,
  bindChannel,
  trackAnnounce,
  dj,
  avatarUrl,
  outerColor = "#292b2f",
  innerColor = "#000000",
  fontPath,
}) {
  const width = 700;
  const height = 190;
  const borderRadius = 12;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  if (fontPath) {
    await fontRegister(fontPath, "CustomFont");
  }

  ctx.fillStyle = outerColor;
  drawRoundedRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  ctx.fillStyle = innerColor;
  drawRoundedRect(ctx, 15, 15, width - 30, height - 30, borderRadius);
  ctx.fill();

  const avatar = await loadImage(avatarUrl);
  const avatarSize = 120;
  const avatarX = 30;
  const avatarY = height / 2 - avatarSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(
    avatarX + avatarSize / 2,
    avatarY + avatarSize / 2,
    avatarSize / 2,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  ctx.restore();

  const textY = avatarY + 10;
  ctx.fillStyle = "#ffffff";
  ctx.font = fontPath ? "22px 'CustomFont'" : "22px Arial";
  ctx.fillText(guildName, avatarX + avatarSize + 20, textY);

  ctx.fillStyle = "#b9bbbe";
  ctx.font = fontPath ? "18px 'CustomFont'" : "18px Arial";
  ctx.fillText(`ID: ${guildId}`, avatarX + avatarSize + 20, textY + 25);

  const statsX = avatarX + avatarSize + 20;
  const statsY = textY + 55;
  const columnGap = 270;
  const lineSpacing = 20;

  drawStat(
    ctx,
    "Total sessions:",
    formatCount(totalSessions, "session"),
    statsX,
    statsY
  );
  drawStat(ctx, "Embed Color:", embedColor, statsX, statsY + lineSpacing);
  drawStat(
    ctx,
    "24/7 Mode:",
    autoplay ? "Enabled" : "Disabled",
    statsX,
    statsY + lineSpacing * 2
  );
  drawStat(ctx, "Volume:", `${volume}`, statsX, statsY + lineSpacing * 3);

  drawStat(
    ctx,
    "Autoplay Mode:",
    autoplay ? "Enabled" : "Disabled",
    statsX + columnGap,
    statsY
  );
  drawStat(
    ctx,
    "Bind Channel:",
    bindChannel ? "Enabled" : "Disabled",
    statsX + columnGap,
    statsY + lineSpacing
  );
  drawStat(
    ctx,
    "Track Announce:",
    trackAnnounce ? "Enabled" : "Disabled",
    statsX + columnGap,
    statsY + lineSpacing * 2
  );
  drawStat(
    ctx,
    "DJ:",
    dj ? "Enabled" : "Disabled",
    statsX + columnGap,
    statsY + lineSpacing * 3
  );

  const buffer = canvas.toBuffer("image/png");
  return buffer;
}

function drawStat(ctx, label, value, x, y) {
  ctx.font = fontPath ? "bold 14px 'CustomFont'" : "bold 14px Arial";
  ctx.fillStyle = "#ffffff";
  const labelWidth = ctx.measureText(label).width;
  ctx.fillText(label, x, y);

  ctx.font = fontPath ? "bold 14px 'CustomFont'" : "14px Arial";
  ctx.fillStyle = "#b9bbbe";
  ctx.fillText(value, x + labelWidth + 5, y);
}

function formatCount(count, singular) {
  return `${count} ${count === 1 ? singular : singular + "s"}`;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

module.exports = { settingsCard };
