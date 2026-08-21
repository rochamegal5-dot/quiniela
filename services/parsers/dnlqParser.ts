export interface Resultado {

  puesto: number;

  numero: string;

}

export interface DNLQData {

  fecha: string;

  quiniela: {

    vespertina: Resultado[];

    nocturna: Resultado[];

  };

  tombola: {

    vespertina: Resultado[];

    nocturna: Resultado[];

  };

  fiveGold: {

    numeros: number[];

    extra: number;

    revancha: number[];

    pozo: string;

    pozoRevancha: string;

  };

}
export function parseDNLQ(html: string): DNLQData {

  const text = html

    .replace(/<script[\s\S]*?<\/script>/gi,"")

    .replace(/<style[\s\S]*?<\/style>/gi,"")

    .replace(/<[^>]*>/g,"\n")

    .replace(/\r/g,"")

    .replace(/\u00a0/g," ")

    .replace(/[ ]+/g," ")

    .split("\n")

    .map(x=>x.trim())

    .filter(Boolean);

  return {

    fecha: obtenerFecha(text),

    quiniela:{

      vespertina: obtenerSorteo(text,"VESPERTINA"),

      nocturna: obtenerSorteo(text,"NOCTURNA")

    },

    tombola:{

      vespertina: obtenerTombola(text,"VESPERTINA"),

      nocturna: obtenerTombola(text,"NOCTURNA")

    },

    fiveGold: obtenerFiveGold(text)

  };

}
function obtenerFecha(lines:string[]){

  const f=lines.find(l=>/\d{2}\/\d{2}\/\d{4}/.test(l));

  return f||"";
}
function obtenerSorteo(

lines:string[],

nombre:string

){

const inicio=lines.findIndex(

l=>l.toUpperCase().includes(nombre)

);

if(inicio<0)return[];

const resultados=[];

for(

let i=inicio;

i<lines.length;

i++

){

const m=lines[i].match(/^(\d{1,2})\s+(\d{2,4})$/);

if(!m)continue;

resultados.push({

puesto:Number(m[1]),

numero:m[2]

});

if(resultados.length===20)break;

}

return resultados;

}
function obtenerTombola(

lines:string[],

nombre:string

){

return obtenerSorteo(lines,nombre);

}
function obtenerFiveGold(

lines:string[]

){

const numeros=[];

const revancha=[];

let extra=0;

let pozo="";

let pozoRevancha="";

for(const l of lines){

if(

/^\d+\s+\d+\s+\d+\s+\d+\s+\d+$/.test(l)

){

const n=l

.split(" ")

.map(Number);

if(!numeros.length)

numeros.push(...n);

else if(!revancha.length)

revancha.push(...n);

}

if(

l.toUpperCase().includes("EXTRA")

){

const n=l.match(/\d+/);

if(n)

extra=Number(n[0]);

}

if(

l.toUpperCase().includes("POZO")

&&

!pozo

){

pozo=l;

}

if(

l.toUpperCase().includes("REVANCHA")

&&

!pozoRevancha

){

pozoRevancha=l;

}

}

return{

numeros,

extra,

revancha,

pozo,

pozoRevancha

};

}
