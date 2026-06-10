function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="h-screen flex items-center justify-center text-3xl">
      Welcome {user?.name}
    </div>
  );
}

export default Dashboard;