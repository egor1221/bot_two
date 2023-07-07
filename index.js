const TelegramApi = require('node-telegram-bot-api')

const {gameOptions, againOptions} = require('./options')

const token = '6074421340:AAGrFFM4RQJ3YD0lPSO5UJJZYPnrz80OIGc'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const GameStart = async (chatId) => {
    await bot.sendMessage(chatId, 'сейчас загадаю число от 0 до 9')
    const random = Math.floor(Math.random() * 10)
    chats[chatId] = random
    await bot.sendMessage(chatId, `Отгадай`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {commands: '/start', description: 'hello'},
        {commands: '/info', description: 'info'},
        {commands: '/game', description: 'game'}
    ])
    
    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
    
        if(text === '/start'){
            await bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/e4d/0d1/e4d0d1cd-3c66-46b7-9ac6-0b897a81320a/3.webp')
            return bot.sendMessage(chatId, 'Hello')
        }
    
        if(text === '/info'){
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name}`)
        }

        if(text === '/game'){
            return GameStart(chatId)
        }

        return bot.sendMessage(chatId, 'I dont understand')
    })

    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if(data === '/again'){
            return GameStart(chatId)
        }

        if(data === chats[chatId]){
            return bot.sendMessage(chatId, 'you win', againOptions)
        }else{
            return bot.sendMessage(chatId, `you lose, number = ${chats[chatId]}`, againOptions)
        }
    })
    
}

start()