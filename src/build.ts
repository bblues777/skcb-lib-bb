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
  // Generate unified callbacks for primary domain and all aliases
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

  // 8. selective.json
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
      }
    }
  };

  const selectiveJson = JSON.stringify(selective, null, 2) + '\n';
  await writeFile(path.join(distDir, 'selective.json'), selectiveJson, 'utf8');

  // Also write selective.json at repository root with dist/ prefix if needed, or keep root selective.json
  const rootSelective = {
    ...selective,
    entries: Object.fromEntries(
      Object.entries(selective.entries).map(([k, v]) => [k, { ...v, entry: `dist/${v.entry}` }])
    )
  };
  await writeFile(path.join(rootDir, 'selective.json'), JSON.stringify(rootSelective, null, 2) + '\n', 'utf8');

  // 9. index.js & index.d.ts
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
