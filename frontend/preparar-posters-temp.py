from PIL import Image
from pathlib import Path

BASE = Path("public/images")

POSTERS = [
    ("casual-desktop.jpg", "casual-desktop-final.jpg", (2752, 1536)),
    ("casual-mobile.jpg", "casual-mobile-final.jpg", (1536, 2752)),
    ("outlet-desktop.jpg", "outlet-desktop-final.jpg", (2752, 1536)),
    ("outlet-mobile.jpg", "outlet-mobile-final.jpg", (1536, 2752)),
    ("ofertas da semana-desktop.jpg", "ofertas-desktop-final.jpg", (2752, 1536)),
    ("ofertas da semana-mobile.jpg", "ofertas-mobile-final.jpg", (1536, 2752)),
]

for origem, destino, tamanho in POSTERS:
    origem = BASE / origem
    destino = BASE / destino

    img = Image.open(origem).convert("RGB")

    largura, altura = tamanho

    escala = min(largura / img.width, altura / img.height)

    nova_largura = round(img.width * escala)
    nova_altura = round(img.height * escala)

    img = img.resize(
        (nova_largura, nova_altura),
        Image.Resampling.LANCZOS
    )

    tela = Image.new("RGB", tamanho, "white")

    x = (largura - nova_largura) // 2
    y = (altura - nova_altura) // 2

    tela.paste(img, (x, y))

    tela.save(destino, "JPEG", quality=95, optimize=True)

    print(f"OK: {destino.name} -> {largura}x{altura}")

print("CONCLUIDO")
