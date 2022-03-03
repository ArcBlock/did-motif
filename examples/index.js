/* eslint-disable func-names */
import { update, toDataURL, Shape } from '../src/index';

update(document.getElementById('example-1'), 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', {
  size: 88,
});

update(document.getElementById('example-2'), 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', {
  size: 88,
  animation: true,
});

document.getElementById('example-3').src = toDataURL('z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', {
  size: 88,
});

// DIDMotif Shape Examples (roleType based)
(function () {
  // account
  update(document.getElementById('example-4-1'), 'z1YXMb8Souf2u8zVwWzexSNiD5Te7XGS313', {
    size: 88,
    animation: true,
  });
  // application
  update(document.getElementById('example-4-2'), 'zNKeLKixvCM32TkVM1zmRDdAU3bvm3dTtAcM', {
    size: 88,
    animation: true,
  });
  // asset
  update(document.getElementById('example-4-3'), 'zjdj2tvjvLVF9S3eFaaX5xEEDuwLu6qdQk2t', {
    size: 88,
    animation: true,
  });
  // token
  update(document.getElementById('example-4-4'), 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', {
    size: 88,
    animation: true,
  });
  // unsupported role type (default Shape - square)
  update(document.getElementById('example-4-5'), 'z3CtC3bGEFsDVvJC2GUqBcCfJyZM7a5uqY1fS', {
    size: 88,
    animation: true,
  });
})();

// DIDMotif Shape Examples (explicitly specify shape)
(function () {
  // account & Shape.CIRCLE
  update(document.getElementById('example-5-1'), 'z1YXMb8Souf2u8zVwWzexSNiD5Te7XGS313', {
    size: 88,
    shape: Shape.CIRCLE,
  });
  // application & Shape.HEXAGON
  update(document.getElementById('example-5-2'), 'zNKeLKixvCM32TkVM1zmRDdAU3bvm3dTtAcM', {
    size: 88,
    shape: Shape.HEXAGON,
  });
  // asset & Shape.SQUARE
  update(document.getElementById('example-5-3'), 'zjdj2tvjvLVF9S3eFaaX5xEEDuwLu6qdQk2t', {
    size: 88,
    shape: Shape.SQUARE,
  });
  // token & Shape.RECTANGLE
  update(document.getElementById('example-5-4'), 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', {
    size: 88,
    shape: Shape.RECTANGLE,
  });
})();

// SvgRenderer Examples
(function () {
  // account
  update(document.getElementById('example-6-1'), 'z1YXMb8Souf2u8zVwWzexSNiD5Te7XGS313', {
    size: 20,
  });
  // application
  update(document.getElementById('example-6-2'), 'zNKeLKixvCM32TkVM1zmRDdAU3bvm3dTtAcM', {
    size: 44,
  });
  // asset
  update(document.getElementById('example-6-3'), 'zjdj2tvjvLVF9S3eFaaX5xEEDuwLu6qdQk2t', {
    size: 88,
  });
  // token
  update(document.getElementById('example-6-4'), 'z35n6X6rDp8rWWCGSiXZgvd42bixdLULmX8oX', {
    size: 88,
    animation: true,
  });
  // unsupported role type (default Shape - square)
  update(document.getElementById('example-6-5'), 'z3CtC3bGEFsDVvJC2GUqBcCfJyZM7a5uqY1fS', {
    size: 88,
    animation: true,
  });
})();

// Invalid DID
(function () {
  const canvas = document.createElement('canvas');
  update(canvas, 'invalid-did-z1YXMb8Souf2u8zVwWzexSNiD5Te7XGS313');
})();
