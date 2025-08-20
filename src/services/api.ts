// src/services/api.ts
import { ApiResponse, Message, RoomPreviewInfo } from '../types';

const API_BASE_URL = 'https://chatroom.zjuxlab.com';

// 通用请求函数
async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);
  const data = await response.json() as ApiResponse<T>;
  
  if (data.code !== 0) {
    throw new Error(data.message || '请求失败');
  }
  
  return data;
}

// 创建房间
export async function createRoom(user: string, roomName: string): Promise<number> {
  const response = await request<{ roomId: number }>('/api/room/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, roomName }),
  });
  
  return response.data?.roomId || 0;
}

// 获取房间列表
export async function getRoomList(): Promise<RoomPreviewInfo[]> {
  const response = await request<{ rooms: RoomPreviewInfo[] }>('/api/room/list');
  return response.data?.rooms || [];
}

// 删除房间
export async function deleteRoom(user: string, roomId: number): Promise<boolean> {
  await request<null>('/api/room/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, roomId }),
  });
  
  return true;
}

// 添加消息
export async function addMessage(roomId: number, content: string, sender: string): Promise<boolean> {
  await request<null>('/api/message/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomId, content, sender }),
  });
  
  return true;
}

// 获取房间消息列表
export async function getRoomMessages(roomId: number): Promise<Message[]> {
  // 添加查询参数
  const url = new URL(`${API_BASE_URL}/api/room/message/list`);
  url.searchParams.append('roomId', roomId.toString());
  
  const response = await fetch(url.toString());
  const data = await response.json() as ApiResponse<{ messages: Message[] }>;
  
  if (data.code !== 0) {
    throw new Error(data.message || '获取消息失败');
  }
  
  return data.data?.messages || [];
}

// 获取消息更新
export async function getMessageUpdates(roomId: number, sinceMessageId: number): Promise<Message[]> {
  // 添加查询参数
  const url = new URL(`${API_BASE_URL}/api/room/message/getUpdate`);
  url.searchParams.append('roomId', roomId.toString());
  url.searchParams.append('sinceMessageId', sinceMessageId.toString());
  
  const response = await fetch(url.toString());
  const data = await response.json() as ApiResponse<{ messages: Message[] }>;
  
  if (data.code !== 0) {
    throw new Error(data.message || '获取消息更新失败');
  }
  
  return data.data?.messages || [];
}