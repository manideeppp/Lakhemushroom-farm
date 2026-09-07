import { useState } from 'react';
import { Input } from '../forms/Input';
import { FileUpload } from '../forms/FileUpload';
import { useToast } from '../feedback/ToastProvider';
import {
  uploadAdminMedia,
  type AdminMediaFolder,
} from '../../lib/mediaUpload';
import { getErrorMessage } from '../../utils/errors';

export interface AdminImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: AdminMediaFolder;
  placeholder?: string;
  required?: boolean;
}

export function AdminImageField({
  label,
  value,
  onChange,
  folder,
  placeholder = 'https://… or upload a file below',
  required,
}: AdminImageFieldProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | null) {
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadAdminMedia(file, folder);
      onChange(url);
      toast({ tone: 'success', message: 'Image uploaded.' });
    } catch (err) {
      toast({
        tone: 'danger',
        message: getErrorMessage(err, 'Could not upload image.'),
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Input
        label={label}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={uploading}
      />
      <FileUpload
        label="Upload from device"
        hint="JPG, PNG or WebP · max 5 MB"
        accept="image/jpeg,image/png,image/webp,image/gif"
        disabled={uploading}
        onFileSelected={(file) => void handleFile(file)}
      />
      {uploading && (
        <p className="text-caption text-ink-500">Uploading image…</p>
      )}
      {value && (
        <img
          src={value}
          alt=""
          className="h-24 w-24 rounded-md border border-ink-100 object-cover bg-cream-50"
        />
      )}
    </div>
  );
}
