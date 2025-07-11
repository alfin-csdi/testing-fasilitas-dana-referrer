import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layout, Menu, Avatar, Drawer, Button, Dropdown } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { MenuItemType } from "@/types/users.types";

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const router = useRouter();
  const { selectedUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    setMenuItems([
      { key: "users", label: <Link href="/users">Users</Link> },
      { key: "todos", label: <Link href="/todos">My Todos</Link> },
      {
        key: "posts",
        label: "Posts",
        children: [
          { key: "all-posts", label: <Link href="/posts/all">All Posts</Link> },
          { key: "my-posts", label: <Link href="/posts/my">My Posts</Link> },
        ],
      },
    ]);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const profileMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: selectedUser ? (
            <div className="px-2 py-1">
              <div className="font-semibold truncate max-w-[200px]">
                {selectedUser.name}
              </div>
              <div className="text-sm text-gray-500 truncate max-w-[200px]">
                {selectedUser.email}
              </div>
              <div className="text-xs text-gray-400 mt-1 capitalize">
                {selectedUser.status} · {selectedUser.gender}
              </div>
            </div>
          ) : (
            <div className="px-2 py-1">
              <div className="text-gray-500">No profile selected</div>
            </div>
          ),
        },
      ]}
    />
  );

  return (
    <AntHeader className="bg-white shadow px-4 lg:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center flex-1 gap-4">
        <Link href="/" className="text-xl font-bold mr-4 flex-shrink-0">
          Todos & Posts or Blog Website!
        </Link>

        <div className="flex items-center gap-2">
          <a
            className="bg-red-800 text-white p-2 rounded text-sm"
            href="http://localhost:3001/fasilitas-dana"
          >
            Ke Fasilitas Dana (Direct)
          </a>

          <a
            className="bg-blue-800 text-white p-2 rounded text-sm"
            href="http://localhost:3001/fasilitas-dana"
            target="_blank"
            rel="noopener"
          >
            Ke Fasilitas Dana (New Tab)
          </a>
        </div>

        <div className="hidden md:flex gap-6 text-lg items-center">
          {menuItems.map((item) =>
            item.children ? (
              <Dropdown
                key={item.key}
                menu={{ items: item.children }}
                trigger={["hover"]}
              >
                <span className="cursor-pointer hover:text-blue-600">
                  {item.label}
                </span>
              </Dropdown>
            ) : (
              <Link
                key={item.key}
                href={`/${item.key}`}
                className="hover:text-blue-600"
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Dropdown
          overlay={profileMenu}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="hidden sm:block text-right max-w-[200px]">
              {selectedUser ? (
                <div className="font-medium truncate">{selectedUser.name}</div>
              ) : (
                <div className="text-gray-500">No profile selected</div>
              )}
            </div>
            <Avatar
              icon={<UserOutlined />}
              className={
                selectedUser?.status === "active"
                  ? "bg-green-500"
                  : "bg-gray-400"
              }
            />
          </div>
        </Dropdown>
        {isMobile && (
          <Button
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
          />
        )}
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        style={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[router.pathname.split("/")[1] || "users"]}
          className="border-0"
          items={menuItems}
        />
      </Drawer>
    </AntHeader>
  );
};

export default Header;
