# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
