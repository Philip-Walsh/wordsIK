# WordsIK - Educational Vocabulary Repository

A simple, high-quality repository of multilingual educational content for teachers and developers.

## 🎯 What is WordsIK?

WordsIK provides **validated, culturally appropriate educational content** in multiple languages. It's designed to be:

- **Simple to use** - Just JSON files you can copy and use
- **High quality** - All content is validated and reviewed
- **Multi-language** - English, Spanish, French, Arabic, Korean
- **Grade-appropriate** - Organized by grade levels 1-5

## 📁 Content Structure

```
data/
├── vocabulary/     # Vocabulary words by language and grade
├── grammar/        # Grammar lessons and exercises
└── spelling/       # Spelling lists and activities
```

### Example Content

```json
{
  "week": "1",
  "theme": "Animals",
  "words": [
    {
      "word": "cat",
      "translation": "gato",
      "definition": "A small domesticated carnivorous mammal",
      "example": "The cat is sleeping on the sofa.",
      "difficulty": "easy",
      "category": "animals"
    }
  ]
}
```

## 🚀 Quick Start

### For Teachers

1. **Browse content** in the `data/` folder
2. **Copy the JSON files** you need
3. **Use in your lessons** - games, flashcards, worksheets

### For Developers

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/wordsIK.git
   cd wordsIK
   ```

2. **Validate content**

   ```bash
   npm install
   npm run validate
   ```

3. **Generate templates**
   ```bash
   npm run template en 1 1 --theme "Colors"
   ```

## 🔧 Simple Tools

### Validate Content

```bash
# Validate all content
npm run validate

# Validate specific files
npm run validate --files data/vocabulary/en/grade-1/week-1.json

# Verbose output
npm run validate --verbose
```

### Generate Templates

```bash
# Create a new vocabulary template
npm run template en 1 1 --theme "Animals"

# Create for different language
npm run template es 2 3 --theme "Food"
```

### Check Quality

```bash
# Run quality checks
npm run check-quality

# See repository status
npm run status
```

## 🌍 Supported Languages

- **English (en)** - Complete content
- **Spanish (es)** - Complete content
- **French (fr)** - Complete content
- **Arabic (ar)** - Basic content
- **Korean (ko)** - Basic content

## 📝 Contributing

### Add New Content

1. **Create a new file** following the structure:

   ```
   data/vocabulary/[language]/grade-[level]/week-[number].json
   ```

2. **Use the template**:

   ```bash
   npm run template en 1 2 --theme "Your Theme"
   ```

3. **Validate your content**:

   ```bash
   npm run validate --files your-file.json
   ```

4. **Submit a pull request**

### Content Guidelines

- ✅ **Age-appropriate** content for target grade
- ✅ **Accurate translations** by native speakers
- ✅ **Clear examples** that students can understand
- ✅ **Cultural sensitivity** - appropriate for target culture
- ✅ **Proper JSON format** - passes validation

## 📊 Quality Assurance

All content is automatically validated for:

- ✅ **JSON syntax** - Valid JSON format
- ✅ **Required fields** - All necessary fields present
- ✅ **Content quality** - Appropriate for educational use
- ✅ **Spelling** - Multi-language spell checking
- ✅ **Cultural appropriateness** - No inappropriate content

## 🤝 Community

- **Teachers**: Use content in your classrooms
- **Developers**: Build educational apps and games
- **Contributors**: Add content in your native language
- **Reviewers**: Help validate and improve content

## 📚 Examples

See the `examples/` folder for:

- Sample vocabulary files
- Usage examples
- Activity ideas
- Integration patterns

## 🔗 Integration

WordsIK content works with:

- Educational games
- Flashcard apps
- Quiz generators
- Language learning platforms
- Classroom activities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Getting Help

- **Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check the `docs/` folder for detailed guides

---

**Simple. Quality. Educational.** That's WordsIK.
