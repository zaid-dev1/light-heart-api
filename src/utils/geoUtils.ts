import axios from 'axios';

export const getCoordinatesFromAddress = async (
  fullAddress: any,
): Promise<{ lat: number | null; lng: number | null }> => {
  const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=${process.env.OPENCAGE_API_KEY}`;

  try {
    const geoResponse = await axios.get(geoUrl);
    if (geoResponse.data.results.length > 0) {
      const { lat: latitude, lng: longitude } =
        geoResponse.data.results[0].geometry;
      return { lat: latitude, lng: longitude };
    } else {
      console.error(`No geocoding results for address: ${fullAddress}`);
      return { lat: null, lng: null };
    }
  } catch (error) {
    console.error('Error fetching coordinates from OpenCage:', error);
    return { lat: null, lng: null };
  }
};
