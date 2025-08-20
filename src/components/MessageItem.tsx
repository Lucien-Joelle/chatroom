// src/components/MessageItem.tsx
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
  isSelf: boolean;
  showTime: boolean; // 新增属性，用于控制是否显示时间
}

export default function MessageItem({ message, isSelf, showTime }: MessageItemProps) {
  // 将时间戳转换为可读时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* 如果需要显示时间，则在消息上方显示时间 */}
      {showTime && (
        <div className="message-time-divider">
          <span>{formatTime(message.time)}</span>
        </div>
      )}
      
      <div className={`message-item ${isSelf ? 'self' : 'other'}`}>
        {!isSelf && (
          <div className="avatar">
            {message.sender.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="message-content">
          {!isSelf && <div className="sender-name">{message.sender}</div>}
          <div className="content-bubble">
            <p>{message.content}</p>
          </div>
        </div>
      </div>
    </>
  );
}
