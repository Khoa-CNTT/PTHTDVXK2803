import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../styles/dynamicCoDriverSelect.module.scss";
import { CoAndDriverType } from "../types/trip";
import InputDropDownList from "./InputDropDownList";

interface Props {
  idHTML?: string;
  coDrivers?: CoAndDriverType[];
  onFieldsChange?: (fields: CoAndDriverType[]) => void;
}

const DynamicCoDriverSelect: React.FC<Props> = ({ idHTML, coDrivers = [], onFieldsChange }) => {
  const [selectedCoDrivers, setSelectedCoDrivers] = useState<(CoAndDriverType | null)[]>([]);

  useEffect(() => {
    const validDrivers = selectedCoDrivers.filter(
      (driver): driver is CoAndDriverType => driver !== null
    );
    if (onFieldsChange) {
      onFieldsChange?.(validDrivers);
    }
  }, [selectedCoDrivers]);

  const handleSelectedDriver = (index: number, selectedName: string) => {
    const coDriver = coDrivers.find((d) => d.phone === selectedName.split("-")[1].trim());
    console.log("coDriver", coDriver);
    if (coDriver) {
      const updatedDrivers = [...selectedCoDrivers];
      updatedDrivers[index] = coDriver;
      setSelectedCoDrivers(updatedDrivers);
    }
  };

  const handleAddField = () => {
    if (selectedCoDrivers.some((cd) => !cd)) {
      toast.warning("Vui lòng chọn phụ xe trước khi thêm phụ xe khác");
      return;
    }
    if (selectedCoDrivers.length >= 3) {
      toast.warning("Phụ xe không quá 3 người");
      return;
    }
    setSelectedCoDrivers([...selectedCoDrivers, null]);
  };

  const handleRemoveField = (index: number) => {
    const updatedDrivers = [...selectedCoDrivers];
    updatedDrivers.splice(index, 1);
    setSelectedCoDrivers(updatedDrivers);
  };

  return (
    <div className={`${styles["dynamic-selected-wrapper"]}`}>
      <div className={styles["selected-list"]}>
        {selectedCoDrivers.map((coDriver, index) => {
          const availableCoDrivers = coDrivers.filter(
            (cd) =>
              !selectedCoDrivers.some((selected, idx) => selected?.id === cd?.id && idx !== index)
          );
          return (
            <div key={index} className={styles.item}>
              <div className={styles["input-drop-down-list-wrapper"]}>
                <InputDropDownList
                  idHTML={idHTML}
                  list={availableCoDrivers.map((cd) => `${cd.fullName} - ${cd.phone}`)}
                  valueIn={coDriver?.fullName || ""}
                  contentPlaceholder="Chọn phụ xe..."
                  onSelected={(value) => handleSelectedDriver(index, value)}
                />
              </div>
              <div className={styles.action}>
                <button
                  type="button"
                  onClick={() => handleRemoveField(index)}
                  className={styles["btn-remove"]}
                >
                  X
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.action}>
        <button type="button" onClick={handleAddField} className={styles["btn-add"]}>
          + Thêm phụ xe
        </button>
      </div>
    </div>
  );
};

export default DynamicCoDriverSelect;
