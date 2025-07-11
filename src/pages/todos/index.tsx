import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { List, Tag, Button, Modal, Space, message, Tooltip } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from "@ant-design/icons";
import { todoApi } from "@/services/todos.service";
import { useUser } from "@/context/UserContext";
import { TodoStatus, TodoType } from "@/types/todos.type";
import { useRouter } from "next/router";
import TodoForm from "@/components/todos/TodosForm";


const TodosPage = () => {
  const { selectedUser } = useUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["todos", selectedUser?.id, page, pageSize],
    queryFn: () => 
      selectedUser?.id 
        ? todoApi.getUserTodos(selectedUser.id, page, pageSize)
        : Promise.resolve({
            data: [],
            headers: { 'x-pagination-total': '0' },
            status: 200,
            statusText: 'OK',
            config: {} as any
          }),
    enabled: !!selectedUser?.id,
});

  const deleteTodoMutation = useMutation({
    mutationFn: todoApi.deleteTodo,
    onSuccess: () => {
      message.success('Todo deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['todos', selectedUser?.id] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TodoStatus }) =>
      todoApi.updateTodo(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', selectedUser?.id] });
    },
  });

  useEffect(() => {
    if (!selectedUser) {
      setIsModalOpen(true);
    }
  }, [selectedUser]);

  const handleRedirect = () => {
    setIsModalOpen(false);
    router.push("/users");
  };

  const handleStatusChange = (todo: TodoType) => {
    const newStatus = todo.status === TodoStatus.Completed 
      ? TodoStatus.Pending 
      : TodoStatus.Completed;
    
    updateStatusMutation.mutate({ 
      id: todo.id, 
      status: newStatus 
    });
  };

  const handleDelete = (todo: TodoType) => {
    Modal.confirm({
      title: 'Delete Todo',
      content: 'Are you sure you want to delete this todo?',
      onOk: () => deleteTodoMutation.mutate(todo.id),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todos</h1>
        {selectedUser && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Todo
          </Button>
        )}
      </div>

      <List
        dataSource={data?.data || []}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: Number(data?.headers?.['x-pagination-total'] || 0),
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        renderItem={(todo) => (
          <List.Item
            actions={[
              <Space key={`actions-${todo.id}`}>
                <Tooltip title="Toggle Status">
                  <Button
                    icon={<CheckOutlined />}
                    type={todo.status === TodoStatus.Completed ? 'primary' : 'default'}
                    onClick={() => handleStatusChange(todo)}
                  />
                </Tooltip>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingTodo(todo);
                    setIsCreateModalOpen(true);
                  }}
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(todo)}
                />
              </Space>
            ]}
          >
            <List.Item.Meta
              title={todo.title}
              description={
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Tag color={todo.status === TodoStatus.Completed ? "green" : "orange"}>
                    {todo.status}
                  </Tag>
                  <span>Due: {new Date(todo.due_on).toLocaleString()}</span>
                </div>
              }
            />
          </List.Item>
        )}
        loading={isLoading}
      />

      <Modal
        title="Select Profile"
        open={isModalOpen}
        onOk={handleRedirect}
        onCancel={handleRedirect}
        okText="Select Profile"
        cancelText="Cancel"
      >
        <p>You need to select a profile before viewing todos.</p>
      </Modal>

      <Modal
        title={editingTodo ? 'Edit Todo' : 'Create Todo'}
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          setEditingTodo(null);
        }}
        footer={null}
      >
        <TodoForm
          initialData={editingTodo}
          onSubmit={() => {
            setIsCreateModalOpen(false);
            setEditingTodo(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default TodosPage;