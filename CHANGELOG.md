## [1.1.4](https://github.com/Billos/Broadcastarr/compare/1.1.3...1.1.4) (2024-11-27)


### Bug Fixes

* **releaserc:** update assets for semantic release configuration ([f01ee8d](https://github.com/Billos/Broadcastarr/commit/f01ee8d1f287cae4d5479734cfd93c2b327872b3))

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
