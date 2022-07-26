import { FixedStringEncoder } from "../../src/encoder/FixedStringEncoder";
import { expect } from "chai";
import { DecodingError } from "../../src/error/DecodingError";

describe("encoder.FixedStringEncoder", (): void => {
  it("should encode 'AB' to '000000000001'", (): void => {
    expect(FixedStringEncoder.encode("AB", 2)).to.eql("000000000001");
  });

  it("should encode true 'a'", (): void => {
    expect(FixedStringEncoder.encode("a", 2)).to.eql("100000111111");
  });

  it("should decode '000000000001' string to 'AB'", (): void => {
    expect(FixedStringEncoder.decode("000000000001")).to.eql("AB");
  });

  it("should decode '100000111111' string to 'a'", (): void => {
    expect(FixedStringEncoder.decode("100000111111")).to.eql("a");
  });

  it("should encode '1' to error", (): void => {
    expect(() => {
      FixedStringEncoder.encode("1", 2);
    }).to.throw();
  });

  it("should decode '2' to error", (): void => {
    expect(() => {
      FixedStringEncoder.decode("2");
    }).to.throw();
  });

  /*
  it("should substring '10000000000001' from index 1 length 2 to '000000000000'", (): void => {
    expect(FixedStringEncoder.substring("10000000000001", 1, 2)).to.eql("000000000000");
  });

  it("should substring '01111111111110' from index 1 length 2 to '111111111111'", (): void => {
    expect(FixedStringEncoder.substring("01111111111110", 1, 2)).to.eql("111111111111");
  });
  */
});
