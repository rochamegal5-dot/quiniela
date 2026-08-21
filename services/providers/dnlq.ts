import axios from "axios";

const URL = "https://www.loteria.gub.uy/ver_resultados.php";

export async function loadDNLQ(): Promise<string> {

  const { data } = await axios.get(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    },
    timeout: 15000
  });

  return data;
}
