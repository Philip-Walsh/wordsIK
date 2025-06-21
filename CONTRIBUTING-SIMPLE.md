# Contributing to WordsIK

Thank you for your interest in contributing to WordsIK! This guide will help you add high-quality educational content.

## 🎯 What We Need

### Content Contributors

- **Teachers** - Add vocabulary and grammar content
- **Native Speakers** - Provide accurate translations
- **Linguists** - Ensure cultural appropriateness
- **Developers** - Help with tools and validation

### Content Types

- **Vocabulary** - Word lists with translations and examples
- **Grammar** - Grammar lessons and exercises
- **Spelling** - Spelling lists and activities

## 🚀 Quick Start

### 1. Set Up Your Environment

```bash
# Clone the repository
git clone https://github.com/your-username/wordsIK.git
cd wordsIK

# Install dependencies
npm install

# Validate existing content
npm run validate
```

### 2. Create Your Content

#### Option A: Use the Template Generator

```bash
# Generate a template for English, Grade 1, Week 1
npm run template en 1 1 --theme "Animals"

# This creates: template-en-grade1-week1.json
```

#### Option B: Create Manually

Create a new file: `data/vocabulary/en/grade-1/week-2.json`

```json
{
  "week": "2",
  "theme": "Colors",
  "words": [
    {
      "word": "red",
      "translation": "rojo",
      "definition": "A color like blood or fire",
      "example": "The apple is red.",
      "difficulty": "easy",
      "category": "colors"
    },
    {
      "word": "blue",
      "translation": "azul",
      "definition": "A color like the sky",
      "example": "The sky is blue.",
      "difficulty": "easy",
      "category": "colors"
    }
  ]
}
```

### 3. Validate Your Content

```bash
# Validate your new file
npm run validate --files data/vocabulary/en/grade-1/week-2.json

# Check quality score
npm run check-quality --files data/vocabulary/en/grade-1/week-2.json
```

### 4. Submit Your Contribution

```bash
# Create a new branch
git checkout -b add-colors-vocabulary

# Add your files
git add data/vocabulary/en/grade-1/week-2.json

# Commit with a clear message
git commit -m "Add colors vocabulary for English Grade 1 Week 2"

# Push and create a pull request
git push origin add-colors-vocabulary
```

## 📋 Content Guidelines

### Required Fields

Every word must have:

- `word` - The target word
- `translation` - Translation in target language
- `definition` - Clear, simple definition
- `example` - Usage example sentence

### Optional Fields

- `difficulty` - "easy", "medium", or "hard"
- `category` - Content category (e.g., "animals", "colors")

### Quality Standards

#### ✅ Do

- Use **simple, clear language** appropriate for the grade level
- Provide **accurate translations** by native speakers
- Include **practical examples** students can relate to
- Ensure **cultural appropriateness** for target audience
- Follow **consistent formatting** and structure

#### ❌ Don't

- Use **complex vocabulary** beyond grade level
- Include **inappropriate content** or examples
- Use **machine translations** without human review
- Create **inconsistent formatting** or structure
- Add **duplicate content** or very similar words

### Grade Level Guidelines

#### Grade 1

- **Vocabulary**: Basic nouns, simple adjectives
- **Examples**: Short, simple sentences
- **Themes**: Animals, colors, numbers, family

#### Grade 2

- **Vocabulary**: Common verbs, basic adverbs
- **Examples**: Simple present tense
- **Themes**: Food, weather, school, home

#### Grade 3

- **Vocabulary**: Descriptive words, compound nouns
- **Examples**: Present and past tense
- **Themes**: Jobs, hobbies, transportation, places

#### Grade 4

- **Vocabulary**: Academic words, synonyms
- **Examples**: Multiple tenses, longer sentences
- **Themes**: Science, history, geography, culture

#### Grade 5

- **Vocabulary**: Complex concepts, idioms
- **Examples**: Various sentence structures
- **Themes**: Technology, environment, society, arts

## 🌍 Language-Specific Guidelines

### English (en)

- Use **American English** spelling and grammar
- Include **phonics-friendly** examples
- Consider **reading level** appropriateness

### Spanish (es)

- Use **standard Spanish** (avoid regionalisms)
- Include **gender agreement** in examples
- Consider **formal vs informal** usage

### French (fr)

- Use **standard French** (avoid regionalisms)
- Include **gender and number** agreement
- Consider **formal vs informal** usage

### Arabic (ar)

- Use **Modern Standard Arabic**
- Include **vowel markings** where helpful
- Consider **right-to-left** text direction

### Korean (ko)

- Use **standard Korean** (avoid regionalisms)
- Include **honorific forms** appropriately
- Consider **syllable structure** in examples

## 🔧 Validation Process

### Automated Checks

Your content will be automatically checked for:

- ✅ **JSON syntax** - Valid format
- ✅ **Required fields** - All necessary fields present
- ✅ **Content quality** - Appropriate for educational use
- ✅ **Spelling** - Multi-language spell checking

### Manual Review

Content will be reviewed by:

- **Native speakers** for translation accuracy
- **Teachers** for grade appropriateness
- **Cultural experts** for sensitivity

## 📝 Pull Request Guidelines

### Before Submitting

1. **Validate your content**: `npm run validate`
2. **Check quality**: `npm run check-quality`
3. **Test locally**: Ensure everything works
4. **Update documentation**: If adding new features

### Pull Request Title

Use clear, descriptive titles:

- ✅ `Add colors vocabulary for Spanish Grade 1`
- ✅ `Fix translation in French animals vocabulary`
- ❌ `Update stuff`

### Pull Request Description

Include:

- **What** you added/changed
- **Why** the change is needed
- **How** to test the changes
- **Screenshots** if applicable

## 🏷️ Labels and Categories

Use appropriate labels for your PR:

- `content` - New vocabulary, grammar, or spelling content
- `translation` - Translation improvements
- `bug-fix` - Fixing validation or content issues
- `documentation` - Documentation updates
- `enhancement` - Tool or process improvements

## 🎉 Recognition

### Contributors

- Your name will be added to the contributors list
- You'll receive recognition in release notes
- You can add the project to your portfolio

### Content Credits

- Content creators are credited in file headers
- Native speakers are acknowledged for translations
- Teachers are recognized for grade-appropriate content

## 🆘 Getting Help

### Questions?

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs or request features
- **Documentation**: Check the `docs/` folder

### Need Inspiration?

- **Examples folder**: See sample content
- **Existing content**: Browse current vocabulary
- **Community**: Connect with other contributors

## 📚 Resources

### Tools

- **Template Generator**: `npm run template`
- **Content Validator**: `npm run validate`
- **Quality Checker**: `npm run check-quality`

### Documentation

- **README**: Project overview and quick start
- **Examples**: Sample content and usage
- **API Docs**: If building tools (advanced)

---

**Thank you for contributing to WordsIK!** 🌟

Your contributions help make quality educational content available to students worldwide.
