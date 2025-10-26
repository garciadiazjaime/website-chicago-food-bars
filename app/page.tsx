import fs from "fs";
import path from "path";
import Map from "@/app/components/Map";
import SelectedPlace from "@/app/components/SelectedPlace";

export default async function Home() {
  // Read the JSON file on the server side
  const filePath = path.join(process.cwd(), "public", "all-places.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const places = JSON.parse(fileContent);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Map places={places} />
      <SelectedPlace />
    </div>
  );
}
