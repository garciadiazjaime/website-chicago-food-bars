import fs from "fs";
import path from "path";
import ClientPage from "@/app/components/ClientPage";

export default async function Home() {
  // Read the JSON file on the server side
  const filePath = path.join(process.cwd(), "public", "all-places.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const places = JSON.parse(fileContent);

  return <ClientPage places={places} />;
}
