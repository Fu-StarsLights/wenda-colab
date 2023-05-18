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
        add_conversation("user", Q)
        add_conversation("AI", content)
        console.log("----> 这是输出内容:", content)
        copy(content)
    },
})


功能.push({
    名称: "EdgerOS 客服机器人",
    描述: "EdgerOS 系统问答客服机器人",
    问题: "你的名字叫做 EdgerOS 小天，你只能回答技术以及EdgerOS相关的问题，用户提问内容不属于知识库中的内容则回复用户无法回答:",
})


功能.push({
    名称: "EdgerOS 知识库",
    描述: "EdgerOS 系统问答客服机器人",
    问题: async () => {
        let Q = app.问题
        zsk(false)
        lsdh(true)//打开历史对话
        lsdh(false)
        app.chat.push({ "role": "user", "content": Q })
        kownladge = (await find(Q, 2)).map(i => ({
            title: get_title_form_md(i.title),
            url: get_url_form_md(i.title),
            content: i.content
        }))
        answer = {
            role: "AI",
            content: "",
            sources: kownladge
        }
        app.chat.push(answer)
        result = []
        for (let i in kownladge) {
            answer.content = '正在查找：' + kownladge[i].title
            if (i > 3) continue
            let prompt = "精炼地总结以下文段中与问题相关的信息为二十个字。\n" +
                kownladge[i].content + "\n问题：" + Q
            result.push(await send(prompt, keyword = Q, show = false))
        }
        app.chat.pop()
        app.chat.pop()
        let prompt = "你的身份是 EdgerOS 客服机器人，现在学习以下文段,用中文回答问题。如果无法从中得到答案，则回答我无法回答这些问题。\n" +
            result.join('\n') + "\n问题:" + Q
        await send(prompt, keyword = Q, show = true,sources=kownladge)
    }
})