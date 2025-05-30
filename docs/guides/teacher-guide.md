# Teacher's Guide to Words I Know

Welcome to Words I Know! This guide will help you understand how to use our vocabulary, grammar, and spelling resources in your classroom.

## Repository Structure

```
data/
├── vocabulary/          # Word lists and definitions
│   ├── en/             # English vocabulary
│   │   ├── grade-1/    # Grade 1 vocabulary
│   │   ├── grade-2/    # Grade 2 vocabulary
│   │   └── ...
│   ├── es/             # Spanish vocabulary
│   └── ...
├── grammar/            # Grammar rules and examples
└── spelling/           # Spelling lists and rules
```

## How to Use the Resources

### 1. Direct GitHub Access

You can access our files directly from GitHub:
- Browse the repository at: `https://github.com/yourusername/words-i-know`
- Download specific files using the "Raw" button
- Use the files in your lesson planning software

### 2. Using in Your Applications

The JSON files are designed to be easily integrated into:
- Educational games
- Quiz applications
- Flashcard systems
- Learning management systems

Example usage in JavaScript:
```javascript
// Fetch vocabulary for Grade 1 English
fetch('https://raw.githubusercontent.com/yourusername/words-i-know/main/data/vocabulary/en/grade-1/animals.json')
  .then(response => response.json())
  .then(data => {
    // Use the vocabulary data in your application
    console.log(data.words);
  });
```

### 3. File Formats

Each file contains:
- Clear metadata (language, grade, category)
- Age-appropriate definitions
- Example sentences
- Difficulty levels
- Tags for categorization
- Pronunciation guides
- Synonyms and antonyms

### 4. Categories Available

- Animals
- Colors
- Numbers
- Family
- Food
- Weather
- And more...

## Best Practices

1. **Start with Examples**: Check the `examples/` directory for sample files
2. **Use Tags**: Filter content using the tags in metadata
3. **Check Difficulty**: Use the difficulty levels to match your students' needs
4. **Combine Resources**: Mix vocabulary with grammar and spelling for comprehensive lessons

## Contributing

We welcome contributions from teachers! See our [Contributing Guide](../CONTRIBUTING.md) for details on how to:
- Add new vocabulary
- Suggest improvements
- Report issues
- Share your teaching experiences

## Need Help?

- Open an issue on GitHub
- Check our FAQ
- Join our teacher community

## License

This project is licensed under the MIT License, which means you can:
- Use the content in your classroom
- Modify it for your needs
- Share it with other teachers
- Use it in your applications

Thank you for using Words I Know in your teaching! 