const { Telegraf } = require('telegraf')
const { config } = require('dotenv')
const { Configuration, OpenAIApi } = require('openai')
const { message } = require('telegraf/filters')

config()

const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORGANIZATION,
    apiKey: process.env.GPT_KEY,
});
const openai = new OpenAIApi(configuration)

const chat = async (text) => {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user', content: text
    }]
  })
return response.data.choices[0].message
}

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.start((ctx) => ctx.reply('welcome'))

bot.on(message('text'), async (ctx) => {
  const text = await chat(ctx.message.text)
  // const test = async () => setTimeout(() => 'OI', 4000)

  // ctx.reply(await test())
  ctx.reply(text.content)
});

bot.launch()
