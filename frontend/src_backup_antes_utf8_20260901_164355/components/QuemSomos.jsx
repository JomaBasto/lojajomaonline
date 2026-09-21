import { Link } from "react-router-dom";
export default function QuemSomos() {
  return (
    <div className="quem-somos-page">

        <div className="quem-somos-banner">
  <img 
    src="/quem-somos.jpeg"
    alt="Joma Basto - Quem Somos"
  />
</div>

      <section className="quem-somos-hero">

        <h1>Quem Somos</h1>

        <p className="quem-somos-intro">
          A Joma Basto nasceu em 2018 com o objetivo de levar qualidade,
          confiança e paixão pelo desporto a todos os nossos clientes.
        </p>

      </section>


      <section className="quem-somos-content">

        <p>
          Somos representantes da marca Joma em Portugal, disponibilizando
          calçado, equipamentos e acessórios desportivos para diversas
          modalidades, sempre com foco no conforto, desempenho e qualidade.
        </p>


        <p>
          Com uma vasta experiência no setor do desporto, acompanhamos atletas,
          clubes e equipas, oferecendo soluções adaptadas às necessidades de
          cada praticante, desde o amador ao profissional.
        </p>


        <p>
          O nosso compromisso passa por proporcionar um serviço próximo,
          rápido e seguro, garantindo uma experiência de compra simples,
          transparente e de confiança.
        </p>


        <p>
          Enviamos para todo o território nacional e estrangeiro, levando a
          qualidade da marca Joma cada vez mais longe.
        </p>


        <div className="quem-somos-destaque">

          <h2>Joma Basto</h2>

          <p>
            Paixão pelo desporto, compromisso com o cliente.
          </p>

        </div>

        <div className="quem-somos-botao">
  <Link to="/">
    Ver Produtos Joma
  </Link>
</div>

      </section>

    </div>
  );
}
