// All lessons live here as plain data. To add a project, add an object to PROJECTS.
// Text is written for three interface languages: ro, en, ru.
// Code for PHP, Java and C++ avoids ă â î ș ț inside strings, because server output may not show them correctly.

const L = (ro, en, ru) => ({ ro, en, ru });

export const LEVELS = ['kids', 'teens', 'adults'];

export const LANGUAGES = {
  html: { name: 'HTML', where: 'browser' },
  css: { name: 'CSS', where: 'browser' },
  js: { name: 'JavaScript', where: 'browser' },
  php: { name: 'PHP', where: 'server' },
  java: { name: 'Java', where: 'server' },
  cpp: { name: 'C++', where: 'server' },
};

// The five main languages shown on the home page, in this order, plus JavaScript.
export const LANGUAGE_ORDER = ['html', 'css', 'js', 'php', 'java', 'cpp'];

export const DOMAINS = [
  { id: 'music', icon: 'music', color: '#DCE6FF', title: L('Muzică', 'Music', 'Музыка'), blurb: L('Compune melodii și ritmuri cu cod.', 'Compose melodies and rhythms with code.', 'Сочиняй мелодии и ритмы с помощью кода.') },
  { id: 'art', icon: 'brush', color: '#FFDDEB', title: L('Artă', 'Art', 'Искусство'), blurb: L('Desenează și animează cu cod.', 'Draw and animate with code.', 'Рисуй и оживляй картинки кодом.') },
  { id: 'games', icon: 'gamepad', color: '#FFF0B3', title: L('Jocuri', 'Games', 'Игры'), blurb: L('Fă un joc pe care îl poți juca imediat.', 'Make a game you can play right away.', 'Сделай игру, в которую можно сразу играть.') },
  { id: 'science', icon: 'flask', color: '#D5F5E6', title: L('Știință', 'Science', 'Наука'), blurb: L('Calculează temperaturi, căderi și alte lucruri din natură.', 'Calculate temperatures, falling objects and more.', 'Считай температуру, падение тел и другое.') },
  { id: 'stories', icon: 'book', color: '#FFE4D0', title: L('Povești', 'Stories', 'Истории'), blurb: L('Scrie povești care iau alt drum după alegerea ta.', 'Write stories that take a new path by your choice.', 'Пиши истории, которые идут по-разному в зависимости от выбора.') },
  { id: 'math', icon: 'shapes', color: '#E6DDFF', title: L('Matematică', 'Maths', 'Математика'), blurb: L('Lasă calculatorul să facă socotelile grele.', 'Let the computer do the heavy counting.', 'Пусть компьютер делает сложные подсчёты.') },
];

export const PROJECTS = [
  /* ---------------- Music ---------------- */
  {
    id: 'music-first-note', domain: 'music', levels: ['kids', 'teens', 'adults'],
    title: L('Prima ta notă', 'Your first note', 'Твоя первая нота'),
    summary: L('Fă calculatorul să cânte trei note.', 'Make the computer play three notes.', 'Заставь компьютер сыграть три ноты.'),
    intro: L(
      "Sunetul este aer care vibrează. Cu note('C4') calculatorul cântă nota Do. Al doilea număr spune când pornește nota, în secunde.",
      "Sound is vibrating air. note('C4') makes the computer play the note C. The second number says when it starts, in seconds.",
      "Звук — это колеблющийся воздух. note('C4') играет ноту до. Второе число — когда она начнётся, в секундах."),
    task: L('Schimbă notele (D4, F4, A4) și momentele, apoi apasă Rulează.', 'Change the notes (D4, F4, A4) and the timing, then press Run.', 'Поменяй ноты (D4, F4, A4) и время, потом нажми «Запустить».'),
    hint: L('Diezii se scriu cu #, de exemplu F#4. Un număr mai mare după literă înseamnă un sunet mai ascuțit.', 'Sharps use #, like F#4. A bigger number after the letter means a higher sound.', 'Диезы пишутся с #, например F#4. Чем больше число после буквы, тем звук выше.'),
    variants: {
      js: { view: 'canvas', code: String.raw`circle(250, 200, 60, 'tomato');
note('C4', 0);
note('E4', 0.5);
note('G4', 1);` },
    },
  },
  {
    id: 'music-melody', domain: 'music', levels: ['kids', 'teens'],
    title: L('Compune o melodie', 'Compose a melody', 'Сочини мелодию'),
    summary: L('Pune notele una după alta și fă o melodie.', 'Place notes one after another to make a tune.', 'Расставь ноты по порядку и получи мелодию.'),
    intro: L(
      'O melodie înseamnă note puse în timp. Al treilea număr din note() spune cât timp sună nota. Liniile care încep cu // sunt comentarii: calculatorul le ignoră.',
      'A melody is notes placed in time. The third number in note() says how long the note rings. Lines starting with // are comments: the computer ignores them.',
      'Мелодия — это ноты, расставленные во времени. Третье число в note() — как долго звучит нота. Строки с // — комментарии: компьютер их пропускает.'),
    task: L('Termină melodia sau scrie una a ta.', 'Finish the tune or write your own.', 'Закончи мелодию или напиши свою.'),
    hint: L('Fiecare timp are 0,5 secunde. Numere mai mici fac melodia mai rapidă.', 'Each beat is 0.5 seconds. Smaller numbers make the tune faster.', 'Каждый такт — 0,5 секунды. Чем меньше числа, тем быстрее мелодия.'),
    variants: {
      js: { view: 'canvas', code: String.raw`// Twinkle, twinkle (traditional)
note('C4', 0.0);
note('C4', 0.5);
note('G4', 1.0);
note('G4', 1.5);
note('A4', 2.0);
note('A4', 2.5);
note('G4', 3.0, 0.9);` },
    },
  },
  {
    id: 'music-scale', domain: 'music', levels: ['teens', 'adults'],
    title: L('Scara muzicală', 'The musical scale', 'Музыкальная гамма'),
    summary: L('Cântă opt note cu o buclă și desenează-le.', 'Play eight notes with a loop and draw them.', 'Сыграй восемь нот в цикле и нарисуй их.'),
    intro: L(
      'O buclă repetă instrucțiuni. for (...) rulează de 8 ori, iar after(secunde, ...) desenează cercul exact când sună nota.',
      'A loop repeats instructions. for (...) runs 8 times, and after(seconds, ...) draws the circle exactly when the note sounds.',
      'Цикл повторяет инструкции. for (...) выполняется 8 раз, а after(секунды, ...) рисует круг ровно тогда, когда звучит нота.'),
    task: L('Fă scara mai rapidă sau schimbă culorile.', 'Make the scale faster or change the colors.', 'Сделай гамму быстрее или поменяй цвета.'),
    hint: L('Încearcă i * 0.15 în loc de i * 0.3.', 'Try i * 0.15 instead of i * 0.3.', 'Попробуй i * 0.15 вместо i * 0.3.'),
    variants: {
      js: { view: 'canvas', code: String.raw`const scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const colors = ['tomato', 'orange', 'gold', 'lightgreen', 'turquoise', 'dodgerblue', 'orchid', 'hotpink'];

for (let i = 0; i < scale.length; i++) {
  note(scale[i], i * 0.3);
  after(i * 0.3, () => {
    circle(50 + i * 57, 340 - i * 38, 22, colors[i]);
  });
}` },
    },
  },

  /* ---------------- Art ---------------- */
  {
    id: 'art-colors', domain: 'art', levels: ['kids', 'teens'],
    title: L('Culori în cercuri', 'Colors in circles', 'Цвета в кругах'),
    summary: L('Desenează cercuri și alege-le culorile.', 'Draw circles and pick their colors.', 'Нарисуй круги и выбери им цвета.'),
    intro: L(
      'circle(x, y, mărime, culoare) desenează un cerc. x este distanța de la marginea stângă, y de la marginea de sus. Scena are 500 de lățime și 400 de înălțime.',
      'circle(x, y, size, color) draws a circle. x is the distance from the left edge, y from the top. The stage is 500 wide and 400 tall.',
      'circle(x, y, размер, цвет) рисует круг. x — расстояние от левого края, y — от верхнего. Сцена шириной 500 и высотой 400.'),
    task: L("Mută cercurile și schimbă culorile: încearcă 'hotpink' sau '#2336D9'.", "Move the circles and change the colors: try 'hotpink' or '#2336D9'.", "Передвинь круги и поменяй цвета: попробуй 'hotpink' или '#2336D9'."),
    hint: L('Un x mai mare mută cercul spre dreapta, un y mai mare îl mută în jos.', 'A bigger x moves the circle right, a bigger y moves it down.', 'Чем больше x, тем круг правее, чем больше y, тем ниже.'),
    variants: {
      js: { view: 'canvas', code: String.raw`circle(150, 150, 60, 'tomato');
circle(280, 200, 40, 'gold');
circle(370, 120, 30, 'dodgerblue');` },
    },
  },
  {
    id: 'art-rainbow', domain: 'art', levels: ['kids', 'teens', 'adults'],
    title: L('Curcubeu cu CSS', 'A rainbow with CSS', 'Радуга на CSS'),
    summary: L('Colorează dungile unui curcubeu.', 'Color the stripes of a rainbow.', 'Раскрась полосы радуги.'),
    intro: L(
      'CSS spune paginii cum să arate. Fiecare dungă are o clasă (s1, s2, ...), iar background alege culoarea.',
      'CSS tells a page how to look. Each stripe has a class (s1, s2, ...) and background picks the color.',
      'CSS говорит странице, как выглядеть. У каждой полосы есть класс (s1, s2, ...), а background выбирает цвет.'),
    task: L('Schimbă culorile și înălțimea dungilor. Ce se întâmplă dacă adaugi border-radius: 40px?', 'Change the colors and the stripe height. What happens if you add border-radius: 40px?', 'Поменяй цвета и высоту полос. Что будет, если добавить border-radius: 40px?'),
    hint: L('Culorile pot fi nume (red) sau coduri (#ff8a00). Încearcă și height: 60px.', 'Colors can be names (red) or codes (#ff8a00). Try height: 60px too.', 'Цвета можно задавать именами (red) или кодами (#ff8a00). Попробуй и height: 60px.'),
    variants: {
      css: {
        view: 'page',
        scaffold: '<div class="stripe s1"></div><div class="stripe s2"></div><div class="stripe s3"></div><div class="stripe s4"></div><div class="stripe s5"></div><div class="stripe s6"></div>',
        code: String.raw`.stripe {
  height: 40px;
}
.s1 { background: red; }
.s2 { background: orange; }
.s3 { background: gold; }
.s4 { background: green; }
.s5 { background: dodgerblue; }
.s6 { background: purple; }`,
      },
    },
  },

  /* ---------------- Games ---------------- */
  {
    id: 'game-welcome', domain: 'games', levels: ['kids', 'teens', 'adults'],
    title: L('Mesajul de început', 'The opening message', 'Стартовое сообщение'),
    summary: L('Spune „Bun venit!” jucătorului.', 'Say “Welcome!” to the player.', 'Скажи игроку «Добро пожаловать!»'),
    intro: L(
      'Orice joc începe cu un mesaj. Alege un limbaj și scrie textul care apare pe ecran. Același proiect merge în mai multe limbaje.',
      'Every game starts with a message. Pick a language and write the text that appears on the screen. The same project works in several languages.',
      'Любая игра начинается с сообщения. Выбери язык и напиши текст, который появится на экране. Один и тот же проект работает на разных языках.'),
    task: L('Schimbă mesajul cu al tău, apoi rulează. Apoi încearcă același proiect în alt limbaj.', 'Change the message to your own, then run it. Then try the same project in another language.', 'Измени сообщение на своё и запусти. Потом попробуй тот же проект на другом языке.'),
    hint: L('Textul stă între ghilimele. Pe server scrie fără ă, â, î, ș, ț, ca să se afișeze corect.', 'Text goes between quotes. On the server, write without special letters like ă or ș so it shows correctly.', 'Текст пишется в кавычках. На сервере пиши без букв ă, â, î, ș, ț, чтобы всё отобразилось правильно.'),
    variants: {
      html: { view: 'page', code: String.raw`<h1>Bun venit în joc!</h1>
<p>Apasă Start ca să începi.</p>
<button>Start</button>` },
      js: { view: 'text', code: String.raw`console.log("Bun venit în joc!");` },
      php: { view: 'text', code: String.raw`<?php
echo "Bun venit in joc!\n";` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    System.out.println("Bun venit in joc!");
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>

int main() {
  std::cout << "Bun venit in joc!" << std::endl;
  return 0;
}` },
    },
  },
  {
    id: 'game-dice', domain: 'games', levels: ['kids', 'teens', 'adults'],
    title: L('Dă cu zarul', 'Roll the dice', 'Брось кубик'),
    summary: L('Alege un număr la întâmplare, de la 1 la 6.', 'Pick a random number from 1 to 6.', 'Выбери случайное число от 1 до 6.'),
    intro: L(
      'Jocurile au nevoie de întâmplare. Calculatorul poate alege un număr la nimereală: așa faci un zar.',
      'Games need chance. The computer can pick a random number: that is how you make dice.',
      'Играм нужна случайность. Компьютер может выбрать случайное число — так делают кубик.'),
    task: L('Dă cu zarul de trei ori. Cum faci un zar cu 20 de fețe?', 'Roll the dice three times. How do you make a 20-sided die?', 'Брось кубик три раза. Как сделать кубик с 20 гранями?'),
    hint: L('Numărul 6 spune câte fețe are zarul. Schimbă-l în 20.', 'The number 6 says how many sides the die has. Change it to 20.', 'Число 6 — это количество граней кубика. Замени его на 20.'),
    variants: {
      js: { view: 'text', code: String.raw`const dice = Math.floor(Math.random() * 6) + 1;
console.log("Ai dat: " + dice);` },
      php: { view: 'text', code: String.raw`<?php
$dice = rand(1, 6);
echo "Ai dat: " . $dice . "\n";` },
      java: { view: 'text', code: String.raw`import java.util.Random;

public class Main {
  public static void main(String[] args) {
    Random random = new Random();
    int dice = random.nextInt(6) + 1;
    System.out.println("Ai dat: " + dice);
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>
#include <cstdlib>
#include <ctime>

int main() {
  srand(time(0));
  int dice = rand() % 6 + 1;
  std::cout << "Ai dat: " << dice << std::endl;
  return 0;
}` },
    },
  },

  /* ---------------- Science ---------------- */
  {
    id: 'sci-celsius', domain: 'science', levels: ['teens', 'adults'],
    title: L('Din Celsius în Fahrenheit', 'From Celsius to Fahrenheit', 'Из Цельсия в Фаренгейт'),
    summary: L('Transformă temperaturi cu o formulă.', 'Convert temperatures with a formula.', 'Переводи температуру по формуле.'),
    intro: L(
      'Un calculator poate aplica o formulă pentru oricâte numere. Aici folosim F = C × 9 ÷ 5 + 32 pentru temperaturile de la 0 la 40.',
      'A computer can apply a formula to as many numbers as you like. Here we use F = C × 9 ÷ 5 + 32 for temperatures from 0 to 40.',
      'Компьютер может применить формулу к любому количеству чисел. Здесь мы используем F = C × 9 ÷ 5 + 32 для температур от 0 до 40.'),
    task: L('Schimbă 0 în -40 în rândul cu for. La ce temperatură sunt Celsius și Fahrenheit egale?', 'Change 0 to -40 in the for line. At what temperature are Celsius and Fahrenheit equal?', 'Замени 0 на -40 в строке с for. При какой температуре Цельсий и Фаренгейт равны?'),
    hint: L('Începe de la -40 și uită-te la primul rând afișat: cele două numere sunt la fel.', 'Start from -40 and look at the first line printed: the two numbers are the same.', 'Начни с -40 и посмотри на первую выведенную строку: оба числа одинаковы.'),
    variants: {
      js: { view: 'text', code: String.raw`for (let c = 0; c <= 40; c += 10) {
  const f = c * 9 / 5 + 32;
  console.log(c + " C = " + f + " F");
}` },
      php: { view: 'text', code: String.raw`<?php
for ($c = 0; $c <= 40; $c += 10) {
  $f = $c * 9 / 5 + 32;
  echo $c . " C = " . $f . " F\n";
}` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    for (int c = 0; c <= 40; c += 10) {
      double f = c * 9.0 / 5 + 32;
      System.out.println(c + " C = " + f + " F");
    }
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>

int main() {
  for (int c = 0; c <= 40; c += 10) {
    double f = c * 9.0 / 5 + 32;
    std::cout << c << " C = " << f << " F" << std::endl;
  }
  return 0;
}` },
    },
  },
  {
    id: 'sci-fall', domain: 'science', levels: ['teens', 'adults'],
    title: L('Căderea liberă', 'Free fall', 'Свободное падение'),
    summary: L('Calculează cât cade o piatră în câteva secunde.', 'Calculate how far a stone falls in a few seconds.', 'Посчитай, как далеко падает камень за несколько секунд.'),
    intro: L(
      'Un obiect care cade parcurge d = ½ × g × t² metri; g este aproximativ 9,8 pe Pământ. Calculatorul face socoteala pentru fiecare secundă.',
      'A falling object travels d = ½ × g × t² meters; g is about 9.8 on Earth. The computer does the sum for each second.',
      'Падающее тело проходит d = ½ × g × t² метров; на Земле g примерно 9,8. Компьютер считает для каждой секунды.'),
    task: L('Schimbă 5 secunde în 10. Apoi schimbă g cu 1.6 (Luna).', 'Change 5 seconds to 10. Then change g to 1.6 (the Moon).', 'Замени 5 секунд на 10. Потом замени g на 1.6 (Луна).'),
    hint: L('Pe Lună g este aproximativ 1,6, iar pe Marte aproximativ 3,7.', 'On the Moon g is about 1.6 and on Mars about 3.7.', 'На Луне g примерно 1,6, а на Марсе около 3,7.'),
    variants: {
      js: { view: 'text', code: String.raw`const g = 9.8;
for (let t = 1; t <= 5; t++) {
  const d = 0.5 * g * t * t;
  console.log(t + " s: " + d.toFixed(1) + " m");
}` },
      php: { view: 'text', code: String.raw`<?php
$g = 9.8;
for ($t = 1; $t <= 5; $t++) {
  $d = 0.5 * $g * $t * $t;
  printf("%d s: %.1f m\n", $t, $d);
}` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    double g = 9.8;
    for (int t = 1; t <= 5; t++) {
      double d = 0.5 * g * t * t;
      System.out.printf("%d s: %.1f m%n", t, d);
    }
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <cstdio>

int main() {
  double g = 9.8;
  for (int t = 1; t <= 5; t++) {
    double d = 0.5 * g * t * t;
    printf("%d s: %.1f m\n", t, d);
  }
  return 0;
}` },
    },
  },

  /* ---------------- Stories ---------------- */
  {
    id: 'story-hero', domain: 'stories', levels: ['kids', 'teens'],
    title: L('Eroul poveștii', 'The hero of the story', 'Герой истории'),
    summary: L('Folosește variabile ca să schimbi eroul.', 'Use variables to change the hero.', 'Используй переменные, чтобы изменить героя.'),
    intro: L(
      'O variabilă este o cutie cu nume în care ții o valoare. Schimbi valoarea și povestea se schimbă singură.',
      'A variable is a named box that holds a value. Change the value and the story changes by itself.',
      'Переменная — это коробка с именем, в которой лежит значение. Меняешь значение, и история меняется сама.'),
    task: L('Pune alt nume, altă vârstă și altă putere.', 'Pick another name, another age and another power.', 'Выбери другое имя, другой возраст и другую силу.'),
    hint: L('Textul stă între ghilimele, numerele nu au ghilimele.', 'Text goes in quotes, numbers do not.', 'Текст пишется в кавычках, числа — без кавычек.'),
    variants: {
      html: { view: 'page', code: String.raw`<h1>Povestea Lunei</h1>
<p>Luna are 11 ani și poate vorbi cu păsările.</p>` },
      js: { view: 'text', code: String.raw`const name = "Luna";
const age = 11;
const power = "poate vorbi cu pasarile";
console.log("Eroina noastra se numeste " + name + ".");
console.log("Are " + age + " ani si " + power + ".");` },
      php: { view: 'text', code: String.raw`<?php
$name = "Luna";
$age = 11;
$power = "poate vorbi cu pasarile";
echo "Eroina noastra se numeste " . $name . ".\n";
echo "Are " . $age . " ani si " . $power . ".\n";` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    String name = "Luna";
    int age = 11;
    String power = "poate vorbi cu pasarile";
    System.out.println("Eroina noastra se numeste " + name + ".");
    System.out.println("Are " + age + " ani si " + power + ".");
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>
#include <string>

int main() {
  std::string name = "Luna";
  int age = 11;
  std::string power = "poate vorbi cu pasarile";
  std::cout << "Eroina noastra se numeste " << name << "." << std::endl;
  std::cout << "Are " << age << " ani si " << power << "." << std::endl;
  return 0;
}` },
    },
  },
  {
    id: 'story-choice', domain: 'stories', levels: ['teens', 'adults'],
    title: L('Alege-ți aventura', 'Choose your adventure', 'Выбери своё приключение'),
    summary: L('Povestea ia alt drum după alegerea ta.', 'The story takes a new path by your choice.', 'История идёт по-разному в зависимости от выбора.'),
    intro: L(
      'Cu if și else programul alege ce să facă. Schimbi variabila choice și povestea merge pe alt drum.',
      'With if and else the program decides what to do. Change the variable choice and the story takes another path.',
      'С помощью if и else программа решает, что делать. Меняешь переменную choice, и история идёт другим путём.'),
    task: L('Schimbă alegerea din 1 în 2. Adaugă un al treilea drum.', 'Change the choice from 1 to 2. Add a third path.', 'Измени выбор с 1 на 2. Добавь третий путь.'),
    hint: L('Pentru un al treilea drum folosește else if.', 'For a third path use else if.', 'Для третьего пути используй else if.'),
    variants: {
      js: { view: 'text', code: String.raw`const choice = 1;

if (choice === 1) {
  console.log("Intri in pestera. E intuneric, dar auzi o apa curgand.");
} else {
  console.log("Urci pe munte. De sus vezi tot orasul.");
}` },
      php: { view: 'text', code: String.raw`<?php
$choice = 1;

if ($choice == 1) {
  echo "Intri in pestera. E intuneric, dar auzi o apa curgand.\n";
} else {
  echo "Urci pe munte. De sus vezi tot orasul.\n";
}` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    int choice = 1;

    if (choice == 1) {
      System.out.println("Intri in pestera. E intuneric, dar auzi o apa curgand.");
    } else {
      System.out.println("Urci pe munte. De sus vezi tot orasul.");
    }
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>

int main() {
  int choice = 1;

  if (choice == 1) {
    std::cout << "Intri in pestera. E intuneric, dar auzi o apa curgand." << std::endl;
  } else {
    std::cout << "Urci pe munte. De sus vezi tot orasul." << std::endl;
  }
  return 0;
}` },
    },
  },

  /* ---------------- Maths ---------------- */
  {
    id: 'math-table', domain: 'math', levels: ['kids', 'teens', 'adults'],
    title: L('Tabla înmulțirii', 'The times table', 'Таблица умножения'),
    summary: L('Afișează tabla înmulțirii cu o buclă.', 'Print a times table with a loop.', 'Выведи таблицу умножения в цикле.'),
    intro: L(
      'O buclă repetă instrucțiuni. Aici calculatorul scrie 10 rânduri fără să le scrii tu pe fiecare.',
      'A loop repeats instructions. Here the computer writes 10 lines without you typing each one.',
      'Цикл повторяет инструкции. Здесь компьютер пишет 10 строк, и тебе не нужно набирать каждую.'),
    task: L('Schimbă 7 în alt număr. Fă tabla până la 12.', 'Change 7 to another number. Extend the table to 12.', 'Замени 7 на другое число. Продли таблицу до 12.'),
    hint: L('Variabila n este numărul tău. Pentru 12 rânduri schimbă 10 în 12.', 'The variable n is your number. For 12 lines change 10 to 12.', 'Переменная n — твоё число. Для 12 строк замени 10 на 12.'),
    variants: {
      js: { view: 'text', code: String.raw`const n = 7;
for (let i = 1; i <= 10; i++) {
  console.log(n + " x " + i + " = " + n * i);
}` },
      php: { view: 'text', code: String.raw`<?php
$n = 7;
for ($i = 1; $i <= 10; $i++) {
  echo $n . " x " . $i . " = " . ($n * $i) . "\n";
}` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    int n = 7;
    for (int i = 1; i <= 10; i++) {
      System.out.println(n + " x " + i + " = " + (n * i));
    }
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>

int main() {
  int n = 7;
  for (int i = 1; i <= 10; i++) {
    std::cout << n << " x " << i << " = " << n * i << std::endl;
  }
  return 0;
}` },
    },
  },
  {
    id: 'math-sum', domain: 'math', levels: ['teens', 'adults'],
    title: L('Suma până la 100', 'The sum up to 100', 'Сумма до 100'),
    summary: L('Adună numerele de la 1 la 100 în două feluri.', 'Add the numbers from 1 to 100 in two ways.', 'Сложи числа от 1 до 100 двумя способами.'),
    intro: L(
      'Calculatorul adună numerele una câte una cu o buclă, apoi verificăm cu formula n × (n + 1) ÷ 2. Se spune că micul Gauss a găsit formula la școală.',
      'The computer adds the numbers one by one with a loop, then we check with the formula n × (n + 1) ÷ 2. The story goes that young Gauss found it at school.',
      'Компьютер складывает числа по одному в цикле, а потом мы проверяем формулой n × (n + 1) ÷ 2. Рассказывают, что маленький Гаусс нашёл её ещё в школе.'),
    task: L('Schimbă 100 în 1000. Dau cele două metode același rezultat?', 'Change 100 to 1000. Do both methods give the same result?', 'Замени 100 на 1000. Дают ли оба способа один результат?'),
    hint: L('Formula merge pentru orice număr n.', 'The formula works for any number n.', 'Формула работает для любого числа n.'),
    variants: {
      js: { view: 'text', code: String.raw`const n = 100;
let sum = 0;
for (let i = 1; i <= n; i++) {
  sum += i;
}
console.log("Cu bucla: " + sum);
console.log("Cu formula: " + n * (n + 1) / 2);` },
      php: { view: 'text', code: String.raw`<?php
$n = 100;
$sum = 0;
for ($i = 1; $i <= $n; $i++) {
  $sum += $i;
}
echo "Cu bucla: " . $sum . "\n";
echo "Cu formula: " . ($n * ($n + 1) / 2) . "\n";` },
      java: { view: 'text', code: String.raw`public class Main {
  public static void main(String[] args) {
    int n = 100;
    int sum = 0;
    for (int i = 1; i <= n; i++) {
      sum += i;
    }
    System.out.println("Cu bucla: " + sum);
    System.out.println("Cu formula: " + (n * (n + 1) / 2));
  }
}` },
      cpp: { view: 'text', code: String.raw`#include <iostream>

int main() {
  int n = 100;
  int sum = 0;
  for (int i = 1; i <= n; i++) {
    sum += i;
  }
  std::cout << "Cu bucla: " << sum << std::endl;
  std::cout << "Cu formula: " << n * (n + 1) / 2 << std::endl;
  return 0;
}` },
    },
  },
];

export const projectById = (id) => PROJECTS.find((p) => p.id === id);
export const domainById = (id) => DOMAINS.find((d) => d.id === id);
export const projectsOf = (domainId) => PROJECTS.filter((p) => p.domain === domainId);
export const languagesOf = (project) => LANGUAGE_ORDER.filter((l) => project.variants[l]);
