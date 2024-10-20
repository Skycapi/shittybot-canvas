const { createCanvas, loadImage } = require("@napi-rs/canvas");
const { fontRegister } = require("../utils/fontRegister");

async function profileCard({
  username,
  userId,
  blacklist,
  totalPlaylists,
  avatarUrl,
  outerColor,
  innerColor,
  fontPath,
}) {
  const width = 700;
  const height = 220;
  const borderRadius = 12;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  let OuterColor = outerColor || "#292b2f";
  let InnerColor = innerColor || "#000000";

  if (fontPath) {
    await fontRegister(fontPath, "CustomFont");
  }

  ctx.fillStyle = OuterColor;
  drawRoundedRect(ctx, 0, 0, width, height, borderRadius);
  ctx.fill();

  ctx.fillStyle = InnerColor;
  drawRoundedRect(ctx, 15, 15, width - 30, height - 30, borderRadius);
  ctx.fill();

  const avatar = await loadImage(avatarUrl);
  const avatarSize = 150;
  const avatarX = 30;
  const avatarY = height / 2 - avatarSize / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
  ctx.restore();

  const usernameY = height / 2 - avatarSize / 2 + 32;
  ctx.fillStyle = "#ffffff";
  ctx.font = fontPath ? "26px 'CustomFont'" : "26px Arial";
  ctx.fillText(username, avatarX + avatarSize + 20, usernameY);

  ctx.fillStyle = "#b9bbbe";
  ctx.font = fontPath ? "20px 'CustomFont'" : "20px Arial";
  ctx.fillText(`ID: ${userId}`, avatarX + avatarSize + 20, usernameY + 28);

  const statsX = avatarX + avatarSize + 20;
  const statsY = usernameY + 70;
  const columnGap = 270;
  const lineSpacing = 30;

  drawStat(ctx, "BlackListed:", statsX, statsY, fontPath);
  drawStat(ctx, "Playlists:", formatCount(totalPlaylists, "playlist"), statsX + columnGap, statsY, fontPath);

  const buffer = canvas.toBuffer("image/png");

  return buffer;
}

function drawStat(ctx, label, value, x, y, fontPath) {
  ctx.font = fontPath ? "bold 18px 'CustomFont'" : "bold 18px Arial";
  ctx.fillStyle = "#ffffff";
  const labelWidth = ctx.measureText(label).width;
  ctx.fillText(label, x, y);

  ctx.font = fontPath ? "16px 'CustomFont'" : "16px Arial";
  ctx.fillStyle = "#b9bbbe";
  ctx.fillText(value, x + labelWidth + 5, y);
}

function formatCount(count, singular) {
  // If count is a string (like 'Yes' or 'No'), return it directly
  if (typeof count === 'string') {
    return count;
  }
  // Otherwise, apply the original pluralization logic
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

module.exports = { profileCard };
