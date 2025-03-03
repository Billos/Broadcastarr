# [1.7.0](https://github.com/Billos/Broadcastarr/compare/1.6.0...1.7.0) (2025-03-03)


### Bug Fixes

* **TemplateRenderer:** add error handling for required parameters in date formatting functions ([616279e](https://github.com/Billos/Broadcastarr/commit/616279e9b8259f9232ca3adf69b6bb4898590b6b))
* **TemplateRenderer:** update date formatting to use current time instead of local time ([7c709f8](https://github.com/Billos/Broadcastarr/commit/7c709f86fdc54807cc6f654bc2dbf6b75d864805))


### Features

* **PrintCommand:** change value to values array for handling multiple inputs ([654730e](https://github.com/Billos/Broadcastarr/commit/654730ede21304023e0c7ef6a146603e93ded0be))

# [1.6.0](https://github.com/Billos/Broadcastarr/compare/1.5.0...1.6.0) (2025-03-02)


### Bug Fixes

* **commands:** update SetValuesCommand to use dynamic name for VirtualStorer ([2816e22](https://github.com/Billos/Broadcastarr/commit/2816e22c2bd9ec827caa09a0eecc3e109eebee2b))
* **counter:** fix root element selector handling in Counter command ([75ca8af](https://github.com/Billos/Broadcastarr/commit/75ca8afbe9d11f31f6eebc101dd40c3b4293a213))
* **docker:** rename DEV_NDEXER to DEV_INDEXER in development configuration ([32fddd9](https://github.com/Billos/Broadcastarr/commit/32fddd994dae0f2e570c00fc683e17dae5fbba03))
* **env:** rename environment variables for development configuration ([ce250e4](https://github.com/Billos/Broadcastarr/commit/ce250e457f1f874ecfd3d07240fca71c0bc76b4e))
* **GetValues:** remove unused logger import ([8cc0c12](https://github.com/Billos/Broadcastarr/commit/8cc0c128bfae570a1f1db5180287f11b804c4c3c))
* **logger:** align logger data output with consistent spacing ([ce8beeb](https://github.com/Billos/Broadcastarr/commit/ce8beeba9c383754510f613ce3c45af9242c7172))
* **logging:** include page URL in logger data for AssertGroup, Click, GoToPage, Print, RunScenario commands ([1a32e4a](https://github.com/Billos/Broadcastarr/commit/1a32e4a5c00c53e5b156a451df2f4689d141d4b1))
* **logging:** include page URL in logger data for Counter and GetValues commands ([c84722a](https://github.com/Billos/Broadcastarr/commit/c84722ae3f22f0a946e13dc0b960cf0f5b8aa512))
* **prettierrc:** increase print width from 120 to 140 ([f91f51b](https://github.com/Billos/Broadcastarr/commit/f91f51b12de840c04fef5d9ed8a0d2c9603b196c))
* **print:** remove page URL from logger data in Print command execution ([a75f7c7](https://github.com/Billos/Broadcastarr/commit/a75f7c7fd1447a8043019cf0fcf00d1b6da6515f))
* **print:** simplify logging in Print command by directly rendering value ([e89439a](https://github.com/Billos/Broadcastarr/commit/e89439a9ace7181b4bf2bffef421c0eff354e6eb))
* **SetValuesCommand:** enable logging of values being set with page URL context ([a8d9719](https://github.com/Billos/Broadcastarr/commit/a8d9719b54e242291275de587ffe3dbbb557ce18))
* **worker:** enhance dev mode checks and improve image folder cleanup ([6ccb354](https://github.com/Billos/Broadcastarr/commit/6ccb3547f51d2b360ef8b1c593332c36edf44719))


### Features

* **print:** add Print command to log rendered values ([6daebf3](https://github.com/Billos/Broadcastarr/commit/6daebf3f4ae169a37920b63cec4bd97b2d081b1a))

# [1.5.0](https://github.com/Billos/Broadcastarr/compare/1.4.0...1.5.0) (2025-02-24)


### Bug Fixes

* **dependencies:** migrate from puppeteer to puppeteer-core for improved compatibility ([8629b44](https://github.com/Billos/Broadcastarr/commit/8629b44e641ae596719282c28e3fb2df48a309e5))
* **docker:** update commands in docker-compose files to use 'start' prefix ([fc85373](https://github.com/Billos/Broadcastarr/commit/fc85373d31815f9694f958a01c0b65db334d20c3))
* **legacy:** moveLEGACY.md file ([fbe21de](https://github.com/Billos/Broadcastarr/commit/fbe21de99f8db7630e68b7e01e67cd0ccc7639f0))
* **logger:** replace tslog with winston logger and review child generation ([500c931](https://github.com/Billos/Broadcastarr/commit/500c931cb7dee9cd9150800812a8518ca3188449))
* **publishers:** comment out Matrix publisher creation and deletion ([c071e6e](https://github.com/Billos/Broadcastarr/commit/c071e6ebb6f7972d54a76f6f44321c838ea6004f))
* **readme:** update Readme ([91423bd](https://github.com/Billos/Broadcastarr/commit/91423bdc2d8324eb47efefb35f73551d25db54f1))
* **readme:** Update README.md ([3aab03f](https://github.com/Billos/Broadcastarr/commit/3aab03fcaf8b850adee16bdd0b612316e95acfcd))
* **releaserc:** add dockerTags for versioning in release configuration ([c3ded5e](https://github.com/Billos/Broadcastarr/commit/c3ded5e017d1d1d91ab92f805d64037443072afe))
* **tsconfig:** update TypeScript configuration to target ESNext and use NodeNext module resolution ([bbd9506](https://github.com/Billos/Broadcastarr/commit/bbd95069d81e136e121dc37226e72ee33d0e8ff9))


### Features

* **env:** add IMAGES_FOLDER variable to manage image storage path ([1d900f0](https://github.com/Billos/Broadcastarr/commit/1d900f053f74c0317dd404b326b9cf55b855ac73))
* **logger:** add LOG_DATA environment variable to control log data output ([b339133](https://github.com/Billos/Broadcastarr/commit/b339133520648015a85fa2231ed9a53f6891bdfd))
* **publishers:** remove Matrix implementation and related dependencies ([031548a](https://github.com/Billos/Broadcastarr/commit/031548a3b312eb825ecd493df5d57633110ab4b0))

# [1.4.0](https://github.com/Billos/Broadcastarr/compare/1.3.0...1.4.0) (2025-01-20)


### Bug Fixes

* **eslint:** add rule for arrow-body-style to enforce concise syntax ([f1a70ad](https://github.com/Billos/Broadcastarr/commit/f1a70ad914769cbfa257273f48c57eb6c02d39a0))
* **groups:** add check for GROUPS environment variable before bootstrapping ([d0535ef](https://github.com/Billos/Broadcastarr/commit/d0535ef20987bfe8e98a3df032036a78e0ee6aa8))
* **indexer:** update today field to include optional type definition ([3b58467](https://github.com/Billos/Broadcastarr/commit/3b584678dab602445b07a5d87460c1b7e0ebbbf3))
* **models:** add runValidators option to update operations for data integrity ([dda5f75](https://github.com/Billos/Broadcastarr/commit/dda5f759440a9782de6ed53f09ff4b71592568d0))
* **templater:** implement Templater module to encapsulate nunjucks ([f766883](https://github.com/Billos/Broadcastarr/commit/f7668835de9d59dda0c9c201d2fced225dfc6dc3))


### Features

* **agenda:** integrate Orchestrator for stream and category indexing ([aa437a4](https://github.com/Billos/Broadcastarr/commit/aa437a473a7b879ad348748d38462057bd63a8fe))
* **dependencies:** add json5 package to enhance JSON parsing capabilities ([7e7eab6](https://github.com/Billos/Broadcastarr/commit/7e7eab6fa9aef8c3f381bc7b5a75fca4e2c47e83))
* **displayTitle:** displayTitle is generated from broadcast content ([5433d64](https://github.com/Billos/Broadcastarr/commit/5433d643f9d788d980023cbfe5a8e5bfcb6896ee))
* **documentation:** update README and add COMMANDS and LEGACY documentation for new command pattern ([72f1617](https://github.com/Billos/Broadcastarr/commit/72f1617d7f080d107e0d0223f9c6c07f527dc2ed))
* **indexer:** add command schemas and integrate into indexer model ([4e2c5c0](https://github.com/Billos/Broadcastarr/commit/4e2c5c010c59bdc4bf823dc9d5ec7cdf55916bfd))
* **indexer:** add validation and scenario update functionality ([4e40b8f](https://github.com/Billos/Broadcastarr/commit/4e40b8fb56549678f4774c90fdc92981db7d5f30))
* **scrapper:** Add the basic commands to perform scenarios ([dfa1e38](https://github.com/Billos/Broadcastarr/commit/dfa1e3803e0d33f889b4cbec8330ff674bea00b1))
* **scrapper:** Orchestrator runs scenarios ([d6b3617](https://github.com/Billos/Broadcastarr/commit/d6b3617b6be653f8a5f38fcec466087acaba74a1))
* **templater:** enhance TemplateRenderer with date formatting and error handling ([ef42985](https://github.com/Billos/Broadcastarr/commit/ef429856c9cf2427d152b85181a3d23b9cef870b))
* **worker:** add functionality to empty image folder in dev mode ([aa3659c](https://github.com/Billos/Broadcastarr/commit/aa3659cbc24d58d8e96210d00e5f96fc15307594))

# [1.3.0](https://github.com/Billos/Broadcastarr/compare/1.2.3...1.3.0) (2024-12-25)


### Bug Fixes

* **scrapper:** change timezone from UTC to local for date parsing ([1a286d9](https://github.com/Billos/Broadcastarr/commit/1a286d9a790aceddbfb14a714601b30bcb341985))


### Features

* **dev:** add development environment configuration and indexing support ([ecb5054](https://github.com/Billos/Broadcastarr/commit/ecb505449d796dc7e40ecd0b7bfe9b21f9e76b01))
* **indexer:** add support for clicks and optional login fields in category schema ([0f9b087](https://github.com/Billos/Broadcastarr/commit/0f9b087c31c24ee726a38d316330f6d731000532))
* **indexer:** Data model of indexer includes login definition ([938c8ca](https://github.com/Billos/Broadcastarr/commit/938c8ca1e70ce73b1a24fa9d5b2e36d6c353974d))
* **indexer:** handle clicks for Indexers ([3cc9da2](https://github.com/Billos/Broadcastarr/commit/3cc9da2ffeda8ff08db51994b405017afa6398da))
* **scrapper:** basic nunjucks templating ([d58d6fe](https://github.com/Billos/Broadcastarr/commit/d58d6feb8b9a67d5fdbe9034542c6cd85137533a))
* **scrapper:** implement basic login functionality with validation and click handling ([c773275](https://github.com/Billos/Broadcastarr/commit/c77327568cded32a827fe52514d6fe9a3aed6606))

## [1.2.3](https://github.com/Billos/Broadcastarr/compare/1.2.2...1.2.3) (2024-12-10)


### Bug Fixes

* **package.json:** update bootstrap and server paths to use src directory ([7906881](https://github.com/Billos/Broadcastarr/commit/790688152bd86e9fa26478f204640bce6b8aa407))

## [1.2.2](https://github.com/Billos/Broadcastarr/compare/1.2.1...1.2.2) (2024-12-07)


### Bug Fixes

* **urlJoin:** encode arguments to fix spaces. ([36416a6](https://github.com/Billos/Broadcastarr/commit/36416a63daa48bb4a1443ab31ce5c760faae7570))

## [1.2.1](https://github.com/Billos/Broadcastarr/compare/1.2.0...1.2.1) (2024-12-03)


### Bug Fixes

* **env:** Comments on environment variables and update README ([6fa6633](https://github.com/Billos/Broadcastarr/commit/6fa66334f2b824445e79eef1dd2ac34d1d6b6fdf))
* **env:** replace DESTINATION with M3U8_FOLDER in environment configuration ([bf69227](https://github.com/Billos/Broadcastarr/commit/bf692271a4b2dc95dcf00d419a5b7c5f57003057))
* **env:** set default values for Discord bot avatar and name ([d8b9cfd](https://github.com/Billos/Broadcastarr/commit/d8b9cfdbe5002a8d2b7dad05627fbcb65fd8b149))
* **matrix:** refactor room alias creation to replace spaces with dashes ([ef93f4f](https://github.com/Billos/Broadcastarr/commit/ef93f4f25f9986368f30dbf21891638961a2fa25))
* **matrix:** replace spaces with dashes in room alias ([c4b440d](https://github.com/Billos/Broadcastarr/commit/c4b440da5458adc8faa4a3ab6586efd43e10f35a))
* **matrix:** update room alias prefix from 'scrapper' to 'broadcastarr' ([3dc23e9](https://github.com/Billos/Broadcastarr/commit/3dc23e948899277ed5fa9c36f22ee9d0612a3c9a))
* **scrapper:** repair defaultValue in regex, fix [#7](https://github.com/Billos/Broadcastarr/issues/7) ([e1c3a2d](https://github.com/Billos/Broadcastarr/commit/e1c3a2dee662019b46ae9c0d6cb127ba7ea82da0))

# [1.2.0](https://github.com/Billos/Broadcastarr/compare/1.1.6...1.2.0) (2024-12-02)


### Bug Fixes

* **agenda:** update log message to reflect unpublishing of the group ([ea0e905](https://github.com/Billos/Broadcastarr/commit/ea0e9050a70ef4cf80f888365dd1a949b9af2d8d))
* **discord:** sleep before Discord query to have more resilience ([3101b5b](https://github.com/Billos/Broadcastarr/commit/3101b5b2a69d72fb997481075966fff9d4cfe8e7))
* **discord:** webhooks name and avatar are now optionnal ([f2fdc24](https://github.com/Billos/Broadcastarr/commit/f2fdc2444cad95badc94225a88384c765182847e))
* **docker:** add iproute2 in docker ([370c441](https://github.com/Billos/Broadcastarr/commit/370c441d00843b6e44f2ce961d6e8f02fc2d8ebb))
* **eslint:** set prefer-template eslint rule ([8548a5e](https://github.com/Billos/Broadcastarr/commit/8548a5e61cbc3b2a95446c86f8a4aab474f26f63))
* **jellyfin:** prepend "Broadcastarr " to collection names to avoid name detections ([cbecc62](https://github.com/Billos/Broadcastarr/commit/cbecc627e33e402607c0e3859a1979e3619f3a19))
* **jellyfin:** Repair collection creation and image setting ([4fb4b63](https://github.com/Billos/Broadcastarr/commit/4fb4b6352e1219b27a551e393f8a8ffb0ef5eb42))


### Features

* **category:** add endpoint to refresh channel name for a category ([e3056fd](https://github.com/Billos/Broadcastarr/commit/e3056fdaacfcdfac6e5f87457512015616b18d29))
* **docker:** cron to change de default gateway if wireguard container is detected & entrypoint script ([e1f8a6b](https://github.com/Billos/Broadcastarr/commit/e1f8a6b7c6e36d4af9e9e37cd7840b1e6fa1014f))

## [1.1.6](https://github.com/Billos/Broadcastarr/compare/1.1.5...1.1.6) (2024-11-28)

### Bug Fixes

- **roadmap:** update roadmap ([1e7ba59](https://github.com/Billos/Broadcastarr/commit/1e7ba5931555ec4f484dc63625af09efab55e0f3))

## [1.1.5](https://github.com/Billos/Broadcastarr/compare/1.1.4...1.1.5) (2024-11-28)

### Bug Fixes

- **docker-compose:** update image tags to latest version ([3d8ecac](https://github.com/Billos/Broadcastarr/commit/3d8ecac8f430a5cebd8dda9ceb2e0d71d04d1cfd))
- **releaserc:** add docker-compose files to release assets ([9aadbac](https://github.com/Billos/Broadcastarr/commit/9aadbac2e490f94f19704483945ab68679c4acc3))
- **releaserc:** add npm plugin for semantic release configuration ([2ad5e57](https://github.com/Billos/Broadcastarr/commit/2ad5e577c76709bbcba03e13314021c50dbb1d34))
- **releaserc:** add npm plugin for semantic release configuration ([2a3ba94](https://github.com/Billos/Broadcastarr/commit/2a3ba9482a2fc89981c6369ae1fb9d774f9943b1))
- **roadmap:** Add task in roadmap ([2e4a41a](https://github.com/Billos/Broadcastarr/commit/2e4a41a93fdc49415696fbf72a4355e7b4793bef))

## [1.1.4](https://github.com/Billos/Broadcastarr/compare/1.1.3...1.1.4) (2024-11-27)

### Bug Fixes

- **releaserc:** update assets for semantic release configuration ([f01ee8d](https://github.com/Billos/Broadcastarr/commit/f01ee8d1f287cae4d5479734cfd93c2b327872b3))

## [1.1.2](https://github.com/Billos/Broadcastarr/compare/1.1.2...1.1.3) (2024-11-27)

### Bug Fixes

- **roadmap:** roadmap update ([5390548](https://github.com/Billos/Broadcastarr/commit/5390548e6d32aeb80fd674af2716f524feea072f))

## [1.1.1](https://github.com/Billos/Broadcastarr/compare/1.1.0...1.1.1) (2024-11-27)

### Bug Fixes

- **package:** change start script from node to tsx for improved execution ([9b987cc](https://github.com/Billos/Broadcastarr/commit/9b987ccb090ddd36dbaec612c97403a6d1ce6035))

# [1.1.0](https://github.com/Billos/Broadcastarr/compare/1.0.1...1.1.0) (2024-11-27)

### Bug Fixes

- **docker:** Update server service to use pre-built image and simplify command ([eb33e07](https://github.com/Billos/Broadcastarr/commit/eb33e07ca2f411cabcb278112a1e5c91ce03e8b4))
- **prettier:** Add Prettier configuration file and update package dependencies ([c5f6972](https://github.com/Billos/Broadcastarr/commit/c5f697287110238478928194e135f97515cf5b0f))
- **publishers:** Refactor sendMessage and sendCategoryMessages to use CategoryDocument instead of string ([6ffbee9](https://github.com/Billos/Broadcastarr/commit/6ffbee9f9941301519500727ac35a02de9fef4e6))
- **urlJoin:** Update urlJoin function to prepend remoteUrl to the constructed API path, avoids wrong url ([c2fe096](https://github.com/Billos/Broadcastarr/commit/c2fe0962a904965863f0807c514de87695074ac6))

### Features

- **gotify:** Implement Gotify publisher with API integration and environment variable configuration ([880c123](https://github.com/Billos/Broadcastarr/commit/880c123b26b047e232115217ba4240592c68b908))
- **publishers:** Add Gotify publisher initialization and configuration to environment variables ([5ee037d](https://github.com/Billos/Broadcastarr/commit/5ee037d80cb9d8f53f1c0335bd08bec64c326e0a))

## [1.0.1](https://github.com/Billos/Broadcastarr/compare/1.0.0...1.0.1) (2024-11-25)

### Bug Fixes

- **build:** Add build script and update Dockerfile to run build process ([05556ab](https://github.com/Billos/Broadcastarr/commit/05556ab8b61d4d1e3643793796b682dc67fc2ee9))
- **changelog:** Add initial changelog for version 1.0.0 with bug fixes and features ([6c8dd0b](https://github.com/Billos/Broadcastarr/commit/6c8dd0be054a0b86e760e2687454da2f7135f3dd))
- **dockerignore:** Add wg0.conf to .dockerignore to prevent it from being included in Docker builds ([09e0711](https://github.com/Billos/Broadcastarr/commit/09e07114e9bad94760ea8dfeab3ffa8afd69002a))
- **docker:** Simplify command syntax in Docker Compose files and update entry point in Dockerfile ([5221bc3](https://github.com/Billos/Broadcastarr/commit/5221bc3b2a6612d54c295ff3476b9a0c212b01d4))
- **gitignore:** Update data file path in .gitignore to improve clarity ([57fa74f](https://github.com/Billos/Broadcastarr/commit/57fa74f9c0818952b91813fca53bbe94be6ba5c6))
- **init:** Update data folder handling and improve Docker Compose configuration ([5c2d2f4](https://github.com/Billos/Broadcastarr/commit/5c2d2f4d1edf43a7fb982b3844f4223aeebed87d))
- **matrix:** Change Matrix room name to use category.name ([a9ecbf0](https://github.com/Billos/Broadcastarr/commit/a9ecbf01daa50ad90d9582937056efef58599ff7))
- **readme:** Update installation instructions to include DB volume creation and specify init compose file ([03037b7](https://github.com/Billos/Broadcastarr/commit/03037b783b0489c3ec31e11446f7062fc448a56c))

# 1.0.0 (2024-11-25)

### Bug Fixes

- **.gitignore:** Ignore specific JSON data files in the init directory ([07906f7](https://github.com/Billos/Broadcastarr/commit/07906f7e6f61bd7f68919bd538b2285000b8f07f))
- **.gitignore:** Simplify JSON file ignore pattern in data directory ([92e0185](https://github.com/Billos/Broadcastarr/commit/92e0185692d92ad64fb94d8a4fdf488aa558dd70))
- **broadcastsIndexer:** Ensure group emoji is checked before assignment ([89caacd](https://github.com/Billos/Broadcastarr/commit/89caacd7c896902bf5334c8d77a0311b793944a5))
- **converters:** Update default property to use Object.fromEntries for better compatibility ([c6baef9](https://github.com/Billos/Broadcastarr/commit/c6baef9934ad23f29339df1966e6a45fcbe1f265))
- **dependencies:** Upgrade dependencies ([1a97248](https://github.com/Billos/Broadcastarr/commit/1a972480c3f95960807618b0c7d2bf9346f0e7aa))
- **dependencies:** Upgrade packages ([e046dd2](https://github.com/Billos/Broadcastarr/commit/e046dd26d9ac37763d82801cc3f5985148d95fc0))
- **docs:** Add screenshots for publishing and releasing ([b46b1ba](https://github.com/Billos/Broadcastarr/commit/b46b1ba3341a3df39e0eaea07accbedd8e3c6348))
- **genericBroadcastsIndexer:** Improve error message to include group country and name ([98a3fa6](https://github.com/Billos/Broadcastarr/commit/98a3fa6107b65930ff2b5fcdc13313559a076129))
- **markdown:** Add padding to displayContent when team separator is absent ([b4c5fb2](https://github.com/Billos/Broadcastarr/commit/b4c5fb22f51151f2520848b4a6eba269776fb54a))
- **markdown:** Adjust padding calculation to ensure proper display content length ([00927a9](https://github.com/Billos/Broadcastarr/commit/00927a9ecad3b81dcfc06deaec808a788cd90bbf))
- **package:** Add semantic-release for automated versioning and releases ([2556156](https://github.com/Billos/Broadcastarr/commit/255615631e376f29e4e8dc25ae2352728f49d27d))
- **package:** Bump version to 1.0.0 and set package as private ([8c27cf3](https://github.com/Billos/Broadcastarr/commit/8c27cf343c4d5e5e6e8d95aa6c1d2b798acba86a))
- **package:** Update repository URL format in package.json ([fb1e28d](https://github.com/Billos/Broadcastarr/commit/fb1e28d1fa64c7b51815045dd86b8393b0cd1fae))
- **publish:** Ensure that the lack of "team separator" does not crash ([bb7bc28](https://github.com/Billos/Broadcastarr/commit/bb7bc2879f34bb38c87f1b74fb924fd24c14f1b5))
- **publishGroup:** Add logging for group publishing process and task scheduling ([82802a6](https://github.com/Billos/Broadcastarr/commit/82802a6223969b40ef3cd2f2699ecf77148dd0e5))
- **publishGroup:** Ensure existing job scheduling is awaited for proper execution ([20429ed](https://github.com/Billos/Broadcastarr/commit/20429edc0e4a20d4d5eec594c2ef1d3f8c50510b))
- **togglegroup:** Handle case when no groups are found and provide user feedback ([82a6d18](https://github.com/Billos/Broadcastarr/commit/82a6d1891da03666857d9b2383334a11aaee4016))

### Features

- **docker:** Add development and initialization Docker Compose configurations ([33ba04b](https://github.com/Billos/Broadcastarr/commit/33ba04b4e17e36c27e18cf0a0cbe5815648c4ffb))
- **releaserc:** Add configuration for semantic-release with main branch ([bbcb228](https://github.com/Billos/Broadcastarr/commit/bbcb228c1fc7ca385f20365dd3847079e2364621))
- **releaserc:** Add Docker plugin support and update dependencies for semantic-release ([33c19ac](https://github.com/Billos/Broadcastarr/commit/33c19ac316a6638dcfae8dfba5d04c1e8d441583))
