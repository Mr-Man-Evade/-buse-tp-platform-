import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiSend, FiSearch, FiChevronLeft, FiPaperclip, FiX } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const API_BASE_URL = '/api';

export default function Chat() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (contact) => {
    setSelectedContact(contact);
    setMessages([]);

    try {
      const response = await axios.get(`${API_BASE_URL}/messages/conversation/${contact.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const handleAttachmentSelect = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && attachments.length === 0) || !selectedContact) return;
    setSending(true);

    try {
      const formData = new FormData();
      formData.append('recipientId', selectedContact.id);
      formData.append('content', newMessage.trim());
      attachments.forEach((file) => formData.append('attachments', file));

      const response = await axios.post(`${API_BASE_URL}/messages`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
      setAttachments([]);
    } catch (err) {
      console.error('Failed to send message:', err.response?.data || err.message);
      alert(err.response?.data?.error || 'Unable to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.first_name} ${contact.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) || contact.email.toLowerCase().includes(search.toLowerCase());
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F5F9FF]">
      <Sidebar role={user?.role || 'student'} onLogout={handleLogout} />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#003399]">Messages</h1>
            <p className="text-gray-600 mt-1">Communicate with students, mentors, supervisors, and coordinators.</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <div className="card p-4 bg-white shadow-sm border border-[#E2E8F0]">
            <div className="flex items-center gap-3 mb-4">
              <FiSearch className="text-[#003399]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts"
                className="input-field w-full"
              />
            </div>

            {loading ? (
              <p className="text-gray-600">Loading contacts...</p>
            ) : filteredContacts.length === 0 ? (
              <p className="text-gray-600">No contacts found.</p>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => fetchConversation(contact)}
                    className={`w-full text-left p-3 rounded-lg transition ${selectedContact?.id === contact.id ? 'bg-[#003399] text-white' : 'bg-[#F8FAFC] hover:bg-[#E2E8F0]'}`}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div>
                        <p className="font-semibold">{contact.first_name} {contact.last_name}</p>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                      </div>
                      <span className="text-xs uppercase tracking-wide text-[#003399]">Chat</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card p-4 bg-white shadow-sm border border-[#E2E8F0] flex flex-col h-[75vh]">
            {selectedContact ? (
              <>
                <div className="border-b border-[#E2E8F0] pb-4 mb-4 flex items-center justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedContact(null)}
                      className="text-[#003399] flex items-center gap-2 mb-2"
                    >
                      <FiChevronLeft /> Back to contacts
                    </button>
                    <p className="text-xl font-bold text-[#003399]">{selectedContact.first_name} {selectedContact.last_name}</p>
                    <p className="text-sm text-gray-600">{selectedContact.role}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-green-600">Online</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-600 mt-6">No messages yet. Start the conversation.</p>
                  ) : (
                    messages.map((message) => {
                      const isSender = message.sender_id === user.id;
                      return (
                        <div key={message.id} className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 ${isSender ? 'bg-[#DCF8C6] text-[#0B3D91]' : 'bg-[#F1F3F5] text-[#1F2937]'}`}>
                            {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}
                            {message.attachments?.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <a
                                    key={attachment.id}
                                    href={attachment.file_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block rounded-lg bg-white p-3 border border-[#CBD5E1] text-sm text-[#1F2937] hover:bg-[#E2E8F0]"
                                  >
                                    {attachment.file_name}
                                  </a>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2 text-right">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-[#E2E8F0] space-y-3">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-[#003399] font-semibold cursor-pointer">
                      <FiPaperclip /> Attach files
                      <input
                        type="file"
                        multiple
                        accept=".doc,.docx,.pdf,.xlsx,.xls,.mp4,.jpg,.jpeg,.png"
                        onChange={handleAttachmentSelect}
                        className="hidden"
                      />
                    </label>

                    {attachments.length > 0 && (
                      <div className="bg-[#F8FAFC] border border-[#87CEEB] rounded-lg p-3">
                        <p className="font-semibold text-[#003399] mb-2">Attachments</p>
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between gap-3 bg-white p-2 rounded">
                              <div>
                                <p className="font-medium text-sm text-[#1F2937]">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                              <button type="button" onClick={() => removeAttachment(index)} className="text-red-600 hover:text-red-800">
                                <FiX />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      className="input-field flex-1"
                    />
                    <button
                      type="button"
                      disabled={(!newMessage.trim() && attachments.length === 0) || sending}
                      onClick={handleSend}
                      className="btn-primary px-5 py-3 disabled:opacity-60"
                    >
                      <FiSend />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center text-gray-600">
                <p className="mb-3 text-lg font-semibold">Select a contact to begin chatting.</p>
                <p>Messages are delivered securely within the TP system.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
