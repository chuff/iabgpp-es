import { AbstractEncodableBitStringDataType } from "../datatype/AbstractEncodableBitStringDataType.js";
import { EncodableBoolean } from "../datatype/EncodableBoolean.js";
import { EncodableDatetime } from "../datatype/EncodableDatetime.js";
import { EncodableFlexibleBitfield } from "../datatype/EncodableFlexibleBitfield.js";
import { EncodableFixedBitfield } from "../datatype/EncodableFixedBitfield.js";
import { EncodableFixedInteger } from "../datatype/EncodableFixedInteger.js";
import { EncodableFixedString } from "../datatype/EncodableFixedString.js";
import { AbstractEncodableSegmentedBitStringSection } from "./AbstractEncodableSegmentedBitStringSection.js";
import { EncodableFixedIntegerRange } from "../datatype/EncodableFixedIntegerRange.js";
import { EncodableOptimizedFixedRange } from "../datatype/EncodableOptimizedFixedRange.js";
import { DecodingError } from "../../error/DecodingError.js";
import { Base64UrlEncoder } from "../../encoder/Base64UrlEncoder.js";

export class TcfEuV2 extends AbstractEncodableSegmentedBitStringSection {
  public static readonly ID = 5;
  public static readonly VERSION = 2;
  public static readonly NAME = "tcfeuv2";

  constructor(encodedString?: string) {
    let fields = new Map<string, AbstractEncodableBitStringDataType<any>>();

    // core section
    fields.set("version", new EncodableFixedInteger(6, TcfEuV2.VERSION));
    fields.set("created", new EncodableDatetime());
    fields.set("lastUpdated", new EncodableDatetime());
    fields.set("cmpId", new EncodableFixedInteger(12, 0));
    fields.set("cmpVersion", new EncodableFixedInteger(12, 0));
    fields.set("consentScreen", new EncodableFixedInteger(6, 0));
    fields.set("consentLanguage", new EncodableFixedString(2, "EN"));
    fields.set("vendorListVersion", new EncodableFixedInteger(12, 0));
    fields.set("policyVersion", new EncodableFixedInteger(6, 2));
    fields.set("isServiceSpecific", new EncodableBoolean(false));
    fields.set("useNonStandardStacks", new EncodableBoolean(false));
    fields.set("specialFeatureOptins", new EncodableFixedBitfield(12, []));
    fields.set("purposeConsents", new EncodableFixedBitfield(24, []));
    fields.set("purposeLegitimateInterests", new EncodableFixedBitfield(24, []));
    fields.set("purposeOneTreatment", new EncodableBoolean(false));
    fields.set("publisherCountryCode", new EncodableFixedString(2, "AA"));
    fields.set("vendorConsents", new EncodableFixedIntegerRange([]));
    fields.set("vendorLegitimateInterests", new EncodableFixedIntegerRange([]));

    fields.set("publisherRestrictions", new EncodableFixedIntegerRange([]));

    // publisher purposes segment
    fields.set("publisherPurposesSegmentType", new EncodableFixedInteger(3, 3));
    fields.set("publisherConsents", new EncodableFixedBitfield(24, []));
    fields.set("publisherLegitimateInterests", new EncodableFixedBitfield(24, []));

    let numCustomPurposes = new EncodableFixedInteger(6, 0);
    fields.set("numCustomPurposes", numCustomPurposes);

    fields.set(
      "publisherCustomConsents",
      new EncodableFlexibleBitfield(() => {
        return numCustomPurposes.getValue();
      }, [])
    );

    fields.set(
      "publisherCustomLegitimateInterests",
      new EncodableFlexibleBitfield(() => {
        return numCustomPurposes.getValue();
      }, [])
    );

    fields.set("vendorsAllowedSegmentType", new EncodableFixedInteger(3, 2));
    fields.set("vendorsAllowed", new EncodableOptimizedFixedRange([]));

    fields.set("vendorsDisclosedSegmentType", new EncodableFixedInteger(3, 1));
    fields.set("vendorsDisclosed", new EncodableOptimizedFixedRange([]));

    let coreSegment = [
      "version",
      "created",
      "lastUpdated",
      "cmpId",
      "cmpVersion",
      "consentScreen",
      "consentLanguage",
      "vendorListVersion",
      "policyVersion",
      "isServiceSpecific",
      "useNonStandardStacks",
      "specialFeatureOptins",
      "purposeConsents",
      "purposeLegitimateInterests",
      "purposeOneTreatment",
      "publisherCountryCode",
      "vendorConsents",
      "vendorLegitimateInterests",
      "publisherRestrictions",
    ];

    let publisherPurposesSegment = [
      "publisherPurposesSegmentType",
      "publisherConsents",
      "publisherLegitimateInterests",
      "numCustomPurposes",
      "publisherCustomConsents",
      "publisherCustomLegitimateInterests",
    ];

    let vendorsAllowedSegment = ["vendorsAllowedSegmentType", "vendorsAllowed"];

    let vendorsDisclosedSegment = ["vendorsDisclosedSegmentType", "vendorsDisclosed"];

    let segments = [coreSegment, publisherPurposesSegment, vendorsAllowedSegment, vendorsDisclosedSegment];

    super(fields, segments);

    if (encodedString && encodedString.length > 0) {
      this.decode(encodedString);
    }
  }

  //Overriden
  public encode(): string {
    let segmentBitStrings = this.encodeSegmentsToBitStrings();
    let encodedSegments = [];
    encodedSegments.push(Base64UrlEncoder.encode(segmentBitStrings[0]));
    if (this.getFieldValue("isServiceSpecific")) {
      if (segmentBitStrings[1] && segmentBitStrings[1].length > 0) {
        encodedSegments.push(Base64UrlEncoder.encode(segmentBitStrings[1]));
      }
    } else {
      if (segmentBitStrings[2] && segmentBitStrings[2].length > 0) {
        encodedSegments.push(Base64UrlEncoder.encode(segmentBitStrings[2]));
      }

      if (segmentBitStrings[3] && segmentBitStrings[3].length > 0) {
        encodedSegments.push(Base64UrlEncoder.encode(segmentBitStrings[3]));
      }
    }

    return encodedSegments.join(".");
  }

  //Overriden
  public decode(encodedSection: string): void {
    let encodedSegments = encodedSection.split(".");
    let segmentBitStrings = [];
    for (let i = 0; i < encodedSegments.length; i++) {
      /**
       * first char will contain 6 bits, we only need the first 3. In version 1
       * and 2 of the TC string there is no segment type for the CORE string.
       * Instead the first 6 bits are reserved for the encoding version, but
       * because we're only on a maximum of encoding version 2 the first 3 bits
       * in the core segment will evaluate to 0.
       */
      let segmentBitString = Base64UrlEncoder.decode(encodedSegments[i]);
      switch (segmentBitString.substring(0, 3)) {
        // unfortunately, the segment ordering doesn't match the segment ids
        case "000": {
          segmentBitStrings[0] = segmentBitString;
          break;
        }
        case "001": {
          segmentBitStrings[3] = segmentBitString;
          break;
        }
        case "010": {
          segmentBitStrings[2] = segmentBitString;
          break;
        }
        case "011": {
          segmentBitStrings[1] = segmentBitString;
          break;
        }
        default: {
          throw new DecodingError("Unable to decode segment '" + encodedSegments[i] + "'");
        }
      }
    }
    this.decodeSegmentsFromBitStrings(segmentBitStrings);
  }

  //Overriden
  public setFieldValue(fieldName: string, value: any): void {
    super.setFieldValue(fieldName, value);
    if (fieldName != "created" && fieldName != "lastUpdated") {
      const date = new Date();
      const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

      this.setFieldValue("created", utcDate);
      this.setFieldValue("lastUpdated", utcDate);
    }
  }

  //Overriden
  public getId(): number {
    return TcfEuV2.ID;
  }

  //Overriden
  public getName(): string {
    return TcfEuV2.NAME;
  }
}
