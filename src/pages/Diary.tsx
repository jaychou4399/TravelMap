import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cityMap } from '@/data/cities';
import { useStore } from '@/store/useStore';
import { IconArrowLeft, IconEdit, IconCheck, IconPhoto } from '@/components/Icons';

const SAMPLE = `# 标题

写下游历的所思所感…

## 小标题

**加粗** *斜体* ~~删除线~~

> 引用一段话

- 待办列表
- [x] 已完成
- [ ] 未完成

\`\`\`js
console.log('代码块');
\`\`\`

| 项目 | 花费 |
| --- | --- |
| 机票 | 1200 |
`;

export default function Diary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const state = useStore();
  const trip = state.trips.find((t) => t.id === tripId);
  const city = trip ? cityMap[trip.cityId] : undefined;

  const [content, setContent] = useState(trip?.diary ?? '');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(true);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (trip) setContent(trip.diary);
  }, [trip?.id]);

  // Autosave (debounced)
  useEffect(() => {
    if (!trip) return;
    if (content === trip.diary) return;
    setSaved(false);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      state.updateTrip(trip.id, { diary: content });
      setSaved(true);
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [content, trip]);

  if (!trip || !city) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <p className="text-gray-500 mb-4">未找到该日记</p>
        <Link to="/timeline" className="btn-primary">返回时间轴</Link>
      </div>
    );
  }

  const wrap = (before: string, after = '') => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = content.slice(start, end);
    const next = content.slice(0, start) + before + sel + after + content.slice(end);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = end + before.length;
    });
  };

  const insertLine = (text: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const lineStart = content.lastIndexOf('\n', pos - 1) + 1;
    const next = content.slice(0, lineStart) + text + content.slice(lineStart);
    setContent(next);
    requestAnimationFrame(() => ta.focus());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button onClick={() => navigate(-1)} className="btn-glass !py-2 text-sm">
          <IconArrowLeft width={16} height={16} /> 返回
        </button>
        <div className="flex items-center gap-2">
          <span className={`chip ${saved ? '' : '!bg-amber-400/20 !text-amber-600'}`}>
            {saved ? <><IconCheck width={13} height={13} /> 已保存</> : '保存中…'}
          </span>
          <button onClick={() => setEditing((e) => !e)} className="btn-glass !py-2 text-sm">
            <IconEdit width={15} height={15} /> {editing ? '预览' : '编辑'}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-glass p-5 sm:p-8"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <IconPhoto width={14} height={14} /> {city.name} · {trip.startDate}
        </div>
        <h1 className="text-3xl font-extrabold mb-5">{trip.feeling || `${city.name} 旅行日记`}</h1>

        {editing && (
          <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-white/30 dark:border-white/10">
            <ToolBtn onClick={() => insertLine('# ')} label="H1" />
            <ToolBtn onClick={() => insertLine('## ')} label="H2" />
            <ToolBtn onClick={() => wrap('**', '**')} label="B" bold />
            <ToolBtn onClick={() => wrap('*', '*')} label="I" italic />
            <ToolBtn onClick={() => wrap('~~', '~~')} label="S" strike />
            <ToolBtn onClick={() => insertLine('> ')} label="引用" />
            <ToolBtn onClick={() => insertLine('- ')} label="列表" />
            <ToolBtn onClick={() => insertLine('- [ ] ')} label="待办" />
            <ToolBtn onClick={() => wrap('`', '`')} label="`code`" />
            <ToolBtn onClick={() => insertLine('| 列1 | 列2 |\n| --- | --- |\n| | |\n')} label="表格" />
            <ToolBtn onClick={() => insertLine(`![图片](${trip.cover})\n`)} label="图片" />
          </div>
        )}

        {editing ? (
          <textarea
            ref={taRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={SAMPLE}
            className="input-glass min-h-[50vh] font-mono text-sm leading-relaxed resize-y"
          />
        ) : (
          <article className="prose-diary">
            {content.trim() ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">还没有日记，点击「编辑」开始记录吧。</p>
            )}
          </article>
        )}
      </motion.div>

      <style>{`
        .prose-diary { color: var(--text-primary); line-height: 1.8; font-size: 16px; }
        .prose-diary h1 { font-size: 1.8em; font-weight: 800; margin: 0.8em 0 0.4em; }
        .prose-diary h2 { font-size: 1.4em; font-weight: 700; margin: 1em 0 0.4em; }
        .prose-diary h3 { font-size: 1.15em; font-weight: 700; margin: 0.8em 0 0.3em; }
        .prose-diary p { margin: 0.7em 0; }
        .prose-diary ul, .prose-diary ol { margin: 0.7em 0; padding-left: 1.5em; }
        .prose-diary li { margin: 0.25em 0; }
        .prose-diary blockquote { border-left: 3px solid #59a1ff; padding: 0.2em 1em; margin: 1em 0; color: var(--text-secondary); background: rgba(89,161,255,0.08); border-radius: 0 12px 12px 0; }
        .prose-diary code { background: rgba(120,140,180,0.2); padding: 0.15em 0.4em; border-radius: 6px; font-size: 0.9em; font-family: ui-monospace, monospace; }
        .prose-diary pre { background: rgba(11,18,32,0.85); color: #e8f0ff; padding: 1em; border-radius: 16px; overflow-x: auto; margin: 1em 0; }
        .prose-diary pre code { background: transparent; padding: 0; }
        .prose-diary table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .prose-diary th, .prose-diary td { border: 1px solid rgba(120,140,180,0.3); padding: 0.5em 0.8em; text-align: left; }
        .prose-diary th { background: rgba(89,161,255,0.12); font-weight: 600; }
        .prose-diary img { max-width: 100%; border-radius: 16px; margin: 1em 0; }
        .prose-diary a { color: #1d60f2; text-decoration: underline; }
        .prose-diary hr { border: none; border-top: 1px solid rgba(120,140,180,0.3); margin: 1.5em 0; }
        .prose-diary input[type=checkbox] { margin-right: 0.4em; }
      `}</style>
    </div>
  );
}

function ToolBtn({ onClick, label, bold, italic, strike }: { onClick: () => void; label: string; bold?: boolean; italic?: boolean; strike?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/30 dark:bg-white/5 hover:bg-brand-500/20 transition-colors"
      style={{ fontWeight: bold ? 700 : italic ? 400 : 500, fontStyle: italic ? 'italic' : 'normal', textDecoration: strike ? 'line-through' : 'none' }}
    >
      {label}
    </button>
  );
}
