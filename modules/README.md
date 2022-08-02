## Create CmpApi

To create an instance of the CmpApi. Pass in your Cmp ID (assigned by IAB) and the Version (integer), and whether or not this instance is configured to use a [service-specific scope](https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework/blob/master/TCFv2/IAB%20Tech%20Lab%20-%20Consent%20string%20and%20vendor%20list%20formats%20v2.md#what-are-the-different-scopes-for-a-tc-string) to the constructor.

A [custom commands object map](#custom-commands) may optionally be passed to extend the page-call functionality as well.

````javascript
import {CmpApi} from '@iabgpp/cmpapi';

const cmpApi = new CmpApi(1, 3);
````

## Methods available to CMPs
````javascript
public constructor(cmpId: number, cmpVersion: number, customCommands?: CustomCommands)
public fireUpdate(currentAPI?: string, uiVisible = false): void
public getCurrentAPI(): string
public setCurrentAPI(currentAPI: string): void {
public setGppString(encodedGppString: string): void {
public getGppString(): string {
public setSectionString(sectionName: string, encodedSectionString: string): void {
public getSectionString(sectionName: string): string {
public setFieldValue(sectionName: string, fieldName: string, value: any): void {
public getFieldValue(sectionName: string, fieldName: string): any {
public getSection(sectionName: string): any {
public getGvlFromVendorList(vendorList: VendorList): Gvl {
public async getGvlFromUrl(gvlUrlConfig: GvlUrlConfig): Promise<Gvl> {
````

## Initialization
import {CmpApi} from '@iabgpp/cmpapi';

## CMP Example
````javascript
<script>
  const cmpApi = new CmpApi(1, 3);
  cmpApi.setGppString(gppString);
  cmpApi.setFieldValue("uspv1", "OptOutSale", 0);
  cmpApi.fireUpdate("uspv1");
  console.log(cmpApi.getGppString());
</script>
````

## Commands available to consumers
````javascript
__gpp("addEventListener", callback?, param?)
__gpp("getField", callback?, param?)
__gpp("getGPPString", callback?, param?)
__gpp("getSection", callback?, param?)
__gpp("hasSection", callback?, param?)
__gpp("ping", callback?, param?)
__gpp("removeEventListener", callback?, param?)
````

# Consumer example
````javascript
<script src="/js/stub/stub.js"></script>
<script>
  console.log(__gpp("ping"));

  __gpp("addEventListener", function (evt) {
    console.log("Received uspv1 event: " + evt);
    console.log(__gpp("getGPPString"));
  }, "uspv1");

  if(__gpp("hasSection", null, "tcfeuv2")) {
    console.log(__gpp("getSection", null, "tcfeuv2"));
  }

  if(__gpp("hasSection", null, "uspv1")) {
    console.log(__gpp("getField", null, "uspv1.OptOutSale"));
  }
</script>
````
