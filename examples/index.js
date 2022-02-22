/* eslint-disable func-names */
import { Motif as DIDMotif } from '../src/index';

(function () {
  const canvas = document.getElementById('example-1');
  const motif = new DIDMotif({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', canvas });
  motif.render();
})();

(function () {
  const canvas = document.getElementById('example-2');
  const motif = new DIDMotif({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', canvas });
  motif.animate();
})();

(function () {
  const img = document.getElementById('example-3');
  img.src = DIDMotif.toDataURL({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX' })
})();
