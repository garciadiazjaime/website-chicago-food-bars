export interface Place {
  name: string;
  url: string;
  type: "restaurant" | "bar" | "hotel";
  lat: number;
  lng: number;
  address: string;
  slug: string;
  image: string;
}
