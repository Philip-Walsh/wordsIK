# Code Review Guide for Cursor Integration

This guide explains how to use the WordsIK CLI code review feature to generate comprehensive code reviews that integrate seamlessly with Cursor's web search capabilities.

## Quick Start

### Basic Code Review

```bash
# Review all changed files
npm run review

# Review with web search integration
npm run review-changed

# Review with AI enhancement
npm run review-enhanced
```

### Review Specific Files

```bash
# Review specific files
npm run review-files src/cli.ts src/ValidationManager.ts

# Review with custom options
npm start review --files src/**/*.ts --web-search --ai-enhanced
```

## CLI Commands

### Review Command

```bash
npm start review [options]
```

### Options

- `--files <files...>` - Specific files to review (default: changed files)
- `--output <format>` - Output format: `cursor`, `markdown`, `json` (default: `cursor`)
- `--web-search` - Enable web search for context and best practices
- `--ai-enhanced` - Use AI to enhance review quality
- `--verbose` - Verbose output
- `--log-file <file>` - Log file path
- `--template <template>` - Review template to use
- `--focus <focus>` - Focus areas: `security`, `performance`, `style`, `docs`

## NPM Scripts

### Quick Review Scripts

```bash
# Basic review of changed files
npm run review

# Review with web search integration
npm run review-changed

# Review with AI enhancement
npm run review-enhanced

# Review specific files
npm run review-files file1.ts file2.ts

# Generate Cursor-optimized review
npm run review-cursor

# Generate Markdown review
npm run review-markdown
```

## Output Formats

### 1. Cursor Format (Default)

Optimized for Cursor's interface with:

- Clear issue categorization
- Actionable suggestions
- Code snippets and line references
- Severity indicators
- Web search integration hints

**Example Output:**

```markdown
# Code Review for Cursor

Generated on: 2024-03-21T10:30:45.123Z

## src/cli.ts

**Score:** 85/100

**Summary:** Found 3 issues (1 high, 1 medium, 1 low) and 5 suggestions

### Issues

🔴 **HIGH**: Potential sensitive data found
💡 **Suggestion**: Consider using environment variables or secure configuration management

🟡 **MEDIUM**: Console.log found in production code
💡 **Suggestion**: Remove or replace with proper logging
📍 **Line**: 45

### Suggestions

💡 Consider using specific types instead of "any" for better type safety

💡 Consider using ES6 import/export syntax for better tree-shaking
```

### 2. Markdown Format

Standard markdown for documentation and sharing:

```bash
npm start review --output markdown
```

### 3. JSON Format

Machine-readable format for integration:

```bash
npm start review --output json
```

## Web Search Integration

### What Web Search Adds

- **Best Practices**: Current industry standards and patterns
- **Security Updates**: Latest security recommendations
- **Performance Tips**: Modern optimization techniques
- **Framework Updates**: Latest framework best practices
- **Community Insights**: Popular patterns and solutions

### Usage

```bash
# Enable web search
npm run review-changed

# With AI enhancement
npm run review-enhanced
```

## AI Enhancement Features

### What AI Enhancement Adds

- **Complexity Analysis**: File size and function count analysis
- **Pattern Recognition**: Common code patterns and anti-patterns
- **Context Awareness**: Understanding of codebase structure
- **Intelligent Suggestions**: Personalized recommendations
- **Trend Analysis**: Modern development trends

### Usage

```bash
# Enable AI enhancement
npm run review-enhanced
```

## Focus Areas

### Security Focus

```bash
npm start review --focus security
```

Checks for:

- Hardcoded secrets
- Insecure dependencies
- Authentication issues
- Data exposure risks

### Performance Focus

```bash
npm start review --focus performance
```

Checks for:

- Inefficient algorithms
- Memory leaks
- Async/await usage
- Bundle size optimization

### Style Focus

```bash
npm start review --focus style
```

Checks for:

- Code formatting
- Naming conventions
- Documentation
- Consistency

### Documentation Focus

```bash
npm start review --focus docs
```

Checks for:

- JSDoc comments
- README updates
- API documentation
- Code examples

## Integration with Cursor

### 1. Copy Review to Cursor

```bash
# Generate review
npm run review-cursor

# Copy to clipboard (on macOS/Linux)
cat cursor-review.md | pbcopy

# Paste into Cursor's chat or review panel
```

### 2. Use with Cursor's Web Search

1. Generate review with web search enabled
2. Copy specific suggestions to Cursor
3. Ask Cursor to elaborate on any suggestions
4. Use Cursor's web search to find current best practices

### 3. Iterative Review Process

```bash
# Initial review
npm run review-enhanced

# After making changes
npm run review-changed

# Final review before commit
npm run review --focus security,performance
```

## Review Templates

### Custom Templates

Create custom review templates in `templates/review/`:

```json
{
  "name": "security-focused",
  "checks": ["security", "authentication", "data-protection"],
  "severity": "high",
  "output": "cursor"
}
```

### Usage

```bash
npm start review --template security-focused
```

## Advanced Usage

### Review Workflow Integration

```bash
# Pre-commit review
npm run review-changed

# Post-merge review
npm run review --files $(git diff --name-only main)

# Release review
npm run review-enhanced --focus security,performance
```

### CI/CD Integration

```yaml
# In GitHub Actions
- name: Code Review
  run: |
    npm run review-enhanced --output json > review-report.json
    npm run review-cursor > cursor-review.md
```

### Custom Review Rules

Extend the ReviewGenerator to add custom checks:

```typescript
// In ReviewGenerator.ts
private async performCustomChecks(
  file: string,
  content: string,
  issues: ReviewIssue[],
  suggestions: string[]
): Promise<void> {
  // Add your custom checks here
  if (content.includes('TODO')) {
    issues.push({
      type: 'warning',
      message: 'TODO comment found',
      severity: 'low',
      suggestion: 'Consider creating an issue or completing the task'
    });
  }
}
```

## Best Practices

### 1. Regular Reviews

- Run reviews before each commit
- Use different focus areas for different stages
- Integrate with your development workflow

### 2. Team Collaboration

- Share review reports with team members
- Use markdown format for documentation
- Discuss high-severity issues in team meetings

### 3. Continuous Improvement

- Update review rules based on team feedback
- Add custom checks for project-specific needs
- Monitor review scores over time

### 4. Cursor Integration

- Use web search for current best practices
- Ask Cursor to explain suggestions in detail
- Use Cursor's code generation for fixes

## Troubleshooting

### Common Issues

1. **No files found for review**

   ```bash
   # Check git status
   git status

   # Review specific files
   npm run review-files src/**/*.ts
   ```

2. **Web search not working**

   - Ensure internet connection
   - Check if web search APIs are available
   - Try without web search first

3. **AI enhancement errors**
   - Check AI service availability
   - Verify API keys if using external services
   - Use basic review as fallback

### Getting Help

```bash
# Show help
npm start review --help

# Verbose output for debugging
npm start review --verbose

# Check logs
npm run logs:view
```

## Examples

### Complete Review Workflow

```bash
# 1. Make changes to your code
git add .

# 2. Generate comprehensive review
npm run review-enhanced

# 3. Address high-priority issues
# (Review the generated cursor-review.md)

# 4. Re-review after fixes
npm run review-changed

# 5. Commit when satisfied
git commit -m "Fix issues from code review"
```

### Team Review Process

```bash
# 1. Generate review for PR
npm run review-markdown > pr-review.md

# 2. Share with team
# (Add to PR description or comments)

# 3. Address feedback
# (Make changes based on review)

# 4. Final review
npm run review-cursor
```

This code review system provides a powerful way to maintain code quality while leveraging Cursor's web search capabilities for the most current best practices and recommendations.
