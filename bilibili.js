const core = require("./bilibili.core.js"); // 你原来的插件

module.exports = {
    async search(keyword, page) {
        const res = await core.search(keyword, page, "music");
        return {
            isEnd: res.isEnd,
            data: res.data.map(item => ({
                id: item.id || item.cid || item.aid || item.bvid,
                title: item.title,
                artist: item.artist,
                album: item.album,
                artwork: item.artwork,
                duration: item.duration
            }))
        };
    },

    async getSong(id, quality) {
        const musicItem = await core.getMusicInfoById(id); // 你需要自己写这个
        const media = await core.getMediaSource(musicItem, quality);

        return {
            name: musicItem.title,
            artist: musicItem.artist,
            url: media.url,
            cover: musicItem.artwork,
            lrc: "" // 你以后可以加歌词
        };
    },

    async getLyric(id) {
        return { lrc: "" };
    }
};
