# Contributing to Electron IPC Bridge

Thanks for contributing.

This repository is a pnpm monorepo with two published packages:

- `@electron-ipc-bridge/core`
- `@electron-ipc-bridge/vite-plugin`

It also contains shared internal code, docs, and examples.

## Prerequisites

- Node.js `^24`
- pnpm `^10`

The canonical versions are defined in the root `package.json` under `engines`.

## Setup

```bash
git clone https://github.com/metacurb/electron-ipc-bridge.git
cd electron-ipc-bridge
pnpm install
```

## Repository Layout

- `packages/core`: IPC framework package published to npm.
- `packages/vite-plugin`: Vite plugin package published to npm.
- `packages/shared`: private shared workspace package.
- `apps/docs`: Docusaurus documentation site.
- `apps/examples/*`: example projects.

## Common Commands

From repository root:

- `pnpm lint`
- `pnpm test`
- `pnpm format`
- `pnpm format:check`

Scoped builds/checks:

- `pnpm --filter @electron-ipc-bridge/shared build`
- `pnpm --filter @electron-ipc-bridge/core build`
- `pnpm --filter @electron-ipc-bridge/vite-plugin build`
- `pnpm --filter docs typecheck`
- `pnpm --filter docs build`
- `pnpm --filter docs start`

## Pull Request Checklist

Before opening a PR, run the checks relevant to your change:

1. `pnpm lint`
2. `pnpm test`
3. Build changed packages (and docs if affected)
4. Update `README.md` and/or docs when public behavior changes

Keep PRs focused and include:

- concise summary,
- user-facing behavior/API impact,
- tests added or updated,
- docs updates when needed.

## Commit Convention

Use Conventional Commits for commit messages and PR titles.

Releasable types in this repo:

- `feat`
- `fix`
- `perf`
- `refactor`
- `deps`

Non-releasable/maintenance types:

- `docs`
- `test`
- `ci`
- `chore`

Release notes mapping:

- `feat` -> `Added`
- `fix` -> `Fixed`
- `perf`, `refactor`, `deps` -> `Changed`

## Release Process (Automated)

Release automation is managed by Release Please and GitHub Actions.

1. Pushes to `main` run `.github/workflows/release-please.yml`.
2. Release Please opens/updates a release PR for:
   - `packages/core`
   - `packages/vite-plugin`
3. Versions are linked for those two packages.
4. Merging the release PR creates tags/releases.
5. Publishing the GitHub release triggers `.github/workflows/release.yml`, which:
   - builds packages,
   - uploads `.tgz` package artifacts to the release,
   - publishes both packages to npm,
   - deploys docs to GitHub Pages.
