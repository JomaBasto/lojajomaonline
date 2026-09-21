from pathlib import Path
import re

p = Path("src/App.jsx")
s = p.read_text(encoding="utf-8")

def corrigir(match):
    texto = match.group(0)
    try:
        convertido = texto.encode("cp1252").decode("utf-8")
        maus = sum(texto.count(x) for x in ("Ã", "Â", "â"))
        bons = sum(convertido.count(x) for x in ("Ã", "Â", "â"))
        if bons < maus:
            return convertido
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass
    return texto

s = re.sub(r"[^\x00-\x7F]+", corrigir, s)

p.write_text(s, encoding="utf-8")
print("Encoding corrigido.")
