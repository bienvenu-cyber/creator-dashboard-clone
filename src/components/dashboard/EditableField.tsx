import { useState, useRef, useEffect } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tag?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
}

export function EditableField({ value, onChange, className = '', style, tag: Tag = 'span' }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSubmit = () => {
    onChange(tempValue);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') { setTempValue(value); setEditing(false); }
        }}
        className={className}
        style={{
          ...style,
          background: 'transparent',
          border: 'none',
          borderBottom: '2px solid #00AFF0',
          outline: 'none',
          width: '100%',
          padding: 0,
          margin: 0,
          font: 'inherit',
          lineHeight: 'inherit',
        }}
      />
    );
  }

  return (
    <Tag
      className={`${className} cursor-pointer hover:opacity-80 transition-opacity`}
      style={style}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
}
