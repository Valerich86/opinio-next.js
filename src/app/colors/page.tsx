export default function Colors() {
  return (
    <div className="flex gap-5 w-screen h-screen justify-center items-center bg-gray-400">
      <div className="flex flex-col items-center justify-center">
        <p className="italic">Основной 1</p>
        <div className="bg-primary w-25 h-25 rounded-sm"></div>
        <p>#FBFFF1</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="italic">Основной 2</p>
        <div className="bg-secondary w-25 h-25 rounded-sm"></div>
        <p>#3066BE</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="italic">Нейтральный</p>
        <div className="bg-neutral w-25 h-25 rounded-sm"></div>
        <p>#3C3744</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="italic">Акцентный 1</p>
        <div className="bg-accent w-25 h-25 rounded-sm"></div>
        <p>#090C9B</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="italic">Акцентный 2</p>
        <div className="bg-[#EF4444] w-25 h-25 rounded-sm"></div>
        <p>#EF4444</p>
      </div>
    </div>
  );
}
