const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

require("dotenv").config();

// https://www.theworlds50best.com/discovery/sitemap/us/chicago
const host = "https://www.theworlds50best.com";
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ETL;

const places = [];

async function extract(url) {
  loggerInfo("Extracting URL:", { url });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
  });

  await page.goto(url);

  const html = await page.content();
  await browser.close();

  return html;
}

function transform(html) {
  const $ = cheerio.load(html);
  const places = [];

  $("#seoContainer .item").each((index, element) => {
    const name = $(element).find("h2").text().trim();
    const type = $(element).find("p").first().text().trim();
    const url = `${host}${$(element).find("a").attr("href")}`;

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    places.push({
      name,
      type,
      url,
      slug,
    });
  });

  return places;
}

async function getCoordinatesFromAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${GOOGLE_API_KEY}`;

  try {
    loggerInfo("Fetching coordinates for address:", { url });
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || data.results.length === 0) {
      loggerInfo("No results found for address:", {
        address,
        error: data.error_message,
      });
      return {};
    }

    const location = data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } catch (error) {
    loggerInfo("Error fetching coordinates:", { error, address });
    return {};
  }
}

async function transformSinglePlace(html, place) {
  const $ = cheerio.load(html);
  const details = $(".content");
  const address = $(details).find(".location").text().trim();
  const coordinates = await getCoordinatesFromAddress(address);

  if (!coordinates.lat || !coordinates.lng) {
    return;
  }

  places.push({
    name: place.name,
    url: place.url,
    type: place.type,
    address,
    lat: coordinates.lat,
    lng: coordinates.lng,
    slug: place.slug,
  });
}

async function ETLSinglePlace(place) {
  loggerInfo("ETL for place:", { name: place.name });

  const html = await extract(place.url);
  await transformSinglePlace(html, place);
}

async function load() {
  try {
    fs.writeFileSync(
      "public/places.json",
      JSON.stringify(places, null, 2),
      "utf-8"
    );
    loggerInfo(`Places saved,`, { count: places.length });
  } catch (error) {
    loggerInfo("Error saving places to file:", { error });
  }
}

async function main() {
  const url = `${host}/discovery/sitemap/us/chicago`;
  //   const url = `${host}/discovery/sitemap/us/chicago?offset=20`;
  const html = await extract(url);

  const placesFromHomePage = transform(html);

  for (const item of placesFromHomePage) {
    loggerInfo("Processing item:", item);
    await ETLSinglePlace(item);

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  await load();
}

function loggerInfo(msg, metadata) {
  console.log(new Date().toJSON(), msg, metadata);
}

main().then(() => {
  loggerInfo("ETL process completed.");
});
