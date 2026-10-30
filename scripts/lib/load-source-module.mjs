import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import ts from "typescript";

// Load the actual TypeScript readers without Next.js or environment files.
export function sourceLoader(root, overrides = {}) {
  const cache = new Map();
  const externalRequire = createRequire(path.join(root, "package.json"));
  function load(filename) {
    filename = path.resolve(root, filename);
    if (Object.hasOwn(overrides, filename)) return overrides[filename];
    if (cache.has(filename)) return cache.get(filename).exports;
    const loaded = { exports: {} };
    cache.set(filename, loaded);
    const code = ts.transpileModule(readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    }).outputText;
    const require = (specifier) => {
      if (!specifier.startsWith(".") && !specifier.startsWith("@/"))
        return externalRequire(specifier);
      const target = specifier.startsWith("@/")
        ? path.join(root, specifier.slice(2))
        : path.resolve(path.dirname(filename), specifier);
      const resolved = [
        target,
        `${target}.ts`,
        `${target}.tsx`,
        path.join(target, "index.ts"),
      ].find((candidate) => existsSync(candidate) && /\.[cm]?[jt]sx?$/.test(candidate));
      if (!resolved) throw new Error(`Cannot resolve test module ${specifier}`);
      return load(resolved);
    };
    new Function("require", "module", "exports", code)(require, loaded, loaded.exports);
    return loaded.exports;
  }
  return load;
}
