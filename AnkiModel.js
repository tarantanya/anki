"use strict";

import request from "request-promise";

export default class AnkiModel {
  constructor(deck) {
    this.uri = "http://127.0.0.1:8765";
    this._deck = deck;
  }

  async makeRequest(options) {
    return request(this.uri, {
      method: options.method,
      json: true,
      body: options.body,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(e => {
      throw e;
    })
  }

  async getDeckNames() {
    const body = {
      "action": "deckNames",
      "version": 6
    };
    const response = await this.makeRequest({
      method: "POST",
      body,
    });
    return response ? response.result : [];
  }

  async getDeckStats(deck) {
    const result = {};
    const body = {
      action: "getDeckStats",
      version: 6,
      params: {
        decks: [deck]
      }
    };
    const response = await this.makeRequest({
      method: "POST",
      body,
    });

    if (response && response.result) {
      Object.entries(response.result).forEach(([key, value]) => {
        const { new_count, learn_count, review_count, total_in_deck } = value;
        result.news = new_count;
        result.learn = learn_count;
        result.review = review_count;
        result.total = new_count + learn_count + review_count;
        result.all = total_in_deck;
      });
    }
    return result;
  }

  async getFindDueCards(deck) {
    const body = {
      action: "findCards",
      version: 6,
      params: {
        query: `deck:"${deck}" prop:due=0`,
      }
    };
    const response = await this.makeRequest({
      method: "POST",
      body,
    });

    return response ? response.result : [];
  }

  async getFindNewCards(deck) {
    const body = {
      action: "findCards",
      version: 6,
      params: {
        query: `deck:"${deck}" is:new`,
      }
    };
    const response = await this.makeRequest({
      method: "POST",
      body,
    });

    const leng = response.result.length >= 10 ? 10 : response.result.length;
    return response ? response.result.slice(0, leng) : [];
  }

  async getInfoCards(ids) {
    const result = [];
    const body = {
      action: "cardsInfo",
      version: 6,
      "params": {
        "cards": [...ids]
      }
    };
    const response = await this.makeRequest({
      method: "POST",
      body,
    });
    if (response && response.result) {
      response.result.forEach(card => {
        result.push({
          cardId: card.cardId,
          sentence: card.fields.sentence.value,
          translation: card.fields["Sentence Translation"].value,
          body: card.fields["cloze-body"].value,
          prefix: card.fields["cloze-prefix"].value,
          suffix: card.fields["cloze-suffix"].value,
        });
      });
    }
    return result;
  }

}
