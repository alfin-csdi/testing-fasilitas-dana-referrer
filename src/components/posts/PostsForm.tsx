import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PostType } from '@/types/posts.types';
import { postsApi } from '@/services/posts.service';
import { useUser } from '@/context/UserContext';
import { formatApiErrors } from '@/utils/apiError';

const { TextArea } = Input;

interface PostFormProps {
  initialData?: PostType | null;
  onSubmit: () => void;
}

interface PostFormData {
  title: string;
  body: string;
}

export const PostForm: React.FC<PostFormProps> = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { selectedUser } = useUser();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    if (selectedUser) {
      queryClient.invalidateQueries({ queryKey: ['my-posts', selectedUser.id] });
    }
  };

  const createPostMutation = useMutation({
    mutationFn: (data: PostFormData) => 
      selectedUser ? postsApi.createPost(selectedUser.id, data) : Promise.reject('No user selected'),
    onSuccess: () => {
      message.success('Post created successfully');
      invalidateQueries();
      onSubmit();
    },
    onError: (error: any) => {
      const formErrors = formatApiErrors(error);
      form.setFields(
        Object.entries(formErrors).map(([field, message]) => ({
          name: field,
          errors: [message],
        }))
      );
      if (formErrors.general) {
        message.error(formErrors.general);
      }
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: PostFormData) => 
      initialData ? postsApi.updatePost(initialData.id, data) : Promise.reject('No post selected'),
    onSuccess: () => {
      message.success('Post updated successfully');
      invalidateQueries();
      onSubmit();
    },
    onError: (error: any) => {
      const formErrors = formatApiErrors(error);
      form.setFields(
        Object.entries(formErrors).map(([field, message]) => ({
          name: field,
          errors: [message],
        }))
      );
      if (formErrors.general) {
        message.error(formErrors.general);
      }
    },
  });

  const handleSubmit = (values: PostFormData) => {
    if (initialData) {
      updatePostMutation.mutate(values);
    } else {
      createPostMutation.mutate(values);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData?? undefined}
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
        name="body"
        label="Content"
        rules={[{ required: true, message: 'Please input the content!' }]}
      >
        <TextArea rows={6} />
      </Form.Item>

      <Form.Item className="mb-0 text-right">
        <Button
          type="primary"
          htmlType="submit"
          loading={createPostMutation.isPending || updatePostMutation.isPending}
        >
          {initialData ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PostForm;