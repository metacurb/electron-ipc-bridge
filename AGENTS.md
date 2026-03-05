# AGENTS.md

## Project Context

- Repository: `electron-ipc-bridge` monorepo.
- Published npm packages:
  - `@electron-ipc-bridge/core`
  - `@electron-ipc-bridge/vite-plugin`
- Internal workspace package: `@electron-ipc-bridge/shared` (private).
- Docs site lives in `apps/docs` and is deployed to GitHub Pages.
- Tooling source of truth:
  - Node engine: `^24`
  - pnpm engine: `^10`
  - Defined in root `package.json`.

## Repo Layout

- `packages/core`: runtime/decorator IPC library.
- `packages/vite-plugin`: type generation Vite plugin.
- `packages/shared`: shared internal utilities/types.
- `apps/docs`: Docusaurus docs site.
- `apps/examples/*`: integration examples.
- `.github/workflows/ci.yml`: lint/test/build validation.
- `.github/workflows/release-please.yml`: release PR and notes automation.
- `.github/workflows/release.yml`: publish npm packages, upload tarballs, deploy docs.
- `release-please-config.json`: release notes/categories and linked versions.
- `.release-please-manifest.json`: tracked versions per releasable package.

## Working Rules For Agents

- Prioritize correctness of public package behavior over examples/docs polish.
- Treat `README.md` and `apps/docs` as user-facing contract docs; update when APIs or setup change.
- Do not edit generated artifacts (`dist`, pack output, docs build output) unless explicitly requested.
- Prefer `pnpm` commands and `--filter` for scoped workspace tasks.
- Keep changes targeted; avoid broad refactors unless required.
- Preserve linked versioning across `core` and `vite-plugin`.

## Validation Commands

Run the smallest relevant subset:

- `pnpm lint`
- `pnpm test`
- `pnpm --filter @electron-ipc-bridge/shared build`
- `pnpm --filter @electron-ipc-bridge/core build`
- `pnpm --filter @electron-ipc-bridge/vite-plugin build`
- `pnpm --filter docs typecheck`
- `pnpm --filter docs build`

## Release Automation Notes

- `release-please` is the only mechanism for versioning/changelog automation.
- Releasable components are `core` and `vite-plugin`; versions are linked.
- Changelogs are package-scoped:
  - `packages/core/CHANGELOG.md`
  - `packages/vite-plugin/CHANGELOG.md`
- Publishing a GitHub release with tag prefix `core-v` triggers release workflow.
- Release workflow performs:
  - package builds,
  - `.tgz` asset upload to GitHub release,
  - npm publish for both public packages,
  - docs deployment to GitHub Pages.

## Commit Guidance

- Use Conventional Commits.
- Prefer these releasable types:
  - `feat`
  - `fix`
  - `perf`
  - `refactor`
  - `deps`
- Use `docs`, `test`, `ci`, `chore` when not user-facing/releasable.
- Release notes mapping:
  - `feat` -> `Added`
  - `fix` -> `Fixed`
  - `perf` -> `Changed`
  - `refactor` -> `Changed`
  - `deps` -> `Changed`
