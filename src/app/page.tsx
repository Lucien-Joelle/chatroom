// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../services/api';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      try {
        setLoading(true);
        setError('');
        
        // 调用登录API
        const result = await loginUser(username, password);
        
        // 保存用户名到localStorage (用于显示)
        if (result && result.user) {
          localStorage.setItem('username', result.user.nickname || result.user.username);
        }
        
        // 跳转到聊天页面
        router.push('/chat');
      } catch (err) {
        setError(err instanceof Error ? err.message : '登录失败，请检查用户名和密码');
        console.error('登录失败:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="set-name-container">
      <div className="set-name-card">
        <h1 className="set-name-title">用户登录</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="set-name-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="用户名"
            className="name-input"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            className="name-input"
            required
            disabled={loading}
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <div className="login-help">
          <p>示例用户: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
