# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/glowbuzzer/gbr/compare/v1.2.1...v1.3.0) (2022-09-21)


### Feature

* **#13:** Remove jog percentage slider and add feedrate override as alternative ([052c0b6](https://github.com/glowbuzzer/gbr/commit/052c0b6f0a5027d3f306be6ed09bb32b927baae2))
* **#22:** Create igus front-end app ([206db42](https://github.com/glowbuzzer/gbr/commit/206db423983b9710689b55e6e205dc17919b34f7))
* **#25:** Provide optional KC context on joint DRO ([275d13f](https://github.com/glowbuzzer/gbr/commit/275d13f0a9f18a447f70661dff8817b16ba9ee19))
* **#26:** Provide sequence method in activity API which supports cancellation ([b1d518f](https://github.com/glowbuzzer/gbr/commit/b1d518f73e52687f8f3e8b0dbb078edd2f2d8ca6))
* **#27:** Add ambient light to tool path tile ([77caba7](https://github.com/glowbuzzer/gbr/commit/77caba78ed50a7b658420f47f1223d8d07029aec))
* **#28:** Add options to hide preview and toolpath trace in tool path tile ([77caba7](https://github.com/glowbuzzer/gbr/commit/77caba78ed50a7b658420f47f1223d8d07029aec))
* **#31:** Add feed hold and resume to feed rate tile ([052c0b6](https://github.com/glowbuzzer/gbr/commit/052c0b6f0a5027d3f306be6ed09bb32b927baae2))
* **#35:** Make moveParameters from config default for move ([25b77f1](https://github.com/glowbuzzer/gbr/commit/25b77f11ccb69d755868ac638f8e52e8e91fe55f))


### Bug Fix

* **#23:** Fix orbit controls issue ([0310f9c](https://github.com/glowbuzzer/gbr/commit/0310f9c3ad8445d7756395ec63e8034f8e0d43e7))
* **#36:** M6 toolchange causes javascript error ([f5befb8](https://github.com/glowbuzzer/gbr/commit/f5befb8652d6bdc2ac496c0bbf9cd34934bd835a))


### Chore

* add deploy-example.sh to changefiles for example deploy ([fad588e](https://github.com/glowbuzzer/gbr/commit/fad588ec367f235148891385130e09ebddfd2b73))
* add more locations for dummy moves in igus demo ([e7de9ca](https://github.com/glowbuzzer/gbr/commit/e7de9cad7a58f00aacc0aaefaaae68b3c477aa99))
* add react-native example project ([9cc1d3e](https://github.com/glowbuzzer/gbr/commit/9cc1d3e3aaec854fa8149907353b63fbd737ee0d))
* add test for keeping existing config over several moves ([eab52c9](https://github.com/glowbuzzer/gbr/commit/eab52c96278fc0dee8e664126618ed8907b65ccd))
* add tests for gbc bugs ([8f34682](https://github.com/glowbuzzer/gbr/commit/8f346820716bf37259439b79070e90e525a79b59))
* add tests for triggers ([5829b9f](https://github.com/glowbuzzer/gbr/commit/5829b9fe31d36fa42127fa03d9d8ebda9f6d1161))
* add to tests ([6afd21f](https://github.com/glowbuzzer/gbr/commit/6afd21f17faf001590b1e1742aab848171e5dbee))
* allow manual run of alpha package publish ([1806815](https://github.com/glowbuzzer/gbr/commit/1806815b1a38920c31a03a5111f026753f94f449))
* change alpha package version ([95d39e0](https://github.com/glowbuzzer/gbr/commit/95d39e0ad751fd2746c25dc1359b9a554cdbab3f))
* clean up waiton activities ([9cd52d6](https://github.com/glowbuzzer/gbr/commit/9cd52d65e86b64fc0f5e79acc093f64dab4d7e61))
* exhibit igus kinematics bug ([69c6e05](https://github.com/glowbuzzer/gbr/commit/69c6e05a1ddd47aaddf1ff81adfc6d97937702de))
* fix __dirname error ([f2f541a](https://github.com/glowbuzzer/gbr/commit/f2f541aeeb234ca6028a9ba1bb915127e2536d22))
* fix alpha package publish ([ad0435d](https://github.com/glowbuzzer/gbr/commit/ad0435d5005567b21333e9301fb6124bea5cf1ed))
* fix example build ([ba96255](https://github.com/glowbuzzer/gbr/commit/ba962558b6e6a628eb56fdb9d73ecc1ce8b93426))
* fix example deploy ([e4c2395](https://github.com/glowbuzzer/gbr/commit/e4c23954f5c9922e22ab324baeca92bd24ba7b83))
* make alpha packages public ([9c6f42b](https://github.com/glowbuzzer/gbr/commit/9c6f42bb75a96293dbd3b79ea1617eb6b8961b06))
* make alpha versions public ([addb12b](https://github.com/glowbuzzer/gbr/commit/addb12b46d272dee9e53708c4609454399e628fd))
* move cra template into project and add to build ([608b794](https://github.com/glowbuzzer/gbr/commit/608b794b946ed85c2c03049fcb8a98abcd68577f))
* provide separate import for connect ([547e031](https://github.com/glowbuzzer/gbr/commit/547e031d5f4e260fa2a9f6c9bdd1f2939877c7f1))
* Remove deprecated use of substr ([db3d624](https://github.com/glowbuzzer/gbr/commit/db3d6248f28a9f73c99e4c52243dbd92053b4f26))
* remove nrwl references from tsconfig files ([28ac48c](https://github.com/glowbuzzer/gbr/commit/28ac48ccab0f79492a4ad2a7de991993b9acc2eb))
* remove NX and switch to vite ([093adcb](https://github.com/glowbuzzer/gbr/commit/093adcbe1eae24bbc02d70a4753d995ff45704e4))
* remove unused pnpm override ([ab8f230](https://github.com/glowbuzzer/gbr/commit/ab8f230f8629a029ad55071b4453a97b3032ae65))
* revert bad alpha release ([d6115e2](https://github.com/glowbuzzer/gbr/commit/d6115e22fea4562fbde72fc5af2290f2adbf19c2))
* switch examples/generic and examples/staubli to vite ([ed584ec](https://github.com/glowbuzzer/gbr/commit/ed584ece019bb8dc77e9a2d933ec0c82663ece2b))
* test github ref manipulation in action ([83f37e5](https://github.com/glowbuzzer/gbr/commit/83f37e5f678a4963035e2bf4038175bd941bcbff))
* test github ref manipulation in action ([bf25ed3](https://github.com/glowbuzzer/gbr/commit/bf25ed36543b02de7dee28fd64a97a24dbb8b6e3))
* tweak build and readme ([a5e8939](https://github.com/glowbuzzer/gbr/commit/a5e8939ca7a1b00c286b336128bcd0678cec6736))
* tweak igus demo ([9d74ee7](https://github.com/glowbuzzer/gbr/commit/9d74ee7afab2d6be745248b53ef2d9c7b41e207e))
* update pnpm-lock.yaml ([d4d6b5f](https://github.com/glowbuzzer/gbr/commit/d4d6b5fe3e117610df97dc6e52f2b0fae2c1c524))

## [1.2.1](https://github.com/glowbuzzer/gbr/compare/v1.2.0...v1.2.1) (2022-08-09)


### Bug Fix

* fix release-please.yml ([ea99fe4](https://github.com/glowbuzzer/gbr/commit/ea99fe45221f0c044452807ebc466db3351f86fa))

## [1.2.0](https://github.com/glowbuzzer/gbr/compare/v1.1.0...v1.2.0) (2022-08-09)


### Features

* **#10:** Add label to kinematics configuration dropdowns ([d137f32](https://github.com/glowbuzzer/gbr/commit/d137f321d5d87a08edc11d2ec903343d83009164))
* **#16:** Provide a way to add custom objects to the 3d toolpath display ([ceb41b8](https://github.com/glowbuzzer/gbr/commit/ceb41b8f21a937905e80c7add5e8ec190964db22))
* **#17:** Add machine name to config.json and show in gbr ([b8ed87d](https://github.com/glowbuzzer/gbr/commit/b8ed87d922680b64dc08c0793710978e3cb7fc5b))
* **#18:** Add a simple spindle tile ([d4cbb4e](https://github.com/glowbuzzer/gbr/commit/d4cbb4e3133a4348c0860c0ce2378e28d9ae7a9b))


### Bug Fixes

* **#11:** Toolpath - DynamicLine - Error in line2.computeLineDistances ([74f0065](https://github.com/glowbuzzer/gbr/commit/74f0065c1f3b4a040345d1596d1ac10aa94892cd))
* **#12:** Digital Outputs tile - id not displayed ([d5ec4e7](https://github.com/glowbuzzer/gbr/commit/d5ec4e797ddf4b4cec584646a81f17471bb681b0))
* **#14:** The inputs tiles (analogue, digital, integer) do not show labels from config ([e7ac526](https://github.com/glowbuzzer/gbr/commit/e7ac52627aef741be82a003b190e0a475d1d8e93))
* **#15:** Order of items in config is not preserved when sent to gbr ([e7ac526](https://github.com/glowbuzzer/gbr/commit/e7ac52627aef741be82a003b190e0a475d1d8e93))

## [1.1.0](https://github.com/glowbuzzer/gbr/compare/v1.0.4...v1.1.0) (2022-06-30)


### Bug Fix

* **#1:** Joint DRO tile limits in radians not degrees ([39b2cec](https://github.com/glowbuzzer/gbr/commits/39b2cec95e5247bd99cca9307c2aa7646eb61681)), closes [#1](https://github.com/glowbuzzer/gbr/issues/1)
* **#2:** Tile help hover icon doesn't work ([0d93cda](https://github.com/glowbuzzer/gbr/commits/0d93cdac8a1115855e6dbfc0494d3888084a8071)), closes [#2](https://github.com/glowbuzzer/gbr/issues/2)


### Documentation

* **#3:** added help text for tiles ([27d120e](https://github.com/glowbuzzer/gbr/commits/27d120ee88642c1f5cabc76a812bffd55b316f31)), closes [#3](https://github.com/glowbuzzer/gbr/issues/3)


### Feature

* **#8:** Show diameter in tools tile ([1ea2f0b](https://github.com/glowbuzzer/gbr/commits/1ea2f0bd547456f26a7550bd7bcd33dc243a9e1b)), closes [#8](https://github.com/glowbuzzer/gbr/issues/8)

### [1.0.4](https://github.com/glowbuzzer/gbr/compare/v1.0.3...v1.0.4) (2022-06-28)


### Bug Fix

* **#6:** add correct dependencies to package.json in libs and determine version from top-level in build.mjs ([fd16370](https://github.com/glowbuzzer/gbr/commits/fd16370af394bd38a9bbceabfa129a6b6c984437)), closes [#6](https://github.com/glowbuzzer/gbr/issues/6)

### [1.0.3](https://github.com/glowbuzzer/gbr/compare/v1.0.2...v1.0.3) (2022-06-27)


### Bug Fix

* remove font attribute from react-three-drei Text occurrences to avoid font load errors ([c0faaab](https://github.com/glowbuzzer/gbr/commits/c0faaab1a4608f7563b033be73418bfd350d5e96))
* robot modal relative path issue ([1a6e68f](https://github.com/glowbuzzer/gbr/commits/1a6e68fcc0d55bd9af5d8e99f321fd97e376ca56))

### [1.0.2](https://github.com/glowbuzzer/gbr/compare/v1.0.1...v1.0.2) (2022-06-27)

### [1.0.1](https://github.com/glowbuzzer/gbr/compare/v1.0.0...v1.0.1) (2022-06-27)


### Bug Fix

* set correct path for robot model files and fix near/far distance issue ([ab753d4](https://github.com/glowbuzzer/gbr/commits/ab753d4a7cfae42393cf7fe7c2617f12806b88fc))

## 1.0.0 (2022-06-20)
