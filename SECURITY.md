# Security Policy

## Supported versions

AZ UI is in its initial development (`0.x`). Security fixes are released for the latest published version only.

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |
| older   | No        |

## Reporting a vulnerability

Please do not open a public issue, pull request or discussion for security problems.

Report privately using GitHub's private vulnerability reporting: open the **Security** tab of the repository and choose **Report a vulnerability**.

Include, when possible:

- A description of the issue and its impact.
- The affected version and, if relevant, browser and framework.
- Steps or a minimal example to reproduce it.
- A suggested fix, if you have one.

## What to expect

- Acknowledgement of your report on a best-effort basis.
- An assessment of the issue and, if confirmed, a fix and a release.
- Credit in the release notes if you want it.

Please allow time for a fix before disclosing the issue publicly.

## Scope

In scope:

- Cross-site scripting or HTML injection through the declarative API (`AZUI.Form.*`, `render()`), including unsafe handling of user-provided values.
- Vulnerabilities in the published package contents (JavaScript, CSS, fonts).
- Compromise of the build or release process that could affect the published package.

Out of scope:

- Vulnerabilities in applications that use AZ UI but are caused by their own code.
- Vulnerabilities in development-only dependencies that are not shipped in the package.
- Issues that require an already compromised browser or device.
