/* eslint-disable func-names */
import { DIDMotif, Shape } from '../src/index';

(function () {
  const canvas = document.getElementById('example-1');
  const motif = new DIDMotif({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', canvas, size: 88 });
  motif.render();
})();

(function () {
  const canvas = document.getElementById('example-2');
  const motif = new DIDMotif({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', canvas, size: 88 });
  motif.animate();
})();

(function () {
  const img = document.getElementById('example-3');
  img.src = DIDMotif.toDataURL({ did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', size: 88 });
})();

// DIDMotif Shape Examples (roleType based)
(function () {
  // account
  new DIDMotif({
    did: 'z1YXMb8Souf2u8zVwWzexSNiD5Te7XGS313',
    canvas: document.getElementById('example-4-1'),
    size: 88,
  }).animate();
  // application
  new DIDMotif({
    did: 'zNKeLKixvCM32TkVM1zmRDdAU3bvm3dTtAcM',
    canvas: document.getElementById('example-4-2'),
    size: 88,
  }).animate();
  // asset
  new DIDMotif({
    did: 'zjdj2tvjvLVF9S3eFaaX5xEEDuwLu6qdQk2t',
    canvas: document.getElementById('example-4-3'),
    size: 88,
  }).animate();
  // token
  new DIDMotif({
    did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX',
    canvas: document.getElementById('example-4-4'),
    size: 88,
  }).animate();
  // unsupported role type (default Shape - square)
  new DIDMotif({
    did: 'z3CtC3bGEFsDVvJC2GUqBcCfJyZM7a5uqY1fS',
    canvas: document.getElementById('example-4-5'),
    size: 88,
  }).animate();
})();

// DIDMotif Shape Examples (explicitly specify shape)
(function () {
  // account & Shape.CIRCLE
  new DIDMotif({
    did: 'z1YXMb8Souf2u8zVwWzexSNiD5Te7XGS313',
    canvas: document.getElementById('example-5-1'),
    size: 88,
    shape: Shape.CIRCLE,
  }).animate();
  // application & Shape.HEXAGON
  new DIDMotif({
    did: 'zNKeLKixvCM32TkVM1zmRDdAU3bvm3dTtAcM',
    canvas: document.getElementById('example-5-2'),
    size: 88,
    shape: Shape.HEXAGON,
  }).animate();
  // asset & Shape.SQUARE
  new DIDMotif({
    did: 'zjdj2tvjvLVF9S3eFaaX5xEEDuwLu6qdQk2t',
    canvas: document.getElementById('example-5-3'),
    size: 88,
    shape: Shape.SQUARE,
  }).animate();
  // token & Shape.RECTANGLE
  new DIDMotif({
    did: 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX',
    canvas: document.getElementById('example-5-4'),
    size: 88,
    shape: Shape.RECTANGLE,
  }).animate();
})();
