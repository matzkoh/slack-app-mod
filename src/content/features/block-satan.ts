import { addHook, addJsonHook } from '../xhr-hook'

interface Message {
  bot_id: string
  blocks: unknown[]
}

interface SubscriptionsThreadGetView {
  threads: {
    latest_replies: Message[]
  }[]
}

interface HasMessages {
  messages: Message[]
}

const SATAN_BOT_ID = 'BNV3HJB61'

function isNotSatanMessage(message: Message) {
  return message.bot_id !== SATAN_BOT_ID
}

addHook(({ url, response }) => {
  if (
    ![
      '/api/subscriptions.thread.getView',
      '/api/conversations.history',
      '/api/conversations.replies',
      '/api/conversations.views',
      '/api/activity.mentions',
      '/api/apps.profile.get',
      '/cache/T04Q5G460/users/info',
      '/cache/T04Q5G460/users/search',
    ].includes(new URL(url).pathname) &&
    typeof response === 'string' &&
    response.includes(SATAN_BOT_ID)
  ) {
    alert(`// ${url}\n${response}\n`)
  }
})

addJsonHook<SubscriptionsThreadGetView>((url, json) => {
  if (url.pathname === '/api/subscriptions.thread.getView') {
    for (const thread of json.threads) {
      thread.latest_replies = thread.latest_replies.filter(isNotSatanMessage)
      thread.latest_replies.forEach(m => (m.blocks = []))
    }

    return true
  }
})

addJsonHook<HasMessages>((url, json) => {
  if (['/api/conversations.history', '/api/conversations.replies', '/api/conversations.views'].includes(url.pathname)) {
    json.messages = json.messages.filter(isNotSatanMessage)
    json.messages.forEach(m => (m.blocks = []))

    return true
  }
})
