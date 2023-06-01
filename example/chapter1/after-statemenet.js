function statement(invoice, plays) {
  return String(`청구 내역 (고객명: ${invoice.customer})\n`)
    .concat(
      ...invoice.performances.map(
        perf => `${playForPerformance(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`
      )
    )
    .concat(`총액: ${usd(sumTotalAmount(invoice.performances))}\n`)
    .concat(`적립 포인트: ${sumVolumeCredits(invoice.performances)}점\n`);

  function sumTotalAmount(aPerformances) {
    let result = 0;
    for (const perf of aPerformances) {
      result += amountFor(perf);
    }
    return result;
  }

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

  function amountFor(aPerformance) {
    let result = 0;
    switch (playForPerformance(aPerformance).type) {
      case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playForPerformance(aPerformance).type}`);
    }
    return result;
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
