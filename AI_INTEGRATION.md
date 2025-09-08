# AI Integration for Mermaid Code Fixing

This document describes the AI-powered Mermaid code fixing feature integrated into VisualMaid.

## Overview

The AI integration uses the **GitHub GPT-5 Mini** model to automatically fix broken Mermaid diagram code. When users encounter syntax errors, they can click the "Fix with AI" button to have the AI analyze and correct the code.

## Features

### 🤖 AI-Powered Code Fixing
- **Model**: GitHub GPT-5 Mini (free tier)
- **Automatic Error Detection**: Analyzes Mermaid syntax errors
- **Smart Code Correction**: Fixes common syntax issues while preserving diagram intent
- **Context-Aware**: Uses error location and surrounding code for better fixes

### 🎨 Smooth Animations
- **Typing Animation**: Code is replaced with a realistic typing effect
- **Progress Indicators**: Real-time progress updates during AI processing
- **Loading States**: Beautiful loading animations with step-by-step feedback
- **Success Feedback**: Clear visual confirmation when fixes are applied

### 🔒 Security & Best Practices
- **Environment Variables**: API key stored securely in `.env` file
- **Error Handling**: Comprehensive error handling for API failures
- **Rate Limiting**: Built-in timeout and retry logic
- **Input Validation**: Sanitized inputs and outputs

## Architecture

### Core Components

1. **AI Service** (`src/lib/ai-service.ts`)
   - Handles GitHub GPT-5 API communication
   - Manages request/response processing
   - Implements error handling and retries

2. **AI Store** (`src/store/ai-store.ts`)
   - Zustand store for AI state management
   - Tracks fixing progress and animations
   - Manages AI service status

3. **Typing Animation** (`src/components/common/typing-animation.tsx`)
   - Smooth character-by-character code replacement
   - Configurable typing speed
   - Progress tracking

4. **AI Loading Component** (`src/components/common/ai-loading.tsx`)
   - Progress indicators
   - Step-by-step feedback
   - Error and success states

### Integration Points

- **Monaco Editor**: Enhanced with AI fixing capabilities
- **Error Terminal**: "Fix with AI" button with loading states
- **Error Parser**: Enhanced context analysis for AI

## Usage

### For Users

1. **Write Mermaid Code**: Create or edit a Mermaid diagram
2. **Encounter Errors**: If syntax errors occur, they appear in the error terminal
3. **Click "Fix with AI"**: The button appears when errors are detected
4. **Watch the Magic**: AI analyzes and fixes the code with smooth animations
5. **Review Changes**: The corrected code is automatically applied to the editor

### For Developers

#### Environment Setup

1. **API Key Configuration**:
   ```bash
   # Create .env file with your GitHub token
   VITE_GITHUB_TOKEN=your_github_token_here
   VITE_SITE_URL=https://visualmaid.app
   VITE_SITE_NAME=VisualMaid
   ```

2. **Testing the Integration**:
   ```javascript
   // In browser console
   testAI() // Tests AI service connectivity
   ```

#### API Integration

```typescript
import { fixMermaidCodeWithAI } from '@/lib/ai-service';

const result = await fixMermaidCodeWithAI({
  mermaidCode: 'broken mermaid code',
  errorMessage: 'syntax error',
  errorLine: 5,
  errorColumn: 10
});

if (result.success) {
  console.log('Fixed code:', result.fixedCode);
}
```

## Configuration

### AI Service Settings

- **Model**: `openai/gpt-5-mini`
- **Temperature**: 0.1 (low for consistent code generation)
- **Max Tokens**: 2000
- **Retry Logic**: Built-in error handling with exponential backoff

### Animation Settings

- **Typing Speed**: 50ms per character (configurable)
- **Progress Animation**: 1 second per step
- **Loading States**: 6 progress steps with realistic timing

## Error Handling

### API Errors
- Network timeouts
- Invalid API responses
- Rate limiting
- Authentication failures

### User Experience
- Clear error messages
- Fallback options
- Graceful degradation
- User-friendly feedback

## Security Considerations

1. **API Key Protection**: Stored in environment variables, never exposed to client
2. **Input Sanitization**: All user inputs are validated and sanitized
3. **Output Validation**: AI responses are validated before application
4. **Error Boundaries**: Comprehensive error handling prevents crashes

## Performance

- **Lazy Loading**: AI components load only when needed
- **Caching**: Results are cached to avoid redundant API calls
- **Optimistic Updates**: UI updates immediately with loading states
- **Background Processing**: AI requests don't block the UI

## Future Enhancements

- [ ] Multiple AI model support
- [ ] Custom AI prompts for specific diagram types
- [ ] Batch error fixing
- [ ] AI-powered code suggestions
- [ ] Integration with other AI services

## Troubleshooting

### Common Issues

1. **API Key Not Working**:
   - Check `.env` file configuration
   - Verify API key validity
   - Check network connectivity

2. **AI Not Responding**:
   - Check OpenRouter service status
   - Verify model availability
   - Check rate limits

3. **Animation Issues**:
   - Clear browser cache
   - Check for JavaScript errors
   - Verify component imports

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem('ai-debug', 'true');

// Test AI service
testAI();
```

## Contributing

When contributing to the AI integration:

1. **Follow Security Guidelines**: Never commit API keys
2. **Test Thoroughly**: Test with various error scenarios
3. **Update Documentation**: Keep this README current
4. **Performance**: Consider impact on bundle size and performance
5. **Accessibility**: Ensure AI features are accessible

## License

This AI integration follows the same license as the main VisualMaid project.
