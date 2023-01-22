/*
 * File: main.js                                                               *
 * Project: small-little-crawler                                               *
 * Created Date: 2023-01-22 18:38:01                                           *
 * Author: aiyoudiao                                                           *
 * -----                                                                       *
 * Last Modified:  2023-01-22 18:38:01                                         *
 * Modified By: aiyoudiao                                                      *
 * -----                                                                       *
 * Copyright (c) 2023 哎哟迪奥(码二)                                                 *
 * --------------------------------------------------------------------------- *
 */
const cluster = require("cluster");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { outputHandler: handler, logger } = require("./handler.js");

const getSetting = require("./setting.js");
const { fileName, base, api } = getSetting();

// 设置子进程文件要执行的代码
// http://nodejs.cn/api-v14/cluster.html#clustersetupmastersettings
cluster.setupMaster({
  exec: "./src/children.js",
  args: ["--use", "http"],
});

const work = cluster.fork();
const fileNamePath = path.join(__dirname, "../", fileName);
const fw = fs.createWriteStream(fileNamePath, "utf-8");

work.send(base + api); // 给子进程发消息，通知它干活
let index = 0;
const startTime = Date.now();
// 监听子进程干活完毕后传递过来的结果
work.on("message", (info) => {
  const { message, done } = info;
  index++;
  logger(`${index}.${message}`);
  const url = handler(info, fw);

  if (done) {
    logger(`\r\n 数据爬取结束，耗时${(Date.now() - startTime) / 1000}秒\r\n`);
    logger(`开始关闭文件流和子进程: \r\n`);
    fw.close();
    cluster.disconnect();
    return;
  }
  work.send(url);
});

cluster.on("fork", (children) => {
  logger(`[主进程]: 创建子进程成功，子进程编号{${children.id}}\r\n`);
});

cluster.on("exit", (children) => {
  logger(`[主进程]: 子进程-{${children.id}}成功关闭\r\n`);
});
