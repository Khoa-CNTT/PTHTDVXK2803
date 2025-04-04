import { bookBusTicketsDB } from "../config/db";
import { Car, CarRequest, CarStatus, CarType, Image } from "../@types/car.type";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ResultSetHeader } from "mysql2";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";

export const checkCar = async (licensePlate: string) => {
  const [rows] = await bookBusTicketsDB.execute("select * from car where license_plate = ?", [
    licensePlate,
  ]);
  const car = rows[0];
  if (car) {
    return car;
  }
  throw new Error("Xe không tồn tại");
};

export const checkIsMain = async () => {
  const [rows] = await bookBusTicketsDB.execute(
    "select count(is_main) as countMain from img_car where is_main = 1"
  );
  const countIsMain = (rows as any)[0].countMain ?? 0;
  return countIsMain > 0 ? true : false;
};

export const getImgCarIsMain = async (carID: number) => {
  const [rows] = await bookBusTicketsDB.execute(
    "select * from img_car where is_main = 1 and car_id = ?",
    [carID]
  );
  if (Array.isArray(rows) && rows.length > 0) {
    return (rows[0] as { id: number }).id;
  }
  return null;
};

export const totalCar = async () => {
  const [rows] = await bookBusTicketsDB.execute("select count(id) as totalCarList from car");
  return (rows as any)[0].totalCarList ?? 0;
};

export const addCarSer = (newCar: CarRequest, filesCloudinary: CloudinaryAsset[]): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { licensePlate, capacity, type, indexIsMain } = newCar;
      const index = Number(indexIsMain);
      console.log("data", newCar);
      console.log("files", filesCloudinary);
      const sqlCar = "call AddCar(?, ?, ?)";
      const values = [licensePlate, capacity, type];
      const [result] = await bookBusTicketsDB.execute<ResultSetHeader>(sqlCar, values);
      const car = await checkCar(licensePlate);

      if (result.affectedRows > 0 && checkCar(licensePlate)) {
        if (filesCloudinary && filesCloudinary.length > 0) {
          let count = 0;
          const promise = filesCloudinary.map(async (image) => {
            console.log("count:", count);

            const [resultRows] = await bookBusTicketsDB.execute<ResultSetHeader>(
              "call AddCarImage(?, ?, ?, ?)",
              [car.id, image.secure_url, image.public_id, index === count ? 1 : 0]
            );

            if (resultRows.affectedRows > 0) {
              return ++count;
            } else {
              deleteOldFile(image.public_id);
              return ++count;
            }
          });
          await Promise.all(promise);
        }
      }
      resolve({});
    } catch (error) {
      reject(error);
    }
  });
};

export const updateCarSer = async (
  updateCar: CarRequest,
  filesCloudinary: CloudinaryAsset[]
): Promise<any> => {
  try {
    const { id, licensePlate, capacity, type, indexIsMain } = updateCar;
    if (checkCar(licensePlate)) {
      const sql = "call UpdateCar(?, ?, ?, ?)";
      // Đảm bảo không có giá trị undefined
      const values = [id || null, licensePlate || null, capacity || null, type || null];

      const [rowsUpdate] = await bookBusTicketsDB.execute<ResultSetHeader>(sql, values);

      if (rowsUpdate.affectedRows > 0 && filesCloudinary) {
        let idOldIsMain = null;
        // Chuyển indexIsMain thành số, nếu không hợp lệ thì gán -1
        const isMainIndex =
          indexIsMain !== undefined && indexIsMain !== null ? Number(indexIsMain) : -1;
        console.log("index", isMainIndex);

        // Chỉ lấy id ảnh chính cũ nếu isMainIndex hợp lệ và >= 0
        if (isMainIndex >= 0) {
          idOldIsMain = await getImgCarIsMain(Number(id));
          // Đặt ảnh chính cũ về is_main = 0
          if (idOldIsMain) {
            await bookBusTicketsDB.execute("update img_car set is_main = 0 where id = ?", [
              idOldIsMain,
            ]);
          }
        }

        // Biến để đảm bảo chỉ có một ảnh chính
        let mainImageSet = false;

        if (filesCloudinary && filesCloudinary.length > 0) {
          for (let i = 0; i < filesCloudinary.length; i++) {
            const image = filesCloudinary[i];

            // Kiểm tra đầy đủ để không có undefined
            if (!image || !image.secure_url || !image.public_id) {
              console.log("Bỏ qua ảnh không hợp lệ:", i);
              continue;
            }

            // Xác định có phải ảnh chính không
            const isMain = i === isMainIndex && !mainImageSet ? 1 : 0;

            // Nếu đây là ảnh chính, đánh dấu đã đặt ảnh chính
            if (isMain === 1) {
              mainImageSet = true;
            }

            // Đảm bảo không có giá trị undefined trong tham số SQL
            await bookBusTicketsDB.execute("call AddCarImage(?, ?, ?, ?)", [
              id || null,
              image.secure_url || null,
              image.public_id || null,
              isMain,
            ]);
          }
        }
      }

      return {};
    } else {
      throw new Error("Xe không tồn tại.");
    }
  } catch (error) {
    console.error("Lỗi chi tiết:", error);
    throw error;
  }
};

export const deleteCarSer = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call delete_car(?)";
      await bookBusTicketsDB.execute(sql, [id]);
      resolve({
        status: "OK",
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const getAllCarSer = (limit: number, offset: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const total = await totalCar();
      const sql = "call get_all_car(?, ?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [limit, offset]);
      resolve({
        total: total,
        data: rows[0],
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByIdSer = (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call getDetailCar(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [id]);
      let detailCar: Car = rows[0];

      //convert time to VietNam time
      detailCar[0].createAt = convertToVietnamTime(detailCar[0].createAt);
      detailCar[0].updateAt = convertToVietnamTime(detailCar[0].updateAt);

      resolve(detailCar[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByLicensePlateSer = (licensePlate: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_license_plate(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [licensePlate]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByTypeSer = (type: CarType): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_type(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [type]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByStatusSer = (status: CarStatus): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_status(?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [status]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const getCarByTypeAndStatusSer = (type: string, status: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = "call get_car_by_type_and_status(?, ?)";
      const [rows] = await bookBusTicketsDB.execute(sql, [type, status]);
      resolve(rows[0]);
    } catch (error) {
      reject(error);
    }
  });
};

export const addImgCar = (newImg: Image, fileCloudinary): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { public_id, secure_url } = fileCloudinary;
      const { carId, isMain } = newImg;
      if (!checkIsMain())
        resolve({
          status: "Error",
          message: "Mỗi danh sách hình của xe chỉ có 1 hình là ảnh chính",
        });
      const sql = "call AddCarImage(?, ?, ?)";
      const values = [newImg, secure_url, public_id];
      const [rows] = await bookBusTicketsDB.execute<ResultSetHeader>(sql, values);
      if (rows.affectedRows > 0) {
        resolve({
          status: "OK",
        });
      }
      reject({
        status: "Error",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateImgCarSer = (
  dataImgCar: Image,
  filesCloudinary: CloudinaryAsset
): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { secure_url, public_id } = filesCloudinary;
      const { id, isMain } = dataImgCar;
      if (!checkIsMain())
        resolve({
          status: "Error",
          message: "Mỗi danh sách hình của xe chỉ có 1 hình là ảnh chính",
        });
      if (filesCloudinary) {
        const sql = "call UpdateCarImage(?, ?, ?, ?)";
        const values = [id, secure_url, public_id, isMain];
        const [rows] = await bookBusTicketsDB.execute<ResultSetHeader>(sql, values);
        if (rows.affectedRows > 0) {
          resolve({
            status: "OK",
          });
        }
      } else {
        const [rows] = await bookBusTicketsDB.execute<ResultSetHeader>(
          "update img_car set is_main = ? where id = ?",
          [isMain]
        );
        if (rows.affectedRows > 0) {
          resolve({
            status: "OK",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteImgCarSer = (data: Image): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id, urlPublicImg } = data;

      const [rows] = await bookBusTicketsDB.execute<ResultSetHeader>(
        "delete from img_car  where id = ?",
        [id]
      );
      if (rows.affectedRows > 0) {
        deleteOldFile(urlPublicImg);
        resolve({
          status: "OK",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
