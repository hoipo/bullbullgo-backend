const router = require('koa-router')()
const fetch = require('node-fetch');
const dayjs = require('dayjs');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/ag', async (ctx, next) => {
  let result = {}
  // 获取白银基金的价格和净值
  await fetch(`https://qt.gtimg.cn/q=sz161226&${Date.now()}`, {
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Host': 'qt.gtimg.cn',
      'Pragma': 'no-cache',
      'Referer': 'https://gu.qq.com/',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'script',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
    }
  })
    .then(res => res.text())
    .then(txt => {
      const dataArr = txt.trim().split('=')[1].split('~')
          Object.assign(result, {
            time: dayjs(dataArr[30], "YYYYMMDDHHmmss").format(),
            fundPrice: Number(dataArr[3]),
            fundBid: Number(dataArr[9]),
            fundBidVolume: Number(dataArr[10]),
            fundAsk: Number(dataArr[19]),
            fundAskVolume: Number(dataArr[20])
          })
    })
      .catch(err => {
        console.log(err)
        ctx.status = 500
        ctx.body = {message: 'Get soymeal fund failed.'}
      });

  // 获取净值
  await fetch(`https://j5.fund.eastmoney.com/sc/tfs/qt/v2.0.1/161226.json?deviceid=123&version=6.3.5&appVersion=6.3.5&product=EFund&plat=Iphone&curTime=${Date.now()}`, {
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Host": "j5.fund.eastmoney.com",
      "Origin": "https://h5.1234567.com.cn",
      "Pragma": "no-cache",
      "Referer": "https://h5.1234567.com.cn/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    }
  })
    .then(res => res.json())
    .then(json => {
          Object.assign(result, {
            fundNetValue: Number(json.JJXQ.Datas.DWJZ),
          })
    })
      .catch(err => {
        console.log(err)
        ctx.status = 500
        ctx.body = {message: 'Get ag fund failed.'}
      });
  // 获取白银期货主力连的价格和均价
  await fetch(`https://futsseapi.eastmoney.com/list/variety/113/6?orderBy=zdf&sort=desc&pageSize=30&pageIndex=0&_=${Date.now()}`, {
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Cookie': 'qgqp_b_id=47b7ecba74810708ed88765125f8f26b; st_si=26288100667208; st_asi=delete; EMFUND1=null; EMFUND2=null; EMFUND3=null; EMFUND4=null; EMFUND5=null; EMFUND6=null; EMFUND7=null; EMFUND8=null; EMFUND0=null; EMFUND9=06-05 14:32:05@#$%u56FD%u6295%u745E%u94F6%u767D%u94F6%u671F%u8D27%28LOF%29@%23%24161226; HAList=ty-113-agm-%u6CAA%u94F6%u4E3B%u529B; st_pvi=89871670584411; st_sp=2022-06-05%2014%3A28%3A53; st_inirUrl=https%3A%2F%2Fwww.google.com%2F; st_sn=9; st_psi=20220605152716152-0-7671112426',
      'Host': 'futsseapi.eastmoney.com',
      'Pragma': 'no-cache',
      'Referer': 'https://futures.eastmoney.com/',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'script',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
    }
  })
    .then(res => res.json())
    .then(json => {
      const data = json.list.find(el => el.dm === "agm")
      Object.assign(result, {
        futurePrice: data.mrj,
        futureAveragePrice: data.j,
        futurePreviousSettlementPrice: data.zjsj,
      })
     ctx.body = result
    })
    .catch(err => {
      console.log(err)
      ctx.status = 500
      ctx.body = {message: 'Get ag future failed.'}
    });
})


router.get('/zm', async (ctx, next) => {
  let result = {}
  // 获取白银基金的价格和净值
  await fetch(`https://qt.gtimg.cn/q=sz159985&${Date.now()}`, {
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Host': 'qt.gtimg.cn',
      'Pragma': 'no-cache',
      'Referer': 'https://gu.qq.com/',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'script',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
    }
  })
    .then(res => res.text())
    .then(txt => {
      const dataArr = txt.trim().split('=')[1].split('~')
          Object.assign(result, {
            time: dayjs(dataArr[30], "YYYYMMDDHHmmss").format(),
            fundPrice: Number(dataArr[3]),
            fundBid: Number(dataArr[9]),
            fundBidVolume: Number(dataArr[10]),
            fundAsk: Number(dataArr[19]),
            fundAskVolume: Number(dataArr[20])
          })
    })
      .catch(err => {
        console.log(err)
        ctx.status = 500
        ctx.body = {message: 'Get soymeal fund failed.'}
      });

  // 获取净值
  await fetch(`https://j5.fund.eastmoney.com/sc/tfs/qt/v2.0.1/159985.json?deviceid=123&version=6.3.5&appVersion=6.3.5&product=EFund&plat=Iphone&curTime=${Date.now()}`, {
    headers: {
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Host": "j5.fund.eastmoney.com",
      "Origin": "https://h5.1234567.com.cn",
      "Pragma": "no-cache",
      "Referer": "https://h5.1234567.com.cn/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    }
  })
    .then(res => res.json())
    .then(json => {
          Object.assign(result, {
            fundNetValue: Number(json.JJXQ.Datas.DWJZ),
          })
    })
      .catch(err => {
        console.log(err)
        ctx.status = 500
        ctx.body = {message: 'Get zm fund failed.'}
      });
  // 获取白银期货主力连的价格和均价
  await fetch(`https://futsseapi.eastmoney.com/list/variety/114/4?orderBy=zdf&sort=desc&pageSize=30&pageIndex=0&_=${Date.now()}`, {
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Cookie': 'qgqp_b_id=47b7ecba74810708ed88765125f8f26b; st_si=26288100667208; st_asi=delete; EMFUND1=null; EMFUND2=null; EMFUND3=null; EMFUND4=null; EMFUND5=null; EMFUND6=null; EMFUND7=null; EMFUND8=null; EMFUND0=null; EMFUND9=06-05 14:32:05@#$%u56FD%u6295%u745E%u94F6%u767D%u94F6%u671F%u8D27%28LOF%29@%23%24159985; HAList=ty-113-agm-%u6CAA%u94F6%u4E3B%u529B; st_pvi=89871670584411; st_sp=2022-06-05%2014%3A28%3A53; st_inirUrl=https%3A%2F%2Fwww.google.com%2F; st_sn=9; st_psi=20220605152716152-0-7671112426',
      'Host': 'futsseapi.eastmoney.com',
      'Pragma': 'no-cache',
      'Referer': 'https://futures.eastmoney.com/',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Sec-Fetch-Dest': 'script',
      'Sec-Fetch-Mode': 'no-cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36',
    }
  })
    .then(res => res.json())
    .then(json => {
      const data = json.list.find(el => el.dm === "mm")
      Object.assign(result, {
        futurePrice: data.mrj,
        futureAveragePrice: data.j,
        futurePreviousSettlementPrice: data.zjsj,
      })
     ctx.body = result
    })
    .catch(err => {
      console.log(err)
      ctx.status = 500
      ctx.body = {message: 'Get ag future failed.'}
    });
})


module.exports = router
