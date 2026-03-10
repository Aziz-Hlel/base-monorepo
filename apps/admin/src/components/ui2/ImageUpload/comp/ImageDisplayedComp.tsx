import { Button } from '@/components/ui/button';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import type { DropzoneOptions } from 'react-dropzone';

type ImageDisplayedCompProps = {
  img: string | null;
  maxSizeInBytes: number;
  dropZoneConfig: DropzoneOptions;
  onFileChange: (value: File | null) => void;
  rollBackToInitImage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hasErrors: boolean;
};

export default function ImageDisplayedComp({
  img,
  maxSizeInBytes,
  dropZoneConfig,
  onFileChange,
  rollBackToInitImage,
  hasErrors,
}: ImageDisplayedCompProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-start ">
      <div className={cn(' text-sm text-left w-full font-semibold mb-1', hasErrors && 'text-red-500')}>Thumbnail</div>
      <div className=" text-sm text-left w-full text-gray-600 font-light mb-4">Uploaded Image</div>

      <div
        className={cn('border border-black rounded-lg border-dashed h-full w-full p-2 ', hasErrors && 'border-red-500')}
      >
        <img src={img ?? undefined} className=" mx-auto  h-72 object-contain rounded-lg" />

        <div className="flex justify-end gap-4 px-4 pt-4">
          <Button onClick={rollBackToInitImage} type="button" variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <FileUploader
            value={null}
            onValueChange={onFileChange}
            maxImageSize={maxSizeInBytes}
            dropzoneOptions={dropZoneConfig}
            className=" w-fit"
          >
            <FileInput>
              <Button type="button" variant="default" className="cursor-pointer">
                Change
              </Button>
            </FileInput>
          </FileUploader>
        </div>
      </div>
    </div>
  );
}
