# seedocs.app

The site of SeeDocs, the code documentation tool built with
[ClaFi - Clarity First the Framework](https://github.com/clafi-fw/cpp). Plain HTML, CSS and
JavaScript, served by GitHub Pages from the root of `main`; nothing is built.

- `index.html` - the one page: what SeeDocs reads, projects, the window, the command line,
  installing, checksums and building.
- `assets/site.js` - asks GitHub for the newest `SeeDocs-v*` release of clafi-fw/cpp and writes
  the version, date, links, sizes and checksums into the page. The page as written names 0.1.1
  and stays that way when GitHub cannot be reached.
- `img/`, `favicon.ico` - the application's icon, taken from `Tools/SeeDocs/SeeDocs.ico`.

A new SeeDocs release needs no change here.

## Publishing

1. Settings - Pages: deploy from a branch, `main`, folder `/ (root)`.
2. The domain, at the registrar - the apex points at GitHub Pages, `www` at the account's Pages host:

   | Type  | Name  | Value |
   |-------|-------|-------|
   | A     | @     | 185.199.108.153 |
   | A     | @     | 185.199.109.153 |
   | A     | @     | 185.199.110.153 |
   | A     | @     | 185.199.111.153 |
   | AAAA  | @     | 2606:50c0:8000::153 |
   | AAAA  | @     | 2606:50c0:8001::153 |
   | AAAA  | @     | 2606:50c0:8002::153 |
   | AAAA  | @     | 2606:50c0:8003::153 |
   | CNAME | www   | clafi-fw.github.io |

   Each record is set to DNS only where the registrar offers a proxy - through a proxy GitHub
   cannot issue the certificate.

3. The account's Settings - Pages (github.com/settings/pages): verify `seedocs.app`, so no other
   account can claim it.
4. Once the certificate is issued, tick Enforce HTTPS. A `.app` domain is reachable over HTTPS only.

## Trying it locally

`python -m http.server` in this folder, then http://localhost:8000.
