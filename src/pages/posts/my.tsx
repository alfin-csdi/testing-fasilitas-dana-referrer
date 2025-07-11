import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Modal, Empty, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { postsApi } from '@/services/posts.service';
import { PostType } from '@/types/posts.types';
import { useUser } from '@/context/UserContext';
import PostForm from '@/components/posts/PostsForm';
import PostCard from '@/components/posts/PostsCard';

const MyPostsPage = () => {
  const router = useRouter();
  const { selectedUser } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [isRedirectModalOpen, setIsRedirectModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!selectedUser && !isRedirectModalOpen) {
      setIsRedirectModalOpen(true);
    }
  }, [selectedUser, isRedirectModalOpen]);

  const { data, isLoading } = useQuery({
    queryKey: ['my-posts', selectedUser?.id, page, pageSize],
    queryFn: () => 
      selectedUser ? postsApi.getUserPosts(selectedUser.id, page, pageSize) : null,
    enabled: !!selectedUser,
  });

  const handleEditPost = (post: PostType) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleRedirect = () => {
    router.push('/users');
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {!selectedUser ? (
        <Modal
          title="Select Profile"
          open={isRedirectModalOpen}
          onOk={handleRedirect}
          onCancel={handleRedirect}
          okText="Select Profile"
          cancelText="Cancel"
        >
          <p>You need to select a profile before viewing your posts.</p>
        </Modal>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Posts</h1>
              <p className="text-gray-500 mt-1">
                Posts by {selectedUser.name}
              </p>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Post
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="loading-spinner" />
              </div>
            ) : data?.data.length === 0 ? (
              <Empty 
                description={
                  <div>
                    <p>You havent created any posts yet</p>
                    <Button 
                      type="primary" 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-4"
                    >
                      Create your first post
                    </Button>
                  </div>
                } 
              />
            ) : (
              data?.data.map((post: PostType) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isOwner={true}
                  onEdit={handleEditPost}
                />
              ))
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={Number(data?.headers?.['x-pagination-total'] || 0)}
              onChange={handlePageChange}
              showSizeChanger
              showTotal={(total) => `Total ${total} items`}
            />
          </div>

          {/* Create Post Modal */}
          <Modal
            title="Create Post"
            open={isCreateModalOpen}
            onCancel={() => setIsCreateModalOpen(false)}
            footer={null}
            destroyOnClose
          >
            <PostForm onSubmit={() => setIsCreateModalOpen(false)} />
          </Modal>

          {/* Edit Post Modal */}
          <Modal
            title="Edit Post"
            open={isEditModalOpen}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingPost(null);
            }}
            footer={null}
            destroyOnClose
          >
            <PostForm
              initialData={editingPost}
              onSubmit={() => {
                setIsEditModalOpen(false);
                setEditingPost(null);
              }}
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default MyPostsPage;