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

            if (pathname === "/song") {
                const id = p.get("id");
                if (!id) return json({ error: "id required" }, 400);
            
                const mp3Url = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
            
                try {
                    const res = await fetch(mp3Url, {
                        method: "GET",
                        redirect: "follow"
                    });
            
                    // 如果网易云返回 404，仍然返回 JSON 错误
                    if (!res.ok) {
                        return json({
                            error: "netease_error",
                            status: res.status
                        }, 500);
                    }
            
                    // 流式转发 mp3
                    return new Response(res.body, {
                        status: 200,
                        headers: {
                            "content-type": "audio/mpeg",
                            "access-control-allow-origin": "*"
                        }
                    });
            
                } catch (e) {
                    return json({
                        error: "fetch_failed",
                        detail: e.message
                    }, 500);
                }
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
