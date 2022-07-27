import { UspV1Legacy } from "../../../src/manifest/section/UspV1Legacy";
import { expect } from "chai";

describe("manifest.section.UspV1", (): void => {
  it("should default encode 1---", (): void => {
    let uspv1 = new UspV1Legacy();
    expect(uspv1.encode()).to.eql("1---");
  });

  it("should decode 1NYN", (): void => {
    let uspv1 = new UspV1Legacy("1NYN");
    expect(uspv1.getFieldValue("version")).to.eql(1);
    expect(uspv1.getFieldValue("notice")).to.eql("N");
    expect(uspv1.getFieldValue("optOutSale")).to.eql("Y");
    expect(uspv1.getFieldValue("lspaCovered")).to.eql("N");
  });

  it("should decode 2YNY", (): void => {
    let uspv1 = new UspV1Legacy("2YNY");
    expect(uspv1.getFieldValue("version")).to.eql(2);
    expect(uspv1.getFieldValue("notice")).to.eql("Y");
    expect(uspv1.getFieldValue("optOutSale")).to.eql("N");
    expect(uspv1.getFieldValue("lspaCovered")).to.eql("Y");
  });

  it("should encode to 1YNN", (): void => {
    let uspv1 = new UspV1Legacy();
    uspv1.setFieldValue("notice", "Y");
    uspv1.setFieldValue("optOutSale", "N");
    uspv1.setFieldValue("lspaCovered", "N");

    expect(uspv1.encode()).to.eql("1YNN");
  });

  it("should decode to 2NYY", (): void => {
    let uspv1 = new UspV1Legacy();
    uspv1.setFieldValue("version", 2);
    uspv1.setFieldValue("notice", "N");
    uspv1.setFieldValue("optOutSale", "Y");
    uspv1.setFieldValue("lspaCovered", "Y");

    expect(uspv1.encode()).to.eql("2NYY");
  });
});
