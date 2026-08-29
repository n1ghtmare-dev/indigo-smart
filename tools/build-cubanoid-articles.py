# -*- coding: utf-8 -*-
"""Рендерит статьи девлога Cubanoid в статические страницы рядом с хабом.

Markdown-библиотек в окружении нет, поэтому конвертер покрывает ровно те
конструкции, которые используются в этих статьях: заголовки, абзацы, списки,
таблицы, ограждённый код, жирный, курсив, инлайн-код и метки картинок.
"""
import html
import io
import os
import re
import shutil

SRC = r"C:\www-Oleg\Cubanoid\docs\devlog"
DST = r"C:\www-Oleg\IndigoSmart\landing-root\plans\cubanoid-articles"
IMG_SRC = os.path.join(SRC, "img")
VISION = r"C:\www-Oleg\Cubanoid\docs\vision\current.png"

ARTICLES = [
    ("01", "01-massa-eto-vsyo.md", "Геймдизайн",
     "Одна величина вместо здоровья, ключей и очков"),
    ("02", "02-ot-serykh-kubov-do-zhele.md", "Хроника",
     "Пять кадров: от красного ящика до желейного куба"),
    ("03", "03-kub-spotykalsya-o-shvy.md", "Физика",
     "Ghost collisions и жадный мердж коллайдеров"),
    ("04", "04-domen-ne-znaet-pro-three-js.md", "Архитектура",
     "Ports & adapters и детерминированные e2e"),
    ("05", "05-zhelejnyj-kub.md", "Рендер",
     "Transmission, «чёрные тени» и squash & stretch"),
    ("06", "06-deshyovye-pravki.md", "Практика",
     "Пять дешёвых правок, которые дали больше шейдеров"),
    ("07", "07-realizm.md", "Визуал",
     "Как плоские кубики превратились в скалы над морем облаков"),
]

# Метка IMG:<имя> -> файл в img/ (если None - картинки ещё нет, рисуем заглушку)
IMAGES = {
    "01-hero": "step5-current.jpg",
    "01-mass-scale": "01-mass-scale.png",
    "02-step1": "step1-flat-cube.jpg",
    "02-step2": "step2-rounded.jpg",
    "02-step3": "step3-water-sky.jpg",
    "02-step4": "step4-cartoon.jpg",
    "02-step5": "step5-current.jpg",
    "03-tiles-seams": "step3-water-sky.jpg",
    "03-ghost-collisions": "03-ghost-collisions.png",
    "03-merge-before-after": "03-merge-before-after.png",
    "04-game": "step5-current.jpg",
    "04-layers": "04-layers.png",
    "05-jelly-hero": "step5-current.jpg",
    "05-early-cube": "step2-rounded.jpg",
    "06-before": "step3-water-sky.jpg",
    "06-after": "step5-current.jpg",
    "07-hero": "now-menu.jpg",
    "07-before": "step4-cartoon.jpg",
    "07-pbr": "07-pbr-maps.png",
    "07-panorama": "07-panorama.png",
    "07-mountains": "07-mountains.png",
    "07-layers": "07-layers.png",
    "07-cube": "07-cube-closeup.jpg",
}


def inline(text):
    """Инлайновая разметка. Код обрабатывается первым и защищается от
    последующих замен: внутри `...` не должно быть ни жирного, ни курсива."""
    slots = []

    def stash(match):
        slots.append("<code>%s</code>" % html.escape(match.group(1)))
        return "\x00%d\x00" % (len(slots) - 1)

    text = re.sub(r"`([^`]+)`", stash, text)
    text = html.escape(text)
    text = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![*\w])\*([^*\n]+)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"\x00(\d+)\x00", lambda m: slots[int(m.group(1))], text)
    return text


def image_block(alt, key, caption=None):
    cap = caption or alt
    file = IMAGES.get(key)
    if file:
        return ('<figure class="shot"><img src="img/%s" alt="%s" loading="lazy">'
                "<figcaption>%s</figcaption></figure>"
                % (file, html.escape(alt), inline(cap)))
    return ('<div class="need-shot"><span class="need-shot__tag">нужен скриншот</span>'
            "<b>%s</b><code>docs/devlog/part-1/ → %s</code></div>"
            % (inline(cap), html.escape(key)))


def render(md):
    lines = md.split("\n")
    out, i = [], 0
    title = ""

    while i < len(lines):
        line = lines[i]

        if line.startswith("# ") and not title:
            title = line[2:].strip()
            i += 1
            continue

        if line.startswith("```"):
            lang = line[3:].strip()
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            out.append('<pre class="code" data-lang="%s"><code>%s</code></pre>'
                       % (html.escape(lang), html.escape("\n".join(buf))))
            continue

        m = re.match(r"!\[([^\]]*)\]\(IMG:([^)]+)\)", line.strip())
        if m:
            i += 1
            # курсивная строка сразу под картинкой - это её подпись
            caption = None
            j = i
            while j < len(lines) and not lines[j].strip():
                j += 1
            nxt = lines[j].strip() if j < len(lines) else ""
            if nxt.startswith("*") and nxt.endswith("*") and not nxt.startswith("**"):
                caption = nxt.strip("*")
                i = j + 1
            out.append(image_block(m.group(1), m.group(2), caption))
            continue

        if line.startswith("### ") or line.startswith("## "):
            level = 3 if line.startswith("### ") else 2
            raw = line[level + 1:].strip()
            anchor = ""
            m_anchor = re.search(r"\s*\{#([\w-]+)\}$", raw)
            if m_anchor:
                anchor = ' id="%s"' % m_anchor.group(1)
                raw = raw[: m_anchor.start()].rstrip()
            out.append("<h%d%s>%s</h%d>" % (level, anchor, inline(raw), level))
            i += 1
            continue

        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append(lines[i])
                i += 1
            cells = [[c.strip() for c in r.strip().strip("|").split("|")] for r in rows]
            body = [r for r in cells if not all(set(c) <= set("-: ") for c in r)]
            head, rest = body[0], body[1:]
            t = ["<div class=\"table-wrap\"><table><thead><tr>"]
            t += ["<th>%s</th>" % inline(c) for c in head]
            t.append("</tr></thead><tbody>")
            for r in rest:
                t.append("<tr>" + "".join("<td>%s</td>" % inline(c) for c in r) + "</tr>")
            t.append("</tbody></table></div>")
            out.append("".join(t))
            continue

        if re.match(r"^[-*] ", line) or re.match(r"^\d+\. ", line):
            ordered = bool(re.match(r"^\d+\. ", line))
            items = []
            while i < len(lines) and (re.match(r"^[-*] ", lines[i]) or re.match(r"^\d+\. ", lines[i]) or lines[i].startswith("  ")):
                if lines[i].startswith("  ") and items:
                    items[-1] += " " + lines[i].strip()
                elif lines[i].strip():
                    items.append(re.sub(r"^([-*]|\d+\.) ", "", lines[i]))
                i += 1
            tag = "ol" if ordered else "ul"
            html_list = "<%s>%s</%s>" % (tag, "".join("<li>%s</li>" % inline(x) for x in items), tag)
            # Список сразу после абзаца-маркера «Оглавление» оформляется как оглавление.
            if out and out[-1].startswith("<p>") and "Оглавление" in out[-1]:
                out[-1] = '<nav class="toc">' + out[-1] + html_list + "</nav>"
            else:
                out.append(html_list)
            continue

        if not line.strip():
            i += 1
            continue

        buf = []
        while i < len(lines) and lines[i].strip() and not re.match(r"^(#|```|\||[-*] |\d+\. |!\[)", lines[i]):
            buf.append(lines[i].strip())
            i += 1
        if not buf:
            # Непонятная строка (например, заголовок уровня, который мы не умеем
            # разбирать): пропускаем её как есть, иначе цикл никогда не сдвинется.
            out.append("<p>%s</p>" % inline(lines[i].lstrip("#").strip()))
            i += 1
            continue
        para = " ".join(buf)
        if para.startswith("*") and para.endswith("*") and para.count("*") == 2:
            out.append('<p class="caption">%s</p>' % inline(para.strip("*")))
        else:
            out.append("<p>%s</p>" % inline(para))

    return title, "\n".join(out)


CSS = """
:root{
  --page:#090d14; --surface:#111823; --surface-soft:#0c1119; --sidebar:#0d121b;
  --text:#eef3f8; --muted:#9caaba; --faint:#667486;
  --line:rgba(185,205,228,.16); --line-strong:rgba(185,205,228,.32);
  --accent:#8bc7db; --radius:12px;
}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:var(--page);color:var(--text);
  font:16px/1.68 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  -webkit-font-smoothing:antialiased}
a{color:var(--accent)}
.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:.8rem;
  flex-wrap:wrap;padding:.8rem clamp(1rem,4vw,2rem);
  background:rgba(13,18,27,.92);border-bottom:1px solid var(--line);
  backdrop-filter:blur(12px)}
.pill{display:inline-flex;align-items:center;gap:.4rem;padding:.36rem .8rem;
  border:1px solid var(--line-strong);border-radius:999px;background:var(--surface);
  color:var(--accent);font-size:.8rem;font-weight:700;text-decoration:none;
  white-space:nowrap;cursor:pointer;font-family:inherit}
.pill:hover{background:var(--surface-soft)}
.pill--ok{color:#8fd6a8;border-color:rgba(143,214,168,.5)}
.top__spacer{flex:1}
.top__tag{color:var(--faint);font-size:.78rem;letter-spacing:.06em;text-transform:uppercase}
main{max-width:52rem;margin:0 auto;padding:clamp(1.4rem,4vw,3rem) clamp(1rem,4vw,2rem) 5rem}
h1{font-size:clamp(1.7rem,4vw,2.4rem);line-height:1.2;letter-spacing:-.02em;margin:0 0 1.4rem}
h2{font-size:clamp(1.15rem,2.6vw,1.4rem);margin:2.4rem 0 .8rem;letter-spacing:-.01em}
h3{font-size:1.05rem;margin:1.8rem 0 .6rem;color:var(--muted)}
html{scroll-behavior:smooth}
h2[id],h3[id]{scroll-margin-top:4.5rem}
.toc{margin:0 0 2rem;padding:1.1rem 1.3rem;background:var(--surface);
  border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:var(--radius)}
.toc ol{margin:0;padding-left:1.2rem}
.toc li{margin:.35rem 0}
.toc a{text-decoration:none}
.toc a:hover{text-decoration:underline}
p{margin:0 0 1.1rem}
p.caption{color:var(--faint);font-size:.86rem;margin-top:-.6rem}
ul,ol{margin:0 0 1.2rem;padding-left:1.3rem}
li{margin:.3rem 0}
strong{color:#fff}
code{font-family:ui-monospace,Consolas,monospace;font-size:.88em;
  background:var(--surface);border:1px solid var(--line);border-radius:5px;padding:.1em .35em}
pre.code{position:relative;overflow-x:auto;margin:0 0 1.3rem;padding:1rem 1.1rem;
  background:var(--surface-soft);border:1px solid var(--line);border-radius:var(--radius)}
pre.code code{background:none;border:0;padding:0;font-size:13.5px;line-height:1.6}
pre.code[data-lang]:not([data-lang=""])::after{content:attr(data-lang);position:absolute;
  top:.5rem;right:.7rem;color:var(--faint);font-size:.7rem;letter-spacing:.08em;text-transform:uppercase}
.table-wrap{overflow-x:auto;margin:0 0 1.3rem}
table{border-collapse:collapse;width:100%;font-size:.92rem}
th,td{border:1px solid var(--line);padding:.55rem .7rem;text-align:left;vertical-align:top}
th{background:var(--surface);font-weight:700}
figure.shot{margin:0 0 1.4rem}
figure.shot img{display:block;width:100%;height:auto;border:1px solid var(--line);
  border-radius:var(--radius);background:var(--surface)}
figcaption{color:var(--faint);font-size:.85rem;margin-top:.5rem}
.need-shot{display:flex;flex-direction:column;gap:.5rem;margin:0 0 1.4rem;padding:1.1rem 1.2rem;
  border:1px dashed var(--line-strong);border-radius:var(--radius);background:var(--surface-soft)}
.need-shot__tag{align-self:flex-start;font-size:.68rem;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;color:#e0b06a;border:1px solid rgba(224,176,106,.4);
  border-radius:999px;padding:.2rem .6rem}
.need-shot b{font-weight:600;color:var(--muted)}
.need-shot code{font-size:.78rem;color:var(--faint)}
.cards{display:grid;gap:.9rem;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));margin:0 0 2rem}
.card{display:flex;flex-direction:column;gap:.5rem;padding:1.1rem 1.2rem;text-decoration:none;
  color:inherit;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius)}
.card:hover{border-color:var(--line-strong);background:var(--surface-soft)}
.card__no{font-family:ui-monospace,Consolas,monospace;color:var(--accent);font-size:.78rem}
.card__name{font-weight:700;line-height:1.35}
.card__note{color:var(--muted);font-size:.86rem}
.card__meta{color:var(--faint);font-size:.76rem;margin-top:auto;padding-top:.6rem;
  border-top:1px solid var(--line)}
.note{padding:1rem 1.2rem;border:1px solid var(--line);border-left:3px solid var(--accent);
  border-radius:var(--radius);background:var(--surface);color:var(--muted);font-size:.92rem;margin:0 0 1.6rem}
.note b{color:var(--text)}
"""

COPY_JS = """
document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var src = document.getElementById(btn.dataset.copy);
    if (!src) return;
    var text = src.textContent;
    var done = function () {
      var was = btn.textContent;
      btn.textContent = 'Скопировано';
      btn.classList.add('pill--ok');
      setTimeout(function () { btn.textContent = was; btn.classList.remove('pill--ok'); }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { alert('Скопируйте вручную'); }
      document.body.removeChild(ta);
    }
  });
});
"""


def page(title, body, head_extra="", top=""):
    return (
        "<!doctype html>\n<html lang=\"ru\">\n<head>\n<meta charset=\"utf-8\">\n"
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
        "<meta name=\"robots\" content=\"noindex, nofollow\">\n"
        "<link rel=\"icon\" href=\"data:,\">\n"
        "<title>%s</title>\n<style>%s</style>\n%s</head>\n<body>\n%s\n%s\n"
        "<script>%s</script>\n</body>\n</html>\n"
        % (html.escape(title), CSS, head_extra, top, body, COPY_JS)
    )


def main():
    os.makedirs(os.path.join(DST, "img"), exist_ok=True)
    for name in os.listdir(IMG_SRC):
        if name.endswith(".png") or name.endswith(".jpg"):
            shutil.copy2(os.path.join(IMG_SRC, name), os.path.join(DST, "img", name))
    shutil.copy2(VISION, os.path.join(DST, "img", "current.png"))

    cards = []
    for no, fname, cat, note in ARTICLES:
        md = io.open(os.path.join(SRC, fname), encoding="utf-8").read()
        title, body = render(md)
        need = body.count("need-shot")
        top = (
            '<div class="top">'
            '<a class="pill" href="./">← Все статьи</a>'
            '<button class="pill" type="button" data-copy="raw">Скопировать markdown</button>'
            '<a class="pill" href="https://habr.com/ru/publication/new/" target="_blank" rel="noopener">Редактор Хабра ↗</a>'
            '<span class="top__spacer"></span>'
            '<span class="top__tag">%s</span>'
            "</div>" % html.escape(cat)
        )
        warn = ""
        if need:
            warn = ('<div class="note"><b>Не хватает %d скриншот(ов).</b> Места отмечены в тексте: '
                    "положите кадры в <code>docs/devlog/part-1/</code> и скажите - пересоберу страницу.</div>" % need)
        raw = '<script type="text/plain" id="raw">%s</script>' % html.escape(md)
        out = page(title, "<main><h1>%s</h1>\n%s\n%s</main>\n%s" % (html.escape(title), warn, body, raw), top=top)
        io.open(os.path.join(DST, "%s.html" % no), "w", encoding="utf-8", newline="\n").write(out)

        cards.append(
            '<a class="card" href="%s.html"><span class="card__no">%s · %s</span>'
            '<span class="card__name">%s</span><span class="card__note">%s</span>'
            '<span class="card__meta">%s</span></a>'
            % (no, no, html.escape(cat), html.escape(title), html.escape(note),
               ("нужно скриншотов: %d" % need) if need else "картинки на месте")
        )

    index_top = (
        '<div class="top">'
        '<a class="pill" href="/plans/project-promotion-map/index.html?project=cubanoid">← К карте плана</a>'
        '<a class="pill" href="https://habr.com/ru/publication/new/" target="_blank" rel="noopener">Редактор Хабра ↗</a>'
        '<span class="top__spacer"></span>'
        '<span class="top__tag">Cubanoid · черновики</span>'
        "</div>"
    )
    index_body = (
        "<main><h1>Статьи для публикации</h1>"
        '<div class="note">Пять независимых текстов - выкладывать можно в любом порядке и в разные дни. '
        "Внутри каждого есть кнопка <b>«Скопировать markdown»</b>: жмёте, открываете редактор Хабра, вставляете. "
        "Картинки перетаскиваются в редактор отдельно - в тексте помечено, где именно.</div>"
        '<div class="cards">%s</div>'
        "<h2>Порядок, который я бы взял</h2>"
        "<ol>"
        "<li><b>02</b> - визуальная хроника: легко читается, много картинок, собирает аудиторию на остальные.</li>"
        "<li><b>01</b> - геймдизайн: объясняет, во что вообще играют.</li>"
        "<li><b>03</b> - физика: первая тяжёлая техническая, такое сохраняют в закладки.</li>"
        "<li><b>05</b> - рендер: разбор багов с чтением шейдеров.</li>"
        "<li><b>04</b> - архитектура: самая нишевая, лучше идёт последней.</li>"
        "</ol>"
        "<h2>Перед публикацией</h2>"
        "<ul>"
        "<li>В настройках Хабра обязательное поле <b>«Целевая аудитория»</b> - «Фронтенд». Без него черновик не сохраняется.</li>"
        "<li>Хаб: <b>«Разработка игр»</b>. Ключевые слова вводятся по одному через Enter.</li>"
        "<li>Ссылки на репозиторий в текстах нет - только фрагменты кода и ссылка на играбельную сборку.</li>"
        "</ul>"
        "</main>" % "".join(cards)
    )
    io.open(os.path.join(DST, "index.html"), "w", encoding="utf-8", newline="\n").write(
        page("Статьи Cubanoid", index_body, top=index_top))

    print("страниц: %d + индекс" % len(ARTICLES))
    print("папка:", DST)


main()
