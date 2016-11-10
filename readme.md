## WSagger 

Розробляється як інструментарій для тестування вебсокет-серверів. Хоч і не видно, чому би треба було обмежитись виключно тестуванням на вебсокеті, але щось більше поки не розроблене (цей же формат опису сценаріїв я використовую для юніт-тестів під python, але там зроблено поки небагато).
   

Необхідними видаються наступні можливості для користувача:

* деревовидне меню тестів в графічному-інтерфейсі (поки що — тільки вибір по імені файла на кнопці "Choose file");

* вибір з набору стандартних даних для тестування (поки що — тільки вибір REST-сервера, сокет-сервера і користувача);

* можливість вводу параметрів тестування вручну (є);

* запуск тесту з переглядом проміжних результатів у flow-вікні (є);

* запуск набору тестів з консолі (є);

* зручності для написання сценаріїв перевірки взаємодії декількох клієнтів (є, але треба ще чимало з тим доробити).
   
В ідеалі, хотілось би використовувати цей інструмент "кумулятивно" — писати тестові сценарії для поточної інтерактивної відладки системи і одразу ж додавати їх в систему для подальшого пакетного контролю. Зрештою, так його й вже використовую :-)


### Устаеновка

    $ git clone gogs@git.gbksoft.net:dzikovsky-po/wsagger.git
    $ cd wsagger
    $ npm install


### Мова опису сценаріїв

Схема синтаксису (JSON schema) живе в файлі schema/wsagger.schema.json

Запуск валідатора для файлу зі сценарієм: ./v <filename>. Наприклад:

./v chat.sc/delete_group_message.wsagger.json   

Поля файла сценаріїв:
 
    REST_     // варінти REST-сервера для конектів
    server_   // варінти сокет-сервера для конектів
    user_     // варінти користувачів для конектів
    scenarios // список сценаріїв
    

Один сценарій — це: 

    name
    parameters
    flow      // список кроків


Один крок сценарію — це обʼєкт з полями:

    action          // варіянти: "connect", "request" (відправка в сокет) або "apply" (виклик функції)
    data            // список параметрів для action-виклику
    waitForResponse       // очікування після виконання кроку
    waitForResponse.delay // час
    waitForResponse.data  // спсиок обʼєктів, які поивнні прийти у сокет

В полях data і waitForResponse.data допустимо використовувати шаблони:

    {{key}}     // підставновка значення з parameters[key]

В полях waitForResponse.data також допустимо використовувати шаблони:
    
    {{!key}}    // присвоєння в parameters[key] значення з відповідного елементу waitForResponse.data


### Браузерний інтерфейс

Живе в index.html, файли сценаріїв можна завантажувати туди як з мережі, так і локальні.


### Консольні виклики

Запуск сценарію на виконання: ./r <filename> <server> <user>. Наприклад:

    ./r chat.sc/connect_with_token.wsagger.json dev 2   
    // успіх 
    
    ./r chat.sc/delete_group_message.wsagger.json dev 2 
    // помилка (дебаг-інфу треба вивести якось краще)

Параметри <server> і <user> — це ключі з відповідних обʼєктів server_ і user_ у файлі сценарію.

Запуск на виконання всіх сценаріїв з деякого каталогу : ./ra <dirname> <server> <user>. Наприклад:

    ./ra chat.sc dev 2

    > ...   
    > numSuccess: 14   
    > numFail: 3   



