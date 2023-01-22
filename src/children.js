/*
 * File: chldren.js                                                            *
 * Project: small-little-crawler                                               *
 * Created Date: 2023-01-22 19:00:57                                           *
 * Author: aiyoudiao                                                           *
 * -----                                                                       *
 * Last Modified:  2023-01-22 19:00:57                                         *
 * Modified By: aiyoudiao                                                      *
 * -----                                                                       *
 * Copyright (c) 2023 哎哟迪奥(码二)                                                 *
 * --------------------------------------------------------------------------- *
 */
const { crawler, inputHandler } = require("./handler");

// 子进程监听主进程传递过来的消息，并进行处理
process.on("message", (api) => {
  (async () => {
    const result = await crawler(api);
    process.send(inputHandler(result));
  })();
});
