import { Car, CarType, Image } from "../@types/car.type";
import { CloudinaryAsset } from "../@types/cloudinary";
import { ResultSetHeader } from "mysql2";
import deleteOldFile from "../utils/deleteOldFile.util";
import { ArrangeType } from "../@types/type";

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

  async addCar(newCar: Car, filesCloudinary: CloudinaryAsset[]) {
    const connection = await this.db.getConnection(); // lấy kết nối từ pool
    try {
      await connection.beginTransaction();

      const { licensePlate, capacity, type, currentLocationId } = newCar;

      const sqlCar = "CALL AddCar(?, ?, ?, ?)";
      const [rows] = await connection.query(sqlCar, [
        currentLocationId,
        licensePlate,
        capacity,
        type,
      ]);

      const insertId = rows[0][0].insertedId;
      if (!insertId) {
        for (const image of filesCloudinary) {
          if (!image?.public_id) continue;
          deleteOldFile(image.public_id);
        }

        await connection.rollback();

        return {
          status: "ERR",
          message: "Thêm xe thất bại",
        };
      }

      if (filesCloudinary?.length > 0) {
        for (const image of filesCloudinary) {
          if (!image?.secure_url || !image?.public_id) continue;
          const [resultRows]: any = (await connection.query("CALL AddCarImage(?, ?, ?, ?)", [
            insertId,
            image.secure_url,
            image.public_id,
            image.isMain,
          ])) as [ResultSetHeader];

          if (resultRows?.affectedRows <= 0) {
            deleteOldFile(image.public_id);
          }
        }
      }

      await connection.commit();
      return {
        status: "OK",
        message: "Thêm xe thành công",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release(); // Trả kết nối về pool
    }
  }

  async updateCar(updateCar: Car, filesCloudinary: CloudinaryAsset[]) {
    const connection = await this.db.getConnection();
    try {
      await connection.beginTransaction();

      const { id, licensePlate, capacity, type, indexIsMian } = updateCar;

      const sql = "CALL UpdateCar(?, ?, ?, ?)";
      const values = [id, licensePlate, capacity, type];
      const [rowsUpdate] = (await connection.execute(sql, values)) as [ResultSetHeader];
      if (rowsUpdate?.affectedRows <= 0) {
        await connection.rollback();
        return {
          status: "ERR",
          message: "Cập nhật xe thất bại",
        };
      }
      if (rowsUpdate.affectedRows > 0 && filesCloudinary?.length > 0) {
        if (indexIsMian) {
          const [resetIsmain] = (await connection.execute(
            "UPDATE img_car SET is_main = 0 WHERE car_id = ?",
            [id]
          )) as [ResultSetHeader];
          if (resetIsmain?.affectedRows <= 0) {
            await connection.rollback();
            return {
              status: "ERR",
              message: "Cập nhật ảnh chính thất bại",
            };
          }
        }
        for (let img of filesCloudinary) {
          if (!img?.secure_url || !img?.public_id) continue;

          const addImageSql = "CALL AddCarImage(?, ?, ?, ?)";
          const imageParams = [id, img.secure_url, img.public_id, img.isMain];

          const [result] = (await connection.execute(addImageSql, imageParams)) as [
            ResultSetHeader
          ];

          if (result?.affectedRows <= 0) {
            await connection.rollback(); // rollback nếu thêm ảnh lỗi
            deleteOldFile(img.public_id);
            return {
              status: "ERR",
              message: "Cập nhật ảnh xe thất bại",
            };
          }
        }
      }

      await connection.commit();
      return {
        status: "OK",
        message: "Cập nhật xe thành công",
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
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

  async getAll(
    limit: number,
    offset: number,
    arrangeType: ArrangeType,
    licensePlateSearch: string,
    type: CarType
  ) {
    try {
      const total = await this.totalCar();
      const sql = "call getCars(?, ?, ?, ?, ?)";
      const [rows] = await this.db.execute(sql, [
        limit,
        offset,
        arrangeType,
        licensePlateSearch,
        type,
      ]);
      return {
        total: rows[0][0].total,
        totalPage: Math.ceil(total / limit),
        data: rows[1],
      };
    } catch (error) {
      console.log("err", error);
      throw error;
    }
  }

  async getCarByLicensePlate(licensePlate: string) {
    try {
      const [rows] = await this.db.execute("call getCarByLicensePlate(?)", [licensePlate]);
      return rows[0][0];
    } catch (error) {
      throw error;
    }
  }

  async updateImgCar(dataImgCar: Image, fileCloudinary: CloudinaryAsset) {
    try {
      console.log("dataImgCar", dataImgCar);
      console.log("fileCloudinary", fileCloudinary);
      const { id, urlPublicImg } = dataImgCar;
      const { secure_url, public_id } = fileCloudinary;

      const sql = "call UpdateCarImage(?, ?, ?)";
      const values = [id, secure_url, public_id];
      const [rows] = await (this.db.execute(sql, values) as [ResultSetHeader]);
      if (rows.affectedRows > 0) {
        if (urlPublicImg) {
          deleteOldFile(urlPublicImg);
        }
        return { status: "OK" };
      } else {
        return { status: "ERR" };
      }
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
