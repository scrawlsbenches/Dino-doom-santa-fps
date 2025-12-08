# Contributing to Dino Doom: Santa's Last Stand

## Development Workflow

### Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run pre-commit checks. Before each commit, the following checks run automatically:

1. **ESLint** - Linting with zero warnings allowed
2. **Unit Tests** - All 130+ unit tests must pass

If any check fails, the commit will be blocked.

### Running Tests Locally

```bash
# Run unit tests
npm test

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (requires Playwright browsers)
npm run test:e2e

# Run all tests
npm run test:all

# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix

# Run strict linting (no warnings allowed)
npm run lint:strict
```

### CI Pipeline

The CI pipeline runs on all pull requests and pushes to `main`, `master`, `develop`, and `claude/**` branches.

**All of the following must pass:**
- ESLint (zero warnings)
- Unit tests with coverage
- E2E tests (Playwright)
- JavaScript syntax validation

## Branch Protection Setup

To protect the `main` branch, configure the following rules in GitHub:

### Required Settings

1. Go to **Settings** → **Branches** → **Add branch protection rule**

2. Set **Branch name pattern**: `main`

3. Enable the following:

   - [x] **Require a pull request before merging**
     - [x] Require approvals: 1 (or more)
     - [x] Dismiss stale pull request approvals when new commits are pushed

   - [x] **Require status checks to pass before merging**
     - [x] Require branches to be up to date before merging
     - Add required status checks:
       - `Unit Tests & Lint`
       - `E2E Tests`
       - `Syntax Validation`
       - `CI Status`

   - [x] **Require conversation resolution before merging**

   - [x] **Do not allow bypassing the above settings**

### Optional Settings

   - [ ] **Require signed commits** (if your team uses GPG signing)
   - [ ] **Require linear history** (prevents merge commits)
   - [ ] **Include administrators** (applies rules to admins too)

## Code Coverage

Code coverage reports are generated during CI and uploaded as artifacts. View coverage by:

1. Going to the **Actions** tab
2. Selecting a workflow run
3. Downloading the `coverage-report` artifact

Coverage includes:
- **Text summary** in CI logs
- **HTML report** for detailed file-by-file coverage
- **LCOV format** for integration with coverage tools

## Husky in Claude Code Web

The pre-commit hooks are configured to work in Claude Code Web environments. The `prepare` script uses `husky || true` to gracefully handle environments where Git hooks may not be fully supported.

If you encounter issues:
1. Hooks can be bypassed with `git commit --no-verify` (use sparingly)
2. CI will still enforce all checks on the server
