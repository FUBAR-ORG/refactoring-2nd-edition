const { Province, sampleProvinceData } = require("./chatper4-first");

describe("province", () => {
  it("shortfall", () => {
    const asia = new Province(sampleProvinceData());
    expect(asia.shortfall).toBe(5);
    // assert.equal(asia.shortfall, 5);
  });
  it("profit", () => {
    const asia = new Province(sampleProvinceData());
    expect(asia.shortfall).toBe(5);
  });
});

describe("no-before-each-province", () => {
  const asia = new Province(sampleProvinceData());
  it("shortfall", () => {
    expect(asia.shortfall).toBe(5);
  });
  it("profit", () => {
    expect(asia.profit).toBe(230);
  });
});

describe("before-each-province", () => {
  let asia;
  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  });
  it("shortfall", () => {
    expect(asia.shortfall).toBe(5);
  });
  it("profit", () => {
    expect(asia.profit).toBe(230);
  });
});

describe("province", function () {
  it("change production", function () {
    const asia = new Province(sampleProvinceData());
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  });
});

describe("no producers", function () {
  let noProducers;
  beforeEach(function () {
    const data = {
      name: "No producers",
      producers: [],
      demand: 30,
      price: 20,
    };
    noProducers = new Province(data);
  });
  it("shortfall", function () {
    expect(noProducers.shortfall).toBe(30);
  });
  it("profit", function () {
    expect(noProducers.profit).toBe(0);
  });
});
