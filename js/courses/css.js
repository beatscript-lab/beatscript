import { L, HERE, chk, read, tryIt, quiz, choice, fill } from './kit.js';

const st = (selector, prop, equals, label, fail) => chk({ kind: 'style', selector, prop, equals }, label, fail);

export const cssCourse = {
  id: 'css',
  lang: 'css',
  title: L('CSS: culori, forme și stil', 'CSS: colors, shapes and style'),
  blurb: L('Înveți să îmbraci o pagină: culori, mărimi, spații și chenare.', 'You learn to dress up a page: colors, sizes, spacing and borders.'),
  levels: [
    {
      id: 'css-1',
      title: L('Culori și text', 'Colors and text'),
      lessons: [
        /* ---------- 1. First rule ---------- */
        {
          id: 'css-1-1',
          concept: { id: 'css-1-rule', name: L('Prima regulă CSS', 'Your first CSS rule') },
          title: L('Prima regulă CSS', 'Your first CSS rule'),
          steps: [
            read(L('Ce este CSS?', 'What is CSS?'), [
              L('CSS spune paginii cum să arate: culori, mărimi, spații. HTML face scheletul, CSS îl îmbracă.', 'CSS tells the page how to look: colors, sizes, spacing. HTML makes the skeleton, CSS dresses it.'),
              L('O regulă CSS are un selector (ce vrei să schimbi) și, între acolade `{ }`, o proprietate cu valoarea ei.', 'A CSS rule has a selector (what you want to change) and, between braces `{ }`, a property with its value.'),
            ], { scaffold: '<h1>Salut</h1>', code: 'h1 {\n  color: red;\n}' }),
            read(L('Cum se citește', 'How to read it'), [
              L('`h1 { color: red; }` înseamnă: pentru toate titlurile `h1`, face culoarea textului roșie. După fiecare proprietate pui `;`.', '`h1 { color: red; }` means: for every `h1` heading, make the text color red. After each property you put `;`.'),
            ], { scaffold: '<h1>Salut</h1>\n<p>Text</p>', code: 'p {\n  color: blue;\n}' }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă `red` în `blue` sau `green`, apoi rulează.', 'Change `red` to `blue` or `green`, then run it.'),
              { scaffold: '<h1>Salut</h1>', code: 'h1 {\n  color: red;\n}' }),
            quiz(L('În regula `p { color: blue; }`, ce înseamnă `p`?', 'In the rule `p { color: blue; }`, what does `p` mean?'),
              [L('Selectorul: ce element schimbăm', 'The selector: which element we change'), L('Culoarea', 'The color'), L('Mărimea', 'The size')], 0,
              L('Ce scrii înaintea acoladelor este selectorul: spune ce element se schimbă.', 'What you write before the braces is the selector: it says which element changes.')),
          ],
          practice: [
            {
              task: L('Fă titlul `h1` verde: scrie `color: green;`.', 'Make the `h1` heading green: write `color: green;`.'),
              scaffold: '<h1>Titlu</h1>\n<p>Text</p>', code: 'h1 {\n  \n}', solution: 'h1 {\n  color: green;\n}',
              checks: [st('h1', 'color', 'rgb(0, 128, 0)', L('Titlul este verde', 'The heading is green'), L('Între acolade scrie `color: green;`.', 'Between the braces write `color: green;`.'))],
              hints: [L('Proprietatea pentru culoarea textului este `color`.', 'The property for text color is `color`.'), L('Scrie `color: green;` între `{` și `}`.', 'Write `color: green;` between `{` and `}`.')],
            },
            {
              task: L('Fă paragraful `p` albastru (`blue`).', 'Make the `p` paragraph blue (`blue`).'),
              scaffold: '<h1>Titlu</h1>\n<p>Text</p>', code: 'p {\n  \n}', solution: 'p {\n  color: blue;\n}',
              checks: [st('p', 'color', 'rgb(0, 0, 255)', L('Paragraful este albastru', 'The paragraph is blue'), L('Între acolade scrie `color: blue;`.', 'Between the braces write `color: blue;`.'))],
              hints: [L('Folosește aceeași proprietate: `color`.', 'Use the same property: `color`.'), L('Scrie `color: blue;` între acolade.', 'Write `color: blue;` between the braces.')],
            },
          ],
          questions: [
            choice(L('Care regulă CSS este scrisă corect?', 'Which CSS rule is written correctly?'), ['`h1 { color: red; }`', '`h1 ( color: red )`', '`h1 { color = red }`'], 0,
              L('Regula folosește acolade `{ }`, două puncte `:` și punct și virgulă `;`.', 'A rule uses braces `{ }`, a colon `:` and a semicolon `;`.')),
            fill(L('Completează semnul care deschide regula:', 'Complete the sign that opens the rule:'), ['{'],
              L('Regula se deschide cu `{` și se închide cu `}`.', 'The rule opens with `{` and closes with `}`.'), 'h1 ___\n  color: red;\n}'),
          ],
        },
        /* ---------- 2. Colors ---------- */
        {
          id: 'css-1-2',
          concept: { id: 'css-1-colors', name: L('Culori', 'Colors') },
          title: L('Culori', 'Colors'),
          steps: [
            read(L('color și background-color', 'color and background-color'), [
              L('`color` schimbă culoarea textului. `background-color` schimbă culoarea din spatele textului (fundalul).', '`color` changes the text color. `background-color` changes the color behind the text (the background).'),
              L('Culorile se pot scrie ca nume (`red`, `gold`, `black`) sau ca cod (`#ff0000`).', 'Colors can be written as names (`red`, `gold`, `black`) or as codes (`#ff0000`).'),
            ], { scaffold: '<h1>Salut</h1>', code: 'h1 {\n  color: white;\n  background-color: purple;\n}' }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă `purple` în altă culoare, de exemplu `orange`.', 'Change `purple` to another color, for example `orange`.'),
              { scaffold: '<h1>Salut</h1>', code: 'h1 {\n  color: white;\n  background-color: purple;\n}' }),
            quiz(L('Ce schimbă `background-color`?', 'What does `background-color` change?'), [L('Fundalul', 'The background'), L('Culoarea textului', 'The text color'), L('Mărimea literelor', 'The letter size')], 0,
              L('`background` înseamnă „fundal”. Textul se schimbă cu `color`.', '`background` is what is behind the text. The text itself changes with `color`.')),
          ],
          practice: [
            {
              task: L('Fă fundalul titlului galben (`yellow`) și textul albastru (`blue`).', 'Make the heading background yellow (`yellow`) and the text blue (`blue`).'),
              scaffold: '<h1>Titlu</h1>', code: 'h1 {\n  \n}', solution: 'h1 {\n  background-color: yellow;\n  color: blue;\n}',
              checks: [
                st('h1', 'background-color', 'rgb(255, 255, 0)', L('Fundalul este galben', 'The background is yellow'), L('Folosește `background-color: yellow;`.', 'Use `background-color: yellow;`.')),
                st('h1', 'color', 'rgb(0, 0, 255)', L('Textul este albastru', 'The text is blue'), L('Folosește `color: blue;`.', 'Use `color: blue;`.')),
              ],
              hints: [L('Ai nevoie de două proprietăți, fiecare cu `;` la sfârșit.', 'You need two properties, each ending with `;`.'), L('`background-color` pentru fundal, `color` pentru text.', '`background-color` for the background, `color` for the text.')],
            },
            {
              task: L('Fă fundalul paragrafului negru (`black`) și textul alb (`white`).', 'Make the paragraph background black (`black`) and the text white (`white`).'),
              scaffold: '<p>Salut</p>', code: 'p {\n  \n}', solution: 'p {\n  background-color: black;\n  color: white;\n}',
              checks: [
                st('p', 'background-color', 'rgb(0, 0, 0)', L('Fundalul este negru', 'The background is black'), L('Folosește `background-color: black;`.', 'Use `background-color: black;`.')),
                st('p', 'color', 'rgb(255, 255, 255)', L('Textul este alb', 'The text is white'), L('Folosește `color: white;`.', 'Use `color: white;`.')),
              ],
              hints: [L('Aceleași două proprietăți ca în lecție.', 'The same two properties as in the lesson.'), L('Nu uita `;` după fiecare.', 'Do not forget `;` after each one.')],
            },
          ],
          questions: [
            choice(L('Ce proprietate schimbă culoarea textului?', 'Which property changes the text color?'), ['`color`', '`background-color`', '`font-size`'], 0,
              L('`color` schimbă textul. `background-color` schimbă fundalul.', '`color` changes the text. `background-color` changes the background.')),
            choice(L('Ce devine roșu?', 'What turns red?'), [L('Fundalul paragrafului', 'The paragraph background'), L('Textul paragrafului', 'The paragraph text'), L('Toată pagina', 'The whole page')], 0,
              L('`background-color` colorează fundalul elementului.', '`background-color` colors the background of the element.'), 'p { background-color: red; }'),
          ],
        },
        /* ---------- 3. Size and align ---------- */
        {
          id: 'css-1-3',
          concept: { id: 'css-1-text', name: L('Mărime și aliniere', 'Size and alignment') },
          title: L('Mărime și aliniere', 'Size and alignment'),
          steps: [
            read(L('font-size și text-align', 'font-size and text-align'), [
              L('`font-size` schimbă mărimea literelor, de exemplu `font-size: 40px;` (px înseamnă pixeli).', '`font-size` changes the size of the letters, for example `font-size: 40px;` (px means pixels).'),
              L('`text-align` mută textul: `left` (stânga), `center` (centru) sau `right` (dreapta).', '`text-align` moves the text: `left`, `center` or `right`.'),
            ], { scaffold: '<h1>Salut</h1>', code: 'h1 {\n  font-size: 48px;\n  text-align: center;\n}' }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă `48px` în `20px`, apoi în `70px`. Ce observi?', 'Change `48px` to `20px`, then to `70px`. What do you notice?'),
              { scaffold: '<h1>Salut</h1>', code: 'h1 {\n  font-size: 48px;\n  text-align: center;\n}' }),
            quiz(L('Cum faci literele mai mari?', 'How do you make the letters bigger?'), ['`font-size`', '`text-align`', '`color`'], 0,
              L('`font-size` controlează mărimea literelor.', '`font-size` controls the size of the letters.')),
          ],
          practice: [
            {
              task: L('Fă titlul de `40px` și centrat (`center`).', 'Make the heading `40px` and centered (`center`).'),
              scaffold: '<h1>Titlu</h1>', code: 'h1 {\n  \n}', solution: 'h1 {\n  font-size: 40px;\n  text-align: center;\n}',
              checks: [
                st('h1', 'font-size', '40px', L('Titlul are 40px', 'The heading is 40px'), L('Folosește `font-size: 40px;`.', 'Use `font-size: 40px;`.')),
                st('h1', 'text-align', 'center', L('Titlul este centrat', 'The heading is centered'), L('Folosește `text-align: center;`.', 'Use `text-align: center;`.')),
              ],
              hints: [L('Mărimea: `font-size`. Alinierea: `text-align`.', 'Size: `font-size`. Alignment: `text-align`.'), L('Scrie `px` după număr: `40px`.', 'Write `px` after the number: `40px`.')],
            },
            {
              task: L('Fă paragraful de `24px` și aliniat la dreapta (`right`).', 'Make the paragraph `24px` and aligned to the right (`right`).'),
              scaffold: '<p>Text</p>', code: 'p {\n  \n}', solution: 'p {\n  font-size: 24px;\n  text-align: right;\n}',
              checks: [
                st('p', 'font-size', '24px', L('Paragraful are 24px', 'The paragraph is 24px'), L('Folosește `font-size: 24px;`.', 'Use `font-size: 24px;`.')),
                st('p', 'text-align', 'right', L('Paragraful este la dreapta', 'The paragraph is on the right'), L('Folosește `text-align: right;`.', 'Use `text-align: right;`.')),
              ],
              hints: [L('Aceleași două proprietăți ca înainte, cu alte valori.', 'The same two properties as before, with different values.'), L('Pentru dreapta, valoarea este `right`.', 'For the right side, the value is `right`.')],
            },
          ],
          questions: [
            choice(L('Cum faci textul mai mare?', 'How do you make the text bigger?'), ['`font-size: 40px;`', '`text-size: 40px;`', '`big: 40px;`'], 0,
              L('Proprietatea corectă se numește `font-size`.', 'The correct property is called `font-size`.')),
            fill(L('Completează valoarea pentru text centrat:', 'Complete the value for centered text:'), ['center'],
              L('Centrarea se scrie `text-align: center;`.', 'Centering is written `text-align: center;`.'), 'text-align: ___;'),
          ],
        },
        /* ---------- 4. Box ---------- */
        {
          id: 'css-1-4',
          concept: { id: 'css-1-box', name: L('Spațiu și bordură', 'Spacing and borders') },
          title: L('Spațiu și bordură', 'Spacing and borders'),
          steps: [
            read(L('padding și border', 'padding and border'), [
              L('`padding` este spațiul din interior, între text și marginea cutiei.', '`padding` is the space inside, between the text and the edge of the box.'),
              L('`border` desenează o linie în jurul cutiei: `border: 2px solid black;` (grosime, stil, culoare).', '`border` draws a line around the box: `border: 2px solid black;` (thickness, style, color).'),
            ], { scaffold: '<div>Salut</div>', code: 'div {\n  padding: 20px;\n  border: 3px solid blue;\n}' }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă `20px` în `50px` și vezi cum se mărește spațiul.', 'Change `20px` to `50px` and see how the space grows.'),
              { scaffold: '<div>Salut</div>', code: 'div {\n  padding: 20px;\n  border: 3px solid blue;\n}' }),
            quiz(L('Ce face `padding`?', 'What does `padding` do?'),
              [L('Adaugă spațiu în interiorul cutiei, în jurul textului', 'Adds space inside the box, around the text'), L('Schimbă culoarea', 'Changes the color'), L('Face textul îngroșat', 'Makes the text bold')], 0,
              L('`padding` înseamnă „umplutură”: spațiu între text și bordură.', '`padding` is the space between the text and the border.')),
          ],
          practice: [
            {
              task: L('Dă elementului `div` un spațiu interior de `20px` și o bordură de `2px` plină (`solid`).', 'Give the `div` element `20px` of inner space and a `2px` solid border (`solid`).'),
              scaffold: '<div>Salut</div>', code: 'div {\n  \n}', solution: 'div {\n  padding: 20px;\n  border: 2px solid black;\n}',
              checks: [
                st('div', 'padding-top', '20px', L('Spațiul interior este 20px', 'The inner space is 20px'), L('Folosește `padding: 20px;`.', 'Use `padding: 20px;`.')),
                st('div', 'border-top-width', '2px', L('Bordura are 2px', 'The border is 2px'), L('Scrie grosimea 2px în `border`.', 'Write the 2px thickness in `border`.')),
                st('div', 'border-top-style', 'solid', L('Bordura este plină', 'The border is solid'), L('Folosește stilul `solid` în `border`.', 'Use the `solid` style in `border`.')),
              ],
              hints: [L('Bordura are trei părți: grosime, stil, culoare.', 'A border has three parts: thickness, style, color.'), L('Exemplu: `border: 2px solid black;`.', 'Example: `border: 2px solid black;`.')],
            },
            {
              task: L('Dă paragrafului `p` un spațiu interior de `10px` și o bordură de `4px` punctată (`dotted`).', 'Give the `p` paragraph `10px` of inner space and a `4px` dotted border (`dotted`).'),
              scaffold: '<p>Salut</p>', code: 'p {\n  \n}', solution: 'p {\n  padding: 10px;\n  border: 4px dotted black;\n}',
              checks: [
                st('p', 'padding-top', '10px', L('Spațiul interior este 10px', 'The inner space is 10px'), L('Folosește `padding: 10px;`.', 'Use `padding: 10px;`.')),
                st('p', 'border-top-width', '4px', L('Bordura are 4px', 'The border is 4px'), L('Scrie grosimea 4px în `border`.', 'Write the 4px thickness in `border`.')),
                st('p', 'border-top-style', 'dotted', L('Bordura este punctată', 'The border is dotted'), L('Folosește stilul `dotted` în `border`.', 'Use the `dotted` style in `border`.')),
              ],
              hints: [L('Aceeași formă ca înainte, cu alte valori.', 'The same form as before, with different values.'), L('Exemplu: `border: 4px dotted black;`.', 'Example: `border: 4px dotted black;`.')],
            },
          ],
          questions: [
            choice(L('Ce se întâmplă?', 'What happens?'),
              [L('Apar 20px de spațiu în interiorul cutiei, în jurul textului', '20px of space appear inside the box, around the text'), L('Textul devine albastru', 'The text turns blue'), L('Textul dispare', 'The text disappears')], 0,
              L('`padding` adaugă spațiu în interiorul elementului.', '`padding` adds space inside the element.'), 'p { padding: 20px; }'),
            choice(L('Care scriere pune o bordură subțire neagră?', 'Which one gives a thin black border?'), ['`border: 1px solid black;`', '`border = 1px solid black;`', '`border(1px solid black);`'], 0,
              L('Regula folosește `proprietate: valoare;`, cu două puncte.', 'A rule uses `property: value;`, with a colon.')),
          ],
        },
        /* ---------- 5. Classes ---------- */
        {
          id: 'css-1-5',
          concept: { id: 'css-1-class', name: L('Clase', 'Classes') },
          title: L('Clase', 'Classes'),
          steps: [
            read(L('Clase', 'Classes'), [
              L('Uneori vrei să stilizezi doar unele elemente, nu toate. Le dai o clasă în HTML: `<p class="rosu">`.', 'Sometimes you want to style only some elements, not all. You give them a class in HTML: `<p class="rosu">`.'),
              L('În CSS, o clasă se scrie cu punct înainte: `.rosu { color: red; }`. Se aplică doar elementelor cu acea clasă.', 'In CSS, a class is written with a dot before it: `.rosu { color: red; }`. It applies only to elements with that class.'),
            ], { scaffold: L('<p class="rosu">Roșu</p>\n<p>Normal</p>', '<p class="rosu">Red</p>\n<p>Normal</p>'), code: '.rosu {\n  color: red;\n}' }),
            tryIt(L('Încearcă singur', 'Try it yourself'),
              L('Schimbă `red` în altă culoare. Observă că al doilea paragraf nu se schimbă.', 'Change `red` to another color. Notice that the second paragraph does not change.'),
              { scaffold: L('<p class="rosu">Roșu</p>\n<p>Normal</p>', '<p class="rosu">Red</p>\n<p>Normal</p>'), code: '.rosu {\n  color: red;\n}' }),
            quiz(L('Cum scrii în CSS regula pentru clasa `mare`?', 'How do you write the CSS rule for the class `mare`?'), ['`.mare { ... }`', '`mare { ... }`', '`#mare { ... }`'], 0,
              L('Clasa se scrie cu punct în față: `.mare`.', 'A class is written with a dot in front: `.mare`.')),
          ],
          practice: [
            {
              task: L('Scrie regula `.rosu` care face textul roșu (`red`). Al doilea paragraf trebuie să rămână cum e.', 'Write the `.rosu` rule that makes the text red (`red`). The second paragraph must stay as it is.'),
              scaffold: '<p class="rosu">One</p>\n<p>Two</p>', code: HERE.css, solution: '.rosu {\n  color: red;\n}',
              checks: [
                st('.rosu', 'color', 'rgb(255, 0, 0)', L('Paragraful cu clasa rosu este roșu', 'The paragraph with the class rosu is red'), L('Scrie `.rosu { color: red; }`, cu punct înainte de nume.', 'Write `.rosu { color: red; }`, with a dot before the name.')),
                chk({ kind: 'style', selector: 'p:not(.rosu)', prop: 'color', notEquals: 'rgb(255, 0, 0)' }, L('Celălalt paragraf nu s-a schimbat', 'The other paragraph did not change'), L('Folosește `.rosu`, nu `p`: așa se schimbă doar paragraful cu clasa.', 'Use `.rosu`, not `p`: that way only the paragraph with the class changes.')),
              ],
              hints: [L('Clasa se scrie cu punct: `.rosu`.', 'A class is written with a dot: `.rosu`.'), L('Forma: `.rosu { color: red; }`.', 'The form: `.rosu { color: red; }`.')],
            },
            {
              task: L('Scrie regula `.titlu` care face textul de `36px`.', 'Write the `.titlu` rule that makes the text `36px`.'),
              scaffold: '<p>One</p>\n<p class="titlu">Two</p>', code: HERE.css, solution: '.titlu {\n  font-size: 36px;\n}',
              checks: [
                st('.titlu', 'font-size', '36px', L('Paragraful cu clasa titlu are 36px', 'The paragraph with the class titlu is 36px'), L('Scrie `.titlu { font-size: 36px; }`, cu punct înainte de nume.', 'Write `.titlu { font-size: 36px; }`, with a dot before the name.')),
                chk({ kind: 'style', selector: 'p:not(.titlu)', prop: 'font-size', notEquals: '36px' }, L('Celălalt paragraf nu s-a schimbat', 'The other paragraph did not change'), L('Folosește `.titlu`, nu `p`.', 'Use `.titlu`, not `p`.')),
              ],
              hints: [L('Mărimea se schimbă cu `font-size`.', 'The size is changed with `font-size`.'), L('Forma: `.titlu { font-size: 36px; }`.', 'The form: `.titlu { font-size: 36px; }`.')],
            },
          ],
          questions: [
            fill(L('Completează semnul care arată că este o clasă:', 'Complete the sign that shows it is a class:'), ['.'],
              L('Clasele încep cu punct în CSS.', 'Classes start with a dot in CSS.'), '___rosu { color: red; }'),
            choice(L('Care regulă se aplică acestui paragraf?', 'Which rule applies to this paragraph?'), ['`.mic { ... }`', '`.mare { ... }`', '`mic { ... }`'], 0,
              L('Paragraful are clasa `mic`, deci regula este `.mic`.', 'The paragraph has the class `mic`, so the rule is `.mic`.'), '<p class="mic">Salut</p>'),
          ],
        },
      ],
    },
  ],
};
