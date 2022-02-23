# DID Motif

A javascript library for generating [DID](https://github.com/ArcBlock/ABT-DID-Protocol) identicons.

## Installation

```bash
npm i @arcblock/did-motif
# Or Yarn
yarn add @arcblock/did-motif
```

## Usage

render DID Motif: 

``` js
import { DIDMotif } from '@arcblock/did-motif';

const canvas = document.getElementById('my-canvas');
const motif = new DIDMotif({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', canvas, size: 36 });
motif.render();
```

render DID Motif with animation: 

``` js
import { DIDMotif } from '@arcblock/did-motif';
const canvas = document.getElementById('my-canvas');
const motif = new DIDMotif({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', canvas, size: 36 });
motif.animate();
```


use `DIDMotif.toDataURL` to convert a DID to an image data URL, we can assign the `DataURL` as the value of the `src` attribute of `<img>` element.

``` js
import { DIDMotif } from '@arcblock/did-motif';

const img = document.getElementById('my-img');
img.src = DIDMotif.toDataURL({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', size: 36 });
```

See more examples and options of working with `@arcblock/did-motif` [here](https://github.com/ArcBlock/did-motif/blob/master/examples/index.js).
