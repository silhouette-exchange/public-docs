# Vale Setup Guide for Silhouette Documentation

## Overview
Vale has been configured for the Silhouette documentation with custom styles optimized for technical blockchain documentation.

## Configuration Structure

### Core Files
- `.vale.ini` - Main configuration file
- `.github/workflows/vale.yml` - GitHub Action for automated checks
- `.github/styles/` - Custom style rules and vocabulary

### Style Configuration

#### Applied Styles
1. **Vale** - Core Vale rules
2. **write-good** - General writing improvements
3. **Joblint** - Inclusive language checks
4. **Microsoft** - Technical documentation best practices
5. **Silhouette** - Custom rules for project-specific terminology

#### Custom Silhouette Styles
- **Terminology.yml** - Enforces correct capitalization (Silhouette, HyperCore, HyperEVM, TEE)
- **TechnicalWriting.yml** - Removes unnecessary words and phrases
- **Clarity.yml** - Suggests simpler alternatives to complex terms

### Vocabulary Management
- **accept.txt** - Approved technical terms and project-specific vocabulary
- **reject.txt** - Common misspellings and incorrect variations

## Style Recommendations

### 1. Consistency
- Use "Silhouette" (capitalized) not "silhouette"
- Use "HyperCore" and "HyperEVM" (no spaces)
- Use "TEE" or "TEEs" (not "tee" or "Tee")
- Use "onchain" (one word, no hyphen)

### 2. Technical Writing
- Avoid filler words: "very", "really", "quite", "just", "simply"
- Use active voice when possible
- Be direct and concise
- Avoid "in order to" - use "to" instead

### 3. Clarity
- Prefer simple words: "use" over "utilize", "help" over "facilitate"
- Write for an international audience
- Define technical terms on first use

### 4. Structure
- Use clear, descriptive headings
- Keep paragraphs focused on one topic
- Use lists for multiple related items
- Include code examples where helpful

## Running Vale Locally

### Installation
```bash
# macOS
brew install vale

# Linux/Windows
# Download from https://github.com/errata-ai/vale/releases
```

### Usage
```bash
# Check all documentation
vale docs/

# Check specific file
vale docs/about-silhouette.md

# Check with specific configuration
vale --config=.vale.ini docs/
```

### VS Code Integration
Install the Vale VS Code extension for real-time linting:
1. Search for "Vale" in VS Code extensions
2. Install "Vale +CLS"
3. Configure extension to use `.vale.ini`

## GitHub Action

The Vale GitHub Action runs automatically on:
- Push to `main` or `develop` branches
- Pull requests that modify documentation files

The action:
- Checks all markdown files in `docs/` and `README.md`
- Reports issues as PR comments
- Uploads detailed results as artifacts
- Won't block merges (fail_on_error: false)

## Customization

To adjust the configuration:

1. **Add accepted terms**: Edit `.github/styles/Vocab/Silhouette/accept.txt`
2. **Add rejected terms**: Edit `.github/styles/Vocab/Silhouette/reject.txt`
3. **Modify rules**: Edit files in `.github/styles/Silhouette/`
4. **Change severity**: Adjust `MinAlertLevel` in `.vale.ini`

## Best Practices

1. Run Vale locally before committing
2. Review Vale suggestions, not all need to be fixed
3. Add project-specific terms to vocabulary files
4. Consider context - some rules may not apply to code examples
5. Use Vale comments to ignore specific instances:
   ```markdown
   <!-- vale off -->
   Content to ignore
   <!-- vale on -->
   ```