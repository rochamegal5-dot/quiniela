interface Props {

  title: string

  children: React.ReactNode

}

export default function Panel({

  title,

  children,

}: Props) {

  return (

    <section className="casino-panel">

      <div className="casino-title">

        {title}

      </div>

      <div className="casino-body">

        {children}

      </div>

    </section>

  )

}
