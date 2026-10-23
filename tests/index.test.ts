import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import { SOUTH_PLUS_DOMAINS } from '../dist-build/build.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');

test('@skcb/lib-bb: selective.json complies with skcb manifest schema', async () => {
  // Read manifest.schema.json from @skcb/core
  const schemaPath = path.resolve(projectRoot, 'node_modules/@skcb/core/schemas/manifest.schema.json');
  const schemaText = await readFile(schemaPath, 'utf8');
  const manifestSchema = JSON.parse(schemaText);

  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(manifestSchema);

  // Validate dist/selective.json
  const distManifest = JSON.parse(await readFile(path.join(distDir, 'selective.json'), 'utf8'));
  const validDist = validate(distManifest);
  assert.ok(validDist, `dist/selective.json schema errors: ${JSON.stringify(validate.errors)}`);

  // Validate root selective.json
  const rootManifest = JSON.parse(await readFile(path.join(projectRoot, 'selective.json'), 'utf8'));
  const validRoot = validate(rootManifest);
  assert.ok(validRoot, `root selective.json schema errors: ${JSON.stringify(validate.errors)}`);
});

test('@skcb/lib-bb: all entry files exist and export expected callbacks', async () => {
  const manifest = JSON.parse(await readFile(path.join(distDir, 'selective.json'), 'utf8'));

  for (const [entryId, entryMeta] of Object.entries<any>(manifest.entries)) {
    const entryFilePath = path.join(distDir, entryMeta.entry);
    await assert.doesNotReject(access(entryFilePath), `Entry file ${entryFilePath} must exist for ${entryId}`);

    const mod = await import(entryFilePath);
    assert.equal(typeof mod.default, 'function', `Entry ${entryId} default export must be a factory function`);

    const result = mod.default({ openLink: () => {} });
    assert.ok(result && typeof result === 'object', `Factory for ${entryId} must return an object`);
    assert.ok(result.callbacks && typeof result.callbacks === 'object', `Factory for ${entryId} must return callbacks`);

    // Verify all contributions with callbackRequired have a matching callback
    for (const contrib of entryMeta.contributions) {
      if (contrib.callbackRequired) {
        assert.equal(
          typeof result.callbacks[contrib.id],
          'function',
          `Callback '${contrib.id}' missing in ${entryMeta.entry} for contribution ${contrib.id}`
        );
      }
    }
  }
});

test('@skcb/lib-bb: unified prefix "\\" for all search engines', async () => {
  const manifest = JSON.parse(await readFile(path.join(distDir, 'selective.json'), 'utf8'));

  const expectedSearches = {
    'search-engines.f95zone': { alias: '\\fz', name: 'f95zone', search: 'https://f95zone.to/search/?q=' },
    'search-engines.south-plus': { alias: '\\sp', name: 'south-plus', search: 'https://south-plus.net/search.php?step=2&keyword=' },
    'search-engines.2dfan': { alias: '\\2df', name: '2dfan', search: 'https://www.2dfan.com/subjects/search?keyword=' },
    'search-engines.vndb': { alias: '\\vn', name: 'vndb', search: 'https://vndb.org/v?sq=' },
    'search-engines.cool18': { alias: '\\sw', name: 'cool18-sw', search: 'https://www.cool18.com/bbs4/index.php?app=forum&act=threadsearch&keywords=' }
  };

  for (const [key, expected] of Object.entries(expectedSearches)) {
    const entry = manifest.entries[key];
    assert.ok(entry, `Entry ${key} must exist in manifest`);
    const contrib = entry.contributions.find((c: any) => c.kind === 'search');
    assert.ok(contrib, `Search contribution missing in ${key}`);
    assert.equal(contrib.alias, expected.alias, `Search alias for ${key} must be ${expected.alias}`);
    assert.equal(contrib.name, expected.name, `Search name for ${key} must be ${expected.name}`);
    assert.equal(contrib.search, expected.search, `Search URL for ${key} must match`);
    assert.ok(contrib.alias.startsWith('\\'), `Search alias ${contrib.alias} must start with "\\"`);
  }
});

test('@skcb/lib-bb: f95zone actions support home, trending, and latest-updates', async () => {
  const manifest = JSON.parse(await readFile(path.join(distDir, 'selective.json'), 'utf8'));
  const entry = manifest.entries['actions.f95zone'];
  assert.ok(entry);

  const home = entry.contributions.find((c: any) => c.id === 'home');
  assert.ok(home);
  assert.equal(home.alias, 'h');
  assert.equal(home.domain, 'f95zone.to');

  const trending = entry.contributions.find((c: any) => c.id === 'trending');
  assert.ok(trending);
  assert.equal(trending.alias, 't');
  assert.equal(trending.domain, 'f95zone.to');

  const latest = entry.contributions.find((c: any) => c.id === 'latest-updates');
  assert.ok(latest);
  assert.equal(latest.alias, 'u');
  assert.equal(latest.domain, 'f95zone.to');
});

test('@skcb/lib-bb: south-plus actions support 12 mirror domains with 5 core boards each', async () => {
  const manifest = JSON.parse(await readFile(path.join(distDir, 'selective.json'), 'utf8'));
  const entry = manifest.entries['actions.south-plus'];
  assert.ok(entry);

  assert.equal(SOUTH_PLUS_DOMAINS.length, 12, 'Must include 12 south-plus domains');

  for (const item of SOUTH_PLUS_DOMAINS) {
    const isPrimary = item.slug === 'net';
    const suffix = isPrimary ? '' : `-${item.slug}`;

    const home = entry.contributions.find((c: any) => c.id === `home${suffix}`);
    assert.ok(home, `home${suffix} missing for domain ${item.domain}`);
    assert.equal(home.domain, item.domain);
    assert.equal(home.alias, 'h');

    const tea = entry.contributions.find((c: any) => c.id === `cha-guan${suffix}`);
    assert.ok(tea, `cha-guan${suffix} missing for domain ${item.domain}`);
    assert.equal(tea.domain, item.domain);
    assert.equal(tea.alias, 'c');

    const ai = entry.contributions.find((c: any) => c.id === `ai${suffix}`);
    assert.ok(ai, `ai${suffix} missing for domain ${item.domain}`);
    assert.equal(ai.domain, item.domain);
    assert.equal(ai.alias, 'a');

    const hanhua = entry.contributions.find((c: any) => c.id === `han-hua${suffix}`);
    assert.ok(hanhua, `han-hua${suffix} missing for domain ${item.domain}`);
    assert.equal(hanhua.domain, item.domain);
    assert.equal(hanhua.alias, 'b');

    const novel = entry.contributions.find((c: any) => c.id === `xiao-shuo${suffix}`);
    assert.ok(novel, `xiao-shuo${suffix} missing for domain ${item.domain}`);
    assert.equal(novel.domain, item.domain);
    assert.equal(novel.alias, 'x');
  }

  // Total contributions: 12 domains * 5 boards = 60 contributions
  assert.equal(entry.contributions.length, 60);
});

test('@skcb/lib-bb: end-to-end integration with @skcb/core loader and registration', async () => {
  const { loadMetadataCatalog, registrationPlan } = await import('@skcb/core');

  // Load catalog using @skcb/core
  const mockCtx: any = {
    root: projectRoot,
    extensions: [distDir]
  };

  const catalog = await loadMetadataCatalog(mockCtx);
  const bbEntries = catalog.entries.filter((e: any) => e.id.startsWith('bb/'));
  assert.equal(bbEntries.length, 7, 'Must resolve all 7 features in bb namespace');

  // Test profile resolution and registration plan
  const activeContribs = bbEntries.flatMap((e: any) =>
    e.contributions.map((c: any) => ({ ...c, featureId: e.id }))
  );

  const mockProfile: any = {
    schemaVersion: 1,
    id: 'test-bb',
    abstract: false,
    base: 'minimal',
    select: bbEntries.map((e: any) => e.id),
    settings: {},
    leaders: { site: '<Space>', search: 'a' },
    overrides: [],
    provenance: {}
  };

  const plan = registrationPlan(activeContribs, mockProfile);
  assert.ok(plan.registrations.length > 0);

  // Check generated keys for search engines
  const fzSearch = plan.registrations.find((r: any) => r.id === 'search' && r.featureId === 'bb/search-engines.f95zone');
  assert.ok(fzSearch);
  assert.deepEqual(fzSearch.keys, ['a\\fz', 'ca\\fz'], 'f95zone search key must be a\\fz and ca\\fz');

  const spSearch = plan.registrations.find((r: any) => r.id === 'search' && r.featureId === 'bb/search-engines.south-plus');
  assert.ok(spSearch);
  assert.deepEqual(spSearch.keys, ['a\\sp', 'ca\\sp'], 'south-plus search key must be a\\sp and ca\\sp');

  const cool18Search = plan.registrations.find((r: any) => r.id === 'search' && r.featureId === 'bb/search-engines.cool18');
  assert.ok(cool18Search);
  assert.deepEqual(cool18Search.keys, ['a\\sw', 'ca\\sw'], 'cool18 search key must be a\\sw and ca\\sw');

  // Check site actions keys
  const fzHome = plan.registrations.find((r: any) => r.id === 'home' && r.featureId === 'bb/actions.f95zone');
  assert.ok(fzHome);
  assert.deepEqual(fzHome.keys, ['<Space>h']);
  assert.ok(fzHome.pattern?.includes('f95zone\\.to'));

  const spChaGuan = plan.registrations.find((r: any) => r.id === 'cha-guan' && r.featureId === 'bb/actions.south-plus');
  assert.ok(spChaGuan);
  assert.deepEqual(spChaGuan.keys, ['<Space>c']);
  assert.ok(spChaGuan.pattern?.includes('south-plus\\.net'));
});
