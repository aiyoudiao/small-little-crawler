# small-little-crawler

Do a small crawler 🐛, it seems to have never used nodejs to do this thing, the whole one, should also be convenient ✌️. 做个小爬虫🐛，好像从来没用nodejs做过这玩意，整一个，应该也方便✌️。

## tool

- cheerio：DOM操作
- superagent: 请求操作
- cluster: 集群操作

## 原理

通过主进程和子进程的交互，来实现 解耦+高效的爬虫操作。

superagent 发起请求，cheerio 对页面内容进行dom选择器的操作，通过handler将数据格式化过滤输出及写入。  
setting.js中是你想要做的配置相关的信息，比如要爬那个网站，要如何对内容进行过滤，还有如何进行拿到爬虫结果后的相关操作。  
