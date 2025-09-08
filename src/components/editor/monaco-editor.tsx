import React, { useCallback, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useEditorStore } from '@/store/editor-store';

interface MonacoEditorProps {
  className?: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ className = '' }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  
  const {
    code,
    setCode,
    theme,
    fontSize,
    wordWrap,
    lineNumbers,
  } = useEditorStore();

  // Handle editor mount
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    // Configure Mermaid language support
    monaco.languages.register({ id: 'mermaid' });
    
    // Define Mermaid syntax highlighting
    monaco.languages.setMonarchTokensProvider('mermaid', {
      tokenizer: {
        root: [
          [/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|pie|gitgraph|mindmap|timeline|sankey|quadrantChart|requirement|c4Context|c4Container|c4Component|c4Dynamic|c4Deployment)\b/, 'keyword'],
          [/^(subgraph|end)\b/, 'keyword.control'],
          [/\b(TD|TB|BT|RL|LR)\b/, 'keyword.direction'],
          [/--[>|o]|===[>|o]|\.\.\.[>|o]|-\.-[>|o]/, 'keyword.arrow'],
          [/-->|===|\.\.\.|-\.-/, 'keyword.arrow'],
          [/\|[^\|]*\|/, 'string'],
          [/"[^"]*"/, 'string'],
          [/'[^']*'/, 'string'],
          [/\[[^\]]*\]/, 'string.bracket'],
          [/\([^\)]*\)/, 'string.paren'],
          [/\{[^\}]*\}/, 'string.brace'],
          [/[A-Za-z][A-Za-z0-9]*/, 'identifier'],
          [/%%.*$/, 'comment'],
          [/\s+/, 'white'],
        ],
      },
    });

    // Set theme colors for Mermaid
    monaco.editor.defineTheme('mermaid-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '0066CC', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: '7C3AED', fontStyle: 'bold' },
        { token: 'keyword.direction', foreground: '059669' },
        { token: 'keyword.arrow', foreground: 'DC2626' },
        { token: 'string', foreground: '16A34A' },
        { token: 'string.bracket', foreground: 'EA580C' },
        { token: 'string.paren', foreground: 'CA8A04' },
        { token: 'string.brace', foreground: 'C2410C' },
        { token: 'identifier', foreground: '374151' },
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#374151',
        'editorLineNumber.foreground': '#9CA3AF',
        'editor.selectionBackground': '#DBEAFE',
        'editor.lineHighlightBackground': '#F9FAFB',
      }
    });

    monaco.editor.defineTheme('mermaid-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '60A5FA', fontStyle: 'bold' },
        { token: 'keyword.control', foreground: 'A78BFA', fontStyle: 'bold' },
        { token: 'keyword.direction', foreground: '34D399' },
        { token: 'keyword.arrow', foreground: 'F87171' },
        { token: 'string', foreground: '4ADE80' },
        { token: 'string.bracket', foreground: 'FB923C' },
        { token: 'string.paren', foreground: 'FBBF24' },
        { token: 'string.brace', foreground: 'F97316' },
        { token: 'identifier', foreground: 'E5E7EB' },
        { token: 'comment', foreground: '9CA3AF', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#1F2937',
        'editor.foreground': '#E5E7EB',
        'editorLineNumber.foreground': '#6B7280',
        'editor.selectionBackground': '#374151',
        'editor.lineHighlightBackground': '#111827',
      }
    });

    // Apply the appropriate theme
    monaco.editor.setTheme(theme === 'vs-light' ? 'mermaid-light' : 'mermaid-dark');

    // Focus the editor
    editor.focus();
  }, [theme]);

  // Handle code changes
  const handleEditorChange = useCallback((value: string | undefined) => {
    setCode(value || '');
  }, [setCode]);

  // Update editor options when store values change
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        wordWrap: wordWrap ? 'on' : 'off',
        lineNumbers: lineNumbers ? 'on' : 'off',
        minimap: { enabled: false },
      });
    }
  }, [fontSize, wordWrap, lineNumbers]);

  return (
    <div className={`h-full w-full ${className}`}>
      <Editor
        height="100%"
        language="mermaid"
        theme={theme === 'vs-light' ? 'mermaid-light' : 'mermaid-dark'}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize,
          fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, "Courier New", monospace',
          wordWrap: wordWrap ? 'on' : 'off',
          lineNumbers: lineNumbers ? 'on' : 'off',
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          unfoldOnClickAfterEndOfLine: false,
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderLineHighlight: 'line',
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          accessibilitySupport: 'auto',
        }}
      />
    </div>
  );
};

export default MonacoEditor;
