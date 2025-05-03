"use strict";

import mysql from "mysql2";
import MySQLHelper from "./MySQLHelper.js";
import TelegramsModel from "./TelegramsModel.js";
import moment from "moment/moment.js";

class Instance {
  constructor() {
    this._token = '7222342632:AAHn1gKlEN52g4OWTpA98Kj_jbdBFOnEVXA';
    this._chatId = '531229561';
    this._count = 3;

    this._mysql = mysql.createPool({
      connectionLimit: 5,
      host: "gondola.proxy.rlwy.net",
      port: 36134,
      user: "root",
      database: "railway",
      password: "DNSgXZyzbKZZMjEtXkppHgJcTRxOzeMR"
    });
    this._db = new MySQLHelper(this._mysql);
    this._telegram = new TelegramsModel(this._token, this._chatId);
  }

  async run() {
    await this.cardsProcess();
    process.exit(0);
  }

  async cardsProcess() {
    try {
      if ( new Date().getHours() < 8 || new Date().getHours() > 23) {
        console.log("exit time 8-23")
        return;
      }

      if (new Date().getHours() === 23) {
        this._count = await this._db.getCountCards();
      }
      const cards = await this._db.getCards(this._count);
      for (const card of cards) {
        const msg = this._telegram.cardFormatMsg(card);
        await this._telegram.sendTelegramMessage(msg);
        await this._db.updCards(card);
      }
    }
    catch (e) {
      console.error("Error in cardsProcess:", e);
    }
  }
}
const instance = new Instance();
await instance.run();
