import type { CheerioAPI } from "cheerio";

export function parseTombola($: CheerioAPI) {

  return {

    fecha: "",

    vespertina: [],

    nocturna: [],

  };

}
