import type { CheerioAPI } from "cheerio";

export interface Premio {
  puesto: number;
  numero: string;
}

export interface QuinielaResponse {
  fecha: string;
  vespertina: Premio[];
  nocturna: Premio[];
}

function obtenerBloque($:CheerioAPI, indice:number):Premio[]{

    const bloques=$("img[src*='logo_quiniela']");

    if(bloques.length<=indice)return[];

    const logo=bloques.eq(indice);

    const premios:Premio[]=[];

    let nodo=logo.parent();

    while(nodo.length){

        nodo.find(".text_azul_3").each((_,el)=>{

            const numero=$(el).text().trim();

            if(/^\d{3}$/.test(numero)){

                premios.push({

                    puesto:premios.length+1,

                    numero

                });

            }

        });

        if(premios.length>=20)break;

        nodo=nodo.next();

    }

    return premios.slice(0,20);

}

export function parseQuiniela($:CheerioAPI):QuinielaResponse{

    const fecha=$("body")
    .text()
    .match(/\d{2}\/\d{2}\/\d{4}/)?.[0]||"";

    return{

        fecha,

        vespertina:obtenerBloque($,0),

        nocturna:obtenerBloque($,1)

    };

}
