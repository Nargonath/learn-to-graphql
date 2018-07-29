module.exports = {
  login,
  signup,
};

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.db.mutation.createUser(
    {
      data: { ...args, password },
    },
    `{ id }`
  );

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return { token, user };
}
