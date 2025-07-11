import React, { useState } from 'react';
import { Table, Button, Space, Modal, message, Tooltip, Breakpoint } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserType, UserStatus } from '@/types/users.types';
import { userApi } from '@/services/users.service';
import { useUser } from '@/context/UserContext';
import UserForm from './UserForm';

interface UserTableProps {
  users: UserType[];
  loading: boolean;
  totalUsers: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  totalUsers,
  page,
  pageSize,
  onPageChange,
}) => {
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { selectedUser, setSelectedUser } = useUser();

  const deleteUserMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      message.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSetAsProfile = (user: UserType) => {
    if (user.status === UserStatus.Inactive) {
      message.error('Cannot set inactive user as profile');
      return;
    }
    setSelectedUser(user);
    message.success(`${user.name} set as profile successfully`);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: UserType) => (
        <div className="flex items-center min-w-[150px]">
          {record.id === selectedUser?.id && (
            <Tooltip title="Current Profile">
              <UserOutlined className="mr-2 text-blue-500" />
            </Tooltip>
          )}
          {text}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      className: 'min-w-[200px]',
      responsive: ['md'] as Breakpoint[],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      className: 'min-w-[100px]',
      responsive: ['lg'] as Breakpoint[],
      render: (text: string) => text.charAt(0).toUpperCase() + text.slice(1),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: 'min-w-[100px]',
      responsive: ['sm'] as Breakpoint[],
      render: (status: string) => (
        <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      // fixed: 'right',
      className: 'min-w-[200px]',
      render: (_: unknown, record: UserType) => (
        <Space wrap className="flex flex-wrap gap-2">
          <Tooltip 
            title={record.status === UserStatus.Inactive ? 'Cannot set inactive user as profile' : 
                   record.id === selectedUser?.id ? 'Current profile' : 
                   'Set as profile'}
          >
            <Button
              icon={<UserOutlined />}
              className={record.id === selectedUser?.id ? 'bg-blue-50' : ''}
              onClick={() => handleSetAsProfile(record)}
              disabled={record.id === selectedUser?.id || record.status === UserStatus.Inactive}
            >
              <span className="hidden sm:inline">
                {record.id === selectedUser?.id ? 'Current Profile' : 'Set as Profile'}
              </span>
            </Button>
          </Tooltip>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              setIsModalOpen(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Delete User',
                content: 'Are you sure you want to delete this user?',
                onOk: () => deleteUserMutation.mutate(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: totalUsers,
          onChange: onPageChange,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
          className: 'responsive-pagination',
        }}
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        footer={null}
      >
        <UserForm
          initialData={editingUser}
          onSubmit={() => {
            setIsModalOpen(false);
            setEditingUser(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default UserTable;