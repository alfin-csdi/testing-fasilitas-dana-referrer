import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import UserTable from '../../components/users/UserTable';
import UserForm from '../../components/users/UserForm';
import { Modal } from 'antd';
import { userApi } from '@/services/users.service';


const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => userApi.getUsers(page, pageSize)
  });

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      <UserTable
        users={data?.data || []}
        loading={isLoading}
        totalUsers={Number(data?.headers?.['x-pagination-total'] || 0)}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <Modal
        title="Create User"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <UserForm
          onSubmit={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default UsersPage;
