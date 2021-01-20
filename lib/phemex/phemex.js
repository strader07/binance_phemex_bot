
const trade = require('./api/trade')
const market = require('./api/market')
var email = require('../email');

var sendEmail = email.sendEmail;
var sendErrorEmail = email.sendErrorEmail;
var sendTextErrorEmail = email.sendTextErrorEmail;
var sendLimitOrderEmail = email.sendLimitOrderEmail;
var sendMarketOrderEmail = email.sendMarketOrderEmail;

async function loadMarkets() {
  const {data, error} = await market.loadMarkets();
  if (data) {
  console.log(data);
  }
  if (error) {
  console.log(error);
  }
}

async function loadOrderbook(symbol) {
  const {data, error} = await market.loadOrderbook(symbol);
  if (data) {
  console.log(data);
  }
  if (error) {
  console.error(error);
  }
}

async function loadTrades(symbol) {
  const {data, error} = await market.loadTrades(symbol);
  if (data) {
  console.log(data);
  }
  if (error) {
  console.log(error);
  }
}

async function loadActiveOrders(symbol) {
  const {data, error} = await trade.loadActiveOrders(symbol);
  if (data) {
  console.log(data);
  }
  if (error) {
  console.log(error);
  }
}

async function placeOrder(symbol, side, orderType) {
    await trade.cancelAllOrders(symbol, false)
    await trade.cancelAllOrders(symbol, true)
    const ticker = await market.getTicker(symbol).then(
        (res) => {
            if (res.data) { return res.data; }
            else {
                sendErrorEmail("Phemex API get ticker error. Message from Phemex: " + JSON.stringify(res))
                return null
            }
        }
    ); console.log(ticker)
    const accountPositions = await trade.getAccountPositions("BTC").then((res) => {
        if (res.data) return res.data;
        else {
            sendErrorEmail("Phemex API get account balance error. Message from Phemex: " + JSON.stringify(res))
            return res;
        }
    }); console.log(accountPositions)

    leverage = process.env.LEVERAGE
    risk = process.env.RISK
    size = Math.floor(leverage *(1-risk)*( accountPositions.account.accountBalanceEv / 100000000 * ticker.markPrice / 10000 ))
    if (size == 0) {
        sendErrorEmail("Not enough balance to " + side.toLowerCase() + " " + symbol)
        return null
    }
    console.log("Phemex order size: "+size.toString())

    if (orderType.toLowerCase() == "market") {
        const {data, error} = await trade.placeOrder({
            symbol: symbol,
            side: side,
            orderQty: size,
            ordType: orderType
        });
        if (data) {
            sendMarketOrderEmail(data)
            console.log(data);
        }
        if (error) {
            msg = "Phemex market order failed for "+symbol+ "\n"
            msg = msg + "Here is what Phemex says: \n"+JSON.stringify(error)
            sendErrorEmail(msg)
            console.log(error);
        }
    }
    else if (orderType.toLowerCase() == "limit") {
        const orderBook = await market.loadOrderbook(symbol).then((res) => {
            if (res.data) return res.data
            return res
        }); console.log(orderBook)
        if (side.toLowerCase() == "buy") {
            priceEp = orderBook.book.bids[0][0]
        }  else { priceEp = orderBook.book.asks[0][0] }
        const {data, error} = await trade.placeOrder({
            symbol: symbol,
            side: side,
            priceEp: priceEp,
            orderQty: size,
            ordType: orderType,
        });
        if (data) {
            sendLimitOrderEmail(data)
            console.log(data);
        }
        if (error) {
            msg = "Phemex limit order failed for "+symbol+ "\n"
            msg = msg + "Here is what Phemex says: \n"+JSON.stringify(error)
            sendErrorEmail(msg)
            console.log(error);
        }
    }
    else {
        sendErrorEmail("Unknown order type in Phemex")
        console.log("Unknown order type in Phemex")
        return null
    }
}

async function cancelOrder(symbol, orderId) {
  const {data, error} = await trade.cancelOrder(symbol, orderId);
  if (data) {
  console.log(data);
  }
  if (error) {
  console.log(error);
  }
}

async function getTicker(symbol) {
  const {data, error} = await market.getTicker(symbol);
  if (data) {
  return data
  }
  if (error) {
  console.log(error)
  return null
  }
}

module.exports = {
  placeOrder: placeOrder,
  cancelOrder: cancelOrder,
  loadOrderbook: loadOrderbook,
  loadTrades: loadTrades,
  loadMarkets: loadMarkets,
  loadActiveOrders: loadActiveOrders,
  getTicker: getTicker
}
const trade = require('./api/trade')
const market = require('./api/market')
var email = require('../email');

var sendEmail = email.sendEmail;
var sendErrorEmail = email.sendErrorEmail;
var sendTextErrorEmail = email.sendTextErrorEmail;
var sendLimitOrderEmail = email.sendLimitOrderEmail;
var sendMarketOrderEmail = email.sendMarketOrderEmail;

async function loadMarkets() {
  const {data, error} = await market.loadMarkets();
  if (data) {
	console.log(data);
  }
  if (error) {
	console.log(error);
  }
}

async function loadOrderbook(symbol) {
  const {data, error} = await market.loadOrderbook(symbol);
  if (data) {
	console.log(data);
  }
  if (error) {
	console.error(error);
  }
}

async function loadTrades(symbol) {
  const {data, error} = await market.loadTrades(symbol);
  if (data) {
	console.log(data);
  }
  if (error) {
	console.log(error);
  }
}

async function loadActiveOrders(symbol) {
  const {data, error} = await trade.loadActiveOrders(symbol);
  if (data) {
	console.log(data);
  }
  if (error) {
	console.log(error);
  }
}

async function placeOrder(symbol, side, orderType) {
    await trade.cancelAllOrders(symbol, true)
    const ticker = await market.getTicker(symbol).then(
        (res) => {
            if (res.data) { return res.data; }
            else {
                sendErrorEmail("Phemex API get ticker error. Message from Phemex: " + JSON.stringify(res))
                return null
            }
        }
    ); console.log(ticker)
    const accountPositions = await trade.getAccountPositions("BTC").then((res) => {
        if (res.data) return res.data;
        else {
            sendErrorEmail("Phemex API get account balance error. Message from Phemex: " + JSON.stringify(res))
            return res;
        }
    }); console.log(accountPositions)

    leverage = process.env.LEVERAGE
    risk = process.env.RISK
    size = Math.floor(leverage *(1-risk)*( accountPositions.account.accountBalanceEv / 100000000 * ticker.markPrice / 10000 ))
    if (size == 0) {
        sendErrorEmail("Not enough balance to " + side.toLowerCase() + " " + symbol)
        return null
    }
    console.log("Phemex order size: "+size.toString())

    if (orderType.toLowerCase() == "market") {
        const {data, error} = await trade.placeOrder({
            symbol: symbol,
            side: side,
            orderQty: size,
            ordType: orderType
        });
        if (data) {
            sendMarketOrderEmail(data)
            console.log(data);
        }
        if (error) {
            msg = "Phemex market order failed for "+symbol+ "\n"
            msg = msg + "Here is what Phemex says: \n"+JSON.stringify(error)
            sendErrorEmail(msg)
            console.log(error);
        }
    }
    else if (orderType.toLowerCase() == "limit") {
        const orderBook = await market.loadOrderbook(symbol).then((res) => {
            if (res.data) return res.data
            return res
        }); console.log(orderBook)
        if (side.toLowerCase() == "buy") {
            priceEp = orderBook.book.bids[0][0]
        }  else { priceEp = orderBook.book.asks[0][0] }
        const {data, error} = await trade.placeOrder({
            symbol: symbol,
            side: side,
            priceEp: priceEp,
            orderQty: size,
            ordType: orderType,
        });
        if (data) {
            sendLimitOrderEmail(data)
            console.log(data);
        }
        if (error) {
            msg = "Phemex limit order failed for "+symbol+ "\n"
            msg = msg + "Here is what Phemex says: \n"+JSON.stringify(error)
            sendErrorEmail(msg)
            console.log(error);
        }
    }
    else {
        sendErrorEmail("Unknown order type in Phemex")
        console.log("Unknown order type in Phemex")
        return null
    }
}

async function cancelOrder(symbol, orderId) {
  const {data, error} = await trade.cancelOrder(symbol, orderId);
  if (data) {
	console.log(data);
  }
  if (error) {
	console.log(error);
  }
}

async function getTicker(symbol) {
  const {data, error} = await market.getTicker(symbol);
  if (data) {
	return data
  }
  if (error) {
	console.log(error)
	return null
  }
}

module.exports = {
  placeOrder: placeOrder,
  cancelOrder: cancelOrder,
  loadOrderbook: loadOrderbook,
  loadTrades: loadTrades,
  loadMarkets: loadMarkets,
  loadActiveOrders: loadActiveOrders,
  getTicker: getTicker
}