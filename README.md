## Create CmpApi

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

## CMP Example
````javascript
<script>
  import {CmpApi} from '@iabgpp/cmpapi';

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
