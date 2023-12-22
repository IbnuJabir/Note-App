import { Link } from 'react-router-dom';
const NoPage = () => {
  return (
      <div className="page-not-found">
      <h1>404: Page Not Found.</h1>
      <Link to="/AllNotes"> Go to Notes >> </Link>
      </div>
  );
};

export default NoPage;