export default function Header() {
  return (
    <header className="bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-40">
      <h2 className="font-semibold text-lg">Painel SofiaTech</h2>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Olá, Usuário</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="rounded-full w-10 h-10"
        />
      </div>
    </header>
  );
}
