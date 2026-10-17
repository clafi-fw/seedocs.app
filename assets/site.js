// seedocs.app - the newest release, read from GitHub.
(() => {
    const repo = "clafi-fw/cpp";
    const app = "SeeDocs";
    const cacheKey = "seedocs.releases";
    const cacheAge = 60 * 60 * 1000;

    // Every published release of the repository, newest first; kept for an hour per tab.
    async function releases() {
        try {
            const cached = JSON.parse(sessionStorage.getItem(cacheKey));
            if (cached && Date.now() - cached.at < cacheAge)
                return cached.list;
        } catch { }

        const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`,
            { headers: { Accept: "application/vnd.github+json" } });
        if (!response.ok)
            throw new Error(`GitHub answered ${response.status}`);

        const list = (await response.json())
            .filter(release => !release.draft && !release.prerelease)
            .map(release => ({
                tag: release.tag_name,
                page: release.html_url,
                date: release.published_at,
                assets: release.assets.map(asset => ({
                    name: asset.name,
                    url: asset.browser_download_url,
                    size: asset.size,
                    digest: asset.digest || ""
                }))
            }));
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), list }));
        } catch { }
        return list;
    }

    const versionOf = release => release.tag.slice(app.length + 2).split(".").map(Number);
    const newer = (a, b) => {
        for (let i = 0; i < 3; ++i)
            if ((a[i] || 0) !== (b[i] || 0))
                return (a[i] || 0) > (b[i] || 0);
        return false;
    };

    // The release with the highest version - the framework's applications share the repository.
    function newest(list) {
        let best = null;
        for (const release of list) {
            if (!release.tag.startsWith(`${app}-v`))
                continue;
            if (!best || newer(versionOf(release), versionOf(best)))
                best = release;
        }
        return best;
    }

    const megabytes = bytes => `${(bytes / 1048576).toFixed(1)} MB`;
    const longDate = iso => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const each = (selector, apply) => document.querySelectorAll(selector).forEach(apply);

    function show(release) {
        each("[data-version]", e => e.textContent = versionOf(release).join("."));
        each("[data-date]", e => e.textContent = longDate(release.date));
        each("a[data-release-page]", e => e.href = release.page);

        const kinds = { windows: "-windows-x64.zip", linux: "-linux-x86_64.tar.gz" };
        for (const [kind, ending] of Object.entries(kinds)) {
            const asset = release.assets.find(a => a.name.endsWith(ending));
            if (!asset)
                continue;
            each(`a[data-asset="${kind}"]`, e => e.href = asset.url);
            each(`[data-asset-name="${kind}"]`, e => e.textContent = asset.name);
            each(`[data-asset-size="${kind}"]`, e => e.textContent = `- ${megabytes(asset.size)}`);
            const digest = asset.digest.startsWith("sha256:") ? asset.digest.slice(7) : "";
            each(`[data-asset-digest="${kind}"]`, e => {
                if (digest)
                    e.innerHTML = `<code>${digest}</code>`;
                else
                    e.innerHTML = `<a href="${release.page}">on the release page</a>`;
            });
        }
    }

    // The page as written names 0.1.1 and stays as it is when GitHub cannot be reached.
    releases().then(list => {
        const release = newest(list);
        if (release)
            show(release);
    }).catch(() => { });
})();
