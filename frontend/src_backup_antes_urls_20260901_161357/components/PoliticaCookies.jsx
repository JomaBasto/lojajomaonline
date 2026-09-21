import { Link } from "react-router-dom";

export default function PoliticaCookies() {
  return (
    <div className="legal-page">
      <section className="legal-page-content">
        <h1>Política de Cookies</h1>

        <p>
          Esta página explica de forma geral a utilização de cookies e
          tecnologias semelhantes no website JomaBasto.
        </p>

        <h2>1. O que são cookies?</h2>

        <p>
          Cookies são pequenos ficheiros ou identificadores que podem ser
          armazenados no dispositivo do utilizador quando este visita um
          website. Podem ser utilizados para permitir o funcionamento de
          determinadas funcionalidades ou para outras finalidades previstas
          na legislação aplicável.
        </p>

        <h2>2. Cookies utilizados</h2>

        <p>
          A utilização de cookies depende das funcionalidades efetivamente
          disponibilizadas pelo website e dos serviços utilizados. A JomaBasto
          não declara nesta política a utilização de ferramentas de análise,
          publicidade ou rastreamento que não estejam efetivamente
          implementadas no website.
        </p>

        <h2>3. Cookies necessários</h2>

        <p>
          Poderão ser utilizados mecanismos técnicos necessários ao correto
          funcionamento do website, das sessões de utilização ou de
          determinadas funcionalidades.
        </p>

        <h2>4. Cookies de análise e publicidade</h2>

        <p>
          Caso sejam futuramente introduzidos cookies destinados a análise,
          publicidade ou outras finalidades que exijam consentimento, esta
          política será atualizada e serão disponibilizadas as opções
          legalmente exigíveis ao utilizador.
        </p>

        <h2>5. Gestão de cookies</h2>

        <p>
          O utilizador poderá também gerir as permissões relativas a cookies
          através das opções disponibilizadas pelo seu navegador.
        </p>

        <h2>6. Alterações</h2>

        <p>
          Esta política poderá ser atualizada sempre que sejam introduzidas
          novas funcionalidades ou tecnologias que utilizem cookies.
        </p>

        <div className="legal-page-back">
          <Link to="/">Voltar à loja</Link>
        </div>
      </section>
    </div>
  );
}
