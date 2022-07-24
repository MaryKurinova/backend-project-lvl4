// @ts-check

export default async (app, data) => {
  const responseSignIn = await app.inject({
    method: 'POST',
    url: app.reverse('session'),
    payload: {
      data,
    },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  return { [name]: value };
};
