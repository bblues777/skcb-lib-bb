import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

export const SOUTH_PLUS_DOMAINS = [
  { slug: 'net', domain: 'south-plus.net', name: 'South Plus (主站)' },
  { slug: 'org', domain: 'south-plus.org', name: 'South Plus (.org 镜像)' },
  { slug: 'white', domain: 'white-plus.net', name: 'White Plus 镜像' },
  { slug: 'north', domain: 'north-plus.net', name: 'North Plus 镜像' },
  { slug: 'level', domain: 'level-plus.net', name: 'Level Plus 镜像' },
  { slug: 'soul', domain: 'soul-plus.net', name: 'Soul Plus 镜像' },
  { slug: 'snow', domain: 'snow-plus.net', name: 'Snow Plus 镜像' },
  { slug: 'spring', domain: 'spring-plus.net', name: 'Spring Plus 镜像' },
  { slug: 'summer', domain: 'summer-plus.net', name: 'Summer Plus 镜像' },
  { slug: 'blue', domain: 'blue-plus.net', name: 'Blue Plus 镜像' },
  { slug: 'imouto', domain: 'imoutolove.me', name: 'Imouto Love 镜像' },
  { slug: 'east', domain: 'east-plus.net', name: 'East Plus 镜像' }
];

export async function buildLibBb(): Promise<void> {
  await mkdir(path.join(distDir, 'actions'), { recursive: true });
  await mkdir(path.join(distDir, 'search-engines'), { recursive: true });

  // 1. actions/f95zone.js
  const f95zoneActionsJs = `export default (services) => ({
  callbacks: {
    'home': () => {
      window.location.assign('https://f95zone.to/');
    },
    'trending': () => {
      window.location.assign('https://f95zone.to/trending/');
    },
    'latest-updates': () => {
      window.location.assign('https://f95zone.to/sam/latest_alpha/');
    }
  }
});
`;
  await writeFile(path.join(distDir, 'actions/f95zone.js'), f95zoneActionsJs, 'utf8');

  // 2. search-engines/f95zone.js
  const f95zoneSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/f95zone.js'), f95zoneSearchJs, 'utf8');

  // 3. actions/south-plus.js
  const southPlusCallbackEntries: string[] = [];
  for (const item of SOUTH_PLUS_DOMAINS) {
    const isPrimary = item.slug === 'net';
    const suffix = isPrimary ? '' : `-${item.slug}`;
    southPlusCallbackEntries.push(`    'home${suffix}': () => window.location.assign('/index.php'),`);
    southPlusCallbackEntries.push(`    'cha-guan${suffix}': () => window.location.assign('/thread.php?fid-9.html'),`);
    southPlusCallbackEntries.push(`    'ai${suffix}': () => window.location.assign('/thread.php?fid-208.html'),`);
    southPlusCallbackEntries.push(`    'han-hua${suffix}': () => window.location.assign('/thread.php?fid-36.html'),`);
    southPlusCallbackEntries.push(`    'xiao-shuo${suffix}': () => window.location.assign('/thread.php?fid-195.html'),`);
  }

  const southPlusActionsJs = `export default (services) => ({
  callbacks: {
${southPlusCallbackEntries.join('\n')}
  }
});
`;
  await writeFile(path.join(distDir, 'actions/south-plus.js'), southPlusActionsJs, 'utf8');

  // 4. search-engines/south-plus.js
  const southPlusSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/south-plus.js'), southPlusSearchJs, 'utf8');

  // 5. search-engines/2dfan.js
  const twoDfSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/2dfan.js'), twoDfSearchJs, 'utf8');

  // 6. search-engines/vndb.js
  const vndbSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/vndb.js'), vndbSearchJs, 'utf8');

  // 7. search-engines/cool18.js
  const cool18SearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/cool18.js'), cool18SearchJs, 'utf8');

  // 8. actions/dlsite.js
  const dlsiteActionsJs = `export default (services) => ({
  callbacks: {
    'home': () => {
      window.location.assign('https://www.dlsite.com/maniax/');
    },
    'ranking': () => {
      window.location.assign('https://www.dlsite.com/maniax/ranking/');
    },
    'new': () => {
      window.location.assign('https://www.dlsite.com/maniax/new/');
    }
  }
});
`;
  await writeFile(path.join(distDir, 'actions/dlsite.js'), dlsiteActionsJs, 'utf8');

  // 9. search-engines/dlsite.js
  const dlsiteSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/dlsite.js'), dlsiteSearchJs, 'utf8');

  // 10. actions/kemono.js
  const kemonoActionsJs = `export default (services) => ({
  callbacks: {
    'home': () => {
      window.location.assign('https://kemono.su/posts');
    },
    'artists': () => {
      window.location.assign('https://kemono.su/artists');
    },
    'home-party': () => {
      window.location.assign('/posts');
    },
    'artists-party': () => {
      window.location.assign('/artists');
    }
  }
});
`;
  await writeFile(path.join(distDir, 'actions/kemono.js'), kemonoActionsJs, 'utf8');

  // 11. search-engines/kemono.js
  const kemonoSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/kemono.js'), kemonoSearchJs, 'utf8');

  // 12. actions/coomer.js
  const coomerActionsJs = `export default (services) => ({
  callbacks: {
    'home': () => {
      window.location.assign('https://coomer.su/posts');
    },
    'artists': () => {
      window.location.assign('https://coomer.su/artists');
    },
    'home-party': () => {
      window.location.assign('/posts');
    },
    'artists-party': () => {
      window.location.assign('/artists');
    }
  }
});
`;
  await writeFile(path.join(distDir, 'actions/coomer.js'), coomerActionsJs, 'utf8');

  // 13. search-engines/coomer.js
  const coomerSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/coomer.js'), coomerSearchJs, 'utf8');

  // 14. actions/e-hentai.js
  const eHentaiActionsJs = `export default (services) => ({
  callbacks: {
    'home': () => {
      window.location.assign('https://e-hentai.org/');
    },
    'popular': () => {
      window.location.assign('https://e-hentai.org/popular');
    },
    'watched': () => {
      window.location.assign('https://e-hentai.org/watched');
    },
    'home-ex': () => {
      window.location.assign('https://exhentai.org/');
    },
    'popular-ex': () => {
      window.location.assign('https://exhentai.org/popular');
    },
    'watched-ex': () => {
      window.location.assign('https://exhentai.org/watched');
    }
  }
});
`;
  await writeFile(path.join(distDir, 'actions/e-hentai.js'), eHentaiActionsJs, 'utf8');

  // 15. search-engines/e-hentai.js
  const eHentaiSearchJs = `export default () => ({
  callbacks: {
    'search': (response) => []
  }
});
`;
  await writeFile(path.join(distDir, 'search-engines/e-hentai.js'), eHentaiSearchJs, 'utf8');

  // Build south-plus contributions across all alias domains
  const southPlusContributions = [];
  for (const item of SOUTH_PLUS_DOMAINS) {
    const isPrimary = item.slug === 'net';
    const suffix = isPrimary ? '' : `-${item.slug}`;
    const namePrefix = isPrimary ? '' : `[${item.name}] `;
    southPlusContributions.push(
      {
        id: `home${suffix}`,
        alias: 'h',
        description: {
          en: `${namePrefix}Go to South Plus home page`,
          'zh-CN': `${namePrefix}南+ 论坛首页`
        },
        kind: 'mapkey',
        domain: item.domain,
        callbackRequired: true
      },
      {
        id: `cha-guan${suffix}`,
        alias: 'c',
        description: {
          en: `${namePrefix}Open Cha-Guan (Tea House, fid 9)`,
          'zh-CN': `${namePrefix}南+ 茶馆综合讨论区 (fid 9)`
        },
        kind: 'mapkey',
        domain: item.domain,
        callbackRequired: true
      },
      {
        id: `ai${suffix}`,
        alias: 'a',
        description: {
          en: `${namePrefix}Open AI Discussion (fid 208)`,
          'zh-CN': `${namePrefix}南+ AI交流(beta) (fid 208)`
        },
        kind: 'mapkey',
        domain: item.domain,
        callbackRequired: true
      },
      {
        id: `han-hua${suffix}`,
        alias: 'b',
        description: {
          en: `${namePrefix}Open Translated Doujinshi & CG (fid 36)`,
          'zh-CN': `${namePrefix}南+ 汉化本发布区 (fid 36)`
        },
        kind: 'mapkey',
        domain: item.domain,
        callbackRequired: true
      },
      {
        id: `xiao-shuo${suffix}`,
        alias: 'x',
        description: {
          en: `${namePrefix}Open Original Novels (fid 195)`,
          'zh-CN': `${namePrefix}南+ 原创小说区 (fid 195)`
        },
        kind: 'mapkey',
        domain: item.domain,
        callbackRequired: true
      }
    );
  }

  // 16. selective.json
  const selective = {
    schemaVersion: 1,
    namespace: 'bb',
    entries: {
      'actions.f95zone': {
        entry: 'actions/f95zone.js',
        description: {
          en: 'F95zone game portal navigation',
          'zh-CN': 'F95zone 游戏社区页面快捷导航'
        },
        requires: [],
        capabilities: ['core.openLink'],
        contributions: [
          {
            id: 'home',
            alias: 'h',
            description: {
              en: 'Go to F95zone home page',
              'zh-CN': '跳转至 F95zone 首页'
            },
            kind: 'mapkey',
            domain: 'f95zone.to',
            callbackRequired: true
          },
          {
            id: 'trending',
            alias: 't',
            description: {
              en: 'Open Trending Games',
              'zh-CN': '跳转至 Trending Games 热门游戏'
            },
            kind: 'mapkey',
            domain: 'f95zone.to',
            callbackRequired: true
          },
          {
            id: 'latest-updates',
            alias: 'u',
            description: {
              en: 'Open Latest Updates',
              'zh-CN': '跳转至 Latest Updates 最新更新'
            },
            kind: 'mapkey',
            domain: 'f95zone.to',
            callbackRequired: true
          }
        ]
      },
      'search-engines.f95zone': {
        entry: 'search-engines/f95zone.js',
        description: {
          en: 'F95zone game search',
          'zh-CN': 'F95zone 游戏与论坛搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\fz',
            name: 'f95zone',
            search: 'https://f95zone.to/search/?q=',
            callbackRequired: true,
            description: {
              en: 'F95zone game search',
              'zh-CN': 'F95zone 游戏搜索'
            }
          }
        ]
      },
      'actions.south-plus': {
        entry: 'actions/south-plus.js',
        description: {
          en: 'South Plus forum board navigation (supports all mirror domains)',
          'zh-CN': '南+ (South Plus) 论坛常用板块快捷导航 (支持全量镜像域名)'
        },
        requires: [],
        capabilities: ['core.openLink'],
        contributions: southPlusContributions
      },
      'search-engines.south-plus': {
        entry: 'search-engines/south-plus.js',
        description: {
          en: 'South Plus forum search',
          'zh-CN': '南+ (South Plus) 论坛搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\sp',
            name: 'south-plus',
            search: 'https://south-plus.net/search.php?step=2&keyword=',
            callbackRequired: true,
            description: {
              en: 'South Plus forum search',
              'zh-CN': '南+ 论坛搜索'
            }
          }
        ]
      },
      'search-engines.2dfan': {
        entry: 'search-engines/2dfan.js',
        description: {
          en: '2DFan Galgame search',
          'zh-CN': '2DFan 二次元 Galgame 搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\2df',
            name: '2dfan',
            search: 'https://www.2dfan.com/subjects/search?keyword=',
            callbackRequired: true,
            description: {
              en: '2DFan Galgame search',
              'zh-CN': '2DFan Galgame 搜索'
            }
          }
        ]
      },
      'search-engines.vndb': {
        entry: 'search-engines/vndb.js',
        description: {
          en: 'VNDB visual novel database search',
          'zh-CN': 'VNDB 视觉小说数据库搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\vn',
            name: 'vndb',
            search: 'https://vndb.org/v?sq=',
            callbackRequired: true,
            description: {
              en: 'VNDB visual novel search',
              'zh-CN': 'VNDB 视觉小说搜索'
            }
          }
        ]
      },
      'search-engines.cool18': {
        entry: 'search-engines/cool18.js',
        description: {
          en: 'Cool18 Jinji Shuwu novel search',
          'zh-CN': '禁忌书屋 (Cool18) 小说搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\sw',
            name: 'cool18-sw',
            search: 'https://www.cool18.com/bbs4/index.php?app=forum&act=threadsearch&keywords=',
            callbackRequired: true,
            description: {
              en: 'Cool18 Jinji Shuwu novel search',
              'zh-CN': '禁忌书屋小说搜索'
            }
          }
        ]
      },
      'actions.dlsite': {
        entry: 'actions/dlsite.js',
        description: {
          en: 'DLsite quick navigation (Home, Ranking, New)',
          'zh-CN': 'DLsite 快捷导航 (首页、排行榜、最新发售)'
        },
        requires: [],
        capabilities: ['core.openLink'],
        contributions: [
          {
            id: 'home',
            alias: 'h',
            description: {
              en: 'Go to DLsite Maniax Home',
              'zh-CN': '跳转至 DLsite Maniax 首页'
            },
            kind: 'mapkey',
            domain: 'dlsite.com',
            callbackRequired: true
          },
          {
            id: 'ranking',
            alias: 'r',
            description: {
              en: 'Open DLsite Ranking',
              'zh-CN': '打开 DLsite 排行榜'
            },
            kind: 'mapkey',
            domain: 'dlsite.com',
            callbackRequired: true
          },
          {
            id: 'new',
            alias: 'n',
            description: {
              en: 'Open DLsite New Releases',
              'zh-CN': '打开 DLsite 最新作品列表'
            },
            kind: 'mapkey',
            domain: 'dlsite.com',
            callbackRequired: true
          }
        ]
      },
      'search-engines.dlsite': {
        entry: 'search-engines/dlsite.js',
        description: {
          en: 'DLsite work and creator search',
          'zh-CN': 'DLsite 作品与创作者搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\dl',
            name: 'dlsite',
            search: 'https://www.dlsite.com/home/fsr/=/keyword/',
            callbackRequired: true,
            description: {
              en: 'DLsite search',
              'zh-CN': 'DLsite 站内搜索'
            }
          }
        ]
      },
      'actions.kemono': {
        entry: 'actions/kemono.js',
        description: {
          en: 'Kemono creator and post navigation',
          'zh-CN': 'Kemono 创作者与动态快捷导航'
        },
        requires: [],
        capabilities: ['core.openLink'],
        contributions: [
          {
            id: 'home',
            alias: 'h',
            description: {
              en: 'Go to Kemono Posts feed',
              'zh-CN': '跳转至 Kemono 动态流'
            },
            kind: 'mapkey',
            domain: 'kemono.su',
            callbackRequired: true
          },
          {
            id: 'artists',
            alias: 'a',
            description: {
              en: 'Open Kemono Artists directory',
              'zh-CN': '打开 Kemono 创作者列表'
            },
            kind: 'mapkey',
            domain: 'kemono.su',
            callbackRequired: true
          },
          {
            id: 'home-party',
            alias: 'h',
            description: {
              en: '[kemono.party] Go to Kemono Posts feed',
              'zh-CN': '[kemono.party] 跳转至 Kemono 动态流'
            },
            kind: 'mapkey',
            domain: 'kemono.party',
            callbackRequired: true
          },
          {
            id: 'artists-party',
            alias: 'a',
            description: {
              en: '[kemono.party] Open Kemono Artists directory',
              'zh-CN': '[kemono.party] 打开 Kemono 创作者列表'
            },
            kind: 'mapkey',
            domain: 'kemono.party',
            callbackRequired: true
          }
        ]
      },
      'search-engines.kemono': {
        entry: 'search-engines/kemono.js',
        description: {
          en: 'Kemono post search',
          'zh-CN': 'Kemono 赞助动态搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\km',
            name: 'kemono',
            search: 'https://kemono.su/posts?q=',
            callbackRequired: true,
            description: {
              en: 'Kemono post search',
              'zh-CN': 'Kemono 搜索'
            }
          }
        ]
      },
      'actions.coomer': {
        entry: 'actions/coomer.js',
        description: {
          en: 'Coomer creator and post navigation',
          'zh-CN': 'Coomer 创作者与动态快捷导航'
        },
        requires: [],
        capabilities: ['core.openLink'],
        contributions: [
          {
            id: 'home',
            alias: 'h',
            description: {
              en: 'Go to Coomer Posts feed',
              'zh-CN': '跳转至 Coomer 动态流'
            },
            kind: 'mapkey',
            domain: 'coomer.su',
            callbackRequired: true
          },
          {
            id: 'artists',
            alias: 'a',
            description: {
              en: 'Open Coomer Artists directory',
              'zh-CN': '打开 Coomer 创作者列表'
            },
            kind: 'mapkey',
            domain: 'coomer.su',
            callbackRequired: true
          },
          {
            id: 'home-party',
            alias: 'h',
            description: {
              en: '[coomer.party] Go to Coomer Posts feed',
              'zh-CN': '[coomer.party] 跳转至 Coomer 动态流'
            },
            kind: 'mapkey',
            domain: 'coomer.party',
            callbackRequired: true
          },
          {
            id: 'artists-party',
            alias: 'a',
            description: {
              en: '[coomer.party] Open Coomer Artists directory',
              'zh-CN': '[coomer.party] 打开 Coomer 创作者列表'
            },
            kind: 'mapkey',
            domain: 'coomer.party',
            callbackRequired: true
          }
        ]
      },
      'search-engines.coomer': {
        entry: 'search-engines/coomer.js',
        description: {
          en: 'Coomer post search',
          'zh-CN': 'Coomer 赞助动态搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\co',
            name: 'coomer',
            search: 'https://coomer.su/posts?q=',
            callbackRequired: true,
            description: {
              en: 'Coomer post search',
              'zh-CN': 'Coomer 搜索'
            }
          }
        ]
      },
      'actions.e-hentai': {
        entry: 'actions/e-hentai.js',
        description: {
          en: 'E-Hentai and ExHentai gallery navigation',
          'zh-CN': 'E-Hentai / ExHentai 画廊快捷导航'
        },
        requires: [],
        capabilities: ['core.openLink'],
        contributions: [
          {
            id: 'home',
            alias: 'h',
            description: {
              en: 'Go to E-Hentai Home gallery',
              'zh-CN': '跳转至 E-Hentai 首页'
            },
            kind: 'mapkey',
            domain: 'e-hentai.org',
            callbackRequired: true
          },
          {
            id: 'popular',
            alias: 'p',
            description: {
              en: 'Open E-Hentai Popular galleries',
              'zh-CN': '打开 E-Hentai 热门画廊'
            },
            kind: 'mapkey',
            domain: 'e-hentai.org',
            callbackRequired: true
          },
          {
            id: 'watched',
            alias: 'w',
            description: {
              en: 'Open E-Hentai Watched tags',
              'zh-CN': '打开 E-Hentai 关注标签流'
            },
            kind: 'mapkey',
            domain: 'e-hentai.org',
            callbackRequired: true
          },
          {
            id: 'home-ex',
            alias: 'h',
            description: {
              en: '[ExHentai] Go to ExHentai Home gallery',
              'zh-CN': '[ExHentai] 跳转至 ExHentai 首页'
            },
            kind: 'mapkey',
            domain: 'exhentai.org',
            callbackRequired: true
          },
          {
            id: 'popular-ex',
            alias: 'p',
            description: {
              en: '[ExHentai] Open ExHentai Popular galleries',
              'zh-CN': '[ExHentai] 打开 ExHentai 热门画廊'
            },
            kind: 'mapkey',
            domain: 'exhentai.org',
            callbackRequired: true
          },
          {
            id: 'watched-ex',
            alias: 'w',
            description: {
              en: '[ExHentai] Open ExHentai Watched tags',
              'zh-CN': '[ExHentai] 打开 ExHentai 关注标签流'
            },
            kind: 'mapkey',
            domain: 'exhentai.org',
            callbackRequired: true
          }
        ]
      },
      'search-engines.e-hentai': {
        entry: 'search-engines/e-hentai.js',
        description: {
          en: 'E-Hentai gallery search',
          'zh-CN': 'E-Hentai 画廊搜索'
        },
        requires: [],
        capabilities: [],
        contributions: [
          {
            id: 'search',
            kind: 'search',
            alias: '\\eh',
            name: 'e-hentai',
            search: 'https://e-hentai.org/?f_search=',
            callbackRequired: true,
            description: {
              en: 'E-Hentai search',
              'zh-CN': 'E-Hentai 搜索'
            }
          }
        ]
      }
    }
  };

  const selectiveJson = JSON.stringify(selective, null, 2) + '\n';
  await writeFile(path.join(distDir, 'selective.json'), selectiveJson, 'utf8');

  // 17. index.js & index.d.ts
  const indexJs = `import selective from './selective.json' with { type: 'json' };
export { selective };
export default selective;
`;
  const indexDts = `export declare const selective: Record<string, unknown>;
export default selective;
`;
  await writeFile(path.join(distDir, 'index.js'), indexJs, 'utf8');
  await writeFile(path.join(distDir, 'index.d.ts'), indexDts, 'utf8');
}

if (process.argv[1] && (process.argv[1].endsWith('build.js') || process.argv[1].endsWith('build.ts'))) {
  buildLibBb()
    .then(() => console.log('✅ @skcb/lib-bb build completed.'))
    .catch((err) => {
      console.error('❌ @skcb/lib-bb build failed:', err);
      process.exit(1);
    });
}
