import axios from "axios";
import * as cheerio from "cheerio";

export async function loadPage(url: string) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    timeout: 15000,
  });

  return cheerio.load(response.data);
}
