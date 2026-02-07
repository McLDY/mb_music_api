const bilibili = require("./bilibili.js");
const netease = require("./netease.js");

const sources = {
    bilibili,
    netease,
};

function getSource(name) {
    if (!name) return sources.bilibili;
    return sources[name] || sources.bilibili;
}

function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "access-control-allow-origin": "*"
        }
    });
}

export default {
    async fetch(request) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const p = url.searchParams;

        const sourceName = p.get("source") || "bilibili";
        const api = getSource(sourceName);

        try {
            // 搜索
            if (pathname === "/search") {
                const keyword = p.get("keyword");
                const page = parseInt(p.get("page") || "1");

                if (!keyword) return json({ error: "keyword required" }, 400);

                const result = await api.search(keyword, page);
                return json(result);
            }

            // 获取歌曲（APlayer 友好）
            if (pathname === "/song") {
                const id = p.get("id");
                const quality = p.get("quality") || "standard";

                if (!id) return json({ error: "id required" }, 400);

                const song = await api.getSong(id, quality);
                return json(song);
            }

            // 获取歌词
            if (pathname === "/lyric") {
                const id = p.get("id");
                if (!id) return json({ error: "id required" }, 400);

                const lyric = await api.getLyric(id);
                return json(lyric);
            }

            return json({ error: "not found" }, 404);
        } catch (err) {
            return json({ error: err.message || String(err) }, 500);
        }
    }
};
