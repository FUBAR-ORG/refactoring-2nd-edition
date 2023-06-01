const worker = require("./after-statemenet");

const { invoice, plays } = worker;

test("statement basic test", () => {
  const result = worker.statement(invoice, plays);
  expect(result).toBe(
    "청구 내역 (고객명: BigCo)\n" +
      "Hamlet: $650.00 (55석)\n" +
      "As You Like It: $580.00 (35석)\n" +
      "Othello: $500.00 (40석)\n" +
      "총액: $1,730.00\n" +
      "적립 포인트: 47점\n"
  );
});

test("extract switch", () => {
  const audience = 30;

  const play = { type: "comedy" };
  const perf = { audience: audience };
  const result = worker.amountFor(play, perf);
  let thisAmount = 30000;
  thisAmount += 10000 + 500 * (perf.audience - 20);
  thisAmount += 300 * perf.audience;

  expect(result).toBe(thisAmount);
});
