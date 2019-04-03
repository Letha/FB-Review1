# FB-Review

  Демонстрационный сайт функционирует по ссылке: https://letha.github.io/FB-Review1/.
  
  ----
  (Для FunBox: файл по первому этапу - "level1.pdf". Если общение продолжилось бы, готов заняться покрытием кода тестами и внедрением Redux.)
  
  ----
  Применённый стек: npm, webpack, babel, react, css через модули, yandex maps JS API.
  
  Файлы разделены по директориям:
  - 'dist' - файлы готового сайта;
  - 'src' - исходные файлы (до обработки через webpack);
  - 'docs' - дубль 'dist' для gitpages.
  ----
  ----
  Далее инструкция к развёртыванию проекта и описание его функционала...
  ----
  Развёртывание
  ----
  Проект на продакшн (готовый) находится в дирректории "dist" (файлы самодостаточны и готовы к запуску).

  Чтобы развернуть рабочую среду проекта на локальной машине:
  - установить Node.js (так как нужен npm);
  - скопировать файлы из репозитория (лишние только в папке "docs");
  - в текущей дирректории проекта в командной строке прописать: <b>npm install</b>;
  - конфигурационный файл webpack заранее прописан должным образом.
  
  Можно вносить изменения в дирректории "src", кроме названия файла "index.js", а также во вложенных дирректориях.
  
  Можно вносить изменения в дирректории "dist", кроме файла "main.js".
  
  После внесения изменений при запуске через консоль (в текущей дирректории проекта) команды <b>npm run bundle</b> webpack соответственно пересоберёт в дирректории "dist" файл "main.js" - на этом всё, готово.
  
  (Также можно активировать локальный сервер (порт 9000, с автообновлением) с проектом: <b>npm run server</b>. При изменении режима webpack на "development" обновление работало быстрее.)
  
  ----
  Функционал
  ----
  Функционал сайта (связка React и Яндекс-карты):
  - создание именованных меток маршрута с определением точного адреса (в балуне метки);
  - автоматическая последовательная прорисовка маршрута прямыми линиями между созданными метками;
  - удаление отдельно выбранной метки;
  - перемещение отдельно выбранной метки перетаскиванием на карте;
  - перемещение записи о метке в списке перетаскиванием (с автоматической мгновенной перерисовкой маршрута).
  
  (Метки создаюстся в центре текущих координат карты.)
