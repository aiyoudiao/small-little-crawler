/*
 * File: handler.js                                                            *
 * Project: small-little-crawler                                               *
 * Created Date: 2023-01-22 19:13:05                                           *
 * Author: aiyoudiao                                                           *
 * -----                                                                       *
 * Last Modified:  2023-01-22 19:13:05                                         *
 * Modified By: aiyoudiao                                                      *
 * -----                                                                       *
 * Copyright (c) 2023 哎哟迪奥(码二)                                                 *
 * --------------------------------------------------------------------------- *
 */
const superagent = require("superagent");
const cheerio = require("cheerio");
const getSetting = require("./setting");
const setting = getSetting();
const { base, selector, contentFilter, handleCrawler } = setting;

const logger = console.log;
exports.logger = logger;
// 处理数据
exports.inputHandler = (data) => {
  const { title, content, next } = data;
  return {
    title,
    content,
    next,
    message: `子进程 ${process.pid} 成功爬取【${title}】数据`,
    done: !next,
  };
};

// 对结果进行写，同时返回下一个要操作的内容url
exports.outputHandler = (data, fw) => {
  const { title, content, next } = data;
  const chunk = Buffer.from(contentFilter(title, content));
  fw.write(chunk, (err) => {
    err && logger("err", err);
  });
  return base + next;
};

// 爬虫相关的操作，如请求，加载dom，对内容进行处理，返回合适的内容
exports.crawler = (api) =>
  new Promise((resolve, reject) => {
    superagent.get(api).end((err, res) => {
      if (err) reject(err);
      const $ = cheerio.load(res.text, {
        decodeEntities: false,
      });

      const result = handleCrawler($, selector);
      resolve(result);
    });
  });
