import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';

async function collect(directory = '') {
  const files = [];
  for (const entry of await readdir(`dist/${directory}`, {withFileTypes:true})) {
    const path = `${directory}${entry.name}`;
    if (entry.isDirectory()) files.push(...await collect(`${path}/`));
    else if (!path.endsWith('.map') && path !== 'sw.js') files.push(`./${path}`);
  }
  return files.sort();
}
const files = await collect();
const template = await readFile('scripts/service-worker.js','utf8');
const hash = createHash('sha256').update(template);
for (const file of files) hash.update(file).update(await readFile(`dist/${file}`));
const version = `common-cents-app-shell-${hash.digest('hex').slice(0,12)}`;
await writeFile('dist/sw.js',template.replace('"__CACHE__"',JSON.stringify(version)).replace('"__SHELL__"',JSON.stringify(files)));
console.log(`CommonCents production shell: ${version}, ${files.length} assets`);
