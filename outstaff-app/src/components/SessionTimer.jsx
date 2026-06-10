export default function SessionTimer({ remaining }) {

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const formatted =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-xl text-sm font-medium">
  ⏳ Session expires in {formatted}
</div>
  );
}