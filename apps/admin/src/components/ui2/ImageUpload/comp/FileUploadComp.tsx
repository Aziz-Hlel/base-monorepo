import { CloudUpload } from 'lucide-react';
import type { DropzoneOptions } from 'react-dropzone';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';

type FileUploadCompProps = {
  onFileChange: (value: File | null) => void;
  maxSizeInBytes: number;
  dropZoneConfig: DropzoneOptions;
  hasErrors: boolean;
};

export default function FileUploadComp({
  onFileChange,
  maxSizeInBytes,
  dropZoneConfig,
  hasErrors,
}: FileUploadCompProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-start ">
      <div className=" text-sm text-left w-full font-semibold mb-1">Thumbnail</div>
      <div className=" text-sm text-left w-full text-gray-600 font-light mb-4">Select an image to upload.</div>

      <FileUploader
        value={null}
        onValueChange={onFileChange}
        maxImageSize={maxSizeInBytes}
        dropzoneOptions={dropZoneConfig}
        className="relative  bg-background rounded-lg p-2"
      >
        <FileInput className={cn('outline-dashed outline-1 outline-slate-500', hasErrors && 'outline-red-500')}>
          <div className="flex items-center justify-center flex-col p-8 w-full ">
            <CloudUpload className="text-gray-500 min-h-56 size-16" />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
              &nbsp; or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
          </div>
        </FileInput>
      </FileUploader>
    </div>
  );
}
