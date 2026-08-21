import Carousel from "@/components/Carousel";
import CotizacionPanel from "@/components/panels/CotizacionPanel";
import PublicityPanel from "@/components/panels/PublicityPanel";
import QuinielaSlide from "@/components/panels/QuinielaSlide";
import CincoDeOroSlide from "@/components/panels/CincoDeOroSlide";
import TombolaSlide from "@/components/panels/TombolaSlide";

export default function Home() {
  return (
    <main className="dashboard">
      <Carousel>
        <CotizacionPanel />
        <PublicityPanel />
        <QuinielaSlide />
        <CincoDeOroSlide />
        <TombolaSlide />
      </Carousel>
    </main>
  );
}
