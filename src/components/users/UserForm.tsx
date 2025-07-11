import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/users.service';
import { UserFormData, UserType } from '@/types/users.types';


interface UserFormProps {
  initialData?: UserType | null;
  onSubmit: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      message.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSubmit();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormData> }) =>
      userApi.updateUser(id, data),
    onSuccess: () => {
      message.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onSubmit();
    },
  });

  const handleSubmit = (values: UserFormData) => {
    if (initialData) {
      updateUserMutation.mutate({ id: initialData.id, data: values });
    } else {
      createUserMutation.mutate(values);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData || {}}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input the email!' },
          { type: 'email', message: 'Please input a valid email!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: 'Please select the gender!' }]}
      >
        <Select>
          <Select.Option value="male">Male</Select.Option>
          <Select.Option value="female">Female</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select the status!' }]}
      >
        <Select>
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Inactive</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item className="flex justify-end">
        <Button type="primary" htmlType="submit" loading={createUserMutation.isPending || updateUserMutation.isPending}>
          {initialData ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;