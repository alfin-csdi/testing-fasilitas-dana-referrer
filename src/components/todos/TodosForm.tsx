import React from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi, CreateTodoData } from '@/services/todos.service';
import { AddTodoType, TodoStatus, TodoType } from '@/types/todos.type';
import { useUser } from '@/context/UserContext';
import dayjs from 'dayjs';

interface TodoFormProps {
  initialData?: TodoType | null;
  onSubmit: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { selectedUser } = useUser();

  const createTodoMutation = useMutation({
    mutationFn: (data: CreateTodoData) => {
      if (!selectedUser?.id) throw new Error('No user selected');
      return todoApi.createTodo(selectedUser.id, data);
    },
    onSuccess: () => {
      message.success('Todo created successfully');
      queryClient.invalidateQueries({ queryKey: ['todos', selectedUser?.id] });
      onSubmit();
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTodoData> }) =>
      todoApi.updateTodo(id, data),
    onSuccess: () => {
      message.success('Todo updated successfully');
      queryClient.invalidateQueries({ queryKey: ['todos', selectedUser?.id] });
      onSubmit();
    },
  });

  const handleSubmit = (values: AddTodoType) => {

    console.log(values)
    const todoData: CreateTodoData = {
      title: values.title,
      due_on: values.due_on.toISOString(),
      status: values.status,
    };

    if (initialData) {
      updateTodoMutation.mutate({ id: initialData.id, data: todoData });
    } else {
      createTodoMutation.mutate(todoData);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={
        initialData
          ? {
              ...initialData,
              due_on: dayjs(initialData.due_on),
            }
          : {
              status: TodoStatus.Pending,
              due_on: dayjs(),
            }
      }
      onFinish={handleSubmit}
    >
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="due_on"
        label="Due Date"
        rules={[{ required: true, message: 'Please select the due date!' }]}
      >
        <DatePicker className="w-full" showTime />
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select the status!' }]}
      >
        <Select>
          <Select.Option value={TodoStatus.Pending}>Pending</Select.Option>
          <Select.Option value={TodoStatus.Completed}>Completed</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item className="flex justify-end mb-0">
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={createTodoMutation.isPending || updateTodoMutation.isPending}
        >
          {initialData ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TodoForm;