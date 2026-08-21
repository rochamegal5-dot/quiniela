import type { CheerioAPI } from "cheerio";

export function parseFiveGold($: CheerioAPI) {

  return {

    fecha: "",

    numeros: [],

    extra: 0,

    revancha: [],

    pozo: "",

    pozoRevancha: "",

  };

}
