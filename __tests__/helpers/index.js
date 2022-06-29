// @ts-check

export default async (app, data) => {
  const responseSignIn = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: {
      data,
    },
  });

  // после успешной аутентификации получаем куки из ответа,
  // они понадобятся для выполнения запросов на маршруты требующие
  // предварительную аутентификацию

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  return { [name]: value };
};
