# Contributing to Arcraft

Thank you for your interest in contributing! This document explains how to set up the project, the development workflow, and our expectations for pull requests.

## Setup

```bash
# Clone your fork
git clone https://github.com/<your-username>/arcraft.git
cd arcraft

# Install dependencies
npm install

# Build outputs (browser, esm, cjs)
npm run build

# Generate docs
npm run docs
```

## Development

- Use Node.js >= 18
- Work on a feature branch: `git checkout -b feat/<short-description>`
- Keep edits focused and commits atomic
- Run lint and format before committing:

```bash
npm run lint:fix
npm run format
```

## Testing and Verification

- Ensure build succeeds locally: `npm run build`
- If you change TypeDoc comments, regenerate docs: `npm run docs`
- For examples, see `usecase/` apps. They are optional during PRs.

## Commit Messages

Follow conventional commits:

- `feat: ...` new user-facing feature
- `fix: ...` bug fix
- `docs: ...` documentation only
- `refactor: ...` code change that neither fixes a bug nor adds a feature
- `chore: ...` tooling or auxiliary changes

Keep messages in present tense and concise.

## Pull Requests

- Describe the change and motivation
- Include screenshots or logs when useful
- Link related issues
- Check the PR passes CI (build/lint)

## Code Style

- TypeScript strictness as configured
- Prefer descriptive names and early returns
- Document all public APIs with TypeDoc comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
