import { Button } from '@/components/ui/button';
import Cropper, { type Area, type Point } from 'react-easy-crop';

type ImageCropperComProps = {
  imgUrl: string | undefined;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (point: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  handleCancel: () => void;
  Crop_OptimizeImage: () => Promise<void>;
  onCropComplete: (_: Point, croppedAreaPixels: Area) => void;
};

export default function ImageCropperCom({
  imgUrl,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  handleCancel,
  Crop_OptimizeImage,
  onCropComplete,
}: ImageCropperComProps) {
  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center mr-auto ">
      <div className=" text-sm text-left w-full font-semibold mb-1">Thumbnail</div>
      <div className=" text-sm text-left w-full text-gray-600 font-light mb-4">Crop Image to 9:16</div>

      <div className="border border-black rounded-lg border-dashed h-full w-full p-2 ">
        <div className=" relative w-full h-68   ">
          <div className="bg-white">
            <Cropper
              image={imgUrl}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
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
            onChange={(e) => onZoomChange(e.target.valueAsNumber)}
            className=" w-full"
          />
        </div>
        <div className=" w-full mr-auto flex justify-end gap-4">
          <Button onClick={handleCancel} variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={async () => await Crop_OptimizeImage()} variant="default" className="cursor-pointer">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
