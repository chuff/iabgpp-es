import { expect } from "chai";
import * as sinon from "sinon";
import { Gvl } from "../src/Gvl";
import { XMLHttpTestTools } from "./util/XMLHttpTestTools";

import vendorlistJson from "./vendorlist/vendor-list.json";
import translationJson from "./vendorlist/purposes-fr.json";

describe("Gvl", (): void => {
  const assertPopulated = (gvl: Gvl): void => {
    Object.keys(vendorlistJson).forEach((key: string): void => {
      const msg = `assertPopulated(): gvl.${key}]`;

      if (key === "lastUpdated") {
        expect((gvl[key] as Date).getTime(), msg).to.equal(new Date(vendorlistJson.lastUpdated).getTime());
      } else if (typeof vendorlistJson[key] === "object") {
        expect(gvl[key].id).to.eql(vendorlistJson[key].id);
        expect(gvl[key].name).to.eql(vendorlistJson[key].name);
        expect(gvl[key].purposes).to.eql(vendorlistJson[key].purposes);
        expect(gvl[key].legIntPurposes).to.eql(vendorlistJson[key].legIntPurposes);
        expect(gvl[key].flexiblePurposes).to.eql(vendorlistJson[key].flexiblePurposes);
        expect(gvl[key].features).to.eql(vendorlistJson[key].features);
        expect(gvl[key].specialFeatures).to.eql(vendorlistJson[key].specialFeatures);
        expect(gvl[key].policyUrl).to.eql(vendorlistJson[key].policyUrl);
        expect(gvl[key].cookieMaxAgeSeconds).to.eql(vendorlistJson[key].cookieMaxAgeSeconds);
        expect(gvl[key].usesCookies).to.eql(vendorlistJson[key].usesCookies);
        expect(gvl[key].cookieRefresh).to.eql(vendorlistJson[key].cookieRefresh);
        expect(gvl[key].usesNonCookieAccess).to.eql(vendorlistJson[key].usesNonCookieAccess);
        expect(gvl[key].deviceStorageDisclosureUrl).to.eql(vendorlistJson[key].deviceStorageDisclosureUrl);
      } else {
        expect(gvl[key], msg).to.equal(vendorlistJson[key]);
      }
    });
  };

  const assertTranslated = (gvl: Gvl, lang: string): void => {
    expect(gvl.purposes, "gvl.purposes").to.deep.equal(translationJson.purposes);
    expect(gvl.specialPurposes, "gvl.specialPurposes").to.deep.equal(translationJson.specialPurposes);
    expect(gvl.features, "gvl.features").to.deep.equal(translationJson.features);
    expect(gvl.specialFeatures, "gvl.specialFeatures").to.deep.equal(translationJson.specialFeatures);
    expect(gvl.stacks, "gvl.stacks").to.deep.equal(translationJson.stacks);

    expect(gvl.purposes, "gvl.purposes").to.not.deep.equal(vendorlistJson.purposes);
    expect(gvl.specialPurposes, "gvl.specialPurposes").to.not.deep.equal(vendorlistJson.specialPurposes);
    expect(gvl.features, "gvl.features").to.not.deep.equal(vendorlistJson.features);
    expect(gvl.specialFeatures, "gvl.specialFeatures").to.not.deep.equal(vendorlistJson.specialFeatures);

    expect(gvl.language, "gvl.language").to.equal(lang.toUpperCase());
  };

  beforeEach((): void => {
    XMLHttpTestTools.beforeEach();
  });

  it("should fail to set baseUrl to http://vendorlist.consensu.org/", (): void => {
    // calls constructor
    expect((): void => {
      new Gvl("http://vendorlist.consensu.org/");
    }).to.throw(
      "Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache"
    );
  });
  it("should fail to set baseUrl to https://vendorlist.consensu.org/ (secure url)", (): void => {
    // calls constructor
    expect((): void => {
      new Gvl("https://vendorlist.consensu.org/");
    }).to.throw(
      "Invalid baseUrl!  You may not pull directly from vendorlist.consensu.org and must provide your own cache"
    );
  });

  it("should add a trailing slash to baseUrl if one is not there", (): void => {
    const myURL = "http://vendorlist.mysweetcmp.mgr.consensu.org";

    let gvl = new Gvl(myURL);

    expect(gvl.baseUrl).to.equal(myURL + "/");
  });

  it("should propogate all values with passed in json", (): void => {
    const gvl: Gvl = new Gvl();
    gvl.loadVendorList(vendorlistJson);

    assertPopulated(gvl);
  });

  it("should get latest Gvl if nothing is passed to the constructor", async (): Promise<void> => {
    const gvl: Gvl = new Gvl("http://sweetcmp.com/");
    gvl.refreshVendorList();
    expect(XMLHttpTestTools.requests.length).to.equal(1);
    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];
    expect(req.method).to.equal("GET");

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));
    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it('should get latest Gvl if "LATEST" is passed to the constructor', async (): Promise<void> => {
    const gvl: Gvl = new Gvl("http://sweetcmp.com/");
    gvl.refreshVendorList("LATEST");

    expect(XMLHttpTestTools.requests.length).to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(`${gvl.baseUrl}vendor-list.json`);

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));

    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it("should get versioned Gvl if version number is passed", async (): Promise<void> => {
    const version = 22;
    const gvl: Gvl = new Gvl("http://sweetcmp.com/");
    gvl.refreshVendorList(version);

    expect(XMLHttpTestTools.requests.length).to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(`${gvl.baseUrl}archives/vendor-list-v${version}.json`);

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));

    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it("should get versioned Gvl if version number as string is passed", async (): Promise<void> => {
    const version = "23";
    const gvl: Gvl = new Gvl("http://sweetcmp.com/");
    gvl.refreshVendorList(version);

    expect(XMLHttpTestTools.requests.length).to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(`${gvl.baseUrl}archives/vendor-list-v${version}.json`);

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));
    await gvl.readyPromise;
    assertPopulated(gvl);
  });

  it('should not re-request the "LATEST" vendorlist json if it has already downloaded it', async (): Promise<void> => {
    const gvl: Gvl = new Gvl("http://sweetcmp.com/");
    gvl.refreshVendorList("LATEST");

    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(`${gvl.baseUrl}vendor-list.json`);

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));
    await gvl.readyPromise;

    gvl.refreshVendorList("LATEST");

    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(1);
    expect(XMLHttpTestTools.requests[0], "request").to.deep.equal(req);

    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it("should not re-request a versioned vendorlist json if it has already downloaded it", async (): Promise<void> => {
    let baseUrl = "http://sweetcmp.com/";
    const gvlVersion = vendorlistJson.vendorListVersion;
    const gvl: Gvl = new Gvl(baseUrl);
    gvl.refreshVendorList(gvlVersion);

    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(`${gvl.baseUrl}archives/vendor-list-v${gvlVersion}.json`);

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));

    await gvl.readyPromise;
    assertPopulated(gvl);

    gvl.refreshVendorList(gvlVersion);

    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(1);
    expect(XMLHttpTestTools.requests[0], "request").to.deep.equal(req);

    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it("should not re-request a vendorlist json if it has been passed in to the constructor", async (): Promise<void> => {
    let baseUrl = "http://sweetcmp.com/";

    const gvlVersion = vendorlistJson.vendorListVersion;
    const gvl: Gvl = new Gvl(baseUrl);
    gvl.loadVendorList(vendorlistJson);

    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(0);

    await gvl.readyPromise;
    assertPopulated(gvl);

    gvl.refreshVendorList(gvlVersion);
    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(0);

    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it("should not re-request a vendorlist json latest is request and then that version is requested later", async (): Promise<void> => {
    let baseUrl = "http://sweetcmp.com/";

    const gvlVersion = vendorlistJson.vendorListVersion;
    const gvl: Gvl = new Gvl(baseUrl);
    gvl.refreshVendorList();

    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(`${gvl.baseUrl}vendor-list.json`);

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(vendorlistJson));
    await gvl.readyPromise;
    assertPopulated(gvl);

    gvl.refreshVendorList(gvlVersion);
    expect(XMLHttpTestTools.requests.length, "requests.length").to.equal(1);
    expect(XMLHttpTestTools.requests[0], "request").to.deep.equal(req);

    await gvl.readyPromise;

    assertPopulated(gvl);
  });

  it("should narrow a group of vendors when narrowVendorsTo is called with list of ids", (): void => {
    const gvl: Gvl = new Gvl();
    gvl.loadVendorList(vendorlistJson);
    const onlyVendorId: string = Object.keys(vendorlistJson.vendors)[0];

    gvl.narrowVendorsTo([parseInt(onlyVendorId, 10)]);
    expect(gvl.vendors[onlyVendorId]).to.deep.equal(vendorlistJson.vendors[onlyVendorId]);
    expect(Object.keys(gvl.vendors).length).to.equal(1);
    expect(gvl.vendors[Object.keys(vendorlistJson.vendors)[1]]).to.be.undefined;
  });

  it("should remove a vendor if it has a deletedDate", (): void => {
    const vendorId = "1";

    let gvl = new Gvl();
    gvl.loadVendorList(vendorlistJson);

    const json = gvl.getJson();
    json.vendors[vendorId] = {
      id: +vendorId,
      name: "Fake Vendor with ID 1",
      purposes: [1, 2, 3, 4],
      legIntPurposes: [7, 9, 10],
      flexiblePurposes: [2],
      deletedDate: "2020-01-28T00:00:00Z",
      specialPurposes: [],
      features: [2],
      specialFeatures: [],
      policyUrl: "http://www.fakevendor.com/privacy-policy/",
      usesCookies: true,
      cookieMaxAgeSeconds: 1000,
      cookieRefresh: true,
      usesNonCookieAccess: false,
    };

    expect(json.vendors[vendorId], `json.vendors["${vendorId}"]`).not.to.be.undefined;
    const gvl2: Gvl = new Gvl();
    gvl2.loadVendorList(json);
    expect(gvl2.vendors[vendorId], `gvl2.vendors["${vendorId}"]`).to.be.undefined;
  });

  it("should replace the language when changeLanguage() is called with valid language", async (): Promise<void> => {
    let baseUrl = "http://sweetcmp.com";

    const gvl: Gvl = new Gvl();
    gvl.loadVendorList(vendorlistJson);
    const language = "fr";

    expect(gvl.language).to.equal(Gvl.DEFAULT_LANGUAGE);

    const changePromise = gvl.changeLanguage(language);

    expect(XMLHttpTestTools.requests.length).to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.url).to.equal(gvl.baseUrl + gvl.languageFilename.replace("[LANG]", language));

    req.respond(200, XMLHttpTestTools.JSON_HEADER, JSON.stringify(translationJson));

    await changePromise;

    assertTranslated(gvl, language);
  });

  const langNotOk = (language: string): void => {
    it(`should throw an error if ${language} is passed to changeLanguage()`, async (): Promise<void> => {
      let baseUrl = "http://sweetcmp.com";

      const gvl: Gvl = new Gvl();
      gvl.loadVendorList(vendorlistJson);

      try {
        await gvl.changeLanguage(language);
      } catch (err) {
        expect(err.message).to.contain("unsupported");
      }
    });
  };

  langNotOk("{Z");
  langNotOk("-Z");
  langNotOk("35");
  langNotOk("ZZZ");
  langNotOk("US");
  langNotOk("usa");
  langNotOk("..");
  langNotOk(" EN");
  langNotOk("  ");
  langNotOk("aa");
  langNotOk("aaa");
  langNotOk("zz");
  langNotOk("AA");
  langNotOk("ZZ");
  // too short
  langNotOk("a");
  langNotOk("@#");
  langNotOk("15");
  langNotOk("{{");

  it('should not request a file if the language is "EN"', (): void => {
    let baseUrl = "http://sweetcmp.com";

    const gvl: Gvl = new Gvl();
    gvl.loadVendorList(vendorlistJson);

    expect(gvl.language).to.equal(Gvl.DEFAULT_LANGUAGE);

    gvl.changeLanguage(Gvl.DEFAULT_LANGUAGE);
    expect(XMLHttpTestTools.requests.length).to.equal(0);
  });

  it("should error if a 404 for the language file occurs", (done: () => void): void => {
    let baseUrl = "http://sweetcmp.com";

    const gvl: Gvl = new Gvl();
    gvl.loadVendorList(vendorlistJson);
    const language = "FR";

    expect(gvl.language).to.equal(Gvl.DEFAULT_LANGUAGE);

    gvl
      .changeLanguage(language)
      .then((): void => {
        expect.fail("should not have resolved");
      })
      .catch((err): void => {
        // expect(err).to.be.an.instanceof(GvlError);
        expect(err.message).to.contain("language");
        done();
      });

    expect(XMLHttpTestTools.requests.length).to.equal(1);

    const req: sinon.SinonFakeXMLHttpRequest = XMLHttpTestTools.requests[0];

    expect(req.method).to.equal("GET");
    expect(req.url).to.equal(gvl.baseUrl + gvl.languageFilename.replace("[LANG]", language));

    req.respond(404, XMLHttpTestTools.JSON_HEADER, JSON.stringify({}));
  });
});
