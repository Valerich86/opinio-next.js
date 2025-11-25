

export default function RegisterForm() {
  return (
    <form className="py-10 px-5 rounded-t-md bg-primary w-[80%] md:w-1/3 z-10 flex flex-col gap-5">
      <h1 className={`font-800 text-center text-2xl text-zinc-800`}>Регистрация</h1>
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
        <label htmlFor="password1" className="italic text-sm">Пароль</label>
        <input
          className="w-full rounded-md border-none p-2 outline-zinc-400 text-sm bg-white placeholder:opacity-90"
          id="password1"
          type="password"
          name="password1"
          placeholder="введите пароль"
          required
        />
      </fieldset>
      <fieldset>
        <label htmlFor="password2" className="italic text-sm">Подтверждение пароля</label>
        <input
          className="w-full rounded-md border-none p-2 outline-zinc-400 text-sm bg-white placeholder:opacity-90"
          id="password2"
          type="password"
          name="password2"
          placeholder="повторите пароль"
          required
        />
      </fieldset>
      <input
        className="w-full rounded-md bg-accent text-white h-10 hover:opacity-85"
        type="submit"
        value={"Зарегистрироваться"}
      />
    </form>
  );
}
