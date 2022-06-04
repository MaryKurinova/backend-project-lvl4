// @ts-check

module.exports = {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        edit: {
          success: 'Статус успешно изменён',
          error: 'Не удалось изменить статус',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Не удалось удалить статус',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          success: 'Пользователь успешно изменён',
          error: 'Не удалось изменить пользователя',
        },
        delete: {
          success: 'Пользователь успешно удалён',
          error: 'Не удалось удалить пользователя',
        },
        accessDenied: 'Вы не можете редактировать или удалять другого пользователя',
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        edit: {
          success: 'Задача успешно изменена',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
          error: 'Не удалось удалить задачу',
        },
        accessDenied: 'Задачу может удалить только её автор',
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        edit: {
          success: 'Метка успешно изменена',
          error: 'Не удалось изменить метку',
        },
        delete: {
          success: 'Метка успешно удалена',
          error: 'Не удалось удалить метку',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      form: {
        author: 'Автор',
        createdAt: 'Дата создания',
        creatByUser: 'Только мои задачи',
        name: 'Наименование',
        id: 'ID',
        firstName: 'Имя',
        fullName: 'Полное имя',
        lastName: 'Фамилия',
        email: 'Email',
        password: 'Пароль',
        description: 'Описание',
        status: 'Статус',
        executor: 'Исполнитель',
        statusId: 'Статус',
        executorId: 'Исполнитель',
        labels: 'Метки',
        label: 'Метка',
      },
      manage: {
        create: 'Создать',
        edit: 'Изменить',
        delete: 'Удалить',
        submit: 'Войти',
        show: 'Показать',
        createTask: 'Создать задачу',
        createLabel: 'Создать метку',
        createStatus: 'Создать статус',
        createUser: 'Сохранить',
      },
      title: {
        filter: 'Фильтр',
        createTask: 'Создание задачи',
        createLabel: 'Создание метки',
        createStatus: 'Создание статуса',
        createUser: 'Регистрация',
        editTask: 'Изменение задачи',
        editLabel: 'Изменение метки',
        editStatus: 'Изменение статуса',
        editUser: 'Изменение пользователя',
        signIn: 'Вход',
      },
      info: {
        notAnyLabels: 'Метки отсутствуют',
        notAnyTasks: 'Задачи отсутствуют',
        notAnyStatuses: 'Статусы отсутствуют',
        nonExecutor: 'Не назначен',
        notAnyUsers: 'Пользователи отсутствуют',
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
