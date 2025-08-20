// src/services/api.ts
import { ApiResponse, Message, RoomPreviewInfo } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 获取认证令牌
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// 通用请求函数
async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  const data = await response.json() as ApiResponse<T>;
  
  if (data.code !== 0) {
    throw new Error(data.message || '请求失败');
  }
  
  return data;
}

// 用户注册
export async function registerUser(username: string, password: string, nickname?: string) {
  const response = await request<{ id: number; username: string; nickname: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, nickname }),
  });
  
  return response.data;
}

// 用户登录
export async function loginUser(username: string, password: string) {
  const response = await request<{ user: { id: number; username: string; nickname: string }; token: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  // 保存令牌到本地存储
  if (typeof window !== 'undefined' && response.data?.token) {
    localStorage.setItem('authToken', response.data.token);
  }
  
  return response.data;
}

// 用户登出
export function logoutUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

// 创建房间
export async function createRoom(roomName: string): Promise<{ roomId: number; roomName: string; createdBy: string }> {
  const response = await request<{ roomId: number; roomName: string; createdBy: string }>('/api/room/add', {
    method: 'POST',
    body: JSON.stringify({ roomName }),
  });
  
  return response.data!;
}

// 获取房间列表
export async function getRoomList(): Promise<RoomPreviewInfo[]> {
  const response = await request<RoomPreviewInfo[]>('/api/room/list');
  return response.data || [];
}

// 删除房间
export async function deleteRoom(roomId: number): Promise<boolean> {
  await request<null>(`/api/room/delete?roomId=${roomId}`, {
    method: 'DELETE',
  });
  
  return true;
}

// 发送消息
export async function sendMessage(roomId: number, content: string): Promise<Message> {
  const response = await request<Message>(`/api/room/message/send?roomId=${roomId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  
  return response.data!;
}

// 获取房间消息列表
export async function getRoomMessages(roomId: number): Promise<Message[]> {
  const response = await request<Message[]>(`/api/room/message/list?roomId=${roomId}`);
  return response.data || [];
}