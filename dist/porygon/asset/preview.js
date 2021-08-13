"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewAssets = void 0;
const embed_1 = require("porygon/embed");
const group_1 = require("./group");
/**
 * Used by /op previewasset. Prints out the asset (or each asset in the group)
 * into an embed.
 */
async function previewAssets(asset, channel) {
    if (asset instanceof group_1.AssetGroup) {
        for (const asset_ of asset) {
            await preview(asset_, channel);
        }
    }
    else {
        preview(asset, channel);
    }
}
exports.previewAssets = previewAssets;
function preview(asset, channel) {
    const embed = new embed_1.Embed()
        .setTitle(asset.path)
        .setDescription(LIPSUM)
        .setThumbnail(asset.url);
    return channel.send({ embeds: [embed] });
}
const LIPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et sapien quis erat lacinia luctus sit amet nec lorem. Nulla vel diam eget enim scelerisque sodales. Sed vulputate mollis lobortis. Nulla ut ipsum quam. Maecenas dui orci, fringilla eu fermentum eu, tempor in sem. Etiam consequat lectus libero, ut luctus tortor sagittis at. Pellentesque est lacus, consequat et ipsum vitae, eleifend interdum ante. Donec vel arcu ac urna elementum pretium non vel felis. Nam auctor fermentum rhoncus.';
