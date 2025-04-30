"use strict";

import fetch from "node-fetch";
import moment from "moment";

export default class TelegramsModel {
  constructor(token, chatId) {
    this._token = token;
    this._chatId = chatId;
    this._telegramUrl = `https://api.telegram.org/bot${this._token}/sendMessage`;
  }

  async sendTelegramMessage(text) {
    const body = {
      chat_id: this._chatId,
      text: text,
      parse_mode: 'MarkdownV2'
    };

    const response = await fetch(this._telegramUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Ошибка отправки:", data);
      throw new Error(`Ошибка отправки сообщения: ${data.description}`);
    }
  }

  escapeMarkdownV2(text) {
    return text.replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, '\\$1');
  }

  dayFormatMsg(obj, deck) {
    const { news, learn, review, total, all } = obj;
    return `
*Сегодняшние карточки*: ${this.escapeMarkdownV2(moment().utc().format("DD.MM.YYYY"))} 
Всего: *${total}*
_Новые_: *${news}*  
В процессе: *${learn}*  
Повторение: *${review}*
Колода: *${this.escapeMarkdownV2(deck)}*, карточек: *${all}*`;
  }

  cardFormatMsg(card) {
    const {sentence, translation, prefix, body, suffix, deck} = card;
    return `
*${this.escapeMarkdownV2(sentence || "")}*
${this.escapeMarkdownV2(prefix || "")} *${this.escapeMarkdownV2(body || "")}* ${this.escapeMarkdownV2(suffix || "")}  
||${this.escapeMarkdownV2(translation || "")}||
Колода: ${this.escapeMarkdownV2(deck || "")}`;
  }
}