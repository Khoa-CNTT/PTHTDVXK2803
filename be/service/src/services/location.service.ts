import { bookBusTicketsDB } from "../config/db";

export const addLocationSer = (
  nameLocation: string
): Promise<{ status: string; message: string }> => {
  return new Promise(async (resolve, reject) => {
    if (!nameLocation) reject({ message: "Name location null!" });
    try {
      await bookBusTicketsDB.execute("call insert_location(?)", [nameLocation]);
      // const newLocation = row;
      resolve({
        status: "OK",
        message: "Add new location success.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const updateLocationSer = (
  id: number,
  nameLocation: string
): Promise<{ status: string; message: string }> => {
  return new Promise(async (resolve, reject) => {
    if (!nameLocation || !id) reject({ message: "Name location null!" });
    try {
      await bookBusTicketsDB.execute("call update_location(?, ?)", [id, nameLocation]);
      resolve({
        status: "OK",
        message: "Update location success.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteLocationSer = (id: number): Promise<{ status: string; message: string }> => {
  return new Promise(async (resolve, reject) => {
    if (!id) reject({ message: "Id location null!" });
    try {
      await bookBusTicketsDB.execute("call delete_location(?)", [id]);
      resolve({
        status: "OK",
        message: "Delete location success.",
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllLocationSer = (): Promise<{
  status: string;
  message: string;
  data: object;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const [row] = await bookBusTicketsDB.execute("call get_all_location()");
      resolve({
        status: "OK",
        message: "Get all location success.",
        data: row[0],
      });
    } catch (error) {
      reject(error);
    }
  });
};
