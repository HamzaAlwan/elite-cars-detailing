/* eslint-disable */
/**
 * Official Cal.com embed loader (vanilla snippet), wrapped so islands can lazily bootstrap
 * `window.Cal` and load embed.js from the CDN exactly once. This mirrors the snippet Cal.com
 * generates. We use the CDN snippet (not the `@calcom/embed-core` npm module, which throws in a
 * bundler) so embed.js owns iframe sizing + the `linkReady` reveal — fixing the load-then-recenter
 * flash. The `any`/`arguments` style is inherent to the official snippet; lint disabled for this file.
 */
type CalApi = (...args: any[]) => void;

const EMBED_JS = 'https://app.cal.com/embed/embed.js';

export function getCalApi(): CalApi {
  const w = window as any;
  if (!w.Cal) {
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
    })(w, EMBED_JS, 'init');
  }
  return w.Cal as CalApi;
}

/** Inject embed.js once on first intent — safe to call repeatedly. */
export function warmUpCalEmbed(): void {
  getCalApi();
}
