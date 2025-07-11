import React, { useState } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Space,
  List,
  Avatar,
  message,
  Tag,
  Tooltip,
} from "antd";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PostType } from "@/types/posts.types";
import { CommentType } from "@/types/comments.type";
import { postsApi } from "@/services/posts.service";
import { useUser } from "@/context/UserContext";
import { formatApiErrors } from "@/utils/apiError";

interface PostCardProps {
  post: PostType;
  isOwner?: boolean;
  onEdit?: (post: PostType) => void;
}

const { TextArea } = Input;

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isOwner,
  onEdit,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentForm] = Form.useForm();
  const queryClient = useQueryClient();
  const { selectedUser } = useUser();

  const { data: commentsData, isLoading: isLoadingComments } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => postsApi.getPostComments(post.id),
    enabled: showComments,
  });

  
  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
    if (selectedUser) {
      queryClient.invalidateQueries({ queryKey: ['my-posts', selectedUser.id] });
    }
  };

  const deletePostMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      message.success("Post deleted successfully");
      invalidateQueries()
    },
    onError: (error: any) => {
      const formErrors = formatApiErrors(error);
      if (formErrors.general) {
        message.error(formErrors.general);
      }
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: number;
      data: { name: string; email: string; body: string };
    }) => postsApi.createComment(postId, data),
    onSuccess: () => {
      message.success("Comment added successfully");
      commentForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
    },
    onError: (error: any) => {
      const formErrors = formatApiErrors(error);
      commentForm.setFields(
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

  const deleteCommentMutation = useMutation({
    mutationFn: postsApi.deleteComment,
    onSuccess: () => {
      message.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
    },
    onError: (error: any) => {
      const formErrors = formatApiErrors(error);
      if (formErrors.general) {
        message.error(formErrors.general);
      }
    },
  });

  const handleDeletePost = () => {
    Modal.confirm({
      title: "Delete Post",
      content: "Are you sure you want to delete this post?",
      onOk: () => deletePostMutation.mutate(post.id),
    });
  };

  const handleAddComment = async (values: { body: string }) => {
    if (!selectedUser) {
      message.error("Please select a profile first");
      return;
    }

    createCommentMutation.mutate({
      postId: post.id,
      data: {
        name: selectedUser.name,
        email: selectedUser.email,
        body: values.body,
      },
    });
  };

  const handleDeleteComment = (commentId: number) => {
    Modal.confirm({
      title: "Delete Comment",
      content: "Are you sure you want to delete this comment?",
      onOk: () => deleteCommentMutation.mutate(commentId),
    });
  };

  const isUserComment = (comment: CommentType) => {
    return selectedUser?.email === comment.email;
  };

  return (
    <Card
      className="mb-4 shadow-sm hover:shadow-md transition-shadow"
      actions={[
        <Button
          key="comments"
          icon={<CommentOutlined />}
          onClick={() => setShowComments(!showComments)}
        >
          Comments
        </Button>,
        isOwner && (
          <Button
            key="edit"
            icon={<EditOutlined />}
            onClick={() => onEdit?.(post)}
          >
            Edit
          </Button>
        ),
        isOwner && (
          <Button
            key="delete"
            icon={<DeleteOutlined />}
            danger
            onClick={handleDeletePost}
          >
            Delete
          </Button>
        ),
      ].filter(Boolean)}
    >
      <Card.Meta
        title={post.title}
        description={
          <div className="whitespace-pre-wrap mt-2">{post.body}</div>
        }
      />

      {showComments && (
        <div className="mt-4">
          <Form form={commentForm} onFinish={handleAddComment} className="mb-4">
            <Form.Item
              name="body"
              rules={[{ required: true, message: "Please write your comment" }]}
              help={selectedUser ? undefined : "Select a profile to comment"}
            >
              <TextArea
                rows={3}
                placeholder="Write a comment..."
                disabled={!selectedUser}
              />
            </Form.Item>
            <Form.Item className="mb-0 text-right">
              <Button
                type="primary"
                htmlType="submit"
                disabled={!selectedUser}
                loading={createCommentMutation.isPending}
              >
                Add Comment
              </Button>
            </Form.Item>
          </Form>

          <List
            loading={isLoadingComments}
            dataSource={commentsData?.data || []}
            renderItem={(comment: CommentType) => (
              <List.Item
                className="border-b last:border-b-0"
                actions={[
                  isUserComment(comment) && (
                    <Button
                      key="delete"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteComment(comment.id)}
                    />
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Space>
                      <span>{comment.name}</span>
                      {isUserComment(comment) && (
                        <Tooltip title="Your comment">
                          <Tag color="blue">You</Tag>
                        </Tooltip>
                      )}
                    </Space>
                  }
                  description={
                    <div>
                      <div className="text-gray-500 text-sm mb-1">
                        {comment.email}
                      </div>
                      <div>{comment.body}</div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default PostCard;
