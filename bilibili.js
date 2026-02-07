const core = require("./bilibili.core.js");

module.exports = {
    async search(keyword, page) {
        try {
            const res = await core.search(keyword, page, "music");

            return {
                isEnd: res.isEnd,
                data: res.data.map(item => ({
                    id: item.bvid || item.aid || item.cid || item.id,
                    title: item.title,
                    artist: item.artist,
                    album: item.album,
                    artwork: item.artwork,
                    duration: item.duration,
                    source: "bilibili"
                }))
            };
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
            // 1. 获取视频信息（含 cid）
            const cidRes = await core.getCid(id, null);
            const data = cidRes.data;

            const musicItem = {
                id,
                aid: data.aid,
                bvid: data.bvid,
                cid: data.cid,
                title: data.title,
                artist: data.owner?.name,
                artwork: data.pic.startsWith("//") ? "https:" + data.pic : data.pic
            };

            // 2. 获取音频 URL
            const media = await core.getMediaSource(musicItem, quality);

            return {
                name: musicItem.title,
                artist: musicItem.artist,
                url: media.url || "",
                cover: musicItem.artwork,
                lrc: "Nothing"
            };
        } catch (err) {
            return {
                error: String(err),
                url: "",
                name: "",
                artist: "",
                cover: "",
                lrc: "Nothing"
            };
        }
    },

    async getLyric() {
        return { raw: "Nothing" };
    }
};
