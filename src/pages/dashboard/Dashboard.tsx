import Stats from "./component/Stats";
import Trans from "./component/Trans";

const Dashboard = () => {
  return (
    <div className="min-h-screen ">
      <div className="max-w-5xl mx-auto">
        <Stats />
        <Trans />
      </div>
    </div>
  );
};

export default Dashboard;
