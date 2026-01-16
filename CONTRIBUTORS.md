# Contributing to Niena Starter Kit

Thank you for your interest in contributing to the Niena Starter Kit! We welcome contributions from the community to help improve this CLI tool.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## How to Contribute

### Reporting Bugs

If you encounter any bugs or issues, please open an issue on our GitHub repository with the following information:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Your environment (OS, Node.js version, package manager)

### Suggesting Enhancements

We love hearing ideas for new features! Please open an issue to discuss your suggestion before submitting a pull request to ensure it aligns with the project's goals.

### Submitting Pull Requests

1.  **Fork the repository** and clone it to your local machine.
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b my-feature-branch
    ```
3.  **Make your changes** and ensure they follow the project's coding style.
4.  **Run tests** to verify your changes:
    ```bash
    npm test
    ```
5.  **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/) format. This is **required** for automated versioning and release notes.
    - `feat: ...` for a new feature (triggers MINOR release).
    - `fix: ...` for a bug fix (triggers PATCH release).
    - `docs: ...`, `style: ...`, `refactor: ...`, `test: ...`, `chore: ...` for other changes (no release trigger, unless specified).
    - Append `!` after the type/scope for BREAKING CHANGES (triggers MAJOR release).
    - Example: `feat(cli): add new template option`
6.  **Push to your fork**:
    ```bash
    git push origin my-feature-branch
    ```
7.  **Submit a Pull Request** to the `main` branch of the original repository.

## Development Setup

To set up the project locally for development:

1.  Clone the repo.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the CLI locally to test:
    ```bash
    node bin/index.js test-project-name
    ```

## License

By contributing, you agree that your contributions will be licensed under the MIT License of this project.
