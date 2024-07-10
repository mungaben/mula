import CreateSpecialCodePage from './create';
import AdminLayout from './layout';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin dashboard.</p>

      <div>
        <CreateSpecialCodePage/>
      </div>
    </div>
  );
};

export default AdminPage;
