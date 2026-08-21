interface Props{

numero:string

color?:"gold"|"silver"|"green"|"red"

size?:"sm"|"md"|"lg"

}

export default function Ball({

numero,

color="gold",

size="md"

}:Props){

return(

<div className={`ball ${color} ${size}`}>

{numero}

</div>

)

}
