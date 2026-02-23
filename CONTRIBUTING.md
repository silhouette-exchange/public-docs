# Contributing to Silhouette Exchange Documentation

Thank you for your interest in contributing to the Silhouette Exchange documentation! This guide will help you get started with contributing to our documentation site.

## 🌟 Ways to Contribute

There are many ways you can help improve our documentation:

- **Report bugs** or issues with the documentation site
- **Suggest improvements** to existing documentation
- **Request new features** for the documentation site
- **Fix typos** and improve clarity
- **Add new content** or expand existing sections
- **Improve accessibility** and user experience
- **Translate content** (coming soon)

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18.0 or higher)
- [pnpm](https://pnpm.io/installation) (version 10.11 or higher)
- [Git](https://git-scm.com/)

### Setting Up Your Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/silhouette-exchange/public-docs.git
   cd public-docs
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm start
   ```

4. **Open your browser** to `http://localhost:3000`

The site will automatically reload when you make changes.

## 📝 Making Changes

### Documentation Structure

Our documentation is organized as follows:

```
docs/
├── 01-about-silhouette.md      # Introduction to Silhouette
├── 05-account-management/      # Account and wallet management
├── 06-trading/                 # Trading functionality
├── 07-architecture/            # Technical architecture
├── 08-faq.mdx                   # Frequently asked questions
└── 09-glossary.md              # Terms and definitions

blog/                           # Blog posts and announcements
src/                           # React components and styling
static/                        # Static assets (images, etc.)
```

### Content Guidelines

#### Writing Style
- **Clear and concise**: Use simple, direct language
- **User-focused**: Write from the user's perspective
- **Consistent terminology**: Use the same terms throughout
- **Active voice**: Prefer active over passive voice
- **Inclusive language**: Use welcoming, inclusive language

#### Formatting Standards
- Use **Markdown** for all documentation files
- Follow the existing **heading hierarchy** (H1 for page titles, H2 for main sections, etc.)
- Use **code blocks** with appropriate language tags
- Include **alt text** for all images
- Use **relative links** for internal references

#### Technical Content
- **Test all code examples** before submitting
- **Include context** for technical concepts
- **Link to external resources** when helpful
- **Keep examples up-to-date** with current functionality

### Making Your Changes

1. **Create a new branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Use descriptive branch names:
   - `docs/improve-trading-guide` for documentation improvements
   - `fix/broken-links` for bug fixes
   - `feature/new-faq-section` for new features

2. **Make your changes** following our guidelines

3. **Test your changes** locally:
   ```bash
   pnpm start
   ```

4. **Build the site** to check for errors:
   ```bash
   pnpm build
   ```

5. **Commit your changes** with a descriptive message:
   ```bash
   git add .
   git commit -m "docs: improve trading documentation clarity"
   ```

## 🔄 Submitting Your Contribution

### Pull Request Process

1. **Push your branch** to the repository:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - **Clear title** describing your changes
   - **Detailed description** of what you've changed and why
   - **Screenshots** if you've made visual changes
   - **Reference to related issues** (if applicable)

3. **Preview your changes**: Once you create a PR targeting the `main` branch, Vercel will automatically generate a preview deployment. Look for the Vercel bot comment in your PR with a preview link like:
   ```
   ✅ Preview deployment ready!
   🔍 Preview: https://public-docs-git-your-branch-name-silhouette-exchange.vercel.app
   ```
   Use this preview link to:
   - **Test your changes** in a production-like environment
   - **Share with reviewers** for easier feedback
   - **Verify mobile responsiveness** and cross-browser compatibility
   - **Check that all links work** correctly

4. **Request review** from the documentation team

5. **Respond to feedback** from reviewers promptly, using the preview link to demonstrate fixes

6. **Merge** will be handled by maintainers after approval

### Pull Request Guidelines

- **One feature per PR**: Keep pull requests focused on a single improvement
- **Test with preview link**: Always check your Vercel preview before requesting review
- **Update documentation**: If you change functionality, update related docs
- **Test thoroughly**: Use the preview link to test across different browsers and devices
- **Follow existing patterns**: Match the style and structure of existing content
- **Be patient**: Reviews may take time, but we appreciate your contribution!

### Branch Naming Conventions

Use clear, descriptive branch names with prefixes:

- `docs/` - Documentation content changes
- `fix/` - Bug fixes
- `feature/` - New features or enhancements
- `style/` - Styling and UI improvements
- `refactor/` - Code refactoring without functional changes

Examples:
- `docs/update-account-management`
- `fix/mobile-navigation-issue`
- `feature/search-functionality`
- `style/improve-dark-mode`

## 🔗 Preview Deployments

Every pull request targeting the `main` branch automatically gets a preview deployment via Vercel:

### How It Works
- **Automatic**: Preview deployments are created automatically when you open a PR
- **Updated**: Each new commit to your PR branch updates the preview
- **Isolated**: Each PR gets its own unique preview URL
- **Production-like**: Previews use the same build process as the live site

### Using Preview Links
- **Test your changes** before requesting review
- **Share with others** for feedback and collaboration  
- **Verify responsive design** on different devices
- **Check performance** and loading times
- **Validate links** and navigation work correctly

### Preview Link Format
```
https://public-docs-git-[branch-name]-silhouette-exchange.vercel.app
```

The Vercel bot will comment on your PR with the exact preview URL once deployment is complete.

## 🏷️ Issue Labels

We use labels to organize and prioritize issues:

### Type Labels
- `bug` - Something isn't working correctly
- `documentation` - Improvements to documentation content
- `enhancement` - New features or improvements
- `question` - Questions about usage or functionality

### Priority Labels
- `priority: low` - Nice to have improvements
- `priority: medium` - Important improvements
- `priority: high` - Critical issues that need attention
- `priority: urgent` - Blocking issues requiring immediate attention

### Status Labels
- `needs-triage` - New issues that need review
- `good first issue` - Great for newcomers
- `help wanted` - Community contributions welcome
- `in progress` - Currently being worked on
- `needs review` - Ready for review

## 🎯 Content Areas We Need Help With

### High Priority
- **FAQ expansion**: Common questions from users
- **Error message documentation**: Help users troubleshoot issues
- **Mobile experience**: Improving mobile documentation experience
- **Accessibility**: Making content more accessible

### Medium Priority
- **Code examples**: More practical examples and use cases
- **Visual aids**: Diagrams, screenshots, and illustrations
- **Cross-references**: Better linking between related topics
- **Glossary expansion**: More terms and definitions

### Ongoing Needs
- **Typo fixes**: Grammar, spelling, and clarity improvements
- **Link maintenance**: Keeping external links up-to-date
- **Content updates**: Keeping pace with product changes

## 🛠️ Development Tips

### Local Development
- Use `pnpm start` for development with hot reloading
- Use `pnpm build` to test production builds
- Check the browser console for any errors
- Test on different screen sizes and browsers

### Testing Your Changes
1. **Local testing**: Always test locally with `pnpm start`
2. **Production build**: Run `pnpm build` to catch build errors
3. **Preview deployment**: Use the Vercel preview link for final testing
4. **Cross-browser testing**: Check your preview in different browsers
5. **Mobile testing**: Verify mobile experience using the preview link

### Markdown Tips
- Use the [Docusaurus Markdown features](https://docusaurus.io/docs/markdown-features)
- Test internal links work correctly
- Use appropriate heading levels for navigation
- Include alt text for accessibility

### Common Issues
- **Build failures**: Usually caused by broken links or invalid Markdown
- **Styling issues**: Check that custom CSS doesn't conflict
- **Navigation problems**: Ensure sidebar configuration is correct
- **Preview deployment failures**: Check the Vercel deployment logs in your PR

## 🤝 Community Guidelines

### Code of Conduct
We are committed to providing a welcoming and inclusive environment. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Communication
- **Be respectful** and constructive in all interactions
- **Ask questions** if you're unsure about anything
- **Help others** when you can
- **Share knowledge** and learn from the community

### Getting Help
- **Check existing issues** before creating new ones
- **Use appropriate issue templates** for different types of requests
- **Provide context** when asking questions
- **Share preview links** when asking for help with visual issues
- **Be patient** - maintainers are volunteers with other commitments

## 📞 Contact

- **GitHub Issues**: For bugs, features, and questions
- **GitHub Discussions**: For general community discussion
- **Email**: For sensitive issues or private communication

## 🙏 Recognition

All contributors will be recognized in our documentation. We appreciate every contribution, no matter how small!

### Types of Contributions We Recognize
- Code contributions
- Documentation improvements
- Bug reports and testing
- Design and UX feedback
- Community support and moderation
- Translation work

---

Thank you for helping make Silhouette Exchange documentation better for everyone! 🚀
