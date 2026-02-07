const ne = require("./网易云音乐.js"); 
// 你贴的文件名自己改成 netease_raw.js 或 netease_full.js

module.exports = {
    async search(keyword, page = 1) {
        try {
            const res = await ne.search(keyword, page, "music");
            return res;
        } catch (err) {
            return {
                isEnd: true,
                data: [],
                error: String(err)
            };
        }
    },

    async getSong(id, quality = "standard") {
        try {
            const item = { id };
            const media = await ne.getMediaSource(item, quality);

            return {
                id,
                url: media?.url || "",
                error: media?.url ? null : "No URL returned"
            };
        } catch (err) {
            return {
                id,
                url: "",
                error: String(err)
            };
        }
    },

    async getLyric(id) {
        try {
            const item = { id };
            const res = await ne.getLyric(item);

            return {
                raw: res.rawLrc || "",
                translation: res.translation || "",
                error: null
            };
        } catch (err) {
            return {
                raw: "",
                translation: "",
                error: String(err)
            };
        }
    }
};
