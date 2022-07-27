import { Declarations } from "./Declarations";
import { IntMap } from "./IntMap";
import { Vendor } from "./Vendor";

export interface VendorList extends Declarations {
  lastUpdated: string | Date;
  gvlSpecificationVersion: number;
  vendorListVersion: number;
  tcfPolicyVersion: number;
  vendors: IntMap<Vendor>;
}
