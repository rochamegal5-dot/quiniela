interface Props{

value:string

color?:
"green"|
"yellow"|
"blue"

}

export default function LedNumber({

value,
color="yellow"

}:Props){

return(

<div className={`led-number ${color}`}>

{value}

</div>

)

}
