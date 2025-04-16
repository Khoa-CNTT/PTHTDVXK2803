import React from "react";

interface InputCustomizeFileProps {
  multiple?: boolean;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputCustomizeFile: React.FC<InputCustomizeFileProps> = ({ multiple, accept, onChange }) => {
  const [files, setFiles] = React.useState<FileList | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleClickInput = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFiles(files);
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (onChange) {
      onChange(e);
    }
    for (let i = 0; i < files!.length; i++) {
      if (!allowedTypes.includes(files![i].type)) {
        alert("Chỉ được chọn file ảnh JPG, PNG, hoặc JPEG!");
        e.target.value = ""; // Reset input
        return;
      }
    }
  };

  console.log("files", files);

  return (
    <div className="input-customize-file">
      <button className="btn-choose-file" onClick={handleClickInput}>
        Choose files
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default InputCustomizeFile;
