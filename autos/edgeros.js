功能.push({
    名称: "中国神话故事",
    描述: "根据关键词编辑一篇神话故事",
    问题: async () => {
        Q = app.问题
        app.max_length = 4096
        app.chat = []
        resp = (await send("根据关键词编辑一篇神话故事:" + Q, Q))
            .replace(/\n- /g, '\n1.')//兼容不同格式
            .split("\n")
        content = [resp.join("\n\n"), "------------------------------神话故事------------------------------"]
        for (let i in resp) {
            let line = resp[i]
            if (line == "") continue
            line = line.split(".")
            if (line.length < 2) {
                continue  // 判断非提纲内容
            }
            content.push(resp[i])   // 保存提纲
            let num = find_RomanNumerals(line[0])
            if (num <= 0 || num == 100) {
                content.push(await send("根据神话主题：" + Q +
                    "\n对下列段落进行详细的撰写：" + line[1], line[1]) + "\n\n")
            }
        }
        content = content.join("\n\n")
        add_conversation("user",  Q )
        add_conversation("AI",  content )
        console.log("----> 这是输出内容:",content)
        copy(content)
    },
})


功能.push( {
    名称: "EdgerOS 客服机器人",
    描述: "EdgerOS 系统问答客服机器人",
    问题: "你的名字叫做 EdgerOS 小天，你只能回答技术以及EdgerOS相关的问题，用户提问内容不属于只是库中的内容则回复用户无法回答:",
})