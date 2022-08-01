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
    fields.set("Version", new EncodableFixedInteger(6, TcfEuV2.VERSION));
    fields.set("Created", new EncodableDatetime());
    fields.set("LastUpdated", new EncodableDatetime());
    fields.set("CmpId", new EncodableFixedInteger(12, 0));
    fields.set("CmpVersion", new EncodableFixedInteger(12, 0));
    fields.set("ConsentScreen", new EncodableFixedInteger(6, 0));
    fields.set("ConsentLanguage", new EncodableFixedString(2, "EN"));
    fields.set("VendorListVersion", new EncodableFixedInteger(12, 0));
    fields.set("PolicyVersion", new EncodableFixedInteger(6, 2));
    fields.set("IsServiceSpecific", new EncodableBoolean(false));
    fields.set("UseNonStandardStacks", new EncodableBoolean(false));
    fields.set("SpecialFeatureOptins", new EncodableFixedBitfield(12, []));
    fields.set("PurposeConsents", new EncodableFixedBitfield(24, []));
    fields.set("PurposeLegitimateInterests", new EncodableFixedBitfield(24, []));
    fields.set("PurposeOneTreatment", new EncodableBoolean(false));
    fields.set("PublisherCountryCode", new EncodableFixedString(2, "AA"));
    fields.set("VendorConsents", new EncodableFixedIntegerRange([]));
    fields.set("VendorLegitimateInterests", new EncodableFixedIntegerRange([]));

    fields.set("PublisherRestrictions", new EncodableFixedIntegerRange([]));

    // publisher purposes segment
    fields.set("PublisherPurposesSegmentType", new EncodableFixedInteger(3, 3));
    fields.set("PublisherConsents", new EncodableFixedBitfield(24, []));
    fields.set("PublisherLegitimateInterests", new EncodableFixedBitfield(24, []));

    let numCustomPurposes = new EncodableFixedInteger(6, 0);
    fields.set("NumCustomPurposes", numCustomPurposes);

    fields.set(
      "PublisherCustomConsents",
      new EncodableFlexibleBitfield(() => {
        return numCustomPurposes.getValue();
      }, [])
    );

    fields.set(
      "PublisherCustomLegitimateInterests",
      new EncodableFlexibleBitfield(() => {
        return numCustomPurposes.getValue();
      }, [])
    );

    fields.set("VendorsAllowedSegmentType", new EncodableFixedInteger(3, 2));
    fields.set("VendorsAllowed", new EncodableOptimizedFixedRange([]));

    fields.set("VendorsDisclosedSegmentType", new EncodableFixedInteger(3, 1));
    fields.set("VendorsDisclosed", new EncodableOptimizedFixedRange([]));

    let coreSegment = [
      "Version",
      "Created",
      "LastUpdated",
      "CmpId",
      "CmpVersion",
      "ConsentScreen",
      "ConsentLanguage",
      "VendorListVersion",
      "PolicyVersion",
      "IsServiceSpecific",
      "UseNonStandardStacks",
      "SpecialFeatureOptins",
      "PurposeConsents",
      "PurposeLegitimateInterests",
      "PurposeOneTreatment",
      "PublisherCountryCode",
      "VendorConsents",
      "VendorLegitimateInterests",
      "PublisherRestrictions",
    ];

    let publisherPurposesSegment = [
      "PublisherPurposesSegmentType",
      "PublisherConsents",
      "PublisherLegitimateInterests",
      "NumCustomPurposes",
      "PublisherCustomConsents",
      "PublisherCustomLegitimateInterests",
    ];

    let vendorsAllowedSegment = ["VendorsAllowedSegmentType", "VendorsAllowed"];

    let vendorsDisclosedSegment = ["VendorsDisclosedSegmentType", "VendorsDisclosed"];

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
    if (this.getFieldValue("IsServiceSpecific")) {
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
    if (fieldName !== "Created" && fieldName !== "LastUpdated") {
      const date = new Date();
      const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

      this.setFieldValue("Created", utcDate);
      this.setFieldValue("LastUpdated", utcDate);
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
