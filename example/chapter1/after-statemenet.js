function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (const perf of invoice.performances) {
    let thisAmount = amountFor(playForPerformance(perf), perf);

    result += `${playForPerformance(perf).name}: ${usd(thisAmount)} (${perf.audience}석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${usd(totalAmount)}\n`;
  result += `적립 포인트: ${sumVolumeCredits(invoice.performances)}점\n`;

  return result;

  function sumVolumeCredits(aPerformances) {
    let result = 0;
    for (const perf of aPerformances) {
      result += Math.max(perf.audience - 30, 0);

      if (playForPerformance(perf).type === "comedy") result += Math.floor(perf.audience / 5);
    }
    return result;
  }

  function playForPerformance(aPerformance) {
    return plays[aPerformance.playID];
  }

  function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(aNumber / 100);
  }

  function amountFor(play, perf) {
    let thisAmount = 0;
    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }
    return thisAmount;
  }
}

const invoice = {
  customer: "BigCo",
  performances: [
    {
      playID: "hamlet",
      audience: 55,
    },
    {
      playID: "as-like",
      audience: 35,
    },
    {
      playID: "othello",
      audience: 40,
    },
  ],
};

const plays = {
  hamlet: { name: "Hamlet", type: "tragedy" },
  "as-like": { name: "As You Like It", type: "comedy" },
  othello: { name: "Othello", type: "tragedy" },
};

module.exports = { statement, invoice, plays };
