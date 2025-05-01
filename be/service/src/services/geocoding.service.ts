import NodeGeocoder, { Options, Entry } from "node-geocoder";

class GeocodingService {
  private geocoder;

  constructor() {
    const options: Options = {
      provider: "openstreetmap",
    };

    this.geocoder = NodeGeocoder(options);
  }

  async getCoordinates(city: string): Promise<Entry | null> {
    try {
      const res = await this.geocoder.geocode(city);
      return res.length > 0 ? res[0] : null;
    } catch (error) {
      console.log("err", error);
    }
  }
}

export default GeocodingService;
