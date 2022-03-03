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
import { update } from '@arcblock/did-motif';

const element = document.getElementById('my-canvas');
// or const element = document.getElementById('my-svg');
update(element, 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', { size: 36 });
```

render DID Motif with animation: 

``` js
import { update } from '@arcblock/did-motif';

const element = document.getElementById('my-canvas');
// or const element = document.getElementById('my-svg');
update(element, 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', { size: 36, animation: true });
```


use `toDataURL` to convert a DID to an image data URL, we can assign the `DataURL` as the value of the `src` attribute of `<img>` element.

``` js
import { toDataURL } from '@arcblock/did-motif';

const img = document.getElementById('my-img');
img.src = toDataURL({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', size: 36 });
```

See more examples and options of working with `@arcblock/did-motif` [here](https://github.com/ArcBlock/did-motif/blob/master/examples/index.js).
