/*global Meteor*/
(() => {

const blocked = [
  "trk.pinterest.com", "widgets.pinterest.com", "events.reddit.com", "events.redditmedia.com",
  "ads.youtube.com", "ads-api.tiktok.com", "analytics.tiktok.com", "ads-sg.tiktok.com",
  "analytics-sg.tiktok.com", "business-api.tiktok.com", "ads.tiktok.com", "log.byteoversea.com",
  "ads.yahoo.com", "analytics.yahoo.com", "geo.yahoo.com", "udc.yahoo.com",
  "udcm.yahoo.com", "advertising.yahoo.com", "analytics.query.yahoo.com", "partnerads.ysm.yahoo.com",
  "log.fc.yahoo.com", "gemini.yahoo.com", "adtech.yahooinc.com", "extmaps-api.yandex.net",
  "appmetrica.yandex.ru", "adfstat.yandex.ru", "metrika.yandex.ru", "advertising.yandex.ru",
  "offerwall.yandex.net", "adfox.yandex.ru", "auction.unityads.unity3d.com",
  "webview.unityads.unity3d.com", "config.unityads.unity3d.com", "adserver.unityads.unity3d.com",
  "pagead2.googlesyndication.com", "adservice.google.com", "afs.googlesyndication.com",
  "mediavisor.doubleclick.net", "app-measurement.com", "analytics.google.com",
  "click.googleanalytics.com", "an.facebook.com", "static.ads-twitter.com", "ads-api.twitter.com",
  "google-analytics.com",
];

const blockedsites = [
  "pornhub.com", "xvideos.com", "xnxx.com", "pornmate.com", "bestpornsites.net"
];

var adblock = 1;

const k = new TextEncoder().encode(btoa(new Date().toISOString().slice(0, 10) + location.host).split('').reverse().join('').slice(6.7));

self.__meteor$config = {
  prefix: "/!/service/",
  encodeUrl: s => {
    if (!s) return s;
    try {
      const d = new TextEncoder().encode(s), o = new Uint8Array(d.length);
      for (let i = 0; i < d.length; i++) o[i] = d[i] ^ k[i % 8];
      return Array.from(o, b => b.toString(16).padStart(2, "0")).join("");
    } catch { return s; }
  },
  decodeUrl: s => {
    if (!s) return s;
    try {
      const n = Math.min(s.indexOf('?') + 1 || s.length + 1, s.indexOf('#') + 1 || s.length + 1, s.indexOf('&') + 1 || s.length + 1) - 1;
      let h = 0;
      for (let i = 0; i < n && i < s.length; i++) {
        const c = s.charCodeAt(i);
        if (!((c >= 48 && c <= 57) || (c >= 65 && c <= 70) || (c >= 97 && c <= 102))) break;
        h = i + 1;
      }
      if (h < 2 || h % 2) return decodeURIComponent(s);
      const l = h >> 1, o = new Uint8Array(l);
      for (let i = 0; i < l; i++) {
        const x = i << 1;
        o[i] = parseInt(s[x] + s[x + 1], 16) ^ k[i % 8];
      }
      return new TextDecoder().decode(o) + s.slice(h);
    } catch { return decodeURIComponent(s); }
  },
  files: {
    client: '/!/meteor.client.js',
    worker: '/!/meteor.worker.js',
    bundle: '/!/meteor.bundle.js',
    codecs: '/!/meteor.codecs.js',
    config: '/!/meteor.config.js',
  },
};

self.__meteor$config.middleware = (request) => {
  const url = new URL(request.url);
  let host = url.origin;
  let other = url.href.substring(url.origin.length, url.href.length);

  if (url.href.includes("defrgthyju")) {
    other = other.substring(0, other.length - 10);
    adblock = 0;
  }
  if (url.href.includes("lokijuhygt")) {
    other = other.substring(0, other.length - 10);
    adblock = 1;
  }
  if (url.href.includes("?wfryhktgb")) {
    host = self.location.origin;
  }

  if (blockedsites.includes(url.host) ||
    url.href.toLocaleLowerCase().includes("porn") ||
    url.href.toLocaleLowerCase().includes("18+") ||
    url.href.toLocaleLowerCase().includes("xvideos") ||
    url.href.toLocaleLowerCase().includes("xxx")) {
    if (!url.href.includes("?wfryhktgb")) {
      return new Request(self.location.origin + "/public/pages/internal/Checkfailed/Checkfailed.html", request);
    }
  }

  if (adblock === 1) {
    if (blocked.includes(url.host)) return new Response(null, {});
    if (url.pathname.includes("ads.js") ||
      url.pathname.includes("pagead.js") ||
      url.pathname.includes("ad.status.js") ||
      url.pathname.includes("partner.ads.js")) {
      return new Response(null, {});
    }
  }

  if (request.method === "GET") return new Request(host + other, request);
  return request;
};

})();
