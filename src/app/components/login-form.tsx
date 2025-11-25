

export default function LoginForm() {
  return (
    <form className="py-10 px-5 rounded-t-md bg-primary w-[80%] md:w-1/3 z-10 flex flex-col gap-5">
      <h1 className={`font-800 text-center text-2xl text-zinc-800`}>Вход</h1>
      <fieldset>
        <label htmlFor="email" className="italic text-sm">Почта</label>
        <input
          className="w-full rounded-md border-none p-2 outline-zinc-400 text-sm bg-white placeholder:opacity-90"
          id="email"
          type="email"
          name="email"
          placeholder="введите адрес электронной почты"
          autoFocus
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="password" className="italic text-sm">Пароль</label>
        <input
          className="w-full rounded-md border-none p-2 outline-zinc-400 text-sm bg-white placeholder:opacity-90"
          id="password"
          type="password"
          name="password"
          placeholder="введите пароль"
          required
        />
      </fieldset>
      <input
        className="w-full rounded-md bg-accent text-white h-10 hover:opacity-85"
        type="submit"
        value={"Войти"}
      />
    </form>
  );
}
