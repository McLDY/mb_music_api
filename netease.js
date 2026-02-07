const ne = require("./网易云音乐.js"); // 你贴的文件名自己改成 netease_raw.js 或者 netease_full.js

module.exports = {
    async search(keyword, page = 1) {
        const res = await ne.search(keyword, page, "music");
        return res;
    },

    async getSong(id, quality = "standard") {
        const item = { id };
        const media = await ne.getMediaSource(item, quality);
        return {
            id,
            url: media?.url,
        };
    },

    async getLyric(id) {
        const item = { id };
        const res = await ne.getLyric(item);
        return {
            raw: res.rawLrc,
            translation: res.translation,
        };
    }
};
