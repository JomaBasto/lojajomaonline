import { Link } from "react-router-dom";

export default function AvisosLegais() {
  return (
    <div className="legal-page">
      <section className="legal-page-content">
        <h1>Avisos Legais</h1>

        <h2>Identificação</h2>

        <p>
          <strong>JomaBasto — Sónia Fernandes</strong><br />
          NIF: 212042815<br />
          Avenida da Igreja — Loja 4<br />
          4880-231 Mondim de Basto<br />
          Portugal
        </p>

        <p>
          Telefone: 924 176 159
        </p>

        <h2>Atividade</h2>

        <p>
          A JomaBasto dedica-se à comercialização de artigos e equipamentos
          desportivos, disponibilizando os seus produtos através da loja
          online para clientes em Portugal e no estrangeiro.
        </p>

        <h2>Responsável pelo website</h2>

        <p>
          Sónia Fernandes.
        </p>

        <h2>Conteúdos do website</h2>

        <p>
          A JomaBasto procura assegurar que a informação disponibilizada no
          website é correta e atualizada. No entanto, podem existir erros,
          omissões ou alterações de informação.
        </p>

        <h2>Propriedade intelectual</h2>

        <p>
          A utilização, reprodução ou distribuição de conteúdos do website
          deve respeitar os direitos de propriedade intelectual aplicáveis.
        </p>

        <h2>Contactos</h2>

        <p>
          Para qualquer questão relacionada com o website, produtos ou
          serviços, o utilizador poderá contactar a JomaBasto através do
          telefone indicado nesta página.
        </p>

        <div className="legal-page-back">
          <Link to="/">Voltar à loja</Link>
        </div>
      </section>
    </div>
  );
}
