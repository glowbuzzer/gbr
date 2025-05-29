# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.14.1](https://github.com/glowbuzzer/gbr/compare/v1.14.0...v1.14.1) (2025-05-29)


### Bug Fix

* build file issues ([994c491](https://github.com/glowbuzzer/gbr/commit/994c491d40f6bc38d8a154d2951383354d8fbc6b))

## [1.14.0](https://github.com/glowbuzzer/gbr/compare/v1.13.1...v1.14.0) (2025-05-29)


### Feature

* **#141:** Envelope constraint editing ([0602bb7](https://github.com/glowbuzzer/gbr/commit/0602bb721b13154c547f5bc827e5e3821da33b41))
* **#178:** Add config screens gbem and gbc config ([8e1b0dc](https://github.com/glowbuzzer/gbr/commit/8e1b0dca7227a091210a7c67b00be91844829e30))
* **#189:** Tool offset and payload activities in FlowMaker ([52ff176](https://github.com/glowbuzzer/gbr/commit/52ff176f5fdee58b7f300797775f41af3f53f462))
* **#190:** Run tile for FlowMaker ([52ff176](https://github.com/glowbuzzer/gbr/commit/52ff176f5fdee58b7f300797775f41af3f53f462))
* **#192:** Support user login and roles ([0d91ee1](https://github.com/glowbuzzer/gbr/commit/0d91ee1f411389574cdebeaf105adc13ab6f49b9))
* **#198:** Add Modbus Tiles (dout, din, uiin, uiout) ([a3279bf](https://github.com/glowbuzzer/gbr/commit/a3279bf210f1fcb7035c4051cb418a1db4acdedf))
* **#198:** Add Modbus Tiles (dout, din, uiin, uiout) ([c2ba187](https://github.com/glowbuzzer/gbr/commit/c2ba187cd0f6fafc63094e150e2b5c9c1191a7dc))
* **#199:** Provide way to set default move params in streaming API ([aec95d2](https://github.com/glowbuzzer/gbr/commit/aec95d22d291589095e14bf06a7c26f966383be6))
* **#19:** Show tool model file at end of robot ([5ea46f2](https://github.com/glowbuzzer/gbr/commit/5ea46f2d6522b31036e576679160571b660d35ba))
* **#201:** Add description to config ([a9f2bfc](https://github.com/glowbuzzer/gbr/commit/a9f2bfcdcb76c21815948cb6ca0ba4830099a327))
* **#202:** Add ability to read sdos from slaves ([33c471e](https://github.com/glowbuzzer/gbr/commit/33c471eb57e3c9893f244dac440a6156073332d2))
* **#204:** Change Live to Normal for target switch ([cca58e4](https://github.com/glowbuzzer/gbr/commit/cca58e4ebd97d0c4862034795f54cd037178cec7))
* **#205:** Multiple mode support ([dbf85f2](https://github.com/glowbuzzer/gbr/commit/dbf85f2bc3fff214d3b94bec3a397c5e1a878437))
* **#207:** Provide auto-connect option on GlowbuzzerApp ([e4304e3](https://github.com/glowbuzzer/gbr/commit/e4304e34401af21395c958e574acc80407e97280))
* **#208:** Enhance connection status to include GBEM boot status ([22cf3e1](https://github.com/glowbuzzer/gbr/commit/22cf3e1aae743f53a9813893956815b8820d338a))
* **#209:** Automatically move to OP if configured on GlowbuzzerApp ([e4304e3](https://github.com/glowbuzzer/gbr/commit/e4304e34401af21395c958e574acc80407e97280))
* **#210:** support QUICKSTOP ([c179a5f](https://github.com/glowbuzzer/gbr/commit/c179a5f4b1f3cad8371859a71a80c4dd05f497cd))
* **#212:** set safety douts for current mode (if configured) ([c179a5f](https://github.com/glowbuzzer/gbr/commit/c179a5f4b1f3cad8371859a71a80c4dd05f497cd))
* **#216:** Add $metadata to config for various items ([c566ce8](https://github.com/glowbuzzer/gbr/commit/c566ce8b1cf41da6ed0e3bb41c72f4761b3e357e))
* **#218:** Rework hand guided status tray item (generic manual mode item) ([c566ce8](https://github.com/glowbuzzer/gbr/commit/c566ce8b1cf41da6ed0e3bb41c72f4761b3e357e))
* **#221:** Introduce safety faults status tray item and automatically reset safety fault ([83a431b](https://github.com/glowbuzzer/gbr/commit/83a431b57b426a368ea50bfef46a6744c7912688))
* **#222:** Add dedicated safety errors status tray item ([1c66175](https://github.com/glowbuzzer/gbr/commit/1c6617530083000c76723703f9c7f3a294485693))
* **#225:** Modbus dout and iout in FlowMaker ([52ff176](https://github.com/glowbuzzer/gbr/commit/52ff176f5fdee58b7f300797775f41af3f53f462))
* **#227:** Improve connection configuration options ([0d91ee1](https://github.com/glowbuzzer/gbr/commit/0d91ee1f411389574cdebeaf105adc13ab6f49b9))
* **#228:** Restrict config edit to admin user role ([0d91ee1](https://github.com/glowbuzzer/gbr/commit/0d91ee1f411389574cdebeaf105adc13ab6f49b9))
* **#229:** Support per-user tile layout when authenticated ([0d91ee1](https://github.com/glowbuzzer/gbr/commit/0d91ee1f411389574cdebeaf105adc13ab6f49b9))
* **#240:** Plugin to serve model files in vite and express app ([5ea46f2](https://github.com/glowbuzzer/gbr/commit/5ea46f2d6522b31036e576679160571b660d35ba))
* **#242:** Model file management ([770f6b2](https://github.com/glowbuzzer/gbr/commit/770f6b29ad285f2b6625f5e8a30ee21a5e05bffd))
* **#243:** Add cartesian position to telemetry ([c55a799](https://github.com/glowbuzzer/gbr/commit/c55a7990bb2247246c61f93ec822215c7bc52054))
* **#245:** Add metadata to frames in config to control edit capability ([2e1ea97](https://github.com/glowbuzzer/gbr/commit/2e1ea9780587610f2b4e8a1afc4aedbc5f1dbbce))
* **#250:** Auto-override safety inputs in sim mode ([938785f](https://github.com/glowbuzzer/gbr/commit/938785fa258a1953cb8979cfd673c728bf5be867))
* add io rising/falling edges to telemetry ([3d161db](https://github.com/glowbuzzer/gbr/commit/3d161dbe60b5244ef0d26e6e851fc121850406fb))
* move activity up and down in flow ([3c6c6ea](https://github.com/glowbuzzer/gbr/commit/3c6c6ea5ba57314ac7fbcafc2dc9d21a442484a1))


### Bug Fix

* **#184:** Memoise useStream return ([b30ee6b](https://github.com/glowbuzzer/gbr/commit/b30ee6ba44c6d970502fdd4f75ef133272aa08d2))
* **#200:** Set minimum heartbeat frequency to 1 second ([08fc6f4](https://github.com/glowbuzzer/gbr/commit/08fc6f4a26123766832cffe2f2d011576e17858d))
* **#203:** support undefined in move activity axis values ([a329425](https://github.com/glowbuzzer/gbr/commit/a3294251bba47489422f7ce4da0cb21d257ac5fa))
* **#214:** Clearly display when machine is in quick stop state ([d8e8285](https://github.com/glowbuzzer/gbr/commit/d8e8285b3d2aabcbc486681a4c0ef0611e3d1c7d))
* **#217:** Reset CSP mode when existing hand guided mode ([c566ce8](https://github.com/glowbuzzer/gbr/commit/c566ce8b1cf41da6ed0e3bb41c72f4761b3e357e))
* **#223:** Don't show enabling switch prompt when in auto mode ([31fb081](https://github.com/glowbuzzer/gbr/commit/31fb0814834d456c746df8aa98256b02ed0b9502))
* **#236:** Show errors from integration endpoint in flow maker ([1de4339](https://github.com/glowbuzzer/gbr/commit/1de433903e86d0265bccd517fa7211468ad6ea59))
* **#247:** Gracefully handle pouchdb startup errors with global popup ([fda0e69](https://github.com/glowbuzzer/gbr/commit/fda0e69db5046f25465486f98ac07739b5366638))
* **#252:** Fix websocket retry logic ([8a8d72e](https://github.com/glowbuzzer/gbr/commit/8a8d72e84f4b3d9841785660decdb34157995a32))
* handle missing tool metadata ([1910a70](https://github.com/glowbuzzer/gbr/commit/1910a70918110677a73c68c9d75a169171beb711))
* issue with gbdb singleton load due to dynamic import of pouchdb ([8275911](https://github.com/glowbuzzer/gbr/commit/8275911ad51a254ebceb05acaf829a19984115d5))
* minor issue with PrecisionInput.tsx usability ([b19362f](https://github.com/glowbuzzer/gbr/commit/b19362f7d0d01b18faf00b6fe964e67418480923))
* null pointer error deleting flows ([3c6c6ea](https://github.com/glowbuzzer/gbr/commit/3c6c6ea5ba57314ac7fbcafc2dc9d21a442484a1))


### Chore

* **#219:** Rename deadman to enabling switch ([c566ce8](https://github.com/glowbuzzer/gbr/commit/c566ce8b1cf41da6ed0e3bb41c72f4761b3e357e))
* **#220:** Give current mode in jog tile overlay ([c566ce8](https://github.com/glowbuzzer/gbr/commit/c566ce8b1cf41da6ed0e3bb41c72f4761b3e357e))
* **#226:** FlowMaker mode overlay ([52ff176](https://github.com/glowbuzzer/gbr/commit/52ff176f5fdee58b7f300797775f41af3f53f462))
* add app menu to standalone example project ([8ddc396](https://github.com/glowbuzzer/gbr/commit/8ddc3966f3f6ff51fd51d9c3effda24d44b54fcc))
* Add back deleted file used by safety IO ([197d1b4](https://github.com/glowbuzzer/gbr/commit/197d1b49185d23bed9332982f2bbe25bb2f079e8))
* add codesandbox dev container ([12c6a94](https://github.com/glowbuzzer/gbr/commit/12c6a946ba37c6ec2dfdd29c21d2d0fce3254a45))
* Add comments ([a193b47](https://github.com/glowbuzzer/gbr/commit/a193b470981753db866e14bcefb6bddafde6ba22))
* Add decode of datatype ([05e9811](https://github.com/glowbuzzer/gbr/commit/05e9811d451e6f06370252b4d9004f573755aa3b))
* Add description ([19e9c79](https://github.com/glowbuzzer/gbr/commit/19e9c791e966feba12e10ad70f858e1904ecee11))
* Add ethercat types ([39ab4ac](https://github.com/glowbuzzer/gbr/commit/39ab4acaf4a7652b6dc0a4c843880500dffeedfc))
* add facet config to drives-fsoe ([4ff0942](https://github.com/glowbuzzer/gbr/commit/4ff09426b6c4a3618dd552f04f4fd338ba6aaab6))
* add frame edit to config tabs, and make first frame readonly ([5e6c522](https://github.com/glowbuzzer/gbr/commit/5e6c52274451067e832095044f8090ea295d8b3d))
* Add FSOE fault cause ([ebce22c](https://github.com/glowbuzzer/gbr/commit/ebce22cf89ae9c5390911dda1607aa0c33675d9a))
* Add glb download of 3d scene ([5671bcc](https://github.com/glowbuzzer/gbr/commit/5671bccf8c9b3f2b5ab8837116db02bf74ba5b64))
* add ibt-fsoe-l project ([e6ab288](https://github.com/glowbuzzer/gbr/commit/e6ab2889623f935b603f33759ef329e234df7e76))
* Add key ([86eab9d](https://github.com/glowbuzzer/gbr/commit/86eab9d1def3aee224b8a46b7297b93ce69b2718))
* Add Name and Description ([bb3e845](https://github.com/glowbuzzer/gbr/commit/bb3e845c3025ba652cca831be5593e8ab1799028))
* add option for standalone (no GBC) GlowbuzzerStandaloneApp.tsx ([d93d6c3](https://github.com/glowbuzzer/gbr/commit/d93d6c31f731e95408dfc4495a0d56849ecf79ed))
* Add resolveJsonModule ([1868f52](https://github.com/glowbuzzer/gbr/commit/1868f52af35c2de23640da65944287a2283cb9b2))
* add standalone app example ([c1716c0](https://github.com/glowbuzzer/gbr/commit/c1716c0a980a95048ab113385274eed8a33ecbff))
* Add test rotary switch ([1dd552c](https://github.com/glowbuzzer/gbr/commit/1dd552c326edcbf1e94176d45ae427f23ad66bfe))
* Add virtual hmi prototype ([bd0f2af](https://github.com/glowbuzzer/gbr/commit/bd0f2af83d1f09657d010dc3a90f33cef15cbd2c))
* Add visual guard for various states and clean up config tile layouts ([5e852ab](https://github.com/glowbuzzer/gbr/commit/5e852ab9cc57a9fd2911927a890dc2608d54c670))
* add way to put safety inputs into 'good' state in sim mode ([811ba1a](https://github.com/glowbuzzer/gbr/commit/811ba1a54117374af60f6bad254e83e34fb2a2b9))
* Allow overriding of standard and safety dins ([7082cf8](https://github.com/glowbuzzer/gbr/commit/7082cf8d4bd3d45a3c17ae17f0fc79ce1f939f9f))
* clean up example standalone app ([15827bc](https://github.com/glowbuzzer/gbr/commit/15827bca5a99f5620eb2eeb2c78036644c286e96))
* decrease status frequency ([a3a1086](https://github.com/glowbuzzer/gbr/commit/a3a108642c9bc4113525f94c5d9d8aa521451381))
* Ensure empty array is returned if not defined ([752a5dd](https://github.com/glowbuzzer/gbr/commit/752a5dd84682f7c7aa3fdfc21942b152b8dcd4be))
* Ensure empty array is returned if not defined ([c762ea9](https://github.com/glowbuzzer/gbr/commit/c762ea9bd8b17adfd1c2f024d0ae8e27fb36e38d))
* Ensure empty array is returned if not defined and add modus dout ([2e81a40](https://github.com/glowbuzzer/gbr/commit/2e81a408398fa75982038e519afe82481e42383c))
* Ensure empty array is returned if not defined and add modus iout ([9d9c39e](https://github.com/glowbuzzer/gbr/commit/9d9c39e152ea7ecb26bb6e555507fb2f79baba8d))
* ensure static app config specifies machine name ([052a562](https://github.com/glowbuzzer/gbr/commit/052a56290f25bf6a66a30106c4cd266b31bd03d5))
* ensure user management disabled when not configured and improve pouchdb log messaging ([8acb896](https://github.com/glowbuzzer/gbr/commit/8acb896ab3317e59acb78adf594de2b4299db64e))
* Expand tools data, add new file request ([d5ed2ac](https://github.com/glowbuzzer/gbr/commit/d5ed2ac5ba0f3a488f7cdac976582ea5d854075a))
* export status tray items ([ccf0d03](https://github.com/glowbuzzer/gbr/commit/ccf0d0392c4bb1ce0124a315ef6544d2cfcf1864))
* fix compile error ([e65dd2a](https://github.com/glowbuzzer/gbr/commit/e65dd2a6379c8590118b5bf6904c0cb8ecec67e9))
* fix compile issue in GlowbuzzerStandaloneApp.tsx ([dd3227e](https://github.com/glowbuzzer/gbr/commit/dd3227e834f86b1b9a1177df92da92a88b754d4d))
* fix component doc generation issue ([ce86c5c](https://github.com/glowbuzzer/gbr/commit/ce86c5c14b568d4a19b919b24963b825315c84b9))
* fix doc comment ([c7d2aff](https://github.com/glowbuzzer/gbr/commit/c7d2aff0558a26e5b8204c037c3dc3ed8dd65041))
* fix double connection issue ([e6ab288](https://github.com/glowbuzzer/gbr/commit/e6ab2889623f935b603f33759ef329e234df7e76))
* fix enum use ([d4e0351](https://github.com/glowbuzzer/gbr/commit/d4e03519fd45804dcf855d90d423de4cc4877d34))
* fix gbc.ts issue ([9466b6c](https://github.com/glowbuzzer/gbr/commit/9466b6ceec363c773d458c31ea7b80ff237fcfab))
* fix issue in StatusTrayModeSwitch.tsx ([cec1303](https://github.com/glowbuzzer/gbr/commit/cec13033579618ff0e3a5f326b1a520be0cf5d2f))
* fix local references to @glowbuzzer/store ([4de4eaf](https://github.com/glowbuzzer/gbr/commit/4de4eafdb92a7d091df6a7c8997a3313b91705c5))
* fix missing property in DockPerspectiveLayoutProvider.tsx ([6d7f85d](https://github.com/glowbuzzer/gbr/commit/6d7f85df204ff1f3cff5597d2a4d03fc12036b47))
* fix typescript build issues (component per tsx file) ([014d72c](https://github.com/glowbuzzer/gbr/commit/014d72c71c0bbd9510d2a4b100c0914ea05355e4))
* fix up build and verify issues ([db35f9c](https://github.com/glowbuzzer/gbr/commit/db35f9cf502341f4fd8582fa9969e2dac0934f2c))
* fix up compile and component doc errors ([015db65](https://github.com/glowbuzzer/gbr/commit/015db652cb1d683d6e304cce71e12a63aa4f3e98))
* fix up the test for fro changes ([cbfc494](https://github.com/glowbuzzer/gbr/commit/cbfc49458b314836b0ef51c110e5538ceae20c86))
* fix verify build issue ([358efda](https://github.com/glowbuzzer/gbr/commit/358efda1c4bf1c2c59367949d15fa590ee7c81b5))
* Formatting of response payload ([1179329](https://github.com/glowbuzzer/gbr/commit/1179329db9bef7bfb9bb2aeeb4e612620bbadeea))
* hard code local pouchdb for awtube-l2 example ([936eb00](https://github.com/glowbuzzer/gbr/commit/936eb001fabdaabd55a8c1b68d9d673768f12053))
* Improve feedrate override tests ([52ff176](https://github.com/glowbuzzer/gbr/commit/52ff176f5fdee58b7f300797775f41af3f53f462))
* Initial work on IBT modes ([dbf85f2](https://github.com/glowbuzzer/gbr/commit/dbf85f2bc3fff214d3b94bec3a397c5e1a878437))
* Invert safeStop signal ([ca75c21](https://github.com/glowbuzzer/gbr/commit/ca75c21787453b6011e43b2f36db95c707481972))
* lazy load PouchDB ([2385b5a](https://github.com/glowbuzzer/gbr/commit/2385b5a9841f4e7e95396f4a83478d90310f6d59))
* make ready 1.14.0 release ([55138e9](https://github.com/glowbuzzer/gbr/commit/55138e913bdd65b005c71de5868537fc9b79641c))
* minor changes to handling of local/app config to support gbc[#140](https://github.com/glowbuzzer/gbr/issues/140) ([8a08d7e](https://github.com/glowbuzzer/gbr/commit/8a08d7e53d0caa10e2821215a33a62d6ffbd6750))
* minor refactorings and build fixes ([9cb4ff3](https://github.com/glowbuzzer/gbr/commit/9cb4ff3b3da90be7a1e8604353d76e15a7b8c2cc))
* modify envelope viz project ([bfb4994](https://github.com/glowbuzzer/gbr/commit/bfb4994b3662274d406e56372a65418acd115450))
* reduce limits ([aa3655f](https://github.com/glowbuzzer/gbr/commit/aa3655fabe575ab5845eeab76b60ec20efa61afb))
* refactor dock tile definitions plus other changes ([0d18c85](https://github.com/glowbuzzer/gbr/commit/0d18c85e4e921a6af11f445b4934eaec02babb6e))
* refactor tests to avoid use of config files on disk ([0602bb7](https://github.com/glowbuzzer/gbr/commit/0602bb721b13154c547f5bc827e5e3821da33b41))
* refactor tsconfig files ([dbf85f2](https://github.com/glowbuzzer/gbr/commit/dbf85f2bc3fff214d3b94bec3a397c5e1a878437))
* remove codesandbox files ([0789dc3](https://github.com/glowbuzzer/gbr/commit/0789dc33d29b43419b93ac9c64550fa8e4e6379b))
* remove connect tile ([b0755a9](https://github.com/glowbuzzer/gbr/commit/b0755a9e3a0bf63b6639f6c3bf3706b877354658))
* remove duplication of awlib code ([c87e83c](https://github.com/glowbuzzer/gbr/commit/c87e83cf55566cc68b527efe1182fe76637681bb))
* remove GbcVersionPanel ([5e4226a](https://github.com/glowbuzzer/gbr/commit/5e4226aade3ae8e94877e25672293b5e4f5d0bca))
* Remove old versions tile ([56b7246](https://github.com/glowbuzzer/gbr/commit/56b724673a40ae0afa28c2bbc75e7ea1831d4115))
* Remove old versions tile ([0143df6](https://github.com/glowbuzzer/gbr/commit/0143df65df1b8e79bce33f40a674ab5ce0fe25c1))
* Remove redundant code ([e22833e](https://github.com/glowbuzzer/gbr/commit/e22833e75f3aecd022b8d78357b766225aafe2eb))
* Remove safety tile ([0717868](https://github.com/glowbuzzer/gbr/commit/0717868d07fabc2b2aae45ce7048432cc773a8be))
* Remove safety tile ([ab9e635](https://github.com/glowbuzzer/gbr/commit/ab9e635adf02f87037bc4e46d0afcf04cdfdee99))
* remove template layout and build columns dynamically ([a321c7b](https://github.com/glowbuzzer/gbr/commit/a321c7b99d1f6aa906313b8a9e8281d7404491a1))
* remove use of useMotionEnabled in joint jog tile ([3c4dff1](https://github.com/glowbuzzer/gbr/commit/3c4dff1174e39c53e161d1afb3b334cad16319be))
* remove window.global hack from vite config ([618c0f4](https://github.com/glowbuzzer/gbr/commit/618c0f485ac597877c9fd116e3c5381e5ca8a6f4))
* remove window.global PouchDB hack ([34e8f68](https://github.com/glowbuzzer/gbr/commit/34e8f68cbb78521e229c5f8098786a2ac95724eb))
* rename automationware to ibt ([e6ab288](https://github.com/glowbuzzer/gbr/commit/e6ab2889623f935b603f33759ef329e234df7e76))
* Rename emstat to diagnostics ([284899b](https://github.com/glowbuzzer/gbr/commit/284899b64eb839fd2735d310ceaf8119c6ca2b37))
* rename UserCapabilityRegion.tsx ([3d00328](https://github.com/glowbuzzer/gbr/commit/3d0032862aa1eb3af1109824ae4360f2ab2556a7))
* shorten import ([9768ca5](https://github.com/glowbuzzer/gbr/commit/9768ca52bb3e7d4aba6fe75dee357ae8709c933c))
* small tweaks to safety handling ([e6ab288](https://github.com/glowbuzzer/gbr/commit/e6ab2889623f935b603f33759ef329e234df7e76))
* Split emstat into safety and non-safety ([b294566](https://github.com/glowbuzzer/gbr/commit/b294566096559867d7fbb08105c7fdfa533ee8e2))
* split up hooks to reduce unnecessary re-renders ([b30ee6b](https://github.com/glowbuzzer/gbr/commit/b30ee6ba44c6d970502fdd4f75ef133272aa08d2))
* support alias in override vite config ([814e0ec](https://github.com/glowbuzzer/gbr/commit/814e0ec2537d37fefcfe67861fee959f857c866b))
* tweaks to scara demo ([1fcaa32](https://github.com/glowbuzzer/gbr/commit/1fcaa323dfd34faa5424a58735b3353b13873d80))
* Update awlib ([67e1bee](https://github.com/glowbuzzer/gbr/commit/67e1bee58488f23fc07456c7b6aea96f22174056))
* Update awlib ([1cdcbc3](https://github.com/glowbuzzer/gbr/commit/1cdcbc3b52a99395b93e13bd351849b8a9a99d35))
* Update config tabs ([ac654e1](https://github.com/glowbuzzer/gbr/commit/ac654e1cc7e7e4b5060e3074ebf6e24f411468bd))
* Update config to use conditional display in op en ([2f058db](https://github.com/glowbuzzer/gbr/commit/2f058dbc4279b060f22815b663d035191a75ed66))
* Update diagnostics and split into tabs ([0232322](https://github.com/glowbuzzer/gbr/commit/02323228ee2030e6421deabf7235b462b956e7cf))
* Update Drives FSoE project for modes ([5eae38a](https://github.com/glowbuzzer/gbr/commit/5eae38a34f27367c9e6db91a9b2f3ceba559cfb6))
* Update EtherCat config read SDOs with better payload handling ([7405a34](https://github.com/glowbuzzer/gbr/commit/7405a34bda83498c695e164919aeb788e6eb3698))
* Update FSoE drives project ([b35f92f](https://github.com/glowbuzzer/gbr/commit/b35f92fc38d5ab6dcf0346949c3595ab8c94c056))
* Update import ([95aa0c5](https://github.com/glowbuzzer/gbr/commit/95aa0c52ce4fff173198d9e473e4a88e6e14eaa2))
* Update io test tiles ([2f124ee](https://github.com/glowbuzzer/gbr/commit/2f124ee2373169f20f4dceb3fa2631cd4a63db09))
* Update IO tiles with tooltips ([b3b19bf](https://github.com/glowbuzzer/gbr/commit/b3b19bf061b47ef53bd8800bfd42b12201b9f385))
* Update messaging ([1bbd864](https://github.com/glowbuzzer/gbr/commit/1bbd8642b37525f63671239f43d68364c439affa))
* update readme ([0e07d2e](https://github.com/glowbuzzer/gbr/commit/0e07d2ee8d4cd065b1c37b479d8e514351512cff))
* Update Safety IO tiles with new descriptions ([ece0064](https://github.com/glowbuzzer/gbr/commit/ece0064c6639037b9b83759b3b10598223a5e6c2))
* Update safety tab to include emstat data ([a622ea5](https://github.com/glowbuzzer/gbr/commit/a622ea50610fafca0fc59f7ebaabb5fb5e72e565))
* Update slavecat json ([419488d](https://github.com/glowbuzzer/gbr/commit/419488de7905145a27b38a984bd17cebda82b6b8))
* Update styles ([7fb521a](https://github.com/glowbuzzer/gbr/commit/7fb521ace38a5348f98ddca3882482e66b45784a))
* Update tile to remove override and better ui ([e106ef8](https://github.com/glowbuzzer/gbr/commit/e106ef89fc8df1191c74644d1c91d7d941d91252))
* update versions in github action yaml files ([cf21973](https://github.com/glowbuzzer/gbr/commit/cf219733b59607aaa0d5524279a43911544c33fc))
* use frozen lockfile in verify-build.yml ([7fa4386](https://github.com/glowbuzzer/gbr/commit/7fa438668d4c3d2734440d60bebca73813d5988e))
* use known tsc version in build.mjs ([02f2e89](https://github.com/glowbuzzer/gbr/commit/02f2e89307dd66af29d234873b93e53427f8cfcd))
* use remote gbdb store ([9a6b6a6](https://github.com/glowbuzzer/gbr/commit/9a6b6a62d6b670f4c6892f130f9b735a469c7c43))
* work on safety states and modes ([438f052](https://github.com/glowbuzzer/gbr/commit/438f0528e6ab4542b10190601fbc27f36cc3bb88))

## [1.13.1](https://github.com/glowbuzzer/gbr/compare/v1.13.0...v1.13.1) (2024-05-25)


### Bug Fix

* **#194:** Fix PrecisionInput editing issues ([37efd85](https://github.com/glowbuzzer/gbr/commit/37efd850f34cb3d4c5ab03a51f9ece0ab2534214))


### Chore

* ensure model load uses local draco wasm ([51079ae](https://github.com/glowbuzzer/gbr/commit/51079aecd61e1302ea5e7cbb2a106bce58ea5cef))
* increase timeout ([142fb80](https://github.com/glowbuzzer/gbr/commit/142fb8063df218a88a660d84815816f39fd55761))
* increase timeout ([2113c06](https://github.com/glowbuzzer/gbr/commit/2113c063e2025f50e39ec9a9794ed22072cf31bb))
* remove deprecated use of send streaming function ([2731cd7](https://github.com/glowbuzzer/gbr/commit/2731cd78859751f42fbc2eb15a8efb33e6a55112))

## [1.13.0](https://github.com/glowbuzzer/gbr/compare/v1.12.0...v1.13.0) (2024-05-22)


### Feature

* **#153:** Flow Maker (no code) feature ([89c8839](https://github.com/glowbuzzer/gbr/commit/89c883967073f6ca5c7dba84938daca3c6f90ec1))
* **#159:** Runtime mode for flow maker ([77b698a](https://github.com/glowbuzzer/gbr/commit/77b698ad5ab69c0c063217043ab6b8148c57ea61))
* **#160:** Ability to override inputs during development ([77b698a](https://github.com/glowbuzzer/gbr/commit/77b698ad5ab69c0c063217043ab6b8148c57ea61))
* **#161:** Hand guided mode initial version ([77b698a](https://github.com/glowbuzzer/gbr/commit/77b698ad5ab69c0c063217043ab6b8148c57ea61))
* **#165:** External integration http callout to flow maker ([d1d534f](https://github.com/glowbuzzer/gbr/commit/d1d534f5e8d77cecf1ad2225578d4220ec9b1eff))
* **#168:** Add persistence feature ([6783531](https://github.com/glowbuzzer/gbr/commit/67835312a88f1db8ecc7d7339167b5385f6b20bb))
* **#169:** Allow extra app-specific content in the status bar ([d618d3e](https://github.com/glowbuzzer/gbr/commit/d618d3e777586014d8ca76b2896b77771529d5bf))
* **#171:** gbdb auto-save feature ([75e3c88](https://github.com/glowbuzzer/gbr/commit/75e3c882b0e38b9a16b4072ea63e4cfcf93b61ef))
* **#173:** gbdb import/export in console ([f915d38](https://github.com/glowbuzzer/gbr/commit/f915d3853a4856249b321f63badf932df771b6cf))
* **#175:** Make connect tile optional ([7f4f0af](https://github.com/glowbuzzer/gbr/commit/7f4f0af01f81022212ea67647a9299b9467eea60))
* **#176:** Support for gbdb hidden/singleton facets ([7f4f0af](https://github.com/glowbuzzer/gbr/commit/7f4f0af01f81022212ea67647a9299b9467eea60))
* **#180:** Add tool config editor ([26b1f8e](https://github.com/glowbuzzer/gbr/commit/26b1f8ee69638fcff43ec89fd59e5ecb3aaefbc0))
* Add awtube-envelope app ([2718ef2](https://github.com/glowbuzzer/gbr/commit/2718ef23eb206f5eafaad6ff1fa0e31748f3b822))
* Add monitoring to track latency between HMI and GBC ([89c8839](https://github.com/glowbuzzer/gbr/commit/89c883967073f6ca5c7dba84938daca3c6f90ec1))
* add payload tile ([2893886](https://github.com/glowbuzzer/gbr/commit/2893886a9a2f2ac8fef83a9b349067caabd65546))
* Better dock tile resize on touch devices ([0d3b668](https://github.com/glowbuzzer/gbr/commit/0d3b66833ffabfd00d281daa5274deea2964a1b4))


### Bug Fix

* **#149:** fix issue with useTrace hook ([ffc9e92](https://github.com/glowbuzzer/gbr/commit/ffc9e92fde9c915a507720a7778033987b2c962e))
* **#151:** fix issue with zerog tile inverted enter/exit button ([a2590fd](https://github.com/glowbuzzer/gbr/commit/a2590fd4c3af6aee70979c450c58750ae35d3866))
* **#156:** Sort telemetry domains correctly ([8961a80](https://github.com/glowbuzzer/gbr/commit/8961a8087589b74943971d457ce0ca76ef1847cd))
* **#166:** Disable propogation of touch events to prevent select (touch jog control issue) ([36a83aa](https://github.com/glowbuzzer/gbr/commit/36a83aa3101e91e5c2d21345bbc01cee8bd9b96d))
* **#167:** Support status bar and status tray in DockPerspectiveLayoutProvider.tsx ([6783531](https://github.com/glowbuzzer/gbr/commit/67835312a88f1db8ecc7d7339167b5385f6b20bb))
* **#172:** Remove load/save from config slice ([57a3ec4](https://github.com/glowbuzzer/gbr/commit/57a3ec417fe95931ade3c7c4ba9520f1f507abb9))
* actually use the request text in GbemRequestTab.tsx ([d3e210e](https://github.com/glowbuzzer/gbr/commit/d3e210e714c922e362351f15c88ad556bcbb558e))
* bug in configEqual comparison when one config is undefined ([26d3104](https://github.com/glowbuzzer/gbr/commit/26d3104fc3287d6c23a8063c42b88506237eddbe))
* don't try to merge configs below top-level ([96ee23f](https://github.com/glowbuzzer/gbr/commit/96ee23f91b0d7d9eb7306e384d10da6fc272989c))
* Fix incorrect MoI properties ([933d58c](https://github.com/glowbuzzer/gbr/commit/933d58c17556cb65ef8dadf487c06ac51a1d9ec5))
* incorrect min value calc in PrecisionInput.tsx ([00a8303](https://github.com/glowbuzzer/gbr/commit/00a8303e27be589be6041a9c8de53b3af3fe4812))
* Issue with switching kins in jog joint panel ([335a64d](https://github.com/glowbuzzer/gbr/commit/335a64da111406786cef17e0d1fc3953dffe1c54))
* issues with touch controls on tablet ([b1cf0c5](https://github.com/glowbuzzer/gbr/commit/b1cf0c576c89e846d2c2ed881ca9823f435460ab))
* move points from points slice to config slice, same as frames ([e9abdb5](https://github.com/glowbuzzer/gbr/commit/e9abdb5a368606268c35f65c8be49c9ed7fb6faf))
* status bar needs to be inside DockLayoutContext ([1c56621](https://github.com/glowbuzzer/gbr/commit/1c566213a4fab5bb5d8b4762d53d97543090f032))


### Chore

* add basic support for status tray to convmc example ([76f987b](https://github.com/glowbuzzer/gbr/commit/76f987b9f806f11e72839002d204aa8d7954205e))
* add events lib to keep pouchdb happy ([c56d203](https://github.com/glowbuzzer/gbr/commit/c56d2036cbe8c552be98ec058a6153eb41ca25de))
* add script to show latest git tags by date ([f4bd853](https://github.com/glowbuzzer/gbr/commit/f4bd8539fa1cf5236251895af354992fae43e15d))
* add shrink-wrap.mjs bundler ([f4e7f3b](https://github.com/glowbuzzer/gbr/commit/f4e7f3bf0f9436f794922cdef3165814b4b12949))
* Add synapticon slave state processing ([f4431c0](https://github.com/glowbuzzer/gbr/commit/f4431c0cd86f8725817bb4fb4c8fac37221ad087))
* add teeth models to stewart platform demo ([3bd8796](https://github.com/glowbuzzer/gbr/commit/3bd8796673146db99d7d786d37e73ea851fae33f))
* Add window.global to script ([bdb0851](https://github.com/glowbuzzer/gbr/commit/bdb085117b8dc06df720e1e91fac6fefd7097cae))
* create awtube-l2.json example config ([84b0bee](https://github.com/glowbuzzer/gbr/commit/84b0beeb561e5d789b909efcc8994a8c9e187041))
* create machine_limits.ini example file ([6b7ad1f](https://github.com/glowbuzzer/gbr/commit/6b7ad1f6b0d11506eb756fa89990c75c3e7178b5))
* export all from gbdb util.ts ([6ae3a77](https://github.com/glowbuzzer/gbr/commit/6ae3a77742f850cd4b78718a212307660955209a))
* export DevInputOverridesTile ([727bcf6](https://github.com/glowbuzzer/gbr/commit/727bcf666b48c177c465be00e83385658462ce05))
* export some utility components ([d5ba514](https://github.com/glowbuzzer/gbr/commit/d5ba5145c2f592419fa5e47106ccf227fba0c150))
* factor out CartesianPositionEdit.tsx and expose some utility components ([e33d2dd](https://github.com/glowbuzzer/gbr/commit/e33d2ddb85ff867dd49c9b34ea3fe209f4bdebc8))
* fix awtube-variable page load ([96fcd14](https://github.com/glowbuzzer/gbr/commit/96fcd142b819cf82292c7555726c5df59f5cdb75))
* fix docktilelayout with perspective ([9bccc63](https://github.com/glowbuzzer/gbr/commit/9bccc63a9d27a2f7037d4b659bfe31b81db6dfc5))
* fix import ([50ab8fa](https://github.com/glowbuzzer/gbr/commit/50ab8fa829111a824890d2e657670ba9990be422))
* fix import ([de020bc](https://github.com/glowbuzzer/gbr/commit/de020bcb1cd3774b4368984b3fa7e5fcaf49813a))
* fix import issues ([e230e3a](https://github.com/glowbuzzer/gbr/commit/e230e3a8dd16b64911db22d11bb20342d9ceee51))
* fix react docgen issue ([ea32cb0](https://github.com/glowbuzzer/gbr/commit/ea32cb086cdbbd363ed1636521ef79f348fb3603))
* fix up cnc app config.ts ([0ea9bed](https://github.com/glowbuzzer/gbr/commit/0ea9bed2db6da2b45f55e5c6d6e8ef0ac1b7c928))
* fix wrong import ([63082a7](https://github.com/glowbuzzer/gbr/commit/63082a7d8d5407e91bdbc01da762582fee7de3f3))
* improve trace handling and tooltips ([ec41c25](https://github.com/glowbuzzer/gbr/commit/ec41c25ac591dc7a3c8727ebe995684e9a950e4c))
* modify .gitignore ([71c0c07](https://github.com/glowbuzzer/gbr/commit/71c0c0766db9901802b2a89abc4ef91f790cc296))
* new config edit tile with tabs for config and request/response - work in progress ([f258b6f](https://github.com/glowbuzzer/gbr/commit/f258b6fefc804163537de4906c12f7dda3e48d03))
* refactor and comment flow maker runtime code ([5073682](https://github.com/glowbuzzer/gbr/commit/5073682ebb15fffb0f3482e086a48da07072f769))
* Remove din definition that was overwriting other dins ([5029223](https://github.com/glowbuzzer/gbr/commit/5029223d7d2b02b373d41837bdc3919868c5e51c))
* remove unnecessary logging ([54c2b6e](https://github.com/glowbuzzer/gbr/commit/54c2b6ef04970378bdbaedfda37f13a1910d1968))
* remove unnecessary logging ([37b0fd9](https://github.com/glowbuzzer/gbr/commit/37b0fd97189d47f322571d4b47b3a9f550e7c444))
* remove unnecessary logging ([d98ab5d](https://github.com/glowbuzzer/gbr/commit/d98ab5d5a2e6410f5926aca391c1fc88a8e33d86))
* resize touch controls in container ([b1cf0c5](https://github.com/glowbuzzer/gbr/commit/b1cf0c576c89e846d2c2ed881ca9823f435460ab))
* status bar tweaks ([c27e235](https://github.com/glowbuzzer/gbr/commit/c27e2357a3d1feb179ea8436a605fce5251efafc))
* tweak awtube-l2 config.ts ([9e68835](https://github.com/glowbuzzer/gbr/commit/9e6883504a815cc3e510627ecae371aa0cbb7fbc))
* tweaks to awtube-l2 demo ([46c331d](https://github.com/glowbuzzer/gbr/commit/46c331d823f15aedda00bbc8e5ae312731f46d17))
* Update awlib ([0d346bd](https://github.com/glowbuzzer/gbr/commit/0d346bde56bee4acc369c5f711b5deb3db7f99df))
* update awlib hash ([6ca8423](https://github.com/glowbuzzer/gbr/commit/6ca8423533c92cfcff563c200da6e49c7e2a68e1))
* update awlib hash ([fc66f3d](https://github.com/glowbuzzer/gbr/commit/fc66f3dc2566ebfc131edd56e59692eacf9ae65e))
* update drives application to use gbdb facets ([098fc44](https://github.com/glowbuzzer/gbr/commit/098fc445617277436bf68db4ba10d4cbeaf3fdd2))
* update gbc.ts ([4de256e](https://github.com/glowbuzzer/gbr/commit/4de256eb28f6b4db935e10eb1b43b5b9095a8643))
* Update J25 params ([dc16e4a](https://github.com/glowbuzzer/gbr/commit/dc16e4adc07d212bc857d7be071c6fac9398a252))
* Update L2 friction params ([41bdd53](https://github.com/glowbuzzer/gbr/commit/41bdd53dbe65ec80015280ee2bd4c49cdc752e5c))
* update node version ([de75bab](https://github.com/glowbuzzer/gbr/commit/de75baba58e55e6250d2769d561a323478b71208))
* update PNPM version ([b397891](https://github.com/glowbuzzer/gbr/commit/b39789175b93041734fdfdcb20f1f0f38b79eb17))
* Update Safety tile ([d098369](https://github.com/glowbuzzer/gbr/commit/d09836963285920c03b5ff53602c36a6f8e0fbff))
* Update to use gbdb ([64ca5dc](https://github.com/glowbuzzer/gbr/commit/64ca5dc7ed5f7d226c3f24f2173372a869f0a077))
* Update to use gbdb ([d73666b](https://github.com/glowbuzzer/gbr/commit/d73666b379539ca8beec78a235a0e83a78915c07))

## [1.12.0](https://github.com/glowbuzzer/gbr/compare/v1.11.0...v1.12.0) (2024-02-14)


### Feature

* **#102:** Support FSoE safety ([7cddf87](https://github.com/glowbuzzer/gbr/commit/7cddf8730c8c38e2797a40c20d275c4105c341b3))
* **#134:** Ability to save and reload telemetry ([9cbe9f2](https://github.com/glowbuzzer/gbr/commit/9cbe9f23f5ec2831e698e005296ddc64cf704560))
* **#135:** touch-enabled jog controls ([6549960](https://github.com/glowbuzzer/gbr/commit/65499600adfd6905c16d1107bd4f2906081ae8e6))
* **#137:** Allow editing of points and frames ([8c5f559](https://github.com/glowbuzzer/gbr/commit/8c5f559e7a0a2ab72e6dad3d738221fbe0e46241))
* **#140:** Add status bar and status tray with notifications ([3770c7e](https://github.com/glowbuzzer/gbr/commit/3770c7ed0e04f9eb63a6f925bd024ea2f7653f26))
* **#142:** Download drive logs in EmStatTile.tsx ([ee15a1b](https://github.com/glowbuzzer/gbr/commit/ee15a1b75e1546616c39acf01e4df663a39ec3b6))
* **#143:** Serial communications support ([61ef8da](https://github.com/glowbuzzer/gbr/commit/61ef8daa90d85ce52e53ba8a7652fab5c11eeb18))


### Bug Fix

* **#132:** Issue with forward references in frame config ([e523d59](https://github.com/glowbuzzer/gbr/commit/e523d59df513e6e0a9078e8d8b4b6d0c26a64cd6))
* **#138:** Fix frame hierarchy editing ([8c5f559](https://github.com/glowbuzzer/gbr/commit/8c5f559e7a0a2ab72e6dad3d738221fbe0e46241))
* **#144:** control effort not appearing in telemetry tile ([6749478](https://github.com/glowbuzzer/gbr/commit/67494789d1eb90cc3552631b81ee27ea9d285fc0))
* avoid early return in useSerialCommunication as it causes different hook count error ([e463eb1](https://github.com/glowbuzzer/gbr/commit/e463eb1a0fa3ad1d3aff505861bcef4ea01d4b6b))
* export new serial comms components from controls project ([1c3bea2](https://github.com/glowbuzzer/gbr/commit/1c3bea27ddcdd4634dd84dbff6199081ae65489b))
* fix issues with serial comms handling ([5fb68c8](https://github.com/glowbuzzer/gbr/commit/5fb68c8b437221459b0622d1711ed28b0440273e))
* Fix style issue on points display in scene ([5476e4e](https://github.com/glowbuzzer/gbr/commit/5476e4e7b2529e02f73c41426d1435112127f665))
* Only try to send jog activities when connected ([c0f67c2](https://github.com/glowbuzzer/gbr/commit/c0f67c2c575d4e8e55eba680ad9cc237311f19dd))
* remove self-reference in @glowbuzzer/controls ([7c1beaa](https://github.com/glowbuzzer/gbr/commit/7c1beaaf5f706f29085026a97979ab26173df058))
* trigger serial comms effect when entering OP ([bfe1eab](https://github.com/glowbuzzer/gbr/commit/bfe1eabe8b789239ac7784da8001536eb86571e5))


### Chore

* Add back styled sections ([faea89d](https://github.com/glowbuzzer/gbr/commit/faea89de375647f6822944e4dd3cdec573b31159))
* add new activities for unsigned integers and externals ([fc6916d](https://github.com/glowbuzzer/gbr/commit/fc6916d92dbb6990d081f653ea98b2d5bdf6f163))
* add new hooks for unsigned integers and safety inputs, and externals ([fc6916d](https://github.com/glowbuzzer/gbr/commit/fc6916d92dbb6990d081f653ea98b2d5bdf6f163))
* add serial comms to awtube-l2 app ([ea542ad](https://github.com/glowbuzzer/gbr/commit/ea542ad833c3fbf34e0d3858819ca0006342b1b3))
* add spacing between toolbar buttons ([e954b80](https://github.com/glowbuzzer/gbr/commit/e954b801af60cbda73ba89fd5c42325e05e6967c))
* add toggle class to GlowbuzzerIcon.tsx ([9fa6ba7](https://github.com/glowbuzzer/gbr/commit/9fa6ba7735508024389cd8ab9d02316a854f765c))
* cleanup imports ([e6663d3](https://github.com/glowbuzzer/gbr/commit/e6663d3f3a4a8698e56cb1d8facc3c2648338329))
* Correct AW joint config ([c7be552](https://github.com/glowbuzzer/gbr/commit/c7be552e03de2a507b8a6ecdfced02fb444657d4))
* fix AwTube-L dynamics params ([c83dac5](https://github.com/glowbuzzer/gbr/commit/c83dac5db39ec358d85854a25617e5e09ce1cbd4))
* fix component generation and add doc ([13827a5](https://github.com/glowbuzzer/gbr/commit/13827a59ca81bc41eda857f3cdc14f7fa18947c2))
* improve StatusTrayFaults.tsx styling ([4182bc5](https://github.com/glowbuzzer/gbr/commit/4182bc548835799fb758ee3da5c4d9b4d2362430))
* improve style in StatusTray.tsx ([cdafb81](https://github.com/glowbuzzer/gbr/commit/cdafb81656decb5f3ac994ca7b4b684d572f445d))
* make status tray more visible ([778f916](https://github.com/glowbuzzer/gbr/commit/778f916b6b0029624572008491e8666ffed30fb0))
* memoize useFrames hook ([c6922ae](https://github.com/glowbuzzer/gbr/commit/c6922aefcc3074b5224abac815052d1dd26891dc))
* modify default scrollbar style ([2405ccd](https://github.com/glowbuzzer/gbr/commit/2405ccd629edea3e623ada5dbfc6dd82b6786264))
* only allow trigger of drive logs when target is fieldbus and not OP_ENABLED ([d342f27](https://github.com/glowbuzzer/gbr/commit/d342f271812065af61c037c2dc630d32e46f933d))
* Reformat string appearances ([a28a75a](https://github.com/glowbuzzer/gbr/commit/a28a75a598c52e2ba4c4c0cbeabf7d33fb034d9c))
* remove fieldbus layout ([a54c70a](https://github.com/glowbuzzer/gbr/commit/a54c70a42a1ce7a12066bb937da1fd476c976b63))
* rename urdf files ([38a3f34](https://github.com/glowbuzzer/gbr/commit/38a3f3474d09d8bbd651db0638e7024c67e1627d))
* trivial changes to tests ([45785ad](https://github.com/glowbuzzer/gbr/commit/45785ad18f06261ea9a9aaaf01c671f7f64598cc))
* update awlib submodule hash ([9f5b188](https://github.com/glowbuzzer/gbr/commit/9f5b18849ea5c3be1578a8f8868e3f7422985ab5))
* update awlib submodule hash ([6ae7c8c](https://github.com/glowbuzzer/gbr/commit/6ae7c8c8c5a4489f286e0ac97879b8d6cd83a79b))
* update generated gbc.ts ([ff7fc66](https://github.com/glowbuzzer/gbr/commit/ff7fc66b6bdca457ac31b354543986e1a97cf2b7))
* Update restart acknowledge bit number ([eb21ef8](https://github.com/glowbuzzer/gbr/commit/eb21ef8f02d238a884e70dbda5fc010136b5c9e4))
* Update serial comms behavior ([c270f47](https://github.com/glowbuzzer/gbr/commit/c270f4738a3ec7179609a47a57329aeb7a20afb8))
* Update serial comms behavior ([5ec5517](https://github.com/glowbuzzer/gbr/commit/5ec5517355858ec94329b09568f351f1b85a559b))
* Update Slave emergency name in emstat ([bc8e52f](https://github.com/glowbuzzer/gbr/commit/bc8e52f35f2a734ccc1d7a34bae4c52b028f5418))

## [1.11.0](https://github.com/glowbuzzer/gbr/compare/v1.10.0...v1.11.0) (2024-01-04)


### Feature

* Add `execute` method to stream hook (cleaner API for executing activities) ([d9e272d](https://github.com/glowbuzzer/gbr/commit/d9e272dfbf588f5febcc34b361cdb9cbd825bd85))


### Bug Fix

* fix minor type issues ([b575234](https://github.com/glowbuzzer/gbr/commit/b5752346e733a58d1d67b7c6edcf66fd57ec33dd))
* relative toggle issue in CartesianPositionEdit.tsx ([5596db9](https://github.com/glowbuzzer/gbr/commit/5596db9aa7f0655fa35967eda2fdcc87206be2f4))


### Chore

* add extra joint types to aw assets ([4c8840c](https://github.com/glowbuzzer/gbr/commit/4c8840c36a396b0475a34332502b6c0ba2c656a3))
* add InterpolatedMoveTile.tsx ([e9c6ed0](https://github.com/glowbuzzer/gbr/commit/e9c6ed069752b1edd05390591ba4556f0e07eac6))
* add move joints interpolated tests ([b9e88ce](https://github.com/glowbuzzer/gbr/commit/b9e88ceffbe6b57cf463751ea1f0d423910d62cd))
* add optimised glb process ([1fb93d9](https://github.com/glowbuzzer/gbr/commit/1fb93d9c8a1b53a6c60477e49f94acf8ecf0e570))
* add static AwTube L config-static-l.json ([a4d28a2](https://github.com/glowbuzzer/gbr/commit/a4d28a2ad516692bc62b59524ca5f93f1bfa1b9c))
* add suspend-react dependency ([cdad0a8](https://github.com/glowbuzzer/gbr/commit/cdad0a8883dead1ff607695655fe6fa7155e1099))
* add thicker base to AwTube parts.ts ([487782d](https://github.com/glowbuzzer/gbr/commit/487782de37637b55980b367a5573f45d2635cc90))
* change auto install peers option ([86626b8](https://github.com/glowbuzzer/gbr/commit/86626b8e0e4ce3a28452869caec2da3d5882e1ca))
* commit awlib submodule hash ([b6ce4f0](https://github.com/glowbuzzer/gbr/commit/b6ce4f0a0fa5cef74b0d0b138c2b705be9f4172b))
* fix name on publish-packages-beta.yml workflow ([8bee09c](https://github.com/glowbuzzer/gbr/commit/8bee09cf148671e202ae00cb1c4f1196f4ef60d6))
* fix up tests ([da36d82](https://github.com/glowbuzzer/gbr/commit/da36d82204dee9b8505bd3b9266466fef69e061c))
* initial work on move joints interpolated ([e10f9fd](https://github.com/glowbuzzer/gbr/commit/e10f9fdca77363250fe509df606b0427f33eefb9))
* re-build test code ([1efdd08](https://github.com/glowbuzzer/gbr/commit/1efdd08a7c8cd05146b31c7ab4c71536af6ba261))
* remove defunct lib folder ([e1cd27a](https://github.com/glowbuzzer/gbr/commit/e1cd27a51b81acd1c77dc91ccfd07a994f8f2d9b))
* remove fieldbus from config.ts ([a7879fc](https://github.com/glowbuzzer/gbr/commit/a7879fccfbba96f9fc2dcd38aa739aea4954d963))
* remove shadows from DefaultLighting.tsx ([72ea010](https://github.com/glowbuzzer/gbr/commit/72ea010e75f31b23dba9bc11066ba82910dffb23))
* replace timecode with duration in interpolated joint move activity ([0b9e475](https://github.com/glowbuzzer/gbr/commit/0b9e475e109e4e9c1129cadcf8c85187560c1067))
* split out awlib as a git submodule ([1fb93d9](https://github.com/glowbuzzer/gbr/commit/1fb93d9c8a1b53a6c60477e49f94acf8ecf0e570))
* switch to awlib alias ([69b590a](https://github.com/glowbuzzer/gbr/commit/69b590a20fb96e933c67226e761fc3973b4967e9))
* update awlib hash ([fdbcd76](https://github.com/glowbuzzer/gbr/commit/fdbcd76d912a621bb6a6b953348ada8740db894f))
* update AwTube assets ([fab3059](https://github.com/glowbuzzer/gbr/commit/fab30595c43dd358ab6417c693f492c764865210))
* update DH for AwTube L ([b3000c9](https://github.com/glowbuzzer/gbr/commit/b3000c95ec7b3d5fb94a5d549c20900c3cf15ca9))
* update gbc.ts ([6780b9b](https://github.com/glowbuzzer/gbr/commit/6780b9bf1482711c8252178e3e4c1f3ffbad0cf0))
* update urdfviz app for AwTube L ([9ace36e](https://github.com/glowbuzzer/gbr/commit/9ace36e1bc3424b815ae8bcbd6ef91fa32b70e38))
* use suspend-react to load glb files from base64 ([062f2a8](https://github.com/glowbuzzer/gbr/commit/062f2a800c21635f30014511ad77593c439e01d6))

## [1.10.0](https://github.com/glowbuzzer/gbr/compare/v1.9.0...v1.10.0) (2023-11-27)


### Feature

* **#109:** Add actual pos/vel/acc to TelemetryTile.tsx with toggle between modes ([6093435](https://github.com/glowbuzzer/gbr/commit/6093435993f3036bfb4f74fece4574cc2414eac9))
* **#113:** Add configurable AutomationWare awtube robot example ([dd16297](https://github.com/glowbuzzer/gbr/commit/dd162979f575cd68a8a5890a0fcc159378c1185f))
* **#114:** Add liquid handling example ([89d1642](https://github.com/glowbuzzer/gbr/commit/89d164240aa188a9626aa9cc9be1625a4f1449df))
* **#116:** Show torque and vel instantaneous values in joint DRO ([0397209](https://github.com/glowbuzzer/gbr/commit/039720993670a1150bc43f7bd675c2bafa5ca38d))
* **#117:** Improve EtherCAT master tile data and format ([38a7610](https://github.com/glowbuzzer/gbr/commit/38a76102f4d7f1bd80a1e53f6406ca5778b442fb))
* **#117:** Improve EtherCAT master tile data and format ([eb6be4d](https://github.com/glowbuzzer/gbr/commit/eb6be4d4ec86774aae178083816175dd400bf275))
* **#117:** Improve EtherCAT master tile data and format ([7c7fe0c](https://github.com/glowbuzzer/gbr/commit/7c7fe0ca2799f8b7f7c0c45c40eb040bdbb6e111))
* **#121:** Verify GBC version and API schema checksum ([9c154ae](https://github.com/glowbuzzer/gbr/commit/9c154ae81433cde43b5de31ece5879d3ef2f903b))
* **#123:** Improve display of errors in the connect tile ([8404f73](https://github.com/glowbuzzer/gbr/commit/8404f7374b00779b58b4f3790963233d63fb0e95))
* **#128:** Provide diff option in telemetry tile, to show difference between set and act values ([4e11a69](https://github.com/glowbuzzer/gbr/commit/4e11a69d54aa51a711a3748426426e85dca30742))
* **#129:** Enhance telemetry tile ([cc90b62](https://github.com/glowbuzzer/gbr/commit/cc90b62ddf58b12b16a5c703d51f821429b39b2b))
* Ability to overwrite the current config when disconnected ([461ac49](https://github.com/glowbuzzer/gbr/commit/461ac49d16c5f670d800ef0a31968c1999318c17))
* add ability to command torque in DrivesMoveTile.tsx (drives project) ([7554c13](https://github.com/glowbuzzer/gbr/commit/7554c1333e339c05f15801df71e393b73e7f2687))
* add estop status to connect tile ([97464bd](https://github.com/glowbuzzer/gbr/commit/97464bd00784e5a1947b52a5bcd1a815559b6bcb))
* add generic awtube lib for building different awtube configurations ([ca53c95](https://github.com/glowbuzzer/gbr/commit/ca53c956cfe2863181a3631a08c662b0813717ce))
* add instant move to activity builder ([3f1ad68](https://github.com/glowbuzzer/gbr/commit/3f1ad681a74a3c8311d53058d1ea15194500cecb))
* Add torque mode tile ([772f535](https://github.com/glowbuzzer/gbr/commit/772f5359cb557337411d288c64e4f40b9f6c3017))
* add torque radio button to TelemetryTile.tsx ([0397209](https://github.com/glowbuzzer/gbr/commit/039720993670a1150bc43f7bd675c2bafa5ca38d))
* Add types and new tile for EtherCAT master status information ([0a18281](https://github.com/glowbuzzer/gbr/commit/0a182814082ff4fbfa550bf6e7aa97932fce2c60))
* handle simulation only mode in config and connect tile ([1a2dbdc](https://github.com/glowbuzzer/gbr/commit/1a2dbdc857de6759f5d2aa13c33d2cbd4e6585aa))
* Improvements to AW URDF visualizer ([7d87a4d](https://github.com/glowbuzzer/gbr/commit/7d87a4d4333f09888e9eb3b05c41698c5598dcf6))
* update urdf visualiser with latest AwTube model and provide switch between L and L2 size ([e1ca9e0](https://github.com/glowbuzzer/gbr/commit/e1ca9e07a11d5a1ade0afa316f413519a983d480))


### Bug Fix

* **#108:** ensure style-components version match in glowbuzzer template ([9fbdcea](https://github.com/glowbuzzer/gbr/commit/9fbdcea5512872337d10e1207c34db343f2355b0))
* **#115:** show numeric configuration in DRO and dropdown in goto ([4202e67](https://github.com/glowbuzzer/gbr/commit/4202e678db72c8dfd45092ffcf154a1950e67d70))
* **#127:** fix handling of requestedTarget on initial connect and possible undefined heartbeat in heartbeat logic ([b2bf510](https://github.com/glowbuzzer/gbr/commit/b2bf510f49c82c3ee0c76e80f48565ad4f8454df))
* ensure operation mode radio buttons are both disabled together ([e4a9683](https://github.com/glowbuzzer/gbr/commit/e4a9683766e2e4d27cb8f2dafc162ede9ae07e7f))
* fix telemetry torque calc when both set and act selected ([33f0bbd](https://github.com/glowbuzzer/gbr/commit/33f0bbd76d9883437f015ebbbe6392595ce0a326))
* initial target handling on connect ([bfaf599](https://github.com/glowbuzzer/gbr/commit/bfaf5998089fa7e1cd35eafa07c1aa9f743a0d15))
* put children back at tcp of StaubliRobot.tsx ([dab86fc](https://github.com/glowbuzzer/gbr/commit/dab86fcc47e522958ba7404f6755009d411052dc))
* show torque Nm unit label and don't scale value from GBC value ([67c451b](https://github.com/glowbuzzer/gbr/commit/67c451b115f8cd486ae9ea3ce595fc67e59bdd11))
* update telemetry download to use new data generator, and include all set/act data ([5d88aa7](https://github.com/glowbuzzer/gbr/commit/5d88aa7ad8f53de350ef0757f5399d850718587e))
* use correct units when determining red warning on joint DRO ([e33e406](https://github.com/glowbuzzer/gbr/commit/e33e4061f71b34d79067b20b0ed3eb20b1bf9f3a))


### Chore

* add AutomationWare Stewart platform example ([c5e9623](https://github.com/glowbuzzer/gbr/commit/c5e9623c9b39e6e377407bccb869409a3d58554e))
* add AwTube status tile and supporting components ([27d25a5](https://github.com/glowbuzzer/gbr/commit/27d25a552b8836b94570a59165c5b643d35bb675))
* Add digital in/out to drives project ([098ac84](https://github.com/glowbuzzer/gbr/commit/098ac84b0ad837f5d8c49142e01e8947a041c8b5))
* add emstat tile to aw-l20 app ([45f55fc](https://github.com/glowbuzzer/gbr/commit/45f55fcc0f1ba0f8c77cc3952fbb07d85893870b))
* add example estop config to generic app ([97464bd](https://github.com/glowbuzzer/gbr/commit/97464bd00784e5a1947b52a5bcd1a815559b6bcb))
* add inertia triads to urdf visualiser (work in progress) ([f1bf599](https://github.com/glowbuzzer/gbr/commit/f1bf59914b91828ee74e2bd288a1f19c6b5a2deb))
* Add moo to emstat ([7ae8cc7](https://github.com/glowbuzzer/gbr/commit/7ae8cc700b1aeb0c1db389e835d075b221a2c967))
* add more cartesian constraints to piattaforma project ([697c6e0](https://github.com/glowbuzzer/gbr/commit/697c6e0349ee10a288246d7a2a418e6c83e98b9a))
* add nightly-backup.yml ([f044ebc](https://github.com/glowbuzzer/gbr/commit/f044ebcbc4e4052e8bb64308be8034ce5ecac82b))
* add nightly-backup.yml ([61e0e26](https://github.com/glowbuzzer/gbr/commit/61e0e26014d6c076957eccf2ad5cbbd968d59c6a))
* Add oscillating move tile to angled linear delta example ([bb0f602](https://github.com/glowbuzzer/gbr/commit/bb0f602fe2b2518830d2e6eb5b0c63e2a78ea16d))
* add pid parameters to config ([30f7485](https://github.com/glowbuzzer/gbr/commit/30f74850a74e53a1ab79a636fadea624b513342a))
* add points loader to stewart-aw-piattaforma example ([69dd64d](https://github.com/glowbuzzer/gbr/commit/69dd64db1ae56c0d781369baa62944f4cacd06ab))
* add skeleton dictionary to emstat tile ([a4f7095](https://github.com/glowbuzzer/gbr/commit/a4f709540da24d2f5ebcd35da81f381d6bfa45d1))
* add tests for envelope validation ([8e0d3d1](https://github.com/glowbuzzer/gbr/commit/8e0d3d1be758f7fb3a2d8d021e2e1b606ef0ce97))
* add v2 model files ([95fc2a3](https://github.com/glowbuzzer/gbr/commit/95fc2a3afddf6a4fe1ab2ccb57756b27b2246e12))
* Added spherical envelope ([75daa5e](https://github.com/glowbuzzer/gbr/commit/75daa5ec1a05eb4a80cb18e1b266097f5de9cb21))
* Adjust limits on angled linear delta example ([3aa6c04](https://github.com/glowbuzzer/gbr/commit/3aa6c04e5fb6b7d3bcf1835ab3b40ca414110ce5))
* Adjusted spherical envelope ([7dae418](https://github.com/glowbuzzer/gbr/commit/7dae418c567736fae0ce41cb6a9f484e277fef23))
* change heartbeat failure error message ([6955c62](https://github.com/glowbuzzer/gbr/commit/6955c62c3b8d0af4b341a4e59b5f7e8cada4726c))
* change static file location of model files in vite config ([005bf33](https://github.com/glowbuzzer/gbr/commit/005bf3360f070efade0731e9809f916374e6b2f0))
* change to heartbeat frequency expressed in ms ([705a42a](https://github.com/glowbuzzer/gbr/commit/705a42adb10783018593e3fa8c1d436d9929c9ee))
* combined set and offset torques ([b4765dc](https://github.com/glowbuzzer/gbr/commit/b4765dcbc3f19512ec23802da124cfea02b2ca2a))
* commit before automationware refactor ([582c08e](https://github.com/glowbuzzer/gbr/commit/582c08e53c532419c9f47f1c3206044faa7e60cf))
* downgrade typedoc and typescript versions due to compatibility issue ([1f2072a](https://github.com/glowbuzzer/gbr/commit/1f2072af36a0bb7c754bbc1f2df6136efc2b419b))
* finish off nightly backup script and test ([1b8d535](https://github.com/glowbuzzer/gbr/commit/1b8d53540d600025bbff97e60e913f0ff6978731))
* fix relative imports ([1748bab](https://github.com/glowbuzzer/gbr/commit/1748bab4a573bb285ec0e093c15095a6643b3708))
* fix styles.ts ([20c0d07](https://github.com/glowbuzzer/gbr/commit/20c0d071fb7526de775f615628678260281702a8))
* fix typos in emstat tile ([e458e77](https://github.com/glowbuzzer/gbr/commit/e458e77d281a6a70a8005e0f1ad42939207c48c3))
* fix up awtube status tile ([3376d38](https://github.com/glowbuzzer/gbr/commit/3376d384f043be5f404d88a2eac954c30df546ae))
* fix up unit tests ([ecf3d60](https://github.com/glowbuzzer/gbr/commit/ecf3d602a1eaa23ebbe85910017abd15b1187dcd))
* flip J2 limits in AW robot config ([915051e](https://github.com/glowbuzzer/gbr/commit/915051ef37ec5486e4dd4583b0a753927eafa8be))
* improve connect tile layout ([e94baa1](https://github.com/glowbuzzer/gbr/commit/e94baa1c1fb9db3849e8880d6b025f6379dee006))
* improve error display in connect tile ([26ef927](https://github.com/glowbuzzer/gbr/commit/26ef9270606717b586c3ddeb911353d81bce95d6))
* improve telemetry tile scale and visibility handling ([01330ec](https://github.com/glowbuzzer/gbr/commit/01330ecd4f74f97c3aa864e287441df8484f4ec9))
* make nightly backup conditional ([d77d93f](https://github.com/glowbuzzer/gbr/commit/d77d93f63e74fb2a85a072c8ed04f28a4887bc9b))
* make stewart platform demo expose port externally by default ([7ac9e19](https://github.com/glowbuzzer/gbr/commit/7ac9e1909857932a780f1fef463f8ed0df1ba64e))
* make use kinematics hook return THREE types for convenience ([4f60754](https://github.com/glowbuzzer/gbr/commit/4f60754c10e4c28a2b5362915827ca4cb375fd1a))
* minor tweaks and update gbc.ts ([697586e](https://github.com/glowbuzzer/gbr/commit/697586ec36a7db6dfb3d99ab5bf8c33f76c09458))
* move fault cause into gbc.ts ([03a80a3](https://github.com/glowbuzzer/gbr/commit/03a80a39f2ee6f2275a6217bb013e438e5822cd1))
* provide convenience hook to access all digital output states ([af0d68f](https://github.com/glowbuzzer/gbr/commit/af0d68f7ce58fc51154b5c73f83cbeac9e9c21ea))
* refactor automationware code into /vendors directory ([ca53c95](https://github.com/glowbuzzer/gbr/commit/ca53c956cfe2863181a3631a08c662b0813717ce))
* Refactor to remove BasicRobot from controls ([f82679c](https://github.com/glowbuzzer/gbr/commit/f82679c9273f29ed9b59066d0073ce634aedcc0f))
* remove debugging button ([69cf8c4](https://github.com/glowbuzzer/gbr/commit/69cf8c4d0f030066931b6bcb80778b76debef5ef))
* remove fieldbus config from aw-l20 and update gbc.ts ([310d1c5](https://github.com/glowbuzzer/gbr/commit/310d1c5652591435238303f4942319ee19a45945))
* remove fieldbus config from stewart-aw-piattaforma ([15ceb8f](https://github.com/glowbuzzer/gbr/commit/15ceb8f853c3d598dbd8928951efe96c817e1afa))
* remove logging ([5fa9e8b](https://github.com/glowbuzzer/gbr/commit/5fa9e8bc123fd8e238be6ebb88485a3b4ba576c1))
* remove typescript errors ([8b23ad1](https://github.com/glowbuzzer/gbr/commit/8b23ad1e9a26adb965b3d0e03e379c96f9e6bc31))
* rename automationware awtube example project ([9e60d1a](https://github.com/glowbuzzer/gbr/commit/9e60d1a4c84bd0d5aac3430510a8cea24e8e8f90))
* rename machine L20 ([9b5b264](https://github.com/glowbuzzer/gbr/commit/9b5b264d39f555d4c1549599a107bf600a8def7e))
* reorganise automationware directory, add urdf load/visualization ([d81158c](https://github.com/glowbuzzer/gbr/commit/d81158cb43c4a23240cb22dbf1b96a2eca91f08a))
* show error message on reject when uploading config ([1afc2e7](https://github.com/glowbuzzer/gbr/commit/1afc2e7ce502637945e2d6ba0735533f88c98a2a))
* skip unwanted test ([23ccc64](https://github.com/glowbuzzer/gbr/commit/23ccc645f3ec4fda8c4343a0e44a28659152e9dc))
* tweak aw configs ([77b7b06](https://github.com/glowbuzzer/gbr/commit/77b7b063f140d700a7038b7901ce28b337bcdbf8))
* tweak styles ([7b72241](https://github.com/glowbuzzer/gbr/commit/7b7224192fde46746b8205051a4ae1182c91d586))
* update aw-l120 config with inverse dynamics ([a03688d](https://github.com/glowbuzzer/gbr/commit/a03688d4c3826bd0164e92790c4a19a77293a1fd))
* update awtube-l20 config ([a80e1a8](https://github.com/glowbuzzer/gbr/commit/a80e1a88ba87dc5d7d1c65e3bfca9738425be85d))
* update awtube-urdf project ([e667f66](https://github.com/glowbuzzer/gbr/commit/e667f66a63a6a493836adb750b6bf411767fa00b))
* Update config aw ([69e1dcd](https://github.com/glowbuzzer/gbr/commit/69e1dcd9f6e62d01cdeaa281f96dee334eb5060b))
* update config for aw-l20 with latest changes ([7d87a4d](https://github.com/glowbuzzer/gbr/commit/7d87a4d4333f09888e9eb3b05c41698c5598dcf6))
* update gbc.ts ([0d41734](https://github.com/glowbuzzer/gbr/commit/0d417349244ad2dbc2d4b1b5956e49824a418d8d))
* update gbc.ts ([1d88065](https://github.com/glowbuzzer/gbr/commit/1d880654fce7c56140a2ebb39a54fc8e7f2f8a77))
* update gbc.ts ([1269930](https://github.com/glowbuzzer/gbr/commit/12699300a599f30aeb190213d871292aea914867))
* update message processor to handle separate emstat status message frequency ([9bb52f4](https://github.com/glowbuzzer/gbr/commit/9bb52f43b1b6fbb3a4996c02f5aa8852c2dd5c73))
* update node package versions and fix warnings/issues ([cc90b62](https://github.com/glowbuzzer/gbr/commit/cc90b62ddf58b12b16a5c703d51f821429b39b2b))
* update schema from GBC codegen ([ff68ba2](https://github.com/glowbuzzer/gbr/commit/ff68ba2305abcbfe22001dfff1505df0bf69d6c5))
* update tests ([b5928d9](https://github.com/glowbuzzer/gbr/commit/b5928d9e45913f76c3d0279c0464e2e74f3a96e2))
* update to latest awtube model and rename dir ([07222eb](https://github.com/glowbuzzer/gbr/commit/07222ebf9c921c4e541cb7d94076b978dfcd5799))
* update to use new v2 model files ([06c2961](https://github.com/glowbuzzer/gbr/commit/06c29617248118faca012afb2c26c89d00196156))
* Updated AW L20 config ([4e9c71f](https://github.com/glowbuzzer/gbr/commit/4e9c71f0eaabfa54c5e559384542a8f265106868))
* Updated AW-L20 params ([b229987](https://github.com/glowbuzzer/gbr/commit/b229987e5ef90738a70a89c35f06531e2e06e351))
* Updated AW-L20 params ([92d0dc1](https://github.com/glowbuzzer/gbr/commit/92d0dc1064144f1eb38fb213f71214ff761eb7c7))
* Updated AW-tube frames and docs ([f9770d8](https://github.com/glowbuzzer/gbr/commit/f9770d85236dcc02967bb9fcc71a97649b3b40b9))
* Use joint offsets from DH matrix for TX40 ([f82679c](https://github.com/glowbuzzer/gbr/commit/f82679c9273f29ed9b59066d0073ce634aedcc0f))
* use remote config when readonly and warn about local config ([30f7485](https://github.com/glowbuzzer/gbr/commit/30f74850a74e53a1ab79a636fadea624b513342a))

## [1.9.0](https://github.com/glowbuzzer/gbr/compare/v1.8.1...v1.9.0) (2023-07-26)


### Feature

* add rotation interpolation option to arc builder ([1bdd43d](https://github.com/glowbuzzer/gbr/commit/1bdd43ddf905069aa3d839d6838d20e89b4596b4))


### Bug Fix

* add missing peer @babel/core to dependencies.json in template ([baa3e32](https://github.com/glowbuzzer/gbr/commit/baa3e32419825c01b3ba14cb3e16df114030e459))
* fix height of config editor tile ([9470076](https://github.com/glowbuzzer/gbr/commit/94700763306a86e80c58d1b13e213a60c71ca3fa))
* issue with app menu in template ([b65409d](https://github.com/glowbuzzer/gbr/commit/b65409d78ef90b59f619989a355d892a1eb0663e))
* remove unused dependencies ([8624820](https://github.com/glowbuzzer/gbr/commit/8624820961f15ad81103f42464d09babdfc91c76))
* remove unused dependencies ([7ecf36b](https://github.com/glowbuzzer/gbr/commit/7ecf36b06ef1b02b59a442afb93549ac0dd4632c))
* switch to antd reset.css in glowbuzzer template ([dc21ece](https://github.com/glowbuzzer/gbr/commit/dc21ece8c529f3e41353eb7e3a62cdc90f058c6c))


### Chore

* add more tests around tool changes ([5344fa2](https://github.com/glowbuzzer/gbr/commit/5344fa27bfa009bff90a0025c7da68e9f68e7be7))
* finish off path planning ([1bdd43d](https://github.com/glowbuzzer/gbr/commit/1bdd43ddf905069aa3d839d6838d20e89b4596b4))
* improve test framework and re-enable failing tests ([faccb8c](https://github.com/glowbuzzer/gbr/commit/faccb8cc919f8e8ed09010c26a808b44d2d2b4fd))
* path planning checkpoint ([ecba3db](https://github.com/glowbuzzer/gbr/commit/ecba3dba0ed3db75085e64ac252f68509b45f53f))
* reorganise template app ([b65409d](https://github.com/glowbuzzer/gbr/commit/b65409d78ef90b59f619989a355d892a1eb0663e))
* update and pin antd dependencies ([2603da9](https://github.com/glowbuzzer/gbr/commit/2603da910ba295b54b0fa5636777853311aee919))

## [1.8.1](https://github.com/glowbuzzer/gbr/compare/v1.8.0...v1.8.1) (2023-06-30)


### Chore

* add cutter example (wip) ([a03e2fb](https://github.com/glowbuzzer/gbr/commit/a03e2fbfbfe60d2450b307ff243a231bf8ea7ea4))
* update conveyor example ([bc26d67](https://github.com/glowbuzzer/gbr/commit/bc26d6736e1b01d408ce78156573cd1e4c1808e7))
* updates to cnc example app ([4c0c89d](https://github.com/glowbuzzer/gbr/commit/4c0c89d612715df4590356483de0910c350306fb))


### Bug Fix

* issue with staubli example build ([bc26d67](https://github.com/glowbuzzer/gbr/commit/bc26d6736e1b01d408ce78156573cd1e4c1808e7))
* issues with gcode g90 and others ([bc26d67](https://github.com/glowbuzzer/gbr/commit/bc26d6736e1b01d408ce78156573cd1e4c1808e7))

## [1.8.0](https://github.com/glowbuzzer/gbr/compare/v1.7.3...v1.8.0) (2023-06-12)


### Feature

* ability to push new config ([79e158d](https://github.com/glowbuzzer/gbr/commit/79e158d1dffbbc8b06aa07a2a324059ff618f92b))
* add heartbeat to slice status update calls ([c7b72b7](https://github.com/glowbuzzer/gbr/commit/c7b72b779b24831535311d3038a78daa21eb272d))
* add initial automationware example ([79e158d](https://github.com/glowbuzzer/gbr/commit/79e158d1dffbbc8b06aa07a2a324059ff618f92b))
* add optional default camera position ([496ee9a](https://github.com/glowbuzzer/gbr/commit/496ee9aa2fde21f9852a12534b12937c3afea9da))
* add optional label and implicitTransitions to state machine definition (visualisation) ([6f6bdf3](https://github.com/glowbuzzer/gbr/commit/6f6bdf3a80934b2d3594e439572a4cea1316076b))
* add precision buttons to cartesian and joint dro tiles ([169a946](https://github.com/glowbuzzer/gbr/commit/169a94649b0a7ee6645cc930640f96fdddfb21d9))
* dark mode! ([2c22186](https://github.com/glowbuzzer/gbr/commit/2c22186a8ad58d644d881f1cfa318975c2301285))
* improve telemetry tile ([f8c9629](https://github.com/glowbuzzer/gbr/commit/f8c962939ab48b3981be76c4bbaeb3f4181846c7))
* resize telemetry chart according to available height ([84ff23d](https://github.com/glowbuzzer/gbr/commit/84ff23d9fc9a589806095783fad056051d380a18))
* support dark mode set by system ([75d5e54](https://github.com/glowbuzzer/gbr/commit/75d5e54036c450e1f7e7db3effa576b11914c41e))


### Bug Fix

* better connection handling ([79e158d](https://github.com/glowbuzzer/gbr/commit/79e158d1dffbbc8b06aa07a2a324059ff618f92b))
* fix antd 5.x menu warnings ([bb36a9e](https://github.com/glowbuzzer/gbr/commit/bb36a9ed972b8472973f2399f3e5bb71f32f19e9))
* fix sliders and add explanatory note ([6ac1d6b](https://github.com/glowbuzzer/gbr/commit/6ac1d6b2fc3371684238c1cf9c975bb398d42187))
* fix tests and add support for reset/restore joints during test config load ([10ef63d](https://github.com/glowbuzzer/gbr/commit/10ef63ddb3cddb6179d4f6990171678ccad971c2))
* fix up spindle unit test ([3a36b8d](https://github.com/glowbuzzer/gbr/commit/3a36b8d139b46a0d556a9960e92d87f1684b278c))
* fix up Typescript compile issues ([9ba2efb](https://github.com/glowbuzzer/gbr/commit/9ba2efb2e209013a486ac2e1f3dbf289f34a2b02))
* migrate to new esbuild watch api approach ([de25b37](https://github.com/glowbuzzer/gbr/commit/de25b37b76930ad0bc1f5d1980776763708e01f2))
* remove wrong type on theme prop ([74638ef](https://github.com/glowbuzzer/gbr/commit/74638efa101d797a974f3eb13b0c28cc0ee54892))


### Chore

* add menu bar title ([70eb8e2](https://github.com/glowbuzzer/gbr/commit/70eb8e219d884c84d9a4f0f770f0444150a90b24))
* add note about loopback digital output ([eb5862e](https://github.com/glowbuzzer/gbr/commit/eb5862e442981c234696365d42d7cab86781db1b))
* add precision to staubli dance ([51e0576](https://github.com/glowbuzzer/gbr/commit/51e057614bdfbf4e83a5bec4acd2df10916b6419))
* add typedoc verify step ([66d7480](https://github.com/glowbuzzer/gbr/commit/66d7480bcdbf6f8897e5f3978bed7760be594d64))
* change display style for digital input tile ([37708c6](https://github.com/glowbuzzer/gbr/commit/37708c653676020d75379ea5a77c9dc35325574e))
* demo tweaks ([056d335](https://github.com/glowbuzzer/gbr/commit/056d3350b0595eb3daa2a618d6f783559795e93b))
* export GlowbuzzerThemeProvider and provide theme override option ([539fc47](https://github.com/glowbuzzer/gbr/commit/539fc472f93e387718d23111f9e334e88cd377b9))
* Fix laser demo ([f7c1f89](https://github.com/glowbuzzer/gbr/commit/f7c1f89de4cf0da28fb85fcadf8a0618c8fa57c3))
* fix waypoints colors ([7d713de](https://github.com/glowbuzzer/gbr/commit/7d713def0e2d2134691a06cbdfb64e59da9fffd7))
* gbc now sets simulate mode and fro on config load ([46813a0](https://github.com/glowbuzzer/gbr/commit/46813a02c9be06c6073d4ce962b6a8d56b0c2282))
* move cylinder virtual position logic into store extraReducers ([7631ce2](https://github.com/glowbuzzer/gbr/commit/7631ce2fef74b6519d77cb6e61fa3e1b04f41705))
* reduce logging ([b7f0f8c](https://github.com/glowbuzzer/gbr/commit/b7f0f8c0da2b3902b0112af5d3da8917fef3eb25))
* remove appName ([bb4a8cf](https://github.com/glowbuzzer/gbr/commit/bb4a8cfa6014b7e4c6339b80c8ddd212685e738b))
* remove compile errors ([1324aec](https://github.com/glowbuzzer/gbr/commit/1324aecdc7038ac572e941fa800fb7f0161ee661))
* remove joint spinners tile and replace with drive config editor ([cffa10b](https://github.com/glowbuzzer/gbr/commit/cffa10b3fcf0bb0f8665a2aef17297e2621d6174))
* replace suzanne with kamdo in moveable staubli demo ([a0a5893](https://github.com/glowbuzzer/gbr/commit/a0a5893f25c301f1a3970f957e3b8dd6333ac71b))
* tweak joint dro ([196fb2a](https://github.com/glowbuzzer/gbr/commit/196fb2ac45e68213bdc8d044c46fe714e50b4c55))
* tweak style ([95f02d4](https://github.com/glowbuzzer/gbr/commit/95f02d440a9c7592cdeb5d33a7e1ec7416582b01))
* tweaks to TelemetryTile.tsx ([7edf347](https://github.com/glowbuzzer/gbr/commit/7edf3473c1dfeca526fc4250b8e269a1701cf623))
* typedoc fix ([3e8e508](https://github.com/glowbuzzer/gbr/commit/3e8e50816b50ab88a9f5a9f6a095baf2883ce9cb))
* update conveyor sorting example ([64449c3](https://github.com/glowbuzzer/gbr/commit/64449c3e3dfb6146d6ef88383b592dec7f19a7b2))
* update doc ([16899fe](https://github.com/glowbuzzer/gbr/commit/16899fe20b70d5bb11ad915126c44471360fd08f))
* update gbc.ts ([ac19c74](https://github.com/glowbuzzer/gbr/commit/ac19c749b9d4fe7f92fd61c4e9a49b05c01e3cdc))
* update package versions and add typedoc-verify.mjs ([fe5eb0f](https://github.com/glowbuzzer/gbr/commit/fe5eb0f489d5f14c1d16c169203f55deb9ea2af5))
* update typescript version ([3fd6736](https://github.com/glowbuzzer/gbr/commit/3fd6736880c24bb1123f7cc6f50f4ec0e1228085))
* work on moveable staubli example ([3e65436](https://github.com/glowbuzzer/gbr/commit/3e65436755da2519f6ff7394349463f2568a5127))

## [1.7.3](https://github.com/glowbuzzer/gbr/compare/v1.7.2...v1.7.3) (2023-04-26)


### Chore

* disable publish of examples outside of release build ([829a2f6](https://github.com/glowbuzzer/gbr/commit/829a2f6ddbd669dbc9d27bb62804cefb8e118d38))

## [1.7.2](https://github.com/glowbuzzer/gbr/compare/v1.7.1...v1.7.2) (2023-04-26)


### Bug Fix

* fix missing methods on useSoloActivity return ([26ab56e](https://github.com/glowbuzzer/gbr/commit/26ab56e4310e6d4464a27056c3112f33944942ba))

## [1.7.1](https://github.com/glowbuzzer/gbr/compare/v1.7.0...v1.7.1) (2023-04-26)


### Bug Fix

* fix tsconfig.doc.json ([0634230](https://github.com/glowbuzzer/gbr/commit/06342301e7ca97009a20fe97dcf0f5c68b4f0fe0))
* refactor connection handling to remove issue on hot-reload ([3ee74ba](https://github.com/glowbuzzer/gbr/commit/3ee74ba0f856d09d2ab2e4dcb6cb3f955e33c467))


### Chore

* add oscillating move and move at velocity tile to drives app ([8dec782](https://github.com/glowbuzzer/gbr/commit/8dec782d0d06392669743865059d6c8ea570c91f))
* fix invalid imports in tests ([1351691](https://github.com/glowbuzzer/gbr/commit/13516910edd4e8d9d0931705b270386bec42379a))
* remove create-react-app ([40c3b58](https://github.com/glowbuzzer/gbr/commit/40c3b58cf3ee830a96c5300bdb508cfae0e1ec77))
* small refactor to streaming and solo activity apis ([d223b7c](https://github.com/glowbuzzer/gbr/commit/d223b7ceb0925d319d0d525eced6776121caf8ba))

## [1.7.0](https://github.com/glowbuzzer/gbr/compare/v1.6.1...v1.7.0) (2023-04-24)


### Feature

* add pick and place demo ([77d7fe4](https://github.com/glowbuzzer/gbr/commit/77d7fe4c0aad0b4dec9bb7b95c462c2a86665652))
* add way to include config in gbr app ([9408c77](https://github.com/glowbuzzer/gbr/commit/9408c779a87365857cc18f52eeec9fcfdc6b1dab))


### Bug Fix

* fix examples build ([264775f](https://github.com/glowbuzzer/gbr/commit/264775f40d0774f9f8ca79e7f55d0b8e0bd78021))


### Chore

* add scripts to template package.src.json ([cc08623](https://github.com/glowbuzzer/gbr/commit/cc08623a0846f3bc7e8b942d238acc783dccd248))
* add to dependencies.json ([2180d20](https://github.com/glowbuzzer/gbr/commit/2180d20113cab3a6da599c8782e4bf9691a05a0f))
* modify example project structure ([25d19ce](https://github.com/glowbuzzer/gbr/commit/25d19cebd1a1e17dee5c4d3d9043b2ffb23fcee3))
* more work on drives example ([fd49a5b](https://github.com/glowbuzzer/gbr/commit/fd49a5b8b833b1cba848937893ca52e9fd0d234e))
* publish examples to dedicated http-only site ([25d19ce](https://github.com/glowbuzzer/gbr/commit/25d19cebd1a1e17dee5c4d3d9043b2ffb23fcee3))
* push template project for testing ([ddd24ab](https://github.com/glowbuzzer/gbr/commit/ddd24abc73e40f5c455b462df4f37cf717ef8490))
* update dependencies.json in app template ([615420b](https://github.com/glowbuzzer/gbr/commit/615420b808ae36c99da53a53b570ce566d7c25ab))

## [1.6.1](https://github.com/glowbuzzer/gbr/compare/v1.6.0...v1.6.1) (2023-04-06)


### Bug Fix

* export ConnectionProvider ([163ff1e](https://github.com/glowbuzzer/gbr/commit/163ff1ebbe1f8b18fdeeb38678eea3f0e68717d7))

## [1.6.0](https://github.com/glowbuzzer/gbr/compare/v1.5.0...v1.6.0) (2023-04-06)


### Feature

* **#95:** provide joint space mode for gcode ([63f6066](https://github.com/glowbuzzer/gbr/commit/63f6066ed6bcff0c953ae0466ef01dff7181333f))
* enhance telemetry tile ([268c1fc](https://github.com/glowbuzzer/gbr/commit/268c1fca0f2259731aabd620633da50d6801e500))
* multiple streams ([d00909d](https://github.com/glowbuzzer/gbr/commit/d00909da100f06fb8ff1670cfaf9aebcb44d4c22))


### Chore

* add connection test component ([fd49432](https://github.com/glowbuzzer/gbr/commit/fd494320931c5150a8814ffe88c3d624872265d0))
* add double staubli example ([8ad7c9a](https://github.com/glowbuzzer/gbr/commit/8ad7c9a21639034ea6b3abddbeb7a7591c86fbde))
* add initial drives example ([2c7323f](https://github.com/glowbuzzer/gbr/commit/2c7323f4644d3378dba1ace9e50ae02dd24e9a55))
* add OscillatingMoveTile.tsx to staubli example ([33c48d2](https://github.com/glowbuzzer/gbr/commit/33c48d248c0d037ab91191857a88dc6abd4b6d07))
* Added moveable staubli ([4bd7445](https://github.com/glowbuzzer/gbr/commit/4bd74458f46ad3ae54e7b0ccdbd0a6e7ad882d4d))
* Added moveable staubli ([046baf1](https://github.com/glowbuzzer/gbr/commit/046baf182660975a7838b11259b166ac24f0a220))
* Demo moves ([b596b11](https://github.com/glowbuzzer/gbr/commit/b596b116e31819d0eb386586468efe5033223e3c))
* export ConfigLiveEditProvider ([e6cd5e8](https://github.com/glowbuzzer/gbr/commit/e6cd5e85b5d367daefd247f9095cf34f36df7eb5))
* fix self-reference in import ([f61af43](https://github.com/glowbuzzer/gbr/commit/f61af435cc760f3584849576a9e6f88f30ec0af0))
* fix self-references in import ([71ded3a](https://github.com/glowbuzzer/gbr/commit/71ded3a5d09125d7da37f10668954ee8ce3c16d8))
* get all tests passing ([359ddeb](https://github.com/glowbuzzer/gbr/commit/359ddeb3680f49e7a06f3fbd8516e836385aed48))
* improve code doc ([2c7323f](https://github.com/glowbuzzer/gbr/commit/2c7323f4644d3378dba1ace9e50ae02dd24e9a55))
* initial work on handling multiple streams of activities ([bfd54a4](https://github.com/glowbuzzer/gbr/commit/bfd54a4f4c98b1421ac90ef6c9af3016aaa9a73b))
* initial work on time sync'd motion example ([028f76b](https://github.com/glowbuzzer/gbr/commit/028f76b6b55beea4d81bd7ea3f614ef992d87e08))
* put vite cache under node_modules, with dir per example project ([ad6495e](https://github.com/glowbuzzer/gbr/commit/ad6495e70299eb42e7ad3047cd8602b090c105ee))
* refactor stream hook ([400757e](https://github.com/glowbuzzer/gbr/commit/400757e55939b78ec9870e5f29f6f6294adc1a08))
* refactoring and work on Staubli dance example project ([5a864e4](https://github.com/glowbuzzer/gbr/commit/5a864e4b9c47938856dce33d6d4eaa0536356f3f))
* remove depreated use of antd attribute ([238a03d](https://github.com/glowbuzzer/gbr/commit/238a03d44339ae390b96012fac38979de63c476d))
* tweak sync demo ([220b4b3](https://github.com/glowbuzzer/gbr/commit/220b4b37e286a0f539fb03aedb197e9e35389aa7))
* update gbc.ts ([645cc80](https://github.com/glowbuzzer/gbr/commit/645cc80d9aa6cce52f6d8834ec20b2f8a704b91d))
* update runner for publish-test-code.yml ([5d979fb](https://github.com/glowbuzzer/gbr/commit/5d979fbc068a36bb7fba5bb963a31582c08bc4ec))
* various fixes and refactoring ([3fbc4d0](https://github.com/glowbuzzer/gbr/commit/3fbc4d00e8d45499aadbb70c4f682401407aa416))
* various refactoring ([2c7323f](https://github.com/glowbuzzer/gbr/commit/2c7323f4644d3378dba1ace9e50ae02dd24e9a55))
* work on sync demo ([268c1fc](https://github.com/glowbuzzer/gbr/commit/268c1fca0f2259731aabd620633da50d6801e500))


### Bug Fix

* bind promise method to 'this' ([7de05ad](https://github.com/glowbuzzer/gbr/commit/7de05ad3bef7b242151bd3108ca93c5dfbe898e6))
* fixes to stream handling ([268c1fc](https://github.com/glowbuzzer/gbr/commit/268c1fca0f2259731aabd620633da50d6801e500))

## [1.5.0](https://github.com/glowbuzzer/gbr/compare/v1.4.2...v1.5.0) (2023-01-10)


### Bug Fix

* **#51:** maximum call depth exceeded ([d2e2863](https://github.com/glowbuzzer/gbr/commit/d2e2863d506d38d6ef6493b43d37d2f27194e8e3))
* **#83:** fix max call depth exceeded ([d0ed77a](https://github.com/glowbuzzer/gbr/commit/d0ed77af5eaa58d6d856f19b717ef127392acb78))
* add back in GlowbuzzerTileDefinitionList.ts for full list of tiles ([e6d2a30](https://github.com/glowbuzzer/gbr/commit/e6d2a30dcbc361dd50a4ce845036ee4695788ed6))
* error using ThreeDimensionalSceneTileDefinition.tsx ([2193e60](https://github.com/glowbuzzer/gbr/commit/2193e60521929f56250a3f9ce0657a6961496b5e))
* fix gbc tests (missing gcode G5x to frame association) ([9a0a28d](https://github.com/glowbuzzer/gbr/commit/9a0a28d00838df51891c39403acb81164365bc46))
* fix tsc compile error ([58317a0](https://github.com/glowbuzzer/gbr/commit/58317a02592b017fc2cb6ea9cfd4a8acabf7c64c))
* frustum should use extents hook for size ([5b36eb3](https://github.com/glowbuzzer/gbr/commit/5b36eb32245b880d570d93d72f89811f8cccbdc5))
* handle orientation step jog ([8b67d98](https://github.com/glowbuzzer/gbr/commit/8b67d98a28bcaa1b0f19659d6cecf81bbda73722))
* issue with event listener for keydown/keyup ([ca7f0b5](https://github.com/glowbuzzer/gbr/commit/ca7f0b5e273d0f92fd494bb562b1beb355a1673f))
* issue with max extents ([77fbd60](https://github.com/glowbuzzer/gbr/commit/77fbd60afeabc94d75799b9bc51e1cb8cea91b24))
* remove @glowbuzzer/controls self-imports ([e77ee50](https://github.com/glowbuzzer/gbr/commit/e77ee50251d02aea38da5a97d43e3c4f0302688a))
* remove indirect dependency from scene to d3 etc ([e02142c](https://github.com/glowbuzzer/gbr/commit/e02142c168969f8c9a91c0ccedd1ed410ad5751a))
* roll back rename of ThreeDimensionalSceneTileDefinition.ts ([01c5920](https://github.com/glowbuzzer/gbr/commit/01c59201b09e98e6abb60bd9e52cae4ec88bb2bc))


### Chore

* add configuration display to CartesianDroTile.tsx ([b0d19ce](https://github.com/glowbuzzer/gbr/commit/b0d19cebce43fd59fc3bfef23de103c2b598e1b7))
* add individual types property to exports (typescript) ([f06833c](https://github.com/glowbuzzer/gbr/commit/f06833c44c69ca6b2f7900974744ee7315196049))
* add licence property to package.json in npm packages ([ef40293](https://github.com/glowbuzzer/gbr/commit/ef402931a371dbd1191cb61bd3937718a6d1ba30))
* add Suspense around all tile renders ([5a1234e](https://github.com/glowbuzzer/gbr/commit/5a1234e6f426f3b1281351b0dda8c75c23e9cf14))
* Added delta and router examples ([250ad3b](https://github.com/glowbuzzer/gbr/commit/250ad3bb90140594edfd7d0aa5deeadfde693ccd))
* Added new robot examples ([094cd9d](https://github.com/glowbuzzer/gbr/commit/094cd9d03cca6877e2a12dcf2fd02b3858975ccd))
* Added new robot examples ([287a628](https://github.com/glowbuzzer/gbr/commit/287a6285b6bd1a70ef1740b58872dded852d010b))
* Added new robot examples ([f47c9a5](https://github.com/glowbuzzer/gbr/commit/f47c9a5446d1a77f1f81bb883331556d94097c97))
* disable pnpm cache (doesn't work in v7) ([2a5817b](https://github.com/glowbuzzer/gbr/commit/2a5817bb921be93bfea5ac8cda91f4cf13984d55))
* fix build issue with local @glowbuzzer/controls import ([ef05dc9](https://github.com/glowbuzzer/gbr/commit/ef05dc9dc8e73d327df640c69de4d331d51d9723))
* fix move rotation at velocity test ([0777dc3](https://github.com/glowbuzzer/gbr/commit/0777dc3ad3c6358c12cd7743eeacf5381723ccb3))
* fix react component docs ([b43114d](https://github.com/glowbuzzer/gbr/commit/b43114d0b369e0003b06fbfcb3cf591fc8239a7b))
* increase retries to cloudfront invalidate ([1029348](https://github.com/glowbuzzer/gbr/commit/102934877e7bd48fc96e13bc1943e78ad8e2960e))
* merge typescript .d.ts files into bundle files ([b4fc964](https://github.com/glowbuzzer/gbr/commit/b4fc9649977f1c9fe3ea1a85522190d5322b8032))
* Modified cnc router example ([a53d0f2](https://github.com/glowbuzzer/gbr/commit/a53d0f23370cef7b9f342a8561229deb31d9c58b))
* remove GlowbuzzerTileDefinitions.ts and move tile definitions under sub-modules (to avoid dependency spread when using individual tiles) ([5a1234e](https://github.com/glowbuzzer/gbr/commit/5a1234e6f426f3b1281351b0dda8c75c23e9cf14))
* rework build to remove CJS modules and tighten up dependency management ([ba3e4ff](https://github.com/glowbuzzer/gbr/commit/ba3e4ff2feaeaa47a27aad13441ce3f27d8239e2))
* try to increase max attempts when publishing examples ([d280016](https://github.com/glowbuzzer/gbr/commit/d280016bc52ad5ab45a0edef930b8a618ae41e8b))
* update pnpm lockfile ([8a0881e](https://github.com/glowbuzzer/gbr/commit/8a0881efa3b69e7a56804b787dd5479da4ece02b))
* update pnpm version in github actions ([0be79ab](https://github.com/glowbuzzer/gbr/commit/0be79abe64f9ad218d94ec68762ba3da6acbef2f))


### Feature

* **#33:** Show frames on 3d robot view ([0bc4c87](https://github.com/glowbuzzer/gbr/commit/0bc4c87655054f72b004af1953f62686a26d374a))
* **#60:** provide continuous rotation jog ([fdc4510](https://github.com/glowbuzzer/gbr/commit/fdc45106c0bbe56e9416fbdd86cd7e271c9584cf))
* **#62:** Ability to view frame and point rotations as Euler angles ([81bce0f](https://github.com/glowbuzzer/gbr/commit/81bce0f3bbbf0dca49fe3f8aa67dc01d0c0b0fcb))
* **#69:** associate work offsets with specific frames ([189ab80](https://github.com/glowbuzzer/gbr/commit/189ab80751b9853b9f48a9cc10951f29cafe01f8))
* **#71:** editor for points and frames ([c026a39](https://github.com/glowbuzzer/gbr/commit/c026a397c0a85cf693dd347011978e0b33eacbe9))
* **#71:** initial live view of frame changes ([7dd22ea](https://github.com/glowbuzzer/gbr/commit/7dd22eaf8ef49a29e3b54bded8abf0924ae65eba))
* **#71:** live view of points changes ([8386a8e](https://github.com/glowbuzzer/gbr/commit/8386a8ed1a5503a6a629c66f2e61666b5a2298e7))
* **#72:** Provide useScale hook and misc cleanup ([615169d](https://github.com/glowbuzzer/gbr/commit/615169d3f8a776b8ec430792af94207b58d5fc2f))
* **#76:** Provide max extents hook and clean up ThreeDimensionalSceneTile.tsx preamble ([0bc4c87](https://github.com/glowbuzzer/gbr/commit/0bc4c87655054f72b004af1953f62686a26d374a))
* **#79:** jog using keyboard arrow keys ([519a027](https://github.com/glowbuzzer/gbr/commit/519a027cebcd33e2002e316f82266e841ba9ff95))
* **#80:** offline config and per-app local storage key ([d0ed77a](https://github.com/glowbuzzer/gbr/commit/d0ed77af5eaa58d6d856f19b717ef127392acb78))
* **#80:** per app settings and editing of config offline ([793f1e5](https://github.com/glowbuzzer/gbr/commit/793f1e596b5f40bb97e15a5a66f7dcb6dba98046))
* **#81:** allow robot configuration select when performing cartesian goto ([3038f4d](https://github.com/glowbuzzer/gbr/commit/3038f4dd6a5ceb6f3689ce53290dc789c82b4d9b))
* **#82:** show singularity and disable jog panel ([d0ed77a](https://github.com/glowbuzzer/gbr/commit/d0ed77af5eaa58d6d856f19b717ef127392acb78))
* **#85:** enable gcode editor even when offline ([b0bc993](https://github.com/glowbuzzer/gbr/commit/b0bc9932223f5b194182351a46eb8d217aa5476a))
* add TrackPosition component ([5b36eb3](https://github.com/glowbuzzer/gbr/commit/5b36eb32245b880d570d93d72f89811f8cccbdc5))
* smart number input component with precision ([8386a8e](https://github.com/glowbuzzer/gbr/commit/8386a8ed1a5503a6a629c66f2e61666b5a2298e7))

## [1.4.2](https://github.com/glowbuzzer/gbr/compare/v1.4.1...v1.4.2) (2022-11-18)


### Bug Fix

* remove references to flexlayout/src in imports ([d4639d9](https://github.com/glowbuzzer/gbr/commit/d4639d906c164d024c55cdec64640fbc4103956e))

## [1.4.1](https://github.com/glowbuzzer/gbr/compare/v1.4.0...v1.4.1) (2022-11-18)


### Bug Fix

* refactor dynamic import so that catch is more visible to vite ([b1ed81b](https://github.com/glowbuzzer/gbr/commit/b1ed81b6d7a84538be8dd892bc266745e799393c))


### Chore

* move step loader from controls to examples ([a776740](https://github.com/glowbuzzer/gbr/commit/a776740788d2510629c40050da1f8496d818d05c))
* remove FunctionComponent from BasicRobot.tsx ([bbbf8f0](https://github.com/glowbuzzer/gbr/commit/bbbf8f005b5e6d1f3ae33c448f82ecab06e1137f))
* update create-react-app dependencies.json ([5a20545](https://github.com/glowbuzzer/gbr/commit/5a20545c1d2c99ff907af61a7fd306eabbe1d046))

## [1.4.0](https://github.com/glowbuzzer/gbr/compare/v1.3.0...v1.4.0) (2022-11-16)


### Bug Fix

* **#33:** Trace should apply kc frame translation ([9b378c2](https://github.com/glowbuzzer/gbr/commit/9b378c2cf7ec1af6d66bc717cd3fdf511b62aef4))
* **#39:** Change in rotation using moveToPosition API method in gbr causes translation change (to zero) ([32d90bb](https://github.com/glowbuzzer/gbr/commit/32d90bbfe684ac062e57d74c096b4423c090dd14))
* **#40:** make triads have consistent look ([56ba5e9](https://github.com/glowbuzzer/gbr/commit/56ba5e94fe2ae307bc55a5f5e8cd6fcd666c4b3b))
* **#49:** Missing disable limits checkbox ([a7d4354](https://github.com/glowbuzzer/gbr/commit/a7d4354166890d55d370e0c723dd38cb0f869220))
* **#56:** Improve npmjs.com page for gbr packages - add licence ([330acd4](https://github.com/glowbuzzer/gbr/commit/330acd467ae97c2f19c255a9ff637a8f9b538b36))
* **#65:** Ensure useToolConfig cannot returned undefined ([b444ceb](https://github.com/glowbuzzer/gbr/commit/b444ceb188ae971f99af099da0a00cc9819356f2))
* **#66:** Position robot in scene according to frames config ([40d46eb](https://github.com/glowbuzzer/gbr/commit/40d46eb2be054855c11eea247793e1676614e095))


### Chore

* add frustum to standard 3d scene tile definition ([ee727f1](https://github.com/glowbuzzer/gbr/commit/ee727f16c5ebadc270da79a075f4a7019efc9e42))
* add react logo to react-native app ([ba29349](https://github.com/glowbuzzer/gbr/commit/ba293496b5ca8593fb493be783734e115cdcb073))
* add support for operation error from gbc ([c05a5af](https://github.com/glowbuzzer/gbr/commit/c05a5af9da535a25552d1cf9c3efa42612f3da8a))
* add tsconfig to avoid errors in cra template in ide ([5e03748](https://github.com/glowbuzzer/gbr/commit/5e037483db07f851470a1edbc2578af8ed3b8625))
* don't bundle occt-import-js ([0221ac1](https://github.com/glowbuzzer/gbr/commit/0221ac1392a513fa71b2fba78666cac8e9d498cf))
* don't use @glowbuzzer/store from inside lib ([18f5e2e](https://github.com/glowbuzzer/gbr/commit/18f5e2e345b4e00468d6991fc21aac7903b9c3fe))
* enforce import of react and fix up existing files ([9359148](https://github.com/glowbuzzer/gbr/commit/9359148c724e9db911ba0fb9438295987482cebe))
* export Frustum ([c59b1c4](https://github.com/glowbuzzer/gbr/commit/c59b1c4e04619e6a0ba0700a8cb513ca8aa148fe))
* expose DockLayoutContext and add enableWithoutConnection to builder ([611a305](https://github.com/glowbuzzer/gbr/commit/611a305144b15a69b066244ed6dd1dbb661924d8))
* fix issue with BasicRobot.tsx ([92d8e8b](https://github.com/glowbuzzer/gbr/commit/92d8e8b7486dde38a323cee92268319cae377935))
* fix issue with disappearing tiles (hooks problem) ([93d6b0f](https://github.com/glowbuzzer/gbr/commit/93d6b0f012af6b3edbddfab7737e889f4367f4c5))
* fix tsc errors ([980a166](https://github.com/glowbuzzer/gbr/commit/980a1661336b85661f0bccfc0d52d42adacc3711))
* fix up examples and stray imports ([b441d4a](https://github.com/glowbuzzer/gbr/commit/b441d4a0728f245c046ad190a8d0a8de8f33b8d7))
* flexlayout-react add custom component ([b6722a6](https://github.com/glowbuzzer/gbr/commit/b6722a699a556b40aeb8a6f7600b25bcaff12af3))
* flexlayout-react add dummy frames tile ([546bb2b](https://github.com/glowbuzzer/gbr/commit/546bb2bab0078c54bc2f6619ebbb80c28b4f0dae))
* flexlayout-react add settings and custom header ([f687fa0](https://github.com/glowbuzzer/gbr/commit/f687fa04d78f68269fdfa7e89cb74354fddc688c))
* flexlayout-react example ([569f3b4](https://github.com/glowbuzzer/gbr/commit/569f3b425bec3b389f94801e80e5254ef049883a))
* flexlayout-react example ([e3cb762](https://github.com/glowbuzzer/gbr/commit/e3cb762059fcb07562836766221c556e5998effd))
* flexlayout-react mini framework ([c4628a1](https://github.com/glowbuzzer/gbr/commit/c4628a178973f28d8b205a160f4842ee57352d21))
* flexlayout-react rework on various tiles ([73af3d1](https://github.com/glowbuzzer/gbr/commit/73af3d11114930071952eb7614161750fc77dbfc))
* implement config file upload (gbc[#32](https://github.com/glowbuzzer/gbr/issues/32)) ([2a00df0](https://github.com/glowbuzzer/gbr/commit/2a00df0f0484e653e6dffd1105fb5fc6b9b8c2b9))
* indirect render functions ([3f2e06b](https://github.com/glowbuzzer/gbr/commit/3f2e06bb8fc7b91708337353ed2bdfd02bde6fef))
* rc-dock experiment ([afca807](https://github.com/glowbuzzer/gbr/commit/afca8071bf17746365995ecce18d5c94c8d27092))
* refactor three-tutorial in line with robot rendering changes ([a46c34e](https://github.com/glowbuzzer/gbr/commit/a46c34ea83bca187ad4a5c0cbfa6948594a0793d))
* refactor two-link example to use flexlayout ([877fb1b](https://github.com/glowbuzzer/gbr/commit/877fb1b06e27c02de815c0f6717ae8bead1e048a))
* remove logging statement ([340e172](https://github.com/glowbuzzer/gbr/commit/340e17253cde2aa20de66bee23bdc8903669f8c8))
* rename GlowbuzzerDockPlacement ([ce8baa5](https://github.com/glowbuzzer/gbr/commit/ce8baa509438487028d69942a747c487eeacdce3))
* rename teta to jointAngleAdjustment ([923332d](https://github.com/glowbuzzer/gbr/commit/923332de301669b197a056edffaa6947c37e475e))
* rename toolpath dir to scene ([f41d6af](https://github.com/glowbuzzer/gbr/commit/f41d6afe350994d13a34b8c82d3b04f6aa401b32))
* rename ToolPathTile and fix react-docgen issues ([44aee65](https://github.com/glowbuzzer/gbr/commit/44aee65190a4bb105a09fa5c10dc1d0398f07a23))
* update dependencies in react-native example ([91782a6](https://github.com/glowbuzzer/gbr/commit/91782a685287a64a9b28b074b1f892e778d62ad0))
* update doc comments, and further work on dock layout ([1bfa028](https://github.com/glowbuzzer/gbr/commit/1bfa0289068c80fbd3ff79fe2972c40e5b618ab2))
* update TDST doc comments ([199fc11](https://github.com/glowbuzzer/gbr/commit/199fc110c2009868076736e1eb7b07051c81a606))


### Feature

* **#30:** handle machine status message giving error reason ([300fcc3](https://github.com/glowbuzzer/gbr/commit/300fcc3f0a39ecf69902f8b053b0e16b517f5c85))
* **#35:** Add pre-canned views (cube) to toolpath display ([6b2eb96](https://github.com/glowbuzzer/gbr/commit/6b2eb96e2ab94f5b0f0d3a641a5518adbd5b8d1d))
* **#42:** Add example two-link visualisation ([43aacb1](https://github.com/glowbuzzer/gbr/commit/43aacb14d40a4051e0cedfe43103275453a20f1d))
* **#43:** Provide API to control what is added to three scene ([43d3e70](https://github.com/glowbuzzer/gbr/commit/43d3e704b4649182ee9e9f6d05e77664fa64d594))
* **#43:** Provide options for features in the 3d scene ([40d46eb](https://github.com/glowbuzzer/gbr/commit/40d46eb2be054855c11eea247793e1676614e095))
* **#44:** Add three.js examples (two-link and general) ([4649076](https://github.com/glowbuzzer/gbr/commit/4649076a1927107ab6e296013bb1a1abb77a0caa))
* **#44:** Add three.js examples (two-link and general) ([7e3849e](https://github.com/glowbuzzer/gbr/commit/7e3849e1d86a72bf154c5d90e7f8532c8f1fd1f2))
* **#44:** Add three.js examples (two-link and general) ([a8965a4](https://github.com/glowbuzzer/gbr/commit/a8965a4201eaefa0a21df8feb477c81966b436ec))
* **#44:** Add three.js examples (two-link and general) ([38613b6](https://github.com/glowbuzzer/gbr/commit/38613b6f8cfba87662fbf5b3f2a30c942e0cdd4d))
* **#44:** Add three.js examples (two-link and general) ([1b65812](https://github.com/glowbuzzer/gbr/commit/1b65812a35ec20b8c5b8152b31c86883cd642c1b))
* **#45:** flexlayout-react ([2a39e34](https://github.com/glowbuzzer/gbr/commit/2a39e347a9272636903e99586d9178673202c053))
* **#47:** Don't show kc dropdown if there is only a single kc configured ([d514d0e](https://github.com/glowbuzzer/gbr/commit/d514d0eb55927d52426ea462162f7f2f8f393295))
* **#52:** For revolute joints allow a "revolutions" as well as degrees and rads unit type ([1a180be](https://github.com/glowbuzzer/gbr/commit/1a180be6c598db7cbc9d0d3d8b9916767d6d37ba))
* **#55:** Not clear you can't change tools when not in op enabled ([95da958](https://github.com/glowbuzzer/gbr/commit/95da958d0c7e872e543ed7676a28f74291c46d55))
* **#73:** Refactor robot rendering ([40d46eb](https://github.com/glowbuzzer/gbr/commit/40d46eb2be054855c11eea247793e1676614e095))

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
