import { Button } from '@/components/ui/button';
import { FileInput, FileUploader } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import type { DropzoneOptions } from 'react-dropzone';
import { useFile } from '../context/fileProvider';

type ImageDisplayedCompProps = {
  maxSizeInBytes: number;
  dropZoneConfig: DropzoneOptions;
  hasErrors: boolean;
  setError: (message: string) => void;
};

export default function ImageDisplayedComp({ maxSizeInBytes, dropZoneConfig, hasErrors }: ImageDisplayedCompProps) {
  const { mediaUrl, handleFileChange, handleRollBack } = useFile();
  return (
    <div className="relative w-full h-full flex flex-col justify-start ">
      <div
        className={cn('border border-black rounded-lg border-dashed h-full w-full p-2 ', hasErrors && 'border-red-500')}
      >
        <img src={mediaUrl} className=" mx-auto  h-72 object-contain rounded-lg" />

        <div className="flex justify-end gap-4 px-4 pt-4">
          <Button onClick={handleRollBack} type="button" variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <FileUploader
            value={null}
            onValueChange={handleFileChange}
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
