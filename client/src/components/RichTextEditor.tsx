import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Type assertion to fix TypeScript compatibility

import SecureHtmlRenderer from './SecureHtmlRenderer';
import { Eye, Code, Save } from 'lucide-react';

const QuillEditor = ReactQuill as any;

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  showPreview?: boolean;
  onSaveDraft?: () => void;
  isDraft?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your blog content here...",
  height = 400,
  showPreview = true,
  onSaveDraft,
  isDraft = false
}) => {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [htmlSource, setHtmlSource] = useState(value);

  useEffect(() => {
    setHtmlSource(value);
  }, [value]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  const handleSourceChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setHtmlSource(newValue);
    onChange(newValue);
  };

  const handleQuillChange = (content: string) => {
    setHtmlSource(content);
    onChange(content);
  };

  const renderToolbar = () => (
    <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setMode('edit')}
          className={`px-3 py-1 rounded text-sm ${
            mode === 'edit' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          <Code className="w-4 h-4 inline mr-1" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`px-3 py-1 rounded text-sm ${
            mode === 'preview' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Preview
        </button>
        <button
          type="button"
          onClick={() => setMode('split')}
          className={`px-3 py-1 rounded text-sm ${
            mode === 'split' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
          }`}
        >
          Split View
        </button>
      </div>
      
      {onSaveDraft && (
        <div className="flex items-center space-x-2">
          {isDraft && (
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Draft saved
            </span>
          )}
          <button
            type="button"
            onClick={onSaveDraft}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
          >
            <Save className="w-4 h-4 inline mr-1" />
            Save Draft
          </button>
        </div>
      )}
    </div>
  );

  const renderEditor = () => (
    <div className="h-full">
      <QuillEditor
        theme="snow"
        value={htmlSource}
        onChange={handleQuillChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ height: height - 50 }}
      />
    </div>
  );

  // const renderSourceEditor = () => (
  //   <div className="h-full">
  //     <textarea
  //       value={htmlSource}
  //       onChange={handleSourceChange}
  //       placeholder={placeholder}
  //       className="w-full h-full p-4 border-0 resize-none focus:outline-none font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  //       style={{ height: height - 50 }}
  //     />
  //   </div>
  // );

  const renderPreview = () => (
    <div 
      className="h-full overflow-y-auto p-4 bg-white dark:bg-gray-900"
      style={{ height: height - 50 }}
    >
      {htmlSource.trim() ? (
        <SecureHtmlRenderer content={htmlSource} />
      ) : (
        <div className="text-gray-500 dark:text-gray-400 italic">
          Preview will appear here...
        </div>
      )}
    </div>
  );

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      {renderToolbar()}
      
      <div className="relative" style={{ height }}>
        {mode === 'edit' && (
          <div className="h-full">
            {renderEditor()}
          </div>
        )}
        
        {mode === 'preview' && (
          <div className="h-full">
            {renderPreview()}
          </div>
        )}
        
        {mode === 'split' && (
          <div className="flex h-full">
            <div className="w-1/2 border-r border-gray-300 dark:border-gray-600">
              {renderEditor()}
            </div>
            <div className="w-1/2">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
      
      {/* HTML Source Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            HTML Source
          </summary>
          <div className="mt-2">
            <textarea
              value={htmlSource}
              onChange={handleSourceChange}
              className="w-full h-32 p-2 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Raw HTML content..."
            />
          </div>
        </details>
      </div>
    </div>
  );
};

export default RichTextEditor; 