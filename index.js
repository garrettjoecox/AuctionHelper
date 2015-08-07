
var request = require('request');
var exec = require('child_process').exec;
var config = {
  key: require('./key'),
  realm: 'thrall',
  itemId: 4306,
  itemName: 'Silk Cloth',
  threshold: 15000
};

getAuctionUrl()
  .then(getAuctionData)
  .then(countAuctions)
  .then(announceResult)
  .catch(e);

function getAuctionUrl() {
  return get('https://us.api.battle.net/wow/auction/data/' + config.realm + '?locale=en_US&apikey=' + config.key)
    .then(function(body) {
      return body.files[0].url;
    });
}

function getAuctionData(url) {
  return get(url);
}

function countAuctions(body) {
  var count = 0;
  body.auctions.auctions.forEach(function(auction) {
    if (auction.item === config.itemId && auction.buyout < config.threshold) count++;
  });
  return count;
}

function announceResult(count) {
  exec('say there is ' + count + ' ' + config.itemName + ' under threshold on ' + config.realm, function(){});
}

function get(url) {
  return new Promise(function(resolve, reject) {
    request(url, function(err, response, body) {
      if (err) reject(err);
      else resolve(JSON.parse(body));
    });
  });
}

function e(err) {
  console.log(err);
}
