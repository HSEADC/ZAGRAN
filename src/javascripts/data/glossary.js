/* словарь */
window.TERMS = [
  {
    id: "apostille",
    term: "Apostille",
    full: "APOSTILLE",
    ru: "Апостиль",
    short: "Штамп, который делает российский документ действительным за границей.",
    body: "Ставится на аттестат или его перевод, чтобы документ признавали за рубежом без консульской легализации. Работает между странами Гаагской конвенции.",
    example: "Многие вузы просят аттестат с апостилем и нотариальным переводом.",
    articles: ["apostille"]
  },
  {
    id: "bachelor",
    term: "Bachelor",
    full: "BACHELOR’S DEGREE",
    ru: "Бакалавриат",
    short: "Первая ступень высшего образования, 3–4 года.",
    body: "В Европе обычно 3 года (180 ECTS), в США, Канаде и части Азии — 4 года.",
    example: "BSc — бакалавр наук, BA — бакалавр искусств и гуманитарных наук.",
    articles: []
  },
  {
    id: "blocked",
    term: "Blocked account",
    full: "SPERRKONTO",
    ru: "Блокированный счёт",
    short: "Счёт с деньгами на год жизни. Нужен для визы в Германию.",
    body: "Деньги кладут один раз, а снимать можно только фиксированную сумму в месяц. Сумма для визы — около €11 904 на год.",
    example: "Посольство Германии просит подтвердить блокированный счёт до выдачи визы.",
    articles: ["payments", "student-visa"],
    alias: "sperrkonto"
  },
  {
    id: "campus-france",
    term: "Campus France",
    full: "ÉTUDES EN FRANCE",
    ru: "Кампюс Франс",
    short: "Платформа для подачи в вузы Франции из-за рубежа.",
    body: "Для многих стран заявка в французский вуз идёт через «Études en France», а не напрямую.",
    example: "В PSL подача через Campus France — с 1 октября по 15 декабря.",
    articles: []
  },
  {
    id: "conditional-offer",
    term: "Conditional offer",
    full: "CONDITIONAL OFFER",
    ru: "Условное зачисление",
    short: "Тебя берут, если выполнишь условия к сроку.",
    body: "Условием бывает итоговый балл аттестата или результат IELTS. Если условие выполнено — оффер становится безусловным.",
    example: "В Оксфорде нужно подтвердить английский к 31 июля.",
    articles: []
  },
  {
    id: "deadline",
    term: "Deadline",
    full: "APPLICATION DEADLINE",
    ru: "Дедлайн",
    short: "Последний день подачи документов. Обычно с января по май.",
    body: "Бывает рекомендуемый (advisory) и финальный. Для студентов не из ЕС сроки обычно раньше.",
    example: "UvA: рекомендуемый срок — 1 апреля, финальный — 1 мая.",
    articles: []
  },
  {
    id: "ects",
    term: "ECTS",
    full: "EUROPEAN CREDIT TRANSFER SYSTEM",
    ru: "Кредиты ECTS",
    short: "Единица учебной нагрузки в Европе.",
    body: "Один учебный год — 60 ECTS. По ним считают объём программы и плату, например в Испании — за кредит.",
    example: "В Universitat de Barcelona не-ЕС платят €82 за кредит.",
    articles: []
  },
  {
    id: "early-action",
    term: "Early Action",
    full: "EARLY ACTION / REGULAR DECISION",
    ru: "Ранняя подача",
    short: "Два раунда подачи в американские вузы.",
    body: "Early Action — ранний срок (обычно ноябрь), Regular — основной (январь).",
    example: "MIT: Early Action — начало ноября, Regular Action — 1 января.",
    articles: []
  },
  {
    id: "foundation",
    term: "Foundation",
    full: "FOUNDATION YEAR",
    ru: "Подготовительный год",
    short: "Год подготовки, если для поступления не хватает аттестата.",
    body: "Нужен, если аттестата не хватает для прямого поступления: мало лет школы, нет нужных предметов или языка.",
    example: "Свои Foundation-программы есть у King's College London и UCL.",
    articles: []
  },
  {
    id: "gpa",
    term: "GPA",
    full: "GRADE POINT AVERAGE",
    ru: "Средний балл",
    short: "Средняя оценка по шкале 0–4.",
    body: "Используют в США, Канаде и части Европы. Российские оценки переводят по таблицам самого вуза или специальных сервисов.",
    example: "Пятёрка в аттестате — это ещё не автоматически 4.0.",
    articles: []
  },
  {
    id: "ielts",
    term: "IELTS",
    full: "INTERNATIONAL ENGLISH LANGUAGE TESTING SYSTEM",
    ru: "Экзамен IELTS",
    short: "Баллы от 0 до 9, результат действует 2 года.",
    body: "Четыре части: listening, reading, writing, speaking. Вузы ставят минимум и по общему баллу, и по каждой части.",
    example: "UvA: 6.5 в целом и не ниже 6.0 в каждой части.",
    articles: ["ielts-russia"]
  },
  {
    id: "master",
    term: "Master",
    full: "MASTER’S DEGREE",
    ru: "Магистратура",
    short: "Вторая ступень, 1–2 года.",
    body: "Поступают после бакалавриата. В Европе обычно 60–120 ECTS.",
    example: "MSc, MA, MBA — разные виды магистерских степеней.",
    articles: []
  },
  {
    id: "motivation",
    term: "Motivation letter",
    full: "MOTIVATION LETTER",
    ru: "Мотивационное письмо",
    short: "Эссе на 1–2 страницы о том, почему тебе нужна именно эта программа.",
    body: "В Европе обычно привязано к конкретной программе. Главное — конкретика и связь с учебным планом.",
    example: "Одно и то же письмо во все вузы комиссия заметит сразу.",
    articles: []
  },
  {
    id: "nostrification",
    term: "Nostrification",
    full: "NOSTRIFIKACE",
    ru: "Нострификация",
    short: "Признание российского аттестата или диплома в другой стране.",
    body: "В Чехии и ряде других стран без признания аттестата нельзя зачислиться в вуз.",
    example: "Brno University of Technology просит свидетельство о признании (nostrifikační doložka).",
    articles: ["apostille"]
  },
  {
    id: "numerus-fixus",
    term: "Numerus fixus",
    full: "NUMERUS FIXUS",
    ru: "Ограниченный набор",
    short: "Программа с лимитом мест и ранним отбором.",
    body: "В Нидерландах на такие программы подают до 15 января. Число попыток ограничено.",
    example: "TU Delft: Aerospace Engineering и Computer Science and Engineering — с лимитом.",
    articles: []
  },
  {
    id: "parcoursup",
    term: "Parcoursup",
    full: "PARCOURSUP",
    ru: "Платформа Parcoursup",
    short: "Национальная система поступления в бакалавриат.",
    body: "Через неё подают выпускники из ЕС и часть иностранцев. Сроки — январь–март.",
    example: "Европейцы подают в L1 Sorbonne через Parcoursup с 19 января по 12 марта.",
    articles: []
  },
  {
    id: "personal-statement",
    term: "Personal Statement",
    full: "PERSONAL STATEMENT",
    ru: "Личное эссе",
    short: "Одно эссе на все вузы в британской заявке.",
    body: "Пишется в UCAS и отправляется сразу во все выбранные вузы — поэтому без названий конкретных университетов.",
    example: "Главное — интерес к предмету и что ты уже сделал в нём.",
    articles: []
  },
  {
    id: "sat",
    term: "SAT",
    full: "SCHOLASTIC ASSESSMENT TEST",
    ru: "Тест SAT",
    short: "Математика и чтение, 400–1600 баллов.",
    body: "Нужен для части вузов США. В Европе почти не требуется.",
    example: "Большинство европейских бакалавриатов принимают без SAT.",
    articles: []
  },
  {
    id: "scholarship",
    term: "Scholarship",
    full: "SCHOLARSHIP",
    ru: "Стипендия",
    short: "Деньги, которые не нужно возвращать.",
    body: "Покрывает часть платы, всё обучение или ещё и жизнь. Бывает за оценки или по доходу семьи.",
    example: "Tampere и Aalto дают стипендии, снижающие плату для не-ЕС.",
    articles: []
  },
  {
    id: "semesterbeitrag",
    term: "Semesterbeitrag",
    full: "SEMESTER CONTRIBUTION",
    ru: "Семестровый взнос",
    short: "Обязательный взнос за семестр в Германии.",
    body: "Это не плата за обучение: деньги идут студенческому союзу, иногда — на проездной.",
    example: "LMU — €97, Universität Hamburg — €402 за семестр.",
    articles: []
  },
  {
    id: "studielink",
    term: "Studielink",
    full: "STUDIELINK",
    ru: "Портал Studielink",
    short: "Единая система регистрации в нидерландские вузы.",
    body: "Через неё регистрируют заявку, а документы потом загружают на портал вуза.",
    example: "Для numerus fixus регистрация в Studielink — до 15 января.",
    articles: []
  },
  {
    id: "studienkolleg",
    term: "Studienkolleg",
    full: "STUDIENKOLLEG",
    ru: "Штудиенколлег",
    short: "Немецкий аналог Foundation.",
    body: "Год подготовки с экзаменом в конце, если аттестат не даёт прямого доступа к немецкому вузу.",
    example: "У LMU есть отдельное руководство для поступающих в Studienkolleg.",
    articles: []
  },
  {
    id: "toefl",
    term: "TOEFL",
    full: "TEST OF ENGLISH AS A FOREIGN LANGUAGE",
    ru: "Тест TOEFL",
    short: "Чаще всего — iBT, раньше 0–120 баллов.",
    body: "С 21 января 2026 TOEFL iBT перешёл на новую шкалу — уточняй, какую принимает вуз.",
    example: "UC Berkeley: TOEFL 90 по старой шкале или 4.5 по новой.",
    articles: ["ielts-russia"]
  },
  {
    id: "transcript",
    term: "Transcript",
    full: "TRANSCRIPT OF RECORDS",
    ru: "Выписка с оценками",
    short: "Список всех предметов и оценок.",
    body: "Для поступления после школы — аттестат с приложением, после вуза — приложение к диплому.",
    example: "Почти всегда нужен перевод, иногда — апостиль.",
    articles: []
  },
  {
    id: "tuition",
    term: "Tuition fee",
    full: "TUITION FEE",
    ru: "Плата за обучение",
    short: "Только учёба — без жилья и взносов.",
    body: "Для студентов из ЕС и не из ЕС ставки часто отличаются в разы.",
    example: "TU Delft: €19 906 в год для не-ЕС.",
    articles: []
  },
  {
    id: "ucas",
    term: "UCAS",
    full: "UNIVERSITIES AND COLLEGES ADMISSIONS SERVICE",
    ru: "Система UCAS",
    short: "Одна анкета — до пяти вузов Великобритании.",
    body: "Два основных срока: 15 октября (Оксфорд, Кембридж, медицина) и январь — для остальных.",
    example: "Imperial и UCL: 13 января 2027.",
    articles: []
  },
  {
    id: "uni-assist",
    term: "uni-assist",
    full: "UNI-ASSIST",
    ru: "Сервис uni-assist",
    short: "Сервис, который проверяет иностранные документы.",
    body: "Многие немецкие вузы принимают заявки иностранцев только через uni-assist. Платно, около €75.",
    example: "Freie Universität Berlin просит VPD от uni-assist.",
    articles: []
  },
  {
    id: "universitaly",
    term: "Universitaly",
    full: "UNIVERSITALY",
    ru: "Портал Universitaly",
    short: "Обязательная регистрация для визы в Италию.",
    body: "После приёма в вуз нужно оформить pre-enrolment на портале — без него визу не дадут.",
    example: "Срок предзаписи — до 30 июня 2026.",
    articles: ["unis-for-russians"]
  }
];
