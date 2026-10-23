/*global ScramjetController*/
(() => {

const blocked = [
  "trk.pinterest.com", "widgets.pinterest.com", "events.reddit.com", "events.redditmedia.com",
  "ads.youtube.com", "ads-api.tiktok.com", "analytics.tiktok.com", "ads-sg.tiktok.com",
  "analytics-sg.tiktok.com", "business-api.tiktok.com", "ads.tiktok.com", "log.byteoversea.com",
  "ads.yahoo.com", "analytics.yahoo.com", "geo.yahoo.com", "udc.yahoo.com",
  "udcm.yahoo.com", "advertising.yahoo.com", "analytics.query.yahoo.com", "partnerads.ysm.yahoo.com",
  "log.fc.yahoo.com", "gemini.yahoo.com", "adtech.yahooinc.com", "extmaps-api.yandex.net",
  "appmetrica.yandex.ru", "adfstat.yandex.ru", "metrika.yandex.ru", "google-analytics.com",
  "advertising.yandex.ru", "offerwall.yandex.net", "adfox.yandex.ru", "auction.unityads.unity3d.com",
  "webview.unityads.unity3d.com", "config.unityads.unity3d.com", "adserver.unityads.unity3d.com",
  "pagead2.googlesyndication.com", "adservice.google.com", "afs.googlesyndication.com",
  "mediavisor.doubleclick.net", "app-measurement.com", "analytics.google.com",
  "click.googleanalytics.com", "an.facebook.com", "static.ads-twitter.com", "ads-api.twitter.com",
];

const blockedsites = [
  "pornhub.com", "xvideos.com", "xnxx.com", "pornmate.com", "bestpornsites.net"
];

var adblock = 1;

self.__scramjet$config = {
  prefix: "/$/service/",
  files: {
    wasm: "/$/scramjet.wasm.wasm",
    worker: "/$/scramjet.all.js",
    client: "/$/scramjet.bundle.js",
    shared: "/$/scramjet.shared.js",
    sync: "/$/scramjet.sync.js",
  },
  siteFlags: {},
  flags: {
    serviceworkers: true,
    rewriterLogs: false,
  },
};

self.__scramjet$config.middleware = (request) => {
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
