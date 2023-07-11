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
