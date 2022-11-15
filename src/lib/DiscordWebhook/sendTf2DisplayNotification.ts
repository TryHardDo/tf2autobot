import { sendWebhook } from './utils';
import { Webhook } from './interfaces';
import log from '../logger';
import Bot from '../../classes/Bot';
import { timeNow } from '../tools/time';

export default function sendTf2DisplayNotification(bot: Bot, title: string, body: string): void {
    const opt = bot.options.discordWebhook;
    const botInfo = bot.handler.getBotInfo;

    const webhook: Webhook = {
        username: opt.displayName ? opt.displayName : botInfo.name,
        avatar_url: opt.avatarURL ? opt.avatarURL : botInfo.avatarURL,
        content: opt.sendTf2Events.displayNotification.custom.content || '',
        embeds: [
            {
                author: {
                    name: 'Team Fortress 2',
                    url: 'https://www.teamfortress.com/',
                    icon_url:
                        'https://steamuserimages-a.akamaihd.net/ugc/397802673729276567/5616177ADB53A1F185A00458A9CC037AC46B48AB/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'
                },
                title: 'Team Fortress 2 - Display Notification',
                description: `${title ? `**__${title}__**\n\n` : ''}${body}`,
                color: '12936960',
                footer: {
                    text: `${timeNow(bot.options).time}`
                }
            }
        ]
    };

    sendWebhook(opt.sendTf2Events.displayNotification.url, webhook, 'tf2-display-notification').catch(err => {
        log.warn(`❌ Failed to send TF2 Display Notification webhook to Discord: `, err);
    });
}
