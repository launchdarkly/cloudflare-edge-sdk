const { Miniflare } = require('miniflare');

jest.setTimeout(30000);

test('worker', async () => {
  const mf = new Miniflare({
    scriptPath: './tests/miniflare/dist/worker.js',
    packagePath: './tests/miniflare/package.json',
    wranglerConfigPath: './tests/miniflare/wrangler.toml',
  });

  const response = await mf.dispatchFetch('http://localhost:8787/');
  const result = await response.text();

  expect(result).toBe('false');
});
