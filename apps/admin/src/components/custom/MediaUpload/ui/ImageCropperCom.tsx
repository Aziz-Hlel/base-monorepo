import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import Cropper from 'react-easy-crop';
import { useFile } from '../context/fileProvider';
import { useCrop } from '../hooks/use-crop';
import { useGetAspect } from '../hooks/use-get-aspect';

type ImageCropperComProps = {
  aspect: number | null | undefined;
};

export default function ImageCropperCom({ aspect: aspectProp }: ImageCropperComProps) {
  const { file, handleFileChange } = useFile();
  const { crop, zoom, onCropChange, onZoomChange, process_upload_File, onCropComplete } = useCrop();

  const { aspect } = useGetAspect({ aspectProp: aspectProp });

  const image = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  const handleCancel = () => handleFileChange(null);

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center mr-auto ">
      <div className="border border-black rounded-lg border-dashed h-full w-full p-2 ">
        <div className=" relative w-full h-68   ">
          <div className="bg-white">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              classes={{
                containerClassName: 'fixed  w-full h-full ',
              }}
            />
          </div>
        </div>

        <div className=" w-full mr-auto">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={onZoomChange}
            className=" w-full"
          />
        </div>
        <div className=" w-full mr-auto flex justify-end gap-4">
          <Button onClick={handleCancel} variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={process_upload_File} variant="default" className="cursor-pointer">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
