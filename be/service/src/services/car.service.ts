import { Car, CarRequest, CarStatus, CarType, Image } from "../@types/car.type";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ResultSetHeader } from "mysql2";
import { convertToVietnamTime } from "../utils/convertTime";
import deleteOldFile from "../utils/deleteOldFile.util";

export class CarService {
  private db;

  constructor(db: any) {
    this.db = db;
  }

  async checkCar(licensePlate: string) {
    const [rows] = await this.db.execute("select * from car where license_plate = ?", [
      licensePlate,
    ]);
    const car = rows[0];
    if (car) return car;
    throw new Error("Xe không tồn tại");
  }

  async checkIsMain(carId: number) {
    const [rows] = await this.db.execute(
      "select count(*) as countMain from img_car where car_id = ? and is_main = 1",
      [carId]
    );
    return (rows as any)[0].countMain > 0;
  }

  async getMainImage(carId: number) {
    const [rows] = await this.db.execute("select * from img_car where is_main = 1 and car_id = ?", [
      carId,
    ]);
    return rows[0] || null;
  }

  async totalCar() {
    const [rows] = await this.db.execute(`
      select count(c.id) as totalCarList from car c
      inner join img_car ic on c.id = ic.car_id
      where ic.is_main = 1
    `);
    return (rows as any)[0].totalCarList ?? 0;
  }

  async addCar(newCar: CarRequest, filesCloudinary: CloudinaryAsset[]) {
    try {
      const { licensePlate, capacity, type, indexIsMain } = newCar;
      const index = Number(indexIsMain);

      const sqlCar = "call AddCar(?, ?, ?)";
      const values = [licensePlate, capacity, type];
      await this.db.execute(sqlCar, values);

      const car = await this.checkCar(licensePlate);

      if (filesCloudinary?.length > 0) {
        let count = 0;
        const promise = filesCloudinary.map(async (image) => {
          if (!image?.secure_url || !image?.public_id) return;
          const [resultRows] = await (this.db.execute("call AddCarImage(?, ?, ?, ?)", [
            car.id,
            image.secure_url,
            image.public_id,
            index === count ? 1 : 0,
          ]) as [ResultSetHeader]);
          if (resultRows.affectedRows <= 0) {
            deleteOldFile(image.public_id);
          }
          count++;
        });
        await Promise.all(promise);
      }

      return {};
    } catch (error) {
      throw error;
    }
  }

  async updateCar(updateCar: CarRequest, filesCloudinary: CloudinaryAsset[]) {
    try {
      const { id, licensePlate, capacity, type, indexIsMain } = updateCar;
      await this.checkCar(licensePlate);

      const sql = "call UpdateCar(?, ?, ?, ?)";
      const values = [id || null, licensePlate || null, capacity || null, type || null];
      const [rowsUpdate] = await (this.db.execute(sql, values) as [ResultSetHeader]);

      if (rowsUpdate.affectedRows > 0 && filesCloudinary?.length) {
        const isMainIndex = indexIsMain != null ? Number(indexIsMain) : -1;

        if (isMainIndex >= 0) {
          const mainImg = await this.getMainImage(Number(id));
          if (mainImg?.id) {
            await this.db.execute("update img_car set is_main = 0 where id = ?", [mainImg.id]);
          }
        }

        let mainImageSet = false;
        for (let i = 0; i < filesCloudinary.length; i++) {
          const image = filesCloudinary[i];
          if (!image?.secure_url || !image?.public_id) continue;

          const isMain = i === isMainIndex && !mainImageSet ? 1 : 0;
          if (isMain) mainImageSet = true;

          await this.db.execute("call AddCarImage(?, ?, ?, ?)", [
            id || null,
            image.secure_url,
            image.public_id,
            isMain,
          ]);
        }
      }

      return {};
    } catch (error) {
      throw error;
    }
  }

  async deleteCar(id: number) {
    try {
      const sql = "call delete_car(?)";
      await this.db.execute(sql, [id]);
      return { status: "OK" };
    } catch (error) {
      throw error;
    }
  }

  async getAllCar(limit: number, offset: number) {
    try {
      const total = await this.totalCar();
      const sql = "call getCars(?, ?)";
      const [rows] = await this.db.execute(sql, [limit, offset]);
      return {
        total,
        totalPage: Math.ceil(total / limit),
        data: rows[0],
      };
    } catch (error) {
      console.log("err", error);
      throw error;
    }
  }

  async getCarById(id: number) {
    try {
      const sql = "call getDetailCar(?)";
      const [rows] = await this.db.execute(sql, [id]);
      const detailCar: Car = rows[0][0];
      if (!detailCar) throw new Error("Xe không tồn tại");

      detailCar.createAt = convertToVietnamTime(detailCar.createAt);
      detailCar.updateAt = convertToVietnamTime(detailCar.updateAt);

      return detailCar;
    } catch (error) {
      throw error;
    }
  }

  async getCarByLicensePlate(licensePlate: string) {
    try {
      const sql = "call getCarByLicensePlate(?)";
      const [rows] = await this.db.execute(sql, [licensePlate]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getCarByType(type: CarType) {
    try {
      const sql = "call get_car_by_type(?)";
      const [rows] = await this.db.execute(sql, [type]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getCarByStatus(status: CarStatus) {
    try {
      const sql = "call get_car_by_status(?)";
      const [rows] = await this.db.execute(sql, [status]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async getCarByTypeAndStatus(type: string, status: string) {
    try {
      const sql = "call get_car_by_type_and_status(?, ?)";
      const [rows] = await this.db.execute(sql, [type, status]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  async addImgCar(newImg: Image, fileCloudinary: CloudinaryAsset) {
    try {
      const { public_id, secure_url } = fileCloudinary;
      const { carId, isMain } = newImg;

      const hasMain = await this.checkIsMain(carId);
      if (hasMain && isMain === 1) {
        return {
          status: "Error",
          message: "Mỗi xe chỉ có một ảnh chính",
        };
      }

      const sql = "call AddCarImage(?, ?, ?, ?)";
      const values = [carId, secure_url, public_id, isMain];
      const [rows] = await (this.db.execute(sql, values) as [ResultSetHeader]);

      if (rows.affectedRows > 0) return { status: "OK" };
      return { status: "Error" };
    } catch (error) {
      throw error;
    }
  }

  async updateImgCar(dataImgCar: Image, fileCloudinary: CloudinaryAsset) {
    try {
      const { secure_url, public_id } = fileCloudinary;
      const { id, isMain, carId } = dataImgCar;

      const hasMain = await this.checkIsMain(carId);
      if (hasMain && isMain === 1) {
        return {
          status: "Error",
          message: "Mỗi xe chỉ có một ảnh chính",
        };
      }

      if (fileCloudinary) {
        const sql = "call UpdateCarImage(?, ?, ?, ?)";
        const values = [id, secure_url, public_id, isMain];
        const [rows] = await (this.db.execute(sql, values) as [ResultSetHeader]);
        if (rows.affectedRows > 0) return { status: "OK" };
      } else {
        const [rows] = await (this.db.execute("update img_car set is_main = ? where id = ?", [
          isMain,
          id,
        ]) as [ResultSetHeader]);
        if (rows.affectedRows > 0) return { status: "OK" };
      }

      return { status: "Error" };
    } catch (error) {
      throw error;
    }
  }

  async deleteImgCar(data: Image) {
    try {
      const { id, urlPublicImg } = data;
      const [rows] = await (this.db.execute("delete from img_car where id = ?", [id]) as [
        ResultSetHeader
      ]);
      if (rows.affectedRows > 0) {
        deleteOldFile(urlPublicImg);
        return { status: "OK" };
      }
      return { status: "Error", message: "Không tìm thấy ảnh để xóa" };
    } catch (error) {
      throw error;
    }
  }
}
