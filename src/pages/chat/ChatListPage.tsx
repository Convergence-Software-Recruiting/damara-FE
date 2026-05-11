import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Input } from "../../shared/components/ui/input";
import { Button } from "../../shared/components/ui/button";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../shared/components/ui/avatar";
import { getImageUrl } from "../../shared/utils/imageUrl";
import {
  getUserChatRooms,
  getMessages,
  sendMessage,
  markAllMessagesAsRead,
  getChatRoomById,
  deleteChatRoom,
  getChatRoomByPostId,
} from "../../features/chat/api/chatApi";
import { getPostsByStudentId } from "../../features/group-buy/api/groupBuyApi";
import { toast } from "sonner";
import { STORAGE_KEYS } from "../../shared/constants/storageKeys";

interface ChatRoom {
  id: string;
  postId: string;
  post?: { id: string; title: string; authorId: string };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
  sender?: { id: string; nickname: string; avatarUrl?: string };
}

const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ChatListPage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLLIElement>(null);
  const currentUserId = localStorage.getItem(STORAGE_KEYS.USER_ID) || "";
  const roomIdFromQuery = searchParams.get("roomId");

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showTradeSummary, setShowTradeSummary] = useState(false);

  const fetchChatRooms = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const res = await getUserChatRooms(currentUserId);
      let rooms: ChatRoom[] = (res.data.chatRooms || []).map((room: any) => ({
        id: room.id,
        postId: room.postId,
        post: room.post,
        lastMessage: room.lastMessage?.content || "",
        lastMessageTime: room.lastMessage?.createdAt
          ? formatTime(room.lastMessage.createdAt)
          : "",
        unreadCount: room.unreadCount || 0,
      }));

      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const myPostsRes = await getPostsByStudentId(
            user.studentId || user.id
          );
          const myPosts = myPostsRes.data || [];

          const authorRooms = await Promise.all(
            myPosts.map(async (post: any) => {
              try {
                const chatRoomRes = await getChatRoomByPostId(post.id);
                const chatRoom = chatRoomRes.data;
                const chatRoomId = chatRoom.id || chatRoom.chatRoomId;
                const existingRoom = rooms.find(
                  (r) => r.id === chatRoomId || r.postId === post.id
                );
                if (existingRoom) return null;

                let lastMessage = chatRoom.lastMessage?.content || "";
                let lastMessageTime = "";
                let unreadCount = 0;
                try {
                  const messagesRes = await getMessages(chatRoomId, 1, 0);
                  const msgs =
                    messagesRes.data.messages || messagesRes.data || [];
                  if (msgs.length > 0) {
                    const latestMsg = msgs[0];
                    lastMessage = latestMsg.content || "";
                    lastMessageTime = latestMsg.createdAt
                      ? formatTime(latestMsg.createdAt)
                      : "";
                    unreadCount = msgs.filter(
                      (msg: Message) =>
                        !msg.isRead && msg.senderId !== currentUserId
                    ).length;
                  }
                } catch (e) {
                  console.error("메시지 조회 실패:", e);
                }

                return {
                  id: chatRoomId,
                  postId: post.id,
                  post: {
                    id: post.id,
                    title: post.title,
                    authorId: post.authorId || post.userId,
                  },
                  lastMessage,
                  lastMessageTime,
                  unreadCount,
                };
              } catch {
                return null;
              }
            })
          );

          const validAuthorRooms = authorRooms.filter(
            (room): room is ChatRoom => room !== null
          );
          rooms = [...rooms, ...validAuthorRooms];
        }
      } catch (e) {
        console.error("게시자인 게시글의 채팅방 조회 실패:", e);
      }

      setChatRooms(rooms);

      if (roomIdFromQuery && !selectedRoom) {
        const targetRoom = rooms.find((room) => room.id === roomIdFromQuery);
        if (targetRoom) {
          setSelectedRoom(targetRoom);
        } else {
          try {
            const roomRes = await getChatRoomById(roomIdFromQuery);
            const roomData = roomRes.data;
            setSelectedRoom({
              id: roomData.id,
              postId: roomData.postId,
              post: roomData.post,
              lastMessage: roomData.lastMessage?.content || "",
              lastMessageTime: roomData.lastMessage?.createdAt
                ? formatTime(roomData.lastMessage.createdAt)
                : "",
              unreadCount: roomData.unreadCount || 0,
            });
          } catch (e) {
            console.error("채팅방 조회 실패:", e);
          }
        }
      }
    } catch (e) {
      console.error("채팅방 목록 로드 실패:", e);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchChatRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, roomIdFromQuery]);

  useEffect(() => {
    if (!selectedRoom && currentUserId) {
      const interval = setInterval(() => {
        fetchChatRooms();
      }, 5000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom, currentUserId]);

  useEffect(() => {
    if (!selectedRoom) return;
    const fetchMessages = async () => {
      try {
        const res = await getMessages(selectedRoom.id);
        let loadedMessages: Message[] =
          res.data.messages || res.data || [];

        const isAuthor = selectedRoom.post?.authorId === currentUserId;
        if (isAuthor) {
          loadedMessages = loadedMessages.map((msg: Message) => ({
            ...msg,
            isRead: msg.senderId === currentUserId ? true : msg.isRead,
          }));
        }

        setMessages(loadedMessages);
        if (currentUserId) {
          try {
            await markAllMessagesAsRead(selectedRoom.id, currentUserId);
          } catch (e) {
            console.error("읽음 처리 실패:", e);
          }
        }
      } catch (e) {
        console.error("메시지 로드 실패:", e);
        setMessages([]);
      }
    };
    fetchMessages();

    const interval = setInterval(() => {
      if (selectedRoom && currentUserId) {
        getMessages(selectedRoom.id)
          .then((res) => {
            let newMessages: Message[] =
              res.data.messages || res.data || [];
            const isAuthor = selectedRoom.post?.authorId === currentUserId;
            if (isAuthor) {
              newMessages = newMessages.map((msg: Message) => ({
                ...msg,
                isRead: msg.senderId === currentUserId ? true : msg.isRead,
              }));
            }
            setMessages((prev) => {
              const prevIds = new Set(prev.map((m) => m.id));
              const hasNewMessages = newMessages.some(
                (m) => !prevIds.has(m.id)
              );
              if (hasNewMessages) return newMessages;
              return prev.map((oldMsg) => {
                const updatedMsg = newMessages.find(
                  (m) => m.id === oldMsg.id
                );
                return updatedMsg
                  ? { ...oldMsg, isRead: updatedMsg.isRead }
                  : oldMsg;
              });
            });
          })
          .catch((e) => {
            console.error("메시지 업데이트 실패:", e);
          });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedRoom, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !currentUserId) return;
    try {
      setSending(true);
      const res = await sendMessage({
        chatRoomId: selectedRoom.id,
        senderId: currentUserId,
        content: newMessage,
        messageType: "text",
      });

      const isAuthor = selectedRoom.post?.authorId === currentUserId;
      const newMsg: Message = {
        id: res.data?.id || Date.now().toString(),
        chatRoomId: selectedRoom.id,
        senderId: currentUserId,
        content: newMessage,
        messageType: "text",
        isRead: isAuthor ? true : res.data?.isRead ?? false,
        createdAt: res.data?.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

      setChatRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === selectedRoom.id
            ? {
                ...room,
                lastMessage: newMessage,
                lastMessageTime: formatTime(newMsg.createdAt),
              }
            : room
        )
      );
    } catch (e) {
      console.error("메시지 전송 실패 (로컬 추가):", e);
      const isAuthor = selectedRoom.post?.authorId === currentUserId;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          chatRoomId: selectedRoom.id,
          senderId: currentUserId,
          content: newMessage,
          messageType: "text",
          isRead: isAuthor,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } finally {
      setSending(false);
    }
  };

  const handleLeaveChatRoom = async () => {
    if (!selectedRoom) return;
    if (!confirm("채팅방을 나가시겠습니까?")) return;
    try {
      await deleteChatRoom(selectedRoom.id);
      if (currentUserId) {
        const res = await getUserChatRooms(currentUserId);
        const rooms: ChatRoom[] = (res.data.chatRooms || []).map(
          (room: any) => ({
            id: room.id,
            postId: room.postId,
            post: room.post,
            lastMessage: room.lastMessage?.content || "",
            lastMessageTime: room.lastMessage?.createdAt
              ? formatTime(room.lastMessage.createdAt)
              : "",
            unreadCount: room.unreadCount || 0,
          })
        );
        setChatRooms(rooms);
      }
      setSelectedRoom(null);
      setShowMenu(false);
    } catch (err: any) {
      console.error("채팅방 나가기 실패:", err);
      if (err.response?.status === 404) {
        toast.error("채팅방을 찾을 수 없습니다.");
      } else {
        toast.error("채팅방 나가기에 실패했습니다.");
      }
    }
  };

  const handleViewPost = () => {
    if (!selectedRoom?.postId) return;
    setShowMenu(false);
    nav(`/post/${selectedRoom.postId}`);
  };

  if (selectedRoom) {
    return (
      <div>
        <header>
          <button
            type="button"
            onClick={() => setSelectedRoom(null)}
            aria-label="뒤로"
          >
            
          </button>
          <Avatar>
            <AvatarFallback>
              {selectedRoom.post?.title?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3>{selectedRoom.post?.title || "채팅방"}</h3>
            <p>참여자 {messages.length > 0 ? "2" : "0"}명</p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="메뉴"
            >
              
            </button>
            {showMenu && (
              <ul role="menu">
                <li>
                  <button type="button" onClick={handleViewPost}>
                    
                    <span>게시글 보기</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleLeaveChatRoom}>
                    
                    <span>채팅방 나가기</span>
                  </button>
                </li>
              </ul>
            )}
          </div>
        </header>

        <section>
          <button
            type="button"
            onClick={() => setShowTradeSummary(!showTradeSummary)}
            aria-expanded={showTradeSummary}
          >
            <span>거래 정보 요약</span>
            <span>{showTradeSummary ? "접기" : "보기"}</span>
            
          </button>

          {showTradeSummary && selectedRoom.post && (
            <div>
              <div>
                <p>{selectedRoom.post.title}</p>
                <p>
                  공동구매 채팅방입니다. 게시글 보기를 눌러 상세 내용을
                  확인하세요.
                </p>
                <button type="button" onClick={handleViewPost}>
                  게시글 보기
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => toast.info("거래 약속 보기 기능은 준비 중입니다.")}
                >
                  
                  거래 약속 보기
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("노쇼 신고 기능은 준비 중입니다.")}
                >
                  
                  노쇼 신고
                </button>
                <button
                  type="button"
                  onClick={() => toast.info("문제 접수 기능은 준비 중입니다.")}
                >
                  
                  문제 접수
                </button>
              </div>
            </div>
          )}
        </section>

        <ul data-messages>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <li key={msg.id} data-me={isMe}>
                {!isMe && (
                  <Avatar>
                    <AvatarImage src={getImageUrl(msg.sender?.avatarUrl)} />
                    <AvatarFallback>
                      {msg.sender?.nickname?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  {!isMe && msg.sender?.nickname && (
                    <span>{msg.sender.nickname}</span>
                  )}
                  <p>{msg.content}</p>
                  <div>
                    <time>{formatTime(msg.createdAt)}</time>
                    {isMe && !msg.isRead && <span data-unread>1</span>}
                  </div>
                </div>
              </li>
            );
          })}
          <li ref={messagesEndRef} aria-hidden />
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div data-page="채팅">
      <p>채팅</p>

      {selectedRoom && (
        <div>
          <button type="button" onClick={()=>setSelectedRoom(null)} />
          <form onSubmit={handleSendMessage}>
            <input value={newMessage} onChange={e=>setNewMessage(e.target.value)} />
            <button type="submit" disabled={sending||!newMessage.trim()} />
          </form>
        </div>
      )}
    </div>
  );
}