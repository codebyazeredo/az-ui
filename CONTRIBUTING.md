# Contributing to AZ UI

Thanks for your interest in AZ UI. This guide explains how to propose changes.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md). Security problems must be reported privately as described in [SECURITY.md](SECURITY.md), never in public issues.

## Project status

AZ UI is built in phases (see [`.ai/development/roadmap.md`](.ai/development/roadmap.md), written in Portuguese for AI tooling). Only the current phase accepts new work. Open an issue to discuss an idea before sending a pull request for anything beyond a small fix.

## Setup

Requires Node.js 22 or later.

```bash
npm install
npm run dev     # local server; open /examples/index.html
npm run build   # dist/: ESM, types, CSS and fonts
npm test
npm run lint
npm run format:check
```

## Guidelines

- Keep changes small and focused on one concern.
- Write code, names, messages, tests, examples and documentation in English.
- Do not add comments unless they are essential to understand a non-obvious decision.
- Use design tokens (`--az-*`) instead of literal colors, spacing, fonts or shadows.
- Prefix every public CSS class with `az-` and every custom property with `--az-`.
- Do not add runtime dependencies. Explain any new development dependency in the pull request.
- Do not use Bootstrap, Tailwind, jQuery or any framework in the core.
- Components must be accessible (WCAG 2.2 AA): semantic HTML, keyboard support, visible focus, sufficient contrast.
- Never insert user-provided values as raw HTML.
- Add tests for behavior you change. Do not add tests only to raise coverage.
- Update the README, documentation and `CHANGELOG.md` when public behavior changes.

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/), for example `feat(button): add loading state` or `fix(themes): raise muted text contrast`.

Before opening a pull request, make sure that `npm run lint`, `npm run format:check` and `npm test` pass.

Every pull request uses the [pull request template](.github/PULL_REQUEST_TEMPLATE.md). These three sections are required:

1. **Responsible:** your name and GitHub user.
2. **What was done:** the changes made.
3. **Why it was done:** the reason for the changes.

Also fill in the type of change, related issue, impact on the public API, verification and checklist. Remove nothing; mark items that do not apply as unchecked.

Pull requests with an empty required section will not be reviewed.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
