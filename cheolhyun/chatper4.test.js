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
