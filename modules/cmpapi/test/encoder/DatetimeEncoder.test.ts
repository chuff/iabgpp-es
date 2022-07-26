import { DatetimeEncoder } from "../../src/encoder/DatetimeEncoder";
import { expect } from "chai";

describe("encoder.DatetimeEncoder", (): void => {
  it("should encode and decode back to original value", (): void => {
    let date1 = new Date();
    let date2 = DatetimeEncoder.decode(DatetimeEncoder.encode(date1));
    expect(Math.round(date1.getTime() / 100) * 100).to.eql(date2.getTime());
  });

  /*
  it("should substring '10000000000000000000000000000000000001' from index 1 to '000000000000000000000000000000000000'", (): void => {
    expect(DatetimeEncoder.substring("10000000000000000000000000000000000001", 1)).to.eql(
      "000000000000000000000000000000000000"
    );
  });

  it("should substring '01111111111111111111111111111111111110' from index 1 to '111111111111111111111111111111111111'", (): void => {
    expect(DatetimeEncoder.substring("01111111111111111111111111111111111110", 1)).to.eql(
      "111111111111111111111111111111111111"
    );
  });
  */
});
