# Security Policy

## Supported Versions

Only the latest release deployed at [docu.msk-scripts.de](https://docu.msk-scripts.de) (i.e. the current `main` branch) receives security updates. Older snapshots or forks are not maintained.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| older   | :x:                |

## Reporting a Vulnerability

In order for the vulnerability reports to reach maintainers as soon as possible, the preferred way is to use the **"Report a vulnerability"** button under the **Security** tab of this GitHub repository. This creates a private communication channel between the reporter and the maintainers.

If you are absolutely unable to or have strong reasons not to use GitHub's vulnerability reporting workflow, please reach out to the team by mailing **info@msk-scripts.de**.

Please include, where possible:

- A clear description of the issue and its impact
- Steps to reproduce or a proof-of-concept
- The affected URL, page, or component
- Any suggested remediation

We aim to acknowledge new reports within **72 hours** and to provide a status update within **7 days**.

## Dependency Management

Third-party dependencies are monitored via **GitHub Dependabot**. Alerts are triaged and patched as quickly as possible:

- **Critical / High:** patched as soon as a fix is available.
- **Moderate:** patched in the next regular dependency sweep, typically within one week.
- **Low / Informational:** patched alongside scheduled maintenance.

Transitive dependencies that cannot be upgraded directly via `package.json` are pinned via the `resolutions` block in [package.json](package.json) to ensure patched versions reach the lockfile.

## Scope

This policy applies to the documentation site itself (this repository). Vulnerabilities in the underlying scripts, Discord bots, or shop should be reported in their respective repositories.
