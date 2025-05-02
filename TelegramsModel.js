"use strict";

// import fetch from "node-fetch";
// import moment from "moment";
import TelegramBot from 'node-telegram-bot-api';

export default class TelegramsModel {
  constructor(token, chatId) {
    this._token = token;
    this.bot = new TelegramBot(this._token, {polling: true});
    this._chatId = chatId;
    this._telegramUrl = `https://api.telegram.org/bot${this._token}/sendMessage`;
  }

  async sendTelegramMessage(text) {
    await this.bot.sendMessage(this._chatId, text, {parse_mode: "MarkdownV2" });
  }

  escapeMarkdownV2(text) {
    return text.replace(/([_*\[\]()~`>#+=|{}.!\\-])/g, '\\$1');
  }

  cardFormatMsg(card) {
    const {sentence, translation, prefix, body, suffix, deck} = card;
    return `*${this.escapeMarkdownV2(sentence || "")}*\n${this.escapeMarkdownV2(prefix || "")} *${this.escapeMarkdownV2(body || "")}* ${this.escapeMarkdownV2(suffix || "")}\n||${this.escapeMarkdownV2(translation || "")}||\nКолода: ${this.escapeMarkdownV2(deck || "")}`;
  }

  // async sendTelegramMessage_(text) {
  //   const body = {
  //     chat_id: this._chatId,
  //     text: text,
  //     parse_mode: 'MarkdownV2'
  //   };
  //
  //   const response = await fetch(this._telegramUrl, {
  //     method: "POST",
  //     headers: {"Content-Type": "application/json"},
  //     body: JSON.stringify(body)
  //   });
  //
  //   const data = await response.json();
  //   if (!data.ok) {
  //     console.error("Ошибка отправки:", data);
  //     throw new Error(`Ошибка отправки сообщения: ${data.description}`);
  //   }
  // }
//   dayFormatMsg(obj, deck) {
//     const { news, learn, review, total, all } = obj;
//     return `
// *Сегодняшние карточки*: ${this.escapeMarkdownV2(moment().utc().format("DD.MM.YYYY"))}
// Всего: *${total}*
// _Новые_: *${news}*
// В процессе: *${learn}*
// Повторение: *${review}*
// Колода: *${this.escapeMarkdownV2(deck)}*, карточек: *${all}*`;
//   }

}