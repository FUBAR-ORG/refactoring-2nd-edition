const worker = require("./statement");

test("statement basic test", () => {
  const invoice = worker.invoice;
  const plays = worker.plays;

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
