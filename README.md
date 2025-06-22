# WordsIK - Educational Vocabulary Repository

![Words I Know Banner 🍎](docs/assets/banner.png "Title")

A collaborative repository for educational vocabulary, grammar, and spelling resources that can be used to build language learning games and applications. Built with robust quality assurance and multi-language support.

## 🚀 Quick Start

**For Teachers & Educators:**

- 📚 [Teacher Guide](docs/guides/teacher-guide.md) - How to use WordsIK in your classroom
- 📖 [Content Schemas](docs/api/content-schemas.md) - Understanding the data format
- 🎯 [Examples](examples/) - Sample activities and games

**For Developers:**

- 🔧 [API Documentation](docs/api/README.md) - Integrate WordsIK into your apps
- 👨‍💻 [Developer Guide](docs/guides/developer-guide.md) - Technical setup and contribution
- 🛠️ [CLI Usage](docs/cli-usage.md) - Command-line tools

**For Contributors:**

- 🤝 [Contributing Guide](CONTRIBUTING.md) - How to add content
- 📋 [Code Review Guide](docs/guides/code-review-guide.md) - Quality standards
- 🔄 [CI/CD Pipeline](docs/ci-cd-guide.md) - Automated quality checks

## 🌟 What Makes WordsIK Special

- **Multi-language Support**: English, Spanish, French, Arabic, Korean
- **Quality Assurance**: Automated validation, spell checking, and content filtering
- **Educational Focus**: Age-appropriate content organized by grade levels
- **Cultural Sensitivity**: Built-in checks for inclusive and appropriate language
- **TypeScript**: Full TypeScript support with strict type checking
- **Modern Tooling**: ESLint, Prettier, Jest, and Husky for code quality

## 📁 Repository Structure

```
.
├── data/              # Main content directory
│   ├── vocabulary/    # Vocabulary content by language and grade
│   ├── grammar/       # Grammar lessons and exercises
│   └── spelling/      # Spelling lists and activities
├── src/               # TypeScript source code and validation tools
├── docs/              # Comprehensive documentation
├── examples/          # Sample content and activities
└── templates/         # JSON templates for new contributions
```

## 🎯 Use Cases

This repository is designed to be used as a data source for:

- **Educational Games**: Vocabulary builders, word searches, spelling games
- **Language Learning Apps**: Flashcard applications, quiz generators
- **Classroom Tools**: Interactive whiteboard activities, worksheets
- **Assessment Systems**: Automated testing and progress tracking

## 🔧 Local Development

```bash
# Quick setup
git clone https://github.com/Philip-Walsh/wordsIK.git
cd wordsIK
npm install
npm run build
npm run validate-all
```

**Need more details?** Check out our [Developer Guide](docs/guides/developer-guide.md) for complete setup instructions.

## 🌍 Supported Languages

- **English (en)**: Primary language with comprehensive content
- **Spanish (es)**: Full vocabulary and grammar support
- **French (fr)**: Complete educational content
- **Arabic (ar)**: Basic vocabulary support
- **Korean (ko)**: Basic vocabulary support

## 🤝 Contributing

We welcome contributions from teachers, linguists, and educational content creators!

**Quick contribution steps:**

1. Fork the repository
2. Add your content following our [templates](templates/)
3. Run validation: `npm run validate-all`
4. Submit a pull request

**For detailed contribution guidelines:** See our [Contributing Guide](CONTRIBUTING.md)

## 🔒 Security & Quality

Our automated pipeline ensures:

- ✅ Age-appropriate content for target grade
- ✅ Accurate translations and cultural appropriateness
- ✅ Clear, educational examples
- ✅ No sensitive information
- ✅ Security scanning for secrets and vulnerabilities

## 📊 API Usage

Fetch content directly from GitHub raw URLs:

```js
// Example: Get English Grade 1 vocabulary
const response = await fetch(
  "https://raw.githubusercontent.com/Philip-Walsh/wordsIK/main/data/vocabulary/en/grade-1/week-1.json"
);
const vocabulary = await response.json();
```

**For complete API documentation:** See our [API Guide](docs/api/README.md)

## 📚 Documentation Index

### Core Documentation

- [Teacher Guide](docs/guides/teacher-guide.md) - Educational usage and classroom integration
- [Developer Guide](docs/guides/developer-guide.md) - Technical setup and development
- [API Documentation](docs/api/README.md) - Integration and data access
- [Content Schemas](docs/api/content-schemas.md) - Data format specifications

### Contributing & Quality

- [Contributing Guide](CONTRIBUTING.md) - How to contribute content
- [Code Review Guide](docs/guides/code-review-guide.md) - Quality standards and review process
- [CLI Usage](docs/cli-usage.md) - Command-line tools and validation
- [CI/CD Pipeline](docs/ci-cd-guide.md) - Automated quality assurance

### Examples & Templates

- [Examples Directory](examples/) - Sample activities and games
- [Templates](templates/) - JSON templates for new content
- [Sample Content](examples/vocabulary/) - Example vocabulary files

## 🤝 Community

- **Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Pull Requests**: Contribute content and improvements
- **Code of Conduct**: Maintain a welcoming environment

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Teachers and educators who contribute content
- Native speakers who validate translations
- Open source tools that power our validation system
- Educational institutions that use our content

---

**Made with ❤️ for education**
