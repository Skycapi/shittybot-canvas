const { createCanvas, loadImage, GlobalFonts } = require("@napi-rs/canvas");
const path = require("path");

async function leaderboadCard({ songs }) {
    const maxSongs = 5;
    const songHeight = 100;
    const padding = 20;
    const cardWidth = 800;
    const backgroundColor = '#2B2D31';
    const borderRadius = 5; 
    const loveIconURL = 'https://cdn.discordapp.com/attachments/959777491818528788/1249278463001493606/icons8-love-30.png?ex=6666b8bc&is=6665673c&hm=696448b3df555cd1e69268231e2f75790102e5cdac1fd862b7df9679dcbcabde&'; // Placeholder URL for the love icon

    const truncateText = (ctx, text, maxWidth) => {
        let width = ctx.measureText(text).width;
        const ellipsis = '…';
        const ellipsisWidth = ctx.measureText(ellipsis).width;

        if (width <= maxWidth) {
            return text;
        }

        while (width >= maxWidth - ellipsisWidth) {
            text = text.slice(0, -1);
            width = ctx.measureText(text).width;
        }

        return text + ellipsis;
    };

    const generateSingleCard = async (songsBatch, batchIndex) => {
        const cardHeight = padding + songsBatch.length * (songHeight + padding) + padding + 50; // Additional space for text
        const canvas = createCanvas(cardWidth, cardHeight);
        const ctx = canvas.getContext('2d');

        const fontPath = path.join(__dirname, "..", "fonts", "ArialUnicodeMS.ttf");
  GlobalFonts.registerFromPath(fontPath, "ArialUnicodeMS");

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, cardWidth, cardHeight);

        const loveIcon = await loadImage(loveIconURL); // Load the love icon image

        for (let i = 0; i < songsBatch.length; i++) {
            const song = songsBatch[i];
            const yPosition = i * (songHeight + padding) + padding;

            // Draw the background box with rounded corners for each song
            ctx.fillStyle = '#3A3D42';
            ctx.beginPath();
            ctx.moveTo(padding + borderRadius, yPosition);
            ctx.lineTo(cardWidth - padding - borderRadius, yPosition);
            ctx.quadraticCurveTo(cardWidth - padding, yPosition, cardWidth - padding, yPosition + borderRadius);
            ctx.lineTo(cardWidth - padding, yPosition + songHeight - borderRadius);
            ctx.quadraticCurveTo(cardWidth - padding, yPosition + songHeight, cardWidth - padding - borderRadius, yPosition + songHeight);
            ctx.lineTo(padding + borderRadius, yPosition + songHeight);
            ctx.quadraticCurveTo(padding, yPosition + songHeight, padding, yPosition + songHeight - borderRadius);
            ctx.lineTo(padding, yPosition + borderRadius);
            ctx.quadraticCurveTo(padding, yPosition, padding + borderRadius, yPosition);
            ctx.closePath();
            ctx.fill();

            // Draw the song number
            ctx.fillStyle = 'white';
            ctx.font = "bold 40px 'ArialUnicodeMS'";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText((batchIndex * maxSongs + i + 1).toString(), padding + 30, yPosition + 50);

            // Draw the thumbnail with rounded corners
            const thumbnailImage = await loadImage(song.thumbnailURL);
            const thumbnailSize = 80;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(padding + 80 + borderRadius, yPosition + 10);
            ctx.lineTo(padding + 80 + thumbnailSize - borderRadius, yPosition + 10);
            ctx.quadraticCurveTo(padding + 80 + thumbnailSize, yPosition + 10, padding + 80 + thumbnailSize, yPosition + 10 + borderRadius);
            ctx.lineTo(padding + 80 + thumbnailSize, yPosition + 10 + thumbnailSize - borderRadius);
            ctx.quadraticCurveTo(padding + 80 + thumbnailSize, yPosition + 10 + thumbnailSize, padding + 80 + thumbnailSize - borderRadius, yPosition + 10 + thumbnailSize);
            ctx.lineTo(padding + 80 + borderRadius, yPosition + 10 + thumbnailSize);
            ctx.quadraticCurveTo(padding + 80, yPosition + 10 + thumbnailSize, padding + 80, yPosition + 10 + thumbnailSize - borderRadius);
            ctx.lineTo(padding + 80, yPosition + 10 + borderRadius);
            ctx.quadraticCurveTo(padding + 80, yPosition + 10, padding + 80 + borderRadius, yPosition + 10);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(thumbnailImage, padding + 80, yPosition + 10, thumbnailSize, thumbnailSize);
            ctx.restore();

            // Set text styles and draw the song title
            ctx.fillStyle = 'white';
            ctx.font = "bold 25px 'ArialUnicodeMS'";
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            const truncatedTitle = truncateText(ctx, song.songTitle, 350); // Truncate song title
            ctx.fillText(truncatedTitle, padding + 180, yPosition + 20);

            // Draw the song artist
            ctx.fillStyle = '#A79D9D';
            ctx.font = "20px 'ArialUnicodeMS'";
            const truncatedArtist = truncateText(ctx, song.songArtist, 350); // Truncate artist name
            ctx.fillText(truncatedArtist, padding + 180, yPosition + 50);

            // Draw the love icon
            const iconSize = 25;
            ctx.drawImage(loveIcon, cardWidth - padding - iconSize - 20, yPosition + (songHeight - iconSize) / 2, iconSize, iconSize);
        }

        ctx.fillStyle = 'white';
        ctx.font = "20px 'ArialUnicodeMS'";
        ctx.fillText('shittybot.xyz', padding, cardHeight - 30);

        return canvas.toBuffer('image/png');
    };

    const buffers = [];
    for (let i = 0; i < songs.length; i += maxSongs) {
        const songsBatch = songs.slice(i, i + maxSongs);
        const buffer = await generateSingleCard(songsBatch, Math.floor(i / maxSongs));
        buffers.push(buffer);
    }

    return buffers;
}

module.exports = { leaderboadCard };

// // Example usage
// (async () => {
//     const songs = [
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 1', songArtist: 'Artist 1' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 2', songArtist: 'Artist 2' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 3', songArtist: 'Artist 3' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 4', songArtist: 'Artist 4' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 5', songArtist: 'Artist 5' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 6', songArtist: 'Artist 6' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 7', songArtist: 'Artist 7' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 8', songArtist: 'Artist 8' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 9', songArtist: 'Artist 9' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 10', songArtist: 'Artist 10' },
//         { thumbnailURL: 'https://i.scdn.co/image/ab67616d00001e02684d81c9356531f2a456b1c1', songTitle: 'Song Title 11', songArtist: 'Artist 11' },
//     ];

//     const buffers = await generateCard({ songs });
//     buffers.forEach((buffer, index) => {
//         fs.writeFileSync(`output_${index + 1}.png`, buffer);
//     });
// })();
