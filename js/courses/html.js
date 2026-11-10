import { L, HERE, chk, read, tryIt, quiz, choice, fill } from './kit.js';

export const htmlCourse = {
  id: 'html',
  lang: 'html',
  title: L('HTML: scheletul paginilor web', 'HTML: the skeleton of web pages'),
  blurb: L('Faci prima ta pagină web, de la zero. Nu ai nevoie de nimic în plus.', 'You build your first web page from zero. You need nothing else.'),
  levels: [
    {
      id: 'html-1',
      title: L('Prima ta pagină web', 'Your first web page'),
      lessons: [
        /* ---------- 1. Headings ---------- */
        {
          id: 'html-1-1',
          concept: { id: 'html-1-tags', name: L('Etichete și titluri', 'Tags and headings') },
          title: L('Etichete și titluri', 'Tags and headings'),
          steps: [
            read(L('Ce este HTML?', 'What is HTML?'), [
              L('O pagină web este făcută din etichete. O etichetă îi spune browserului ce este un text: un titlu, un paragraf, o listă...', 'A web page is made of tags. A tag tells the browser what a piece of text is: a heading, a paragraph, a list...'),
              L('Mai jos vezi un exemplu. În stânga este codul, iar mai jos vezi ce arată browserul.', 'Below is an example. The code is on top, and under it you see what the browser shows.'),
            ], { code: '<h1>Salut!</h1>' }),
            read(L('Etichete care se deschid și se închid', 'Tags that open and close'), [
              L('Eticheta `<h1>` face un titlu mare. Are două părți: `<h1>` deschide, iar `</h1>` închide (are un semn `/` în plus).', 'The `<h1>` tag makes a big heading. It has two parts: `<h1>` opens it and `</h1>` closes it (it has an extra `/`).'),
              L('Textul stă între cele două părți.', 'The text goes between the two parts.'),
            ], { code: '<h1>Eu sunt un titlu</h1>' }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă cuvântul `Salut` cu numele tău. Apoi apasă Rulează.', 'Change the word `Salut` to your name. Then press Run.'),
              { code: '<h1>Salut!</h1>' }),
            quiz(L('Ce face eticheta `<h1>`?', 'What does the `<h1>` tag do?'),
              [L('Face un titlu mare', 'Makes a big heading'), L('Face o listă', 'Makes a list'), L('Face un buton', 'Makes a button')], 0,
              L('`<h1>` vine de la „heading 1”: titlul cel mai important al paginii.', '`<h1>` comes from “heading 1”: the most important title on the page.')),
          ],
          practice: [
            {
              task: L('Scrie un titlu cu textul `Despre mine`.', 'Write a heading with the text `About me`.'),
              code: HERE.html, solution: L('<h1>Despre mine</h1>', '<h1>About me</h1>'),
              checks: [
                chk({ kind: 'dom', selector: 'h1', min: 1 }, L('Pagina are un titlu `<h1>`', 'The page has an `<h1>` heading'), L('Nu văd niciun `<h1>`. Scrie `<h1>`, apoi textul, apoi `</h1>`.', 'I cannot see an `<h1>`. Write `<h1>`, then the text, then `</h1>`.')),
                chk({ kind: 'dom', selector: 'h1', text: 'despre mine|about me|обо мне' }, L('Titlul spune „Despre mine”', 'The heading says “About me”'), L('Titlul trebuie să conțină exact textul cerut.', 'The heading must contain the exact text asked for.')),
              ],
              hints: [L('Un titlu începe cu `<h1>` și se termină cu `</h1>`.', 'A heading starts with `<h1>` and ends with `</h1>`.'), L('Pune textul între ele, fără spații în plus.', 'Put the text between them.')],
            },
            {
              task: L('Scrie două titluri: unul cu textul `Muzică` și unul cu textul `Desen`.', 'Write two headings: one with the text `Music` and one with the text `Drawing`.'),
              code: HERE.html, solution: L('<h1>Muzică</h1>\n<h1>Desen</h1>', '<h1>Music</h1>\n<h1>Drawing</h1>'),
              checks: [
                chk({ kind: 'dom', selector: 'h1', min: 2 }, L('Pagina are două titluri `<h1>`', 'The page has two `<h1>` headings'), L('Ai nevoie de două titluri, fiecare cu `<h1>` și `</h1>`.', 'You need two headings, each with `<h1>` and `</h1>`.')),
                chk({ kind: 'dom', selector: 'h1', text: 'muzic|music|музык' }, L('Un titlu spune „Muzică”', 'One heading says “Music”'), L('Un titlu trebuie să conțină cuvântul cerut pentru muzică.', 'One heading must contain the word for music.')),
                chk({ kind: 'dom', selector: 'h1', text: 'desen|drawing|рисун' }, L('Un titlu spune „Desen”', 'One heading says “Drawing”'), L('Celălalt titlu trebuie să conțină cuvântul cerut pentru desen.', 'The other heading must contain the word for drawing.')),
              ],
              hints: [L('Scrie un `<h1>...</h1>` pe un rând, apoi încă unul pe rândul următor.', 'Write one `<h1>...</h1>` on a line, then another on the next line.'), L('Exemplu: `<h1>Muzică</h1>` și apoi `<h1>Desen</h1>`.', 'Example: `<h1>Music</h1>` and then `<h1>Drawing</h1>`.')],
            },
          ],
          questions: [
            choice(L('Care titlu este scris corect?', 'Which heading is written correctly?'), ['`<h1>Salut</h1>`', '`<h1>Salut<h1>`', '`h1>Salut</h1>`'], 0,
              L('Un titlu corect se deschide cu `<h1>` și se închide cu `</h1>`, cu semnul `/`.', 'A correct heading opens with `<h1>` and closes with `</h1>`, with the `/` sign.')),
            fill(L('Completează eticheta care închide titlul:', 'Complete the tag that closes the heading:'), ['</h1>'],
              L('Eticheta de închidere are același nume, dar cu `/` în față: `</h1>`.', 'The closing tag has the same name, with a `/` in front: `</h1>`.'), '<h1>Muzică___'),
          ],
        },
        /* ---------- 2. Paragraphs ---------- */
        {
          id: 'html-1-2',
          concept: { id: 'html-1-text', name: L('Paragrafe și accent', 'Paragraphs and emphasis') },
          title: L('Paragrafe și accent', 'Paragraphs and emphasis'),
          steps: [
            read(L('Paragrafe', 'Paragraphs'), [
              L('Eticheta `<p>` face un paragraf: text obișnuit, ca într-o carte.', 'The `<p>` tag makes a paragraph: normal text, like in a book.'),
            ], { code: L('<h1>Pisica</h1>\n<p>Pisica doarme mult și se joacă seara.</p>', '<h1>The cat</h1>\n<p>The cat sleeps a lot and plays in the evening.</p>') }),
            read(L('Îngroșat și înclinat', 'Bold and italic'), [
              L('Cu `<strong>` textul devine îngroșat, iar cu `<em>` devine înclinat.', 'With `<strong>` the text becomes bold, and with `<em>` it becomes italic.'),
              L('Le pui în jurul cuvântului pe care vrei să îl accentuezi.', 'You put them around the word you want to stress.'),
            ], { code: L('<p>Pisica este <strong>foarte</strong> mică și <em>drăguță</em>.</p>', '<p>The cat is <strong>very</strong> small and <em>cute</em>.</p>') }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Pune cuvântul `Ana` între `<strong>` și `</strong>`. Apoi rulează.', 'Put the word `Ana` between `<strong>` and `</strong>`. Then run it.'),
              { code: '<p>Hello, Ana!</p>' }),
            quiz(L('Care etichetă face textul îngroșat?', 'Which tag makes text bold?'), ['`<strong>`', '`<em>`', '`<p>`'], 0,
              L('`strong` înseamnă „puternic”: browserul îngroașă textul. `em` face textul înclinat.', '`strong` means “strong”: the browser makes the text bold. `em` makes it italic.')),
          ],
          practice: [
            {
              task: L('Fă numele `Ana` îngroșat, cu `<strong>`.', 'Make the name `Ana` bold with `<strong>`.'),
              code: '<p>Hello, Ana!</p>', solution: '<p>Hello, <strong>Ana</strong>!</p>',
              checks: [
                chk({ kind: 'dom', selector: 'p', min: 1 }, L('Pagina are un paragraf `<p>`', 'The page has a `<p>` paragraph'), L('Păstrează paragraful `<p>...</p>`.', 'Keep the `<p>...</p>` paragraph.')),
                chk({ kind: 'dom', selector: 'p strong', text: '^\\s*Ana\\s*$' }, L('Numele „Ana” este îngroșat', 'The name “Ana” is bold'), L('Pune doar cuvântul Ana între `<strong>` și `</strong>`, în interiorul paragrafului.', 'Put only the word Ana between `<strong>` and `</strong>`, inside the paragraph.')),
              ],
              hints: [L('Pune `<strong>` chiar înainte de Ana și `</strong>` chiar după.', 'Put `<strong>` right before Ana and `</strong>` right after.'), L('Exemplu: `<strong>Ana</strong>`. Rămâne în interiorul lui `<p>`.', 'Example: `<strong>Ana</strong>`. It stays inside the `<p>`.')],
            },
            {
              task: L('Fă numele `Maria` înclinat, cu `<em>`.', 'Make the name `Maria` italic with `<em>`.'),
              code: '<p>Ion and Maria</p>', solution: '<p>Ion and <em>Maria</em></p>',
              checks: [
                chk({ kind: 'dom', selector: 'p', min: 1 }, L('Pagina are un paragraf `<p>`', 'The page has a `<p>` paragraph'), L('Păstrează paragraful `<p>...</p>`.', 'Keep the `<p>...</p>` paragraph.')),
                chk({ kind: 'dom', selector: 'p em', text: '^\\s*Maria\\s*$' }, L('Numele „Maria” este înclinat', 'The name “Maria” is italic'), L('Pune doar cuvântul Maria între `<em>` și `</em>`.', 'Put only the word Maria between `<em>` and `</em>`.')),
              ],
              hints: [L('Pentru înclinat folosești `<em>`, nu `<strong>`.', 'For italic use `<em>`, not `<strong>`.'), L('Exemplu: `<em>Maria</em>`.', 'Example: `<em>Maria</em>`.')],
            },
          ],
          questions: [
            choice(L('Cum se vede cifra 3?', 'How does the digit 3 look?'), [L('Înclinată', 'Italic'), L('Îngroșată', 'Bold'), L('Normală', 'Normal')], 0,
              L('`<em>` face textul înclinat.', '`<em>` makes the text italic.'), '<p>I have <em>3</em> cats.</p>'),
            fill(L('Completează eticheta care deschide un paragraf:', 'Complete the tag that opens a paragraph:'), ['<p>'],
              L('Un paragraf se deschide cu `<p>` și se închide cu `</p>`.', 'A paragraph opens with `<p>` and closes with `</p>`.'), '___Hello!</p>'),
          ],
        },
        /* ---------- 3. Lists ---------- */
        {
          id: 'html-1-3',
          concept: { id: 'html-1-lists', name: L('Liste', 'Lists') },
          title: L('Liste', 'Lists'),
          steps: [
            read(L('Liste cu buline', 'Lists with bullets'), [
              L('Cu `<ul>` faci o listă cu buline. Fiecare element din listă stă într-o etichetă `<li>`.', 'With `<ul>` you make a bulleted list. Each item in the list sits inside an `<li>` tag.'),
              L('Gândește-te la `<ul>` ca la o cutie, iar la `<li>` ca la bomboanele din ea.', 'Think of `<ul>` as a box and `<li>` as the candies inside it.'),
            ], { code: L('<ul>\n  <li>Mere</li>\n  <li>Pere</li>\n  <li>Prune</li>\n</ul>', '<ul>\n  <li>Apples</li>\n  <li>Pears</li>\n  <li>Plums</li>\n</ul>') }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Adaugă încă un element: o linie nouă `<li>...</li>` înainte de `</ul>`.', 'Add one more item: a new `<li>...</li>` line before `</ul>`.'),
              { code: L('<ul>\n  <li>Mere</li>\n  <li>Pere</li>\n</ul>', '<ul>\n  <li>Apples</li>\n  <li>Pears</li>\n</ul>') }),
            quiz(L('Unde se pun etichetele `<li>`?', 'Where do `<li>` tags go?'), [L('În interiorul lui `<ul>`', 'Inside `<ul>`'), L('În afara lui `<ul>`', 'Outside `<ul>`'), L('În interiorul unui `<h1>`', 'Inside an `<h1>`')], 0,
              L('Elementele unei liste stau mereu în interiorul lui `<ul>`.', 'List items always sit inside `<ul>`.')),
          ],
          practice: [
            {
              task: L('Fă o listă cu 3 mâncăruri preferate. Poți scrie orice.', 'Make a list of 3 favorite foods. You can write anything.'),
              code: '<ul>\n  \n</ul>', solution: L('<ul>\n  <li>Pizza</li>\n  <li>Supă</li>\n  <li>Clătite</li>\n</ul>', '<ul>\n  <li>Pizza</li>\n  <li>Soup</li>\n  <li>Pancakes</li>\n</ul>'),
              checks: [
                chk({ kind: 'dom', selector: 'ul', min: 1 }, L('Pagina are o listă `<ul>`', 'The page has a `<ul>` list'), L('Păstrează `<ul>` și `</ul>`.', 'Keep `<ul>` and `</ul>`.')),
                chk({ kind: 'dom', selector: 'ul li', min: 3 }, L('Lista are cel puțin 3 elemente `<li>`', 'The list has at least 3 `<li>` items'), L('Scrie 3 rânduri `<li>...</li>` între `<ul>` și `</ul>`.', 'Write 3 lines `<li>...</li>` between `<ul>` and `</ul>`.')),
              ],
              hints: [L('Fiecare element: `<li>text</li>`.', 'Each item: `<li>text</li>`.'), L('Pune 3 asemenea rânduri unul sub altul, în interiorul lui `<ul>`.', 'Put 3 such lines one below the other, inside `<ul>`.')],
            },
            {
              task: L('Fă o listă cu 4 culori.', 'Make a list of 4 colors.'),
              code: HERE.html, solution: L('<ul>\n  <li>Roșu</li>\n  <li>Galben</li>\n  <li>Verde</li>\n  <li>Albastru</li>\n</ul>', '<ul>\n  <li>Red</li>\n  <li>Yellow</li>\n  <li>Green</li>\n  <li>Blue</li>\n</ul>'),
              checks: [
                chk({ kind: 'dom', selector: 'ul', min: 1 }, L('Pagina are o listă `<ul>`', 'The page has a `<ul>` list'), L('Începe cu `<ul>` și termină cu `</ul>`.', 'Start with `<ul>` and end with `</ul>`.')),
                chk({ kind: 'dom', selector: 'ul li', min: 4 }, L('Lista are cel puțin 4 elemente `<li>`', 'The list has at least 4 `<li>` items'), L('Ai nevoie de 4 rânduri `<li>...</li>`.', 'You need 4 lines `<li>...</li>`.')),
              ],
              hints: [L('Începe cu `<ul>` pe primul rând și închide cu `</ul>` pe ultimul.', 'Start with `<ul>` on the first line and close with `</ul>` on the last.'), L('Între ele pui 4 rânduri `<li>culoare</li>`.', 'Between them put 4 lines `<li>color</li>`.')],
            },
          ],
          questions: [
            choice(L('Câte buline are lista?', 'How many bullets does the list have?'), ['1', '2', '3'], 1,
              L('Sunt două etichete `<li>`, deci două elemente și două buline.', 'There are two `<li>` tags, so two items and two bullets.'), '<ul><li>A</li><li>B</li></ul>'),
            choice(L('Ce etichetă pui în jurul fiecărui element dintr-o listă?', 'Which tag goes around each item in a list?'), ['`<li>`', '`<p>`', '`<h1>`'], 0,
              L('Fiecare element al listei este într-un `<li>`.', 'Each item of the list is inside an `<li>`.')),
          ],
        },
        /* ---------- 4. Links ---------- */
        {
          id: 'html-1-4',
          concept: { id: 'html-1-links', name: L('Link-uri', 'Links') },
          title: L('Link-uri', 'Links'),
          steps: [
            read(L('Link-uri', 'Links'), [
              L('Eticheta `<a>` face un link. Adresa unde duce se scrie în `href`.', 'The `<a>` tag makes a link. The address it goes to is written in `href`.'),
              L('Ce se vede pe pagină este textul dintre `<a ...>` și `</a>`.', 'What you see on the page is the text between `<a ...>` and `</a>`.'),
            ], { code: L('<a href="https://example.org">Vizitează pagina</a>', '<a href="https://example.org">Visit the page</a>') }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă textul link-ului cu ce vrei tu. Adresa rămâne la fel.', 'Change the link text to anything you like. The address stays the same.'),
              { code: L('<a href="https://example.org">Vizitează pagina</a>', '<a href="https://example.org">Visit the page</a>') }),
            quiz(L('Unde scrii adresa link-ului?', 'Where do you write the link address?'), [L('În `href`', 'In `href`'), L('Între `<a>` și `</a>`', 'Between `<a>` and `</a>`'), L('Într-un `<h1>`', 'In an `<h1>`')], 0,
              L('Adresa merge în `href`. Textul dintre etichete este doar ce vede omul.', 'The address goes in `href`. The text between the tags is just what the person sees.')),
          ],
          practice: [
            {
              task: L('Fă un link cu textul `Pagina mea` care duce la `https://example.org`.', 'Make a link with the text `My page` that goes to `https://example.org`.'),
              code: HERE.html, solution: L('<a href="https://example.org">Pagina mea</a>', '<a href="https://example.org">My page</a>'),
              checks: [
                chk({ kind: 'dom', selector: 'a', min: 1, text: 'pagina mea|my page|моя страница' }, L('Link-ul are textul cerut', 'The link has the requested text'), L('Textul dintre `<a ...>` și `</a>` trebuie să fie cel cerut.', 'The text between `<a ...>` and `</a>` must be the one asked for.')),
                chk({ kind: 'dom', selector: 'a', attr: { name: 'href', matches: '^https://example\\.org' } }, L('Link-ul duce la adresa cerută', 'The link goes to the requested address'), L('Scrie adresa în `href="..."`, între ghilimele.', 'Write the address in `href="..."`, between quotes.')),
              ],
              hints: [L('Forma este `<a href="adresa">text</a>`.', 'The form is `<a href="address">text</a>`.'), L('Adresa e `https://example.org`; textul e cel cerut.', 'The address is `https://example.org`; the text is the one asked for.')],
            },
            {
              task: L('Fă un link cu textul `Hartă` care duce la `https://www.openstreetmap.org`.', 'Make a link with the text `Map` that goes to `https://www.openstreetmap.org`.'),
              code: HERE.html, solution: L('<a href="https://www.openstreetmap.org">Hartă</a>', '<a href="https://www.openstreetmap.org">Map</a>'),
              checks: [
                chk({ kind: 'dom', selector: 'a', min: 1, text: 'hart|map|карт' }, L('Link-ul are textul cerut', 'The link has the requested text'), L('Textul dintre `<a ...>` și `</a>` trebuie să fie cel cerut.', 'The text between `<a ...>` and `</a>` must be the one asked for.')),
                chk({ kind: 'dom', selector: 'a', attr: { name: 'href', matches: 'openstreetmap\\.org' } }, L('Link-ul duce la adresa cerută', 'The link goes to the requested address'), L('Scrie adresa în `href="..."`, între ghilimele.', 'Write the address in `href="..."`, between quotes.')),
              ],
              hints: [L('Forma este `<a href="adresa">text</a>`.', 'The form is `<a href="address">text</a>`.'), L('Nu uita ghilimelele în jurul adresei.', 'Do not forget the quotes around the address.')],
            },
          ],
          questions: [
            choice(L('Care link este scris corect?', 'Which link is written correctly?'), ['`<a href="https://x.org">Click</a>`', '`<a>https://x.org</a>`', '`<link="https://x.org">Click</link>`'], 0,
              L('Link-ul corect folosește `<a>` cu `href="adresa"`.', 'A correct link uses `<a>` with `href="address"`.')),
            fill(L('Completează cuvântul care lipsește:', 'Complete the missing word:'), ['href'],
              L('Adresa link-ului se scrie în `href`.', 'The link address is written in `href`.'), '<a ___="https://x.org">Click</a>'),
          ],
        },
        /* ---------- 5. Nesting ---------- */
        {
          id: 'html-1-5',
          concept: { id: 'html-1-nesting', name: L('Etichete în ordine', 'Tags in the right order') },
          title: L('Etichete ca niște cutii', 'Tags like boxes'),
          steps: [
            read(L('Etichete ca niște cutii', 'Tags like boxes'), [
              L('Etichetele se pot pune una în alta, ca niște cutii. Regula: ultima etichetă pe care o deschizi, o închizi prima.', 'Tags can be placed inside one another, like boxes. The rule: the last tag you open is the first one you close.'),
              L('În exemplu, `<strong>` e deschis în interiorul lui `<p>`, deci se închide înainte de `</p>`.', 'In the example, `<strong>` is opened inside `<p>`, so it is closed before `</p>`.'),
            ], { code: L('<p>Îmi place <strong>muzica</strong>.</p>', '<p>I like <strong>music</strong>.</p>') }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Adaugă un al doilea paragraf sub primul, cu `<p>...</p>`.', 'Add a second paragraph below the first, with `<p>...</p>`.'),
              { code: L('<p>Îmi place <strong>muzica</strong>.</p>', '<p>I like <strong>music</strong>.</p>') }),
            quiz(L('Care cod este scris corect?', 'Which code is written correctly?'), ['`<p><strong>Salut</strong></p>`', '`<p><strong>Salut</p></strong>`', '`<p><strong>Salut</strong>`'], 0,
              L('Deschizi `p`, apoi `strong`. Închizi întâi `strong`, apoi `p`.', 'You open `p`, then `strong`. You close `strong` first, then `p`.')),
          ],
          practice: [
            {
              task: L('Fă o mică pagină despre tine: un titlu `<h1>`, un paragraf `<p>` și o listă `<ul>` cu cel puțin 2 elemente.', 'Make a small page about yourself: an `<h1>` heading, a `<p>` paragraph and a `<ul>` list with at least 2 items.'),
              code: HERE.html, solution: L('<h1>Eu sunt Ana</h1>\n<p>Îmi place muzica.</p>\n<ul>\n  <li>Pian</li>\n  <li>Desen</li>\n</ul>', '<h1>I am Ana</h1>\n<p>I like music.</p>\n<ul>\n  <li>Piano</li>\n  <li>Drawing</li>\n</ul>'),
              checks: [
                chk({ kind: 'dom', selector: 'h1', min: 1 }, L('Are un titlu `<h1>`', 'It has an `<h1>` heading'), L('Adaugă `<h1>...</h1>`.', 'Add `<h1>...</h1>`.')),
                chk({ kind: 'dom', selector: 'p', min: 1 }, L('Are un paragraf `<p>`', 'It has a `<p>` paragraph'), L('Adaugă `<p>...</p>`.', 'Add `<p>...</p>`.')),
                chk({ kind: 'dom', selector: 'ul li', min: 2 }, L('Are o listă cu cel puțin 2 elemente', 'It has a list with at least 2 items'), L('Adaugă `<ul>` cu cel puțin două `<li>...</li>`.', 'Add `<ul>` with at least two `<li>...</li>`.')),
              ],
              hints: [L('Scrie pe rând: titlul, paragraful, apoi lista.', 'Write in order: the heading, the paragraph, then the list.'), L('Fiecare etichetă deschisă trebuie închisă: `</h1>`, `</p>`, `</li>`, `</ul>`.', 'Every tag you open must be closed: `</h1>`, `</p>`, `</li>`, `</ul>`.')],
            },
            {
              task: L('Fă o pagină despre un animal: un titlu `<h1>`, un paragraf `<p>` cu un cuvânt îngroșat `<strong>` și un link `<a>`.', 'Make a page about an animal: an `<h1>` heading, a `<p>` paragraph with one word in `<strong>`, and an `<a>` link.'),
              code: HERE.html, solution: L('<h1>Pisica</h1>\n<p>Pisica este <strong>drăguță</strong>.</p>\n<a href="https://example.org">Mai multe</a>', '<h1>The cat</h1>\n<p>The cat is <strong>cute</strong>.</p>\n<a href="https://example.org">More</a>'),
              checks: [
                chk({ kind: 'dom', selector: 'h1', min: 1 }, L('Are un titlu `<h1>`', 'It has an `<h1>` heading'), L('Adaugă `<h1>...</h1>`.', 'Add `<h1>...</h1>`.')),
                chk({ kind: 'dom', selector: 'p strong', min: 1 }, L('Are un cuvânt îngroșat într-un paragraf', 'It has a bold word inside a paragraph'), L('Pune `<strong>...</strong>` în interiorul unui `<p>`.', 'Put `<strong>...</strong>` inside a `<p>`.')),
                chk({ kind: 'dom', selector: 'a', min: 1, attr: { name: 'href', matches: '.' } }, L('Are un link cu adresă', 'It has a link with an address'), L('Adaugă `<a href="adresa">text</a>`.', 'Add `<a href="address">text</a>`.')),
              ],
              hints: [L('Începe cu titlul, apoi paragraful, apoi link-ul.', 'Start with the heading, then the paragraph, then the link.'), L('Îngroșarea merge în interiorul paragrafului: `<p>... <strong>cuvânt</strong> ...</p>`.', 'The bold goes inside the paragraph: `<p>... <strong>word</strong> ...</p>`.')],
            },
          ],
          questions: [
            choice(L('Ce greșeală are codul?', 'What mistake does the code have?'),
              [L('Etichetele nu sunt închise în ordinea corectă', 'The tags are not closed in the right order'), L('Lipsește `<h1>`', 'It is missing an `<h1>`'), L('Nu are nicio greșeală', 'It has no mistake')], 0,
              L('`<strong>` a fost deschis ultimul, deci trebuie închis primul: `</strong></p>`.', '`<strong>` was opened last, so it must be closed first: `</strong></p>`.'), '<p>Salut <strong>lume</p></strong>'),
            fill(L('Completează ca etichetele să fie în ordine:', 'Complete it so the tags are in the right order:'), ['</strong>'],
              L('Întâi închizi `</strong>`, apoi `</p>`.', 'First you close `</strong>`, then `</p>`.'), '<p><strong>Hello___</p>'),
          ],
        },
      ],
    },
  ],
};
