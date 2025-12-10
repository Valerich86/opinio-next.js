export default function UserName({email}:{email?:string}) {
  return (
    <div className="w-full">
      <div className="py-2 px-4 rounded-3xl bg-secondary w-auto">
        <h1 className="text-xl text-light italic">{email}</h1>
      </div>
    </div>
  );
}
