<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth.js'
import * as messagesApi from '@/api/messages.js'

const auth          = useAuthStore()
const conversations = ref([])
const selected      = ref(null)
const thread        = ref([])
const newMessage    = ref('')
const loadingConvs  = ref(true)
const loadingThread = ref(false)
const sending       = ref(false)
const threadEl      = ref(null)
const mobileView    = ref('list')

onMounted(fetchConversations)

async function fetchConversations() {
  loadingConvs.value = true
  try {
    const { data } = await messagesApi.getConversations()
    conversations.value = data
  } finally {
    loadingConvs.value = false
  }
}

async function selectConversation(conv) {
  selected.value    = conv
  mobileView.value  = 'thread'
  loadingThread.value = true
  thread.value = []
  try {
    const { data } = await messagesApi.getThread(conv.listing_id)
    thread.value = data
    scrollToBottom()
    const unread = data.filter(m => !m.is_read && m.sender_id !== auth.user.id)
    for (const m of unread) await messagesApi.markRead(m.id)
    if (unread.length) fetchConversations()
  } finally {
    loadingThread.value = false
  }
}

async function send() {
  if (!newMessage.value.trim() || !selected.value || sending.value) return
  sending.value = true
  try {
    const { data } = await messagesApi.sendMessage({
      listing_id:  selected.value.listing_id,
      receiver_id: selected.value.other_user_id,
      content:     newMessage.value.trim(),
    })
    thread.value.push(data)
    newMessage.value = ''
    scrollToBottom()
    fetchConversations()
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (threadEl.value) threadEl.value.scrollTop = threadEl.value.scrollHeight
  })
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <main class="messages-page">
    <div class="messages-layout container">

      <aside :class="['conv-panel', { 'mobile-hidden': mobileView === 'thread' }]">
        <h2 class="panel-title">Messages</h2>

        <div v-if="loadingConvs" class="empty-state">Chargement…</div>

        <div v-else-if="conversations.length === 0" class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>Aucune conversation</p>
        </div>

        <ul v-else class="conv-list">
          <li
            v-for="conv in conversations"
            :key="conv.listing_id + '-' + conv.other_user_id"
            :class="['conv-item', { active: selected?.listing_id === conv.listing_id, unread: !conv.is_read }]"
            @click="selectConversation(conv)"
          >
            <div class="conv-avatar">
              <img v-if="conv.other_user_avatar" :src="conv.other_user_avatar" :alt="conv.other_user_name" />
              <span v-else>{{ conv.other_user_name?.[0]?.toUpperCase() }}</span>
            </div>
            <div class="conv-info">
              <div class="conv-header">
                <span class="conv-name">{{ conv.other_user_name }}</span>
                <span class="conv-time">{{ formatTime(conv.created_at) }}</span>
              </div>
              <p class="conv-listing">{{ conv.listing_title }}</p>
              <p class="conv-preview">{{ conv.content }}</p>
            </div>
            <span v-if="!conv.is_read" class="unread-dot"></span>
          </li>
        </ul>
      </aside>

      <section :class="['thread-panel', { 'mobile-hidden': mobileView === 'list' }]">

        <div v-if="!selected" class="empty-thread">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <p>Sélectionnez une conversation</p>
        </div>

        <template v-else>
          <header class="thread-header">
            <button class="back-btn" @click="mobileView = 'list'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <div class="thread-meta">
              <strong>{{ selected.other_user_name }}</strong>
              <span>{{ selected.listing_title }}</span>
            </div>
          </header>

          <div class="thread-messages" ref="threadEl">
            <div v-if="loadingThread" class="thread-loading">Chargement…</div>
            <template v-else>
              <div
                v-for="msg in thread"
                :key="msg.id"
                :class="['bubble-wrap', { mine: msg.sender_id === auth.user.id }]"
              >
                <div class="bubble">
                  <p>{{ msg.content }}</p>
                  <span class="bubble-time">{{ formatTime(msg.created_at) }}</span>
                </div>
              </div>
            </template>
          </div>

          <form class="thread-input" @submit.prevent="send">
            <input
              v-model="newMessage"
              type="text"
              placeholder="Votre message…"
              :disabled="sending"
              @keydown.enter.prevent="send"
            />
            <button type="submit" :disabled="!newMessage.trim() || sending">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </template>

      </section>
    </div>
  </main>
</template>

<style scoped>
.messages-page {
  padding-top: calc(var(--nav-height) + 32px);
  min-height: 100svh;
  background: var(--cream);
}

.messages-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 0;
  height: calc(100svh - var(--nav-height) - 64px);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

/* ── Conversations panel ── */
.conv-panel {
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-title {
  font-size: 18px;
  color: var(--forest-900);
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--gray-100);
  flex-shrink: 0;
}

.conv-list {
  list-style: none;
  overflow-y: auto;
  flex: 1;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--gray-100);
  position: relative;
}

.conv-item:hover { background: var(--forest-50); }
.conv-item.active { background: var(--forest-50); }
.conv-item.unread .conv-name { font-weight: 700; }
.conv-item.unread .conv-preview { font-weight: 600; color: var(--gray-700); }

.conv-avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--forest-100);
  color: var(--forest-700);
  font-weight: 700;
  font-size: 17px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.conv-avatar img { width: 100%; height: 100%; object-fit: cover; }

.conv-info { flex: 1; min-width: 0; }

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.conv-name { font-size: 14px; font-weight: 500; color: var(--gray-800); }
.conv-time { font-size: 11.5px; color: var(--gray-400); flex-shrink: 0; }
.conv-listing { font-size: 12px; color: var(--forest-600); font-weight: 500; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.conv-preview { font-size: 13px; color: var(--gray-500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.unread-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--forest-500);
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 1;
  color: var(--gray-400);
  font-size: 14px;
  padding: 40px 20px;
}

/* ── Thread panel ── */
.thread-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-thread {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--gray-300);
  font-size: 15px;
}

.thread-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  flex-shrink: 0;
}

.back-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--gray-500);
  padding: 4px;
  border-radius: 6px;
}

.back-btn:hover { background: var(--gray-100); }

.thread-meta { display: flex; flex-direction: column; }
.thread-meta strong { font-size: 15px; color: var(--gray-800); }
.thread-meta span { font-size: 12.5px; color: var(--forest-600); }

.thread-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.thread-loading { color: var(--gray-400); font-size: 14px; text-align: center; margin: auto; }

.bubble-wrap { display: flex; }
.bubble-wrap.mine { justify-content: flex-end; }

.bubble {
  max-width: 68%;
  background: var(--gray-100);
  border-radius: 16px 16px 16px 4px;
  padding: 10px 14px;
}

.bubble-wrap.mine .bubble {
  background: var(--forest-600);
  color: white;
  border-radius: 16px 16px 4px 16px;
}

.bubble p { font-size: 14.5px; line-height: 1.5; margin-bottom: 4px; }
.bubble-time { font-size: 11px; opacity: 0.6; }

.thread-input {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--gray-100);
  flex-shrink: 0;
}

.thread-input input {
  flex: 1;
  padding: 10px 16px;
  border: 1.5px solid var(--gray-200);
  border-radius: 24px;
  font-size: 14.5px;
  outline: none;
  transition: border-color 0.15s;
}

.thread-input input:focus { border-color: var(--forest-400); }

.thread-input button {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: var(--forest-600);
  border: none;
  color: white;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.thread-input button:hover:not(:disabled) { background: var(--forest-700); }
.thread-input button:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .messages-layout {
    grid-template-columns: 1fr;
    height: calc(100svh - var(--nav-height) - 32px);
    border-radius: 12px;
  }

  .mobile-hidden { display: none; }

  .back-btn { display: flex; }

  .conv-panel, .thread-panel { grid-column: 1; }
}
</style>
