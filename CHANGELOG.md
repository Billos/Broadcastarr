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
