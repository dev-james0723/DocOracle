# Contributing to DocOracle

Thank you for your interest in contributing to DocOracle. This document provides guidelines and information for contributors.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. When reporting bugs, include the following information:

- Your operating system and Python/Node.js versions
- The PDF size (page count) you were processing
- The specific pipeline step where the error occurred
- The full error message and stack trace

### Submitting Changes

1. Fork the repository
2. Create a feature branch from `main` (`git checkout -b feature/your-feature-name`)
3. Make your changes and test them thoroughly
4. Commit with a clear, descriptive message (`git commit -m 'Add: brief description of change'`)
5. Push to your fork (`git push origin feature/your-feature-name`)
6. Open a Pull Request against `main`

### Development Setup

To set up a local development environment:

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/DocOracle.git
cd DocOracle

# Install pipeline dependencies
pip install -r pipeline/requirements.txt

# Install website dependencies
cd website
npm install
```

### Areas Where Help Is Needed

The following areas are particularly welcome for contributions:

| Area | Description |
|------|-------------|
| **LLM Provider Support** | Adding support for additional LLM providers (Anthropic Claude, Mistral, local models via Ollama) |
| **Pipeline Optimization** | Improving processing speed, reducing API calls, better caching |
| **Language Support** | Extending the pipeline to handle non-English PDFs |
| **Output Formats** | Supporting additional output formats beyond JSON/JSONL |
| **Website Features** | Improving the chat UI, adding export functionality, better mobile support |
| **Documentation** | Improving guides, adding tutorials, translating documentation |
| **Testing** | Adding more test coverage for pipeline scripts and website components |

### Code Style

For Python pipeline scripts, follow PEP 8 conventions. For the website (TypeScript/React), follow the existing code style and use the project's Prettier configuration.

### Commit Message Format

Use clear, descriptive commit messages:

```
Add: new feature description
Fix: bug description
Update: what was changed and why
Remove: what was removed and why
Docs: documentation change description
```

## Code of Conduct

Be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive experience for everyone.

## Questions?

If you have questions about contributing, feel free to open an issue with the "question" label.
