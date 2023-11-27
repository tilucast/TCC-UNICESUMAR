import axios from "axios";
import { useEffect, useState } from "react";

export function useIBGEUf() {
  const [ufInitials, setUfInitials] = useState<string[]>();

  useEffect(() => {
    axios
      .get<IBGEUf[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufResponse = res.data.map((uf) => uf.sigla);

        setUfInitials(ufResponse);
      });
  }, []);

  return { ufInitials };
}

interface IBGEUf {
  sigla: string;
}

export { IBGEUf };
