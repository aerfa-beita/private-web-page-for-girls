(function () {
    var AI_ENDPOINT = window.__CONFIG__ && window.__CONFIG__.AI_ENDPOINT;

    async function requestLoveMessage(prompt) {
        if (!AI_ENDPOINT || !AI_ENDPOINT.startsWith('/')) {
            throw new Error('AI 服务尚未配置');
        }
        var response = await fetch(AI_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: String(prompt || '').slice(0, 240) })
        });
        if (response.status === 429) throw new Error('今天的星愿次数已用完，请稍后再试');
        if (!response.ok) throw new Error('AI 暂时无法回应，请稍后再试');
        var data = await response.json();
        if (!data || typeof data.message !== 'string') throw new Error('AI 返回内容无效');
        return data.message;
    }

    function initAiInteraction() {
        var button = document.getElementById('ai-send-btn');
        var input = document.getElementById('ai-prompt');
        var output = document.getElementById('ai-response');
        if (!button || !input || !output) return;
        button.addEventListener('click', async function () {
            button.disabled = true;
            output.textContent = '正在把心事交给星河…';
            try {
                output.textContent = await requestLoveMessage(input.value);
            } catch (error) {
                output.textContent = error.message + '。离线时仍可翻看我们的回忆。';
            } finally {
                button.disabled = false;
            }
        });
    }

    window.initAiInteraction = initAiInteraction;
    document.addEventListener('DOMContentLoaded', initAiInteraction);
}());
