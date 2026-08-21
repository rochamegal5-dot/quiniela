interface Props{

title:string

amount:string

}

export default function Jackpot({

title,
amount

}:Props){

return(

<div className="pozo">

<span>

{title}

</span>

<strong>

{amount}

</strong>

</div>

)

}
