import { L, HERE, chk, read, tryIt, quiz, choice, fill } from './kit.js';

const out = (props, label, fail) => chk({ kind: 'output', ...props }, label, fail);
const code = (matches, label, fail, extra = {}) => chk({ kind: 'code', matches, ...extra }, label, fail);

export const jsCourse = {
  id: 'js',
  lang: 'js',
  title: L('JavaScript: primele comenzi', 'JavaScript: your first commands'),
  blurb: L('Scrii primele programe: afișezi texte, păstrezi valori, calculezi și iei decizii.', 'You write your first programs: print text, keep values, calculate and make decisions.'),
  levels: [
    {
      id: 'js-1',
      title: L('Primele comenzi', 'First commands'),
      lessons: [
        /* ---------- 1. Print ---------- */
        {
          id: 'js-1-1',
          concept: { id: 'js-1-print', name: L('Afișarea unui text', 'Printing text') },
          title: L('Afișează un text', 'Print some text'),
          steps: [
            read(L('Primul program', 'Your first program'), [
              L('Un program este o listă de comenzi pe care calculatorul le face pe rând, de sus în jos.', 'A program is a list of commands the computer does one by one, from top to bottom.'),
              L('Comanda `console.log("...")` scrie un text pe ecran. Textul se pune între ghilimele.', 'The command `console.log("...")` writes text on the screen. The text goes between quotes.'),
            ], { code: 'console.log("Salut!");' }),
            tryIt(L('Încearcă singur', 'Try it yourself'), L('Schimbă textul dintre ghilimele, apoi rulează.', 'Change the text between the quotes, then run it.'), { code: 'console.log("Salut!");' }),
            quiz(L('Ce face `console.log`?', 'What does `console.log` do?'), [L('Afișează ceva pe ecran', 'Shows something on the screen'), L('Șterge ecranul', 'Clears the screen'), L('Cântă o melodie', 'Plays a song')], 0,
              L('`console.log` scrie pe ecran ce îi dai între paranteze.', '`console.log` writes on the screen whatever you put in the brackets.')),
          ],
          practice: [
            {
              task: L('Afișează textul `Hello` folosind `console.log`.', 'Print the text `Hello` using `console.log`.'),
              code: HERE.cmd, solution: 'console.log("Hello");',
              checks: [
                code('console\\.log\\s*\\(', L('Folosești `console.log`', 'You use `console.log`'), L('Scrie comanda `console.log("...")`.', 'Write the command `console.log("...")`.')),
                out({ matches: '^hello$', flags: 'i' }, L('Pe ecran apare `Hello`', 'The screen shows `Hello`'), L('Textul din ghilimele trebuie să fie exact `Hello`.', 'The text in the quotes must be exactly `Hello`.')),
              ],
              hints: [L('Forma este `console.log("text");`.', 'The form is `console.log("text");`.'), L('Pune `Hello` între ghilimele și închide cu `;`.', 'Put `Hello` between quotes and finish with `;`.')],
            },
            {
              task: L('Afișează două rânduri: `Ana` și `Ion`, fiecare cu propriul `console.log`.', 'Print two lines: `Ana` and `Ion`, each with its own `console.log`.'),
              code: HERE.cmds, solution: 'console.log("Ana");\nconsole.log("Ion");',
              checks: [
                out({ minLines: 2 }, L('Apar două rânduri', 'Two lines appear'), L('Ai nevoie de două comenzi `console.log`, una sub alta.', 'You need two `console.log` commands, one below the other.')),
                out({ matches: 'Ana' }, L('Un rând spune `Ana`', 'One line says `Ana`'), L('Unul dintre texte trebuie să fie `Ana`.', 'One of the texts must be `Ana`.')),
                out({ matches: 'Ion' }, L('Un rând spune `Ion`', 'One line says `Ion`'), L('Celălalt text trebuie să fie `Ion`.', 'The other text must be `Ion`.')),
              ],
              hints: [L('Scrie o comandă pe un rând, apoi încă una pe rândul următor.', 'Write one command on a line, then another on the next line.'), L('Fiecare se termină cu `;`.', 'Each one ends with `;`.')],
            },
          ],
          questions: [
            choice(L('Care cod afișează textul Salut?', 'Which code prints the text Salut?'), ['`console.log("Salut");`', '`console.log(Salut);`', '`print "Salut"`'], 0,
              L('Textul trebuie pus între ghilimele, în interiorul parantezelor.', 'The text must be in quotes, inside the brackets.')),
            choice(L('Ce apare pe ecran?', 'What appears on the screen?'), [L('A pe un rând, B pe rândul de dedesubt', 'A on one line, B on the line below'), 'AB', L('Doar B', 'Only B')], 0,
              L('Fiecare `console.log` scrie pe un rând nou.', 'Each `console.log` writes on a new line.'), 'console.log("A");\nconsole.log("B");'),
          ],
        },
        /* ---------- 2. Variables ---------- */
        {
          id: 'js-1-2',
          concept: { id: 'js-1-vars', name: L('Variabile', 'Variables') },
          title: L('Variabile', 'Variables'),
          steps: [
            read(L('O cutie cu nume', 'A box with a name'), [
              L('O variabilă este o cutie cu nume în care păstrezi o valoare. O faci cu `let`: `let nume = "Ana";`', 'A variable is a box with a name that holds a value. You make one with `let`: `let name = "Ana";`'),
              L('Apoi afișezi ce e în cutie: `console.log(nume);` (fără ghilimele, fiindcă nu scrii textul, ci numele cutiei).', 'Then you print what is in the box: `console.log(name);` (without quotes, because you are not writing the text, but the name of the box).'),
            ], { code: L('let nume = "Ana";\nconsole.log(nume);', 'let name = "Ana";\nconsole.log(name);') }),
            tryIt(L('Încearcă singur', 'Try it yourself'), L('Pune numele tău în loc de `Ana`.', 'Put your own name instead of `Ana`.'), { code: L('let nume = "Ana";\nconsole.log(nume);', 'let name = "Ana";\nconsole.log(name);') }),
            quiz(L('Ce este în variabila `x` după `let x = 5;`?', 'What is in the variable `x` after `let x = 5;`?'), [L('Numărul 5', 'The number 5'), L('Litera x', 'The letter x'), L('Nimic', 'Nothing')], 0,
              L('`let x = 5;` pune valoarea 5 în cutia numită `x`.', '`let x = 5;` puts the value 5 in the box called `x`.')),
          ],
          practice: [
            {
              task: L('Creează o variabilă `nume` cu numele tău și afișeaz-o cu `console.log`.', 'Create a variable `nume` with your name and print it with `console.log`.'),
              code: HERE.code, solution: 'let nume = "Ana";\nconsole.log(nume);',
              checks: [
                code('(let|const|var)\\s+nume\\s*=', L('Ai creat variabila `nume`', 'You created the variable `nume`'), L('Începe cu `let nume = "..." ;`.', 'Start with `let nume = "...";`.')),
                code('console\\.log\\s*\\(\\s*nume\\s*\\)', L('Afișezi variabila `nume`', 'You print the variable `nume`'), L('Scrie `console.log(nume);` fără ghilimele în jurul lui `nume`.', 'Write `console.log(nume);` without quotes around `nume`.')),
                out({ matches: '\\S' }, L('Pe ecran apare ceva', 'Something appears on the screen'), L('Variabila trebuie să conțină un text.', 'The variable must hold some text.')),
              ],
              hints: [L('Mai întâi creezi cutia: `let nume = "Numele tău";`.', 'First you make the box: `let nume = "Your name";`.'), L('Apoi o afișezi: `console.log(nume);`.', 'Then you print it: `console.log(nume);`.')],
            },
            {
              task: L('Creează variabila `varsta` cu un număr și afișeaz-o.', 'Create the variable `varsta` with a number and print it.'),
              code: HERE.code, solution: 'let varsta = 11;\nconsole.log(varsta);',
              checks: [
                code('(let|const|var)\\s+varsta\\s*=', L('Ai creat variabila `varsta`', 'You created the variable `varsta`'), L('Începe cu `let varsta = ...;`.', 'Start with `let varsta = ...;`.')),
                code('console\\.log\\s*\\(\\s*varsta\\s*\\)', L('Afișezi variabila `varsta`', 'You print the variable `varsta`'), L('Scrie `console.log(varsta);`.', 'Write `console.log(varsta);`.')),
                out({ matches: '^\\d+$' }, L('Pe ecran apare un număr', 'A number appears on the screen'), L('Numerele se scriu fără ghilimele, de exemplu `11`.', 'Numbers are written without quotes, for example `11`.')),
              ],
              hints: [L('Un număr nu are ghilimele: `let varsta = 11;`.', 'A number has no quotes: `let varsta = 11;`.'), L('Apoi `console.log(varsta);`.', 'Then `console.log(varsta);`.')],
            },
          ],
          questions: [
            choice(L('Ce afișează programul?', 'What does the program print?'), ['7', 'x', 'let'], 0,
              L('`console.log(x)` afișează valoarea din cutia `x`, adică 7.', '`console.log(x)` prints the value inside the box `x`, which is 7.'), 'let x = 7;\nconsole.log(x);'),
            fill(L('Completează cuvântul care creează o variabilă:', 'Complete the word that creates a variable:'), ['let', 'const', 'var'],
              L('Variabilele se creează cu `let` (sau `const`).', 'Variables are created with `let` (or `const`).'), '___ nume = "Ana";'),
          ],
        },
        /* ---------- 3. Math ---------- */
        {
          id: 'js-1-3',
          concept: { id: 'js-1-math', name: L('Calcule', 'Calculations') },
          title: L('Calcule', 'Calculations'),
          steps: [
            read(L('Calculatorul socotește', 'The computer calculates'), [
              L('Semnele sunt: `+` adunare, `-` scădere, `*` înmulțire și `/` împărțire.', 'The signs are: `+` add, `-` subtract, `*` multiply and `/` divide.'),
              L('`console.log(2 + 3);` afișează 5. Nu pui ghilimele, fiindcă vrei rezultatul, nu textul.', '`console.log(2 + 3);` prints 5. You do not use quotes, because you want the result, not the text.'),
            ], { code: 'console.log(2 + 3);\nconsole.log(4 * 5);' }),
            tryIt(L('Încearcă singur', 'Try it yourself'), L('Schimbă numerele și semnele.', 'Change the numbers and the signs.'), { code: 'console.log(2 + 3);\nconsole.log(4 * 5);' }),
            quiz(L('Ce simbol înseamnă înmulțire?', 'Which symbol means multiplication?'), ['`*`', '`x`', '`+`'], 0, L('În programare înmulțirea se scrie cu `*`.', 'In programming, multiplication is written with `*`.')),
          ],
          practice: [
            {
              task: L('Afișează rezultatul lui 6 × 7, calculat de calculator (folosește `*`).', 'Print the result of 6 × 7, calculated by the computer (use `*`).'),
              code: HERE.code, solution: 'console.log(6 * 7);',
              checks: [
                code('6\\s*\\*\\s*7', L('Calculatorul face înmulțirea cu `*`', 'The computer does the multiplication with `*`'), L('Scrie `6 * 7` în comandă, nu rezultatul gata făcut.', 'Write `6 * 7` in the command, not the finished result.')),
                out({ equals: '42' }, L('Pe ecran apare 42', 'The screen shows 42'), L('Rezultatul trebuie să fie 42.', 'The result must be 42.')),
              ],
              hints: [L('Forma: `console.log(6 * 7);`.', 'The form: `console.log(6 * 7);`.'), L('Fără ghilimele în jurul calculului.', 'No quotes around the calculation.')],
            },
            {
              task: L('Afișează rezultatul lui 9 × 9, calculat cu `*`.', 'Print the result of 9 × 9, calculated with `*`.'),
              code: HERE.code, solution: 'console.log(9 * 9);',
              checks: [
                code('9\\s*\\*\\s*9', L('Calculatorul face înmulțirea cu `*`', 'The computer does the multiplication with `*`'), L('Scrie `9 * 9` în comandă.', 'Write `9 * 9` in the command.')),
                out({ equals: '81' }, L('Pe ecran apare 81', 'The screen shows 81'), L('Rezultatul trebuie să fie 81.', 'The result must be 81.')),
              ],
              hints: [L('Aceeași formă ca în lecție.', 'The same form as in the lesson.'), L('`console.log(9 * 9);`', '`console.log(9 * 9);`')],
            },
          ],
          questions: [
            choice(L('Ce afișează?', 'What does it print?'), ['6', '14', '104'], 0, L('10 − 4 este 6.', '10 − 4 is 6.'), 'console.log(10 - 4);'),
            choice(L('Ce afișează?', 'What does it print?'), ['10', '7', '25'], 0, L('2 × 5 este 10.', '2 × 5 is 10.'), 'console.log(2 * 5);'),
          ],
        },
        /* ---------- 4. Joining text ---------- */
        {
          id: 'js-1-4',
          concept: { id: 'js-1-join', name: L('Lipirea textelor', 'Joining text') },
          title: L('Lipirea textelor', 'Joining text'),
          steps: [
            read(L('Semnul + pentru texte', 'The + sign for text'), [
              L('Cu `+` poți lipi texte: `"Salut, " + "Ana"` devine `Salut, Ana`.', 'With `+` you can join text: `"Hello, " + "Ana"` becomes `Hello, Ana`.'),
              L('Poți lipi și o variabilă: `"Salut, " + nume`. Atenție la spații: ele fac parte din text.', 'You can also join a variable: `"Hello, " + name`. Watch the spaces: they are part of the text.'),
            ], { code: L('let nume = "Ana";\nconsole.log("Salut, " + nume);', 'let name = "Ana";\nconsole.log("Hello, " + name);') }),
            tryIt(L('Încearcă singur', 'Try it yourself'), L('Schimbă numele și textul de la început.', 'Change the name and the text at the start.'), { code: L('let nume = "Ana";\nconsole.log("Salut, " + nume);', 'let name = "Ana";\nconsole.log("Hello, " + name);') }),
            quiz(L('Ce afișează `console.log("Bun " + "venit");`?', 'What does `console.log("Good " + "day");` print?'), [L('Bun venit', 'Good day'), L('Bun + venit', 'Good + day'), L('Bunvenit', 'Goodday')], 0,
              L('`+` lipește cele două texte. Spațiul din „Bun ” rămâne.', '`+` joins the two texts. The space in “Good ” stays.')),
          ],
          practice: [
            {
              task: L('Afișează `Salut, Ana!` folosind variabila `nume` și semnul `+`.', 'Print `Salut, Ana!` using the variable `nume` and the `+` sign.'),
              code: L('let nume = "Ana";\n// Scrie comanda ta mai jos\n', 'let nume = "Ana";\n// Write your command below\n'), solution: 'let nume = "Ana";\nconsole.log("Salut, " + nume + "!");',
              checks: [
                code('console\\.log\\s*\\([^)]*\\+[^)]*nume|console\\.log\\s*\\([^)]*nume[^)]*\\+', L('Lipești textul cu variabila `nume` folosind `+`', 'You join the text with the variable `nume` using `+`'), L('Scrie `"Salut, " + nume + "!"` în interiorul lui `console.log`.', 'Write `"Salut, " + nume + "!"` inside `console.log`.')),
                out({ equals: 'Salut, Ana!' }, L('Pe ecran apare `Salut, Ana!`', 'The screen shows `Salut, Ana!`'), L('Verifică virgula, spațiul și semnul de exclamare.', 'Check the comma, the space and the exclamation mark.')),
              ],
              hints: [L('Ai trei bucăți de lipit: `"Salut, "`, `nume` și `"!"`.', 'You have three pieces to join: `"Salut, "`, `nume` and `"!"`.'), L('`console.log("Salut, " + nume + "!");`', '`console.log("Salut, " + nume + "!");`')],
            },
            {
              task: L('Afișează `Imi place pisica` folosind variabila `animal` și semnul `+`.', 'Print `Imi place pisica` using the variable `animal` and the `+` sign.'),
              code: L('let animal = "pisica";\n// Scrie comanda ta mai jos\n', 'let animal = "pisica";\n// Write your command below\n'), solution: 'let animal = "pisica";\nconsole.log("Imi place " + animal);',
              checks: [
                code('console\\.log\\s*\\([^)]*\\+[^)]*animal|console\\.log\\s*\\([^)]*animal[^)]*\\+', L('Lipești textul cu variabila `animal` folosind `+`', 'You join the text with the variable `animal` using `+`'), L('Scrie `"Imi place " + animal` în interiorul lui `console.log`.', 'Write `"Imi place " + animal` inside `console.log`.')),
                out({ matches: '^[IÎ]mi place pisica$' }, L('Pe ecran apare `Imi place pisica`', 'The screen shows `Imi place pisica`'), L('Verifică spațiul după `place`.', 'Check the space after `place`.')),
              ],
              hints: [L('Textul de început este `"Imi place "`, cu spațiu la sfârșit.', 'The starting text is `"Imi place "`, with a space at the end.'), L('Apoi `+ animal`.', 'Then `+ animal`.')],
            },
          ],
          questions: [
            choice(L('Ce afișează?', 'What does it print?'), [L('Bun venit', 'Good day'), L('a venit', 'a day'), L('Bun a venit', 'Good a day')], 0,
              L('Variabila `a` conține `"Bun "`, iar `+` o lipește de `"venit"`.', 'The variable `a` holds `"Bun "`, and `+` joins it to `"venit"`.'), L('let a = "Bun ";\nconsole.log(a + "venit");', 'let a = "Good ";\nconsole.log(a + "day");')),
            fill(L('Completează semnul care lipește textele:', 'Complete the sign that joins texts:'), ['+'],
              L('Textele se lipesc cu `+`.', 'Texts are joined with `+`.'), 'console.log("Salut, " ___ nume);'),
          ],
        },
        /* ---------- 5. If ---------- */
        {
          id: 'js-1-5',
          concept: { id: 'js-1-if', name: L('Decizii cu if', 'Decisions with if') },
          title: L('Decizii cu if', 'Decisions with if'),
          steps: [
            read(L('Programul alege', 'The program chooses'), [
              L('Cu `if` programul decide. Dacă ce scrii în paranteză este adevărat, face ce e între acolade; altfel face ce e după `else`.', 'With `if` the program decides. If what you write in the brackets is true, it does what is between the braces; otherwise it does what is after `else`.'),
              L('Semne de comparare: `>` mai mare, `<` mai mic, `>=` mai mare sau egal, `===` egal.', 'Comparison signs: `>` greater, `<` smaller, `>=` greater or equal, `===` equal.'),
            ], { code: 'let varsta = 20;\n\nif (varsta >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Copil");\n}' }),
            tryIt(L('Încearcă singur', 'Try it yourself'), L('Schimbă `20` în `10` și vezi ce afișează.', 'Change `20` to `10` and see what it prints.'), { code: 'let varsta = 20;\n\nif (varsta >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Copil");\n}' }),
            quiz(L('Când se execută partea `else`?', 'When does the `else` part run?'), [L('Când condiția din `if` nu este adevărată', 'When the condition in `if` is not true'), L('Întotdeauna', 'Always'), L('Niciodată', 'Never')], 0,
              L('`else` înseamnă „altfel”: se execută doar dacă `if` nu a fost adevărat.', '`else` means “otherwise”: it runs only if the `if` was not true.')),
          ],
          practice: [
            {
              task: L('Scrie un `if` care afișează `Cald` dacă `temperatura` este mai mare de 25, altfel `Frig`.', 'Write an `if` that prints `Cald` if `temperatura` is greater than 25, otherwise `Frig`.'),
              code: L('let temperatura = 30;\n\n// Scrie if-ul tău mai jos\n', 'let temperatura = 30;\n\n// Write your if below\n'), solution: 'let temperatura = 30;\n\nif (temperatura > 25) {\n  console.log("Cald");\n} else {\n  console.log("Frig");\n}',
              checks: [
                code('if\\s*\\(', L('Folosești `if`', 'You use `if`'), L('Începe cu `if (condiție) { ... }`.', 'Start with `if (condition) { ... }`.')),
                code('else', L('Folosești `else`', 'You use `else`'), L('Adaugă `else { ... }` pentru cazul „Frig”.', 'Add `else { ... }` for the “Frig” case.')),
                out({ equals: 'Cald' }, L('Pentru 30 de grade apare `Cald`', 'For 30 degrees `Cald` appears'), L('30 este mai mare de 25, deci trebuie să afișeze `Cald`.', '30 is greater than 25, so it must print `Cald`.')),
              ],
              hints: [L('Condiția este `temperatura > 25`.', 'The condition is `temperatura > 25`.'), L('`if (temperatura > 25) { ... } else { ... }`', '`if (temperatura > 25) { ... } else { ... }`')],
            },
            {
              task: L('Afișează `Adult` dacă `varsta` este cel puțin 18, altfel `Copil`.', 'Print `Adult` if `varsta` is at least 18, otherwise `Copil`.'),
              code: L('let varsta = 12;\n\n// Scrie if-ul tău mai jos\n', 'let varsta = 12;\n\n// Write your if below\n'), solution: 'let varsta = 12;\n\nif (varsta >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Copil");\n}',
              checks: [
                code('if\\s*\\(', L('Folosești `if`', 'You use `if`'), L('Începe cu `if (condiție) { ... }`.', 'Start with `if (condition) { ... }`.')),
                code('else', L('Folosești `else`', 'You use `else`'), L('Adaugă `else { ... }` pentru cazul „Copil”.', 'Add `else { ... }` for the “Copil” case.')),
                out({ equals: 'Copil' }, L('Pentru 12 ani apare `Copil`', 'For 12 years `Copil` appears'), L('12 este mai mic de 18, deci trebuie să afișeze `Copil`.', '12 is less than 18, so it must print `Copil`.')),
              ],
              hints: [L('„Cel puțin 18” se scrie `varsta >= 18`.', '“At least 18” is written `varsta >= 18`.'), L('`if (varsta >= 18) { ... } else { ... }`', '`if (varsta >= 18) { ... } else { ... }`')],
            },
          ],
          questions: [
            choice(L('Ce afișează?', 'What does it print?'), ['mic', 'mare', 'mic mare'], 0,
              L('3 nu este mai mare de 5, deci se execută `else`: `mic`.', '3 is not greater than 5, so `else` runs: `mic`.'), 'let x = 3;\nif (x > 5) {\n  console.log("mare");\n} else {\n  console.log("mic");\n}'),
            choice(L('Ce semn înseamnă „mai mare sau egal”?', 'Which sign means “greater or equal”?'), ['`>=`', '`=>`', '`==>`'], 0,
              L('„Mai mare sau egal” se scrie `>=`.', '“Greater or equal” is written `>=`.')),
          ],
        },
      ],
    },
  ],
};
