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

test("Object.assign 테스트", () => {
  const array = [{ prop: "value" }, { prop: { prop: "value" } }];
  const arrayTest1 = array;
  const arrayTest2 = array.map((obj) => {
    return Object.assign({}, obj);
  });

  console.log("before " + JSON.stringify(arrayTest1));
  console.log("before " + JSON.stringify(arrayTest2));
  array[0].prop = "changeValue";
  array[1].prop.prop = "changeValue";
  console.log("after " + JSON.stringify(arrayTest1));
  console.log("after " + JSON.stringify(arrayTest2));

  expect(arrayTest1[0].prop).not.toBe(arrayTest2[0].prop);
  expect(arrayTest1[1].prop).toBe(arrayTest2[1].prop);
});
