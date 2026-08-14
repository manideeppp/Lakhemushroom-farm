import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';
import { FileUp, ImageIcon, X } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface FileUploadProps {
  label?: string;
  hint?: string;
  accept?: string;
  onFileSelected?: (file: File | null) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * FileUpload — UI-only file picker with drag-and-drop.
 * Emits selected file via `onFileSelected`; parent decides what to do with it.
 */
export function FileUpload({
  label = 'Upload file',
  hint,
  accept = 'image/*',
  onFileSelected,
  error,
  className,
  disabled,
}: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handle = useCallback(
    (f: File | null) => {
      setFile(f);
      onFileSelected?.(f);
    },
    [onFileSelected]
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handle(e.target.files?.[0] ?? null);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) handle(f);
  };

  const clear = () => {
    handle(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <p className="mb-1.5 text-label font-medium text-ink-800">{label}</p>
      )}
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed',
          'bg-cream-50 py-6 px-4 text-center cursor-pointer transition',
          dragging
            ? 'border-forest-400 bg-forest-50'
            : error
              ? 'border-danger/60'
              : 'border-ink-200 hover:border-forest-300 hover:bg-forest-50/40',
          disabled && 'cursor-not-allowed opacity-70'
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={onChange}
          className="sr-only"
        />
        {file ? (
          <div className="flex w-full items-center justify-between gap-3 rounded-md bg-surface-raised border border-ink-100 px-3 py-2 text-left">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                <ImageIcon className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-small font-medium text-ink-900">
                  {file.name}
                </p>
                <p className="text-caption text-ink-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clear();
              }}
              aria-label="Remove file"
              className="rounded-md p-1 text-ink-500 hover:text-ink-900 hover:bg-ink-100/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-50 text-forest-700">
              <FileUp className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-small text-ink-800 font-medium">
              Tap or drag a file to upload
            </p>
            {hint && <p className="text-caption text-ink-500">{hint}</p>}
          </>
        )}
      </label>
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}
    </div>
  );
}
