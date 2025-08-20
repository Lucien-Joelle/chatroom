// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // 保存用户名到localStorage
      localStorage.setItem('username', username);
      router.push('/chat');
    }
  };

  return (
    <div className="set-name-container">
      <div className="set-name-card">
        <h1 className="set-name-title">设置聊天昵称</h1>
        <form onSubmit={handleSubmit} className="set-name-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入您的昵称"
            className="name-input"
            required
          />
          <button type="submit" className="submit-button">
            进入聊天室
          </button>
        </form>
      </div>
    </div>
  );
}
