"use strict";

import moment from "moment/moment.js";

export default class MySQLHelper {
  constructor(mysqlDb) {
    this._mysqlDb = mysqlDb;
  }

  async clearTable(options) {
    try {
      await this._mysqlDb.promise().query(`DELETE FROM ankiCards`);
    }catch (err) {
      console.log(err);
    }
  }

  async getMaxId() {
    try {
      const [data, inf] = await this._mysqlDb.promise().query(`SELECT MAX(id) as col FROM ankiCards`);
      if (data[0].col === null) {
        return 0;
      }
      return data[0].col;
    }catch (err) {
      console.log(err);
    }
  }

  async addCards(cards, deck) {
    try {
      let i = await this.getMaxId();
      const sql = `INSERT INTO ankiCards (id, cardId, sentence, translation, prefix, body, suffix, status, deck, dataAt) VALUES ?`;
      const values = cards.map(e => [++i, e.cardId, e.sentence, e.translation, e.prefix, e.body, e.suffix, 0, deck, moment().utc().format("YYYY-MM-DD")]);
      await this._mysqlDb.promise().query(sql, [values]);
    }catch (err) {
      console.log(err);
    }
  }

  async getCountCards() {
    try {
      const [data, inf] = await this._mysqlDb.promise().query(`SELECT COUNT(*) as col FROM ankiCards WHERE dataAt >= "${moment().utc().format("YYYY-MM-DD")}"`);
      return data[0].col;
    }catch (err) {
      console.log(err);
    }
  }

  async getCards(limit) {
    try {
      const [data, inf] = await this._mysqlDb.promise().query(`SELECT * FROM ankiCards WHERE dataAt >= "${moment().utc().format("YYYY-MM-DD")}" AND status=0 ORDER BY id LIMIT ${limit}`);
      console.log(`SELECT * FROM ankiCards WHERE dataAt >= "${moment().utc().format("YYYY-MM-DD")}" AND status=0 ORDER BY id LIMIT ${limit}`);
      return data;
    }catch (err) {
      console.log(err);
    }
  }

  async updCards(card) {
    try {
      const sql = `UPDATE ankiCards SET status=1 WHERE cardId = ${card.cardId}`;
      await this._mysqlDb.promise().query(sql);
    }catch (err) {
      console.log(err);
    }
  }
}