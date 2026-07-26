import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import type { Wish } from '@/types';
import {
  IconBookmark, IconPlus, IconEdit, IconTrash, IconClose,
  IconCalendar, IconWallet, IconLocation, IconCheck,
} from '@/components/Icons';

interface WishForm {
  name: string;
  type: Wish['type'];
  country: string;
  priority: Wish['priority'];
  plannedDate: string;
  budget: string;
  note: string;
}

const EMPTY_FORM: WishForm = {
  name: '',
  type: 'city',
  country: '',
  priority: 2,
  plannedDate: '',
  budget: '',
  note: '',
};

const PRIORITY_META: Record<Wish['priority'], { label: string; gradient: string }> = {
  1: { label: '高', gradient: 'from-rose-400 to-red-500' },
  2: { label: '中', gradient: 'from-amber-400 to-orange-500' },
  3: { label: '低', gradient: 'from-slate-400 to-slate-500' },
};

const TYPE_LABEL: Record<Wish['type'], string> = {
  city: '城市',
  country: '国家',
};

export default function Bucket() {
  const state = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<WishForm>(EMPTY_FORM);

  const sortedWishes = useMemo(
    () =>
      [...state.wishes].sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return (a.plannedDate || '').localeCompare(b.plannedDate || '');
      }),
    [state.wishes]
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (w: Wish) => {
    setForm({
      name: w.name,
      type: w.type,
      country: w.country ?? '',
      priority: w.priority,
      plannedDate: w.plannedDate,
      budget: String(w.budget || ''),
      note: w.note,
    });
    setEditingId(w.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const payload: Omit<Wish, 'id'> = {
      name: form.name.trim(),
      type: form.type,
      country: form.type === 'country' ? form.country.trim() || undefined : form.country.trim() || undefined,
      priority: form.priority,
      plannedDate: form.plannedDate,
      budget: Number(form.budget) || 0,
      note: form.note.trim(),
    };
    if (editingId) {
      state.updateWish(editingId, payload);
    } else {
      state.addWish({ ...payload, id: 'w-' + Date.now() });
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条愿望吗？')) {
      state.removeWish(id);
    }
  };

  const isEditing = editingId !== null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* ===== Header ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 text-brand-500 mb-2">
          <IconBookmark width={22} height={22} />
          <span className="text-sm font-semibold tracking-wide">BUCKET LIST</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">旅行愿望</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">想去的地方，逐一实现</p>
      </motion.div>

      {/* ===== Summary + Add ===== */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="glass glass-sheen rounded-glass p-5 sm:p-6 mb-5 flex items-center justify-between flex-wrap gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow">
            <IconBookmark width={26} height={26} />
          </div>
          <div>
            <div className="text-3xl font-extrabold leading-none">{state.wishes.length}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">个想去的地方</div>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <IconPlus width={18} height={18} /> 添加愿望
        </button>
      </motion.div>

      {/* ===== Add/Edit Form ===== */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="wish-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden mb-5"
          >
            <div className="glass-strong glass-sheen rounded-glass p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  {isEditing ? <IconEdit width={18} height={18} /> : <IconPlus width={18} height={18} />}
                  {isEditing ? '编辑愿望' : '新增愿望'}
                </h2>
                <button onClick={closeForm} className="btn-glass !p-2" aria-label="取消">
                  <IconClose width={16} height={16} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="名称" required>
                  <input
                    className="input-glass"
                    placeholder="如：京都 / 冰岛"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </Field>

                <Field label="类型">
                  <select
                    className="input-glass"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as Wish['type'] })}
                  >
                    <option value="city">城市</option>
                    <option value="country">国家</option>
                  </select>
                </Field>

                <Field label="国家（可选）">
                  <input
                    className="input-glass"
                    placeholder="如：日本"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                  />
                </Field>

                <Field label="优先级">
                  <select
                    className="input-glass"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: Number(e.target.value) as Wish['priority'] })}
                  >
                    <option value={1}>1 · 高</option>
                    <option value={2}>2 · 中</option>
                    <option value={3}>3 · 低</option>
                  </select>
                </Field>

                <Field label="预计时间">
                  <input
                    type="month"
                    className="input-glass"
                    value={form.plannedDate}
                    onChange={(e) => setForm({ ...form, plannedDate: e.target.value })}
                  />
                </Field>

                <Field label="预算（¥）">
                  <input
                    type="number"
                    min={0}
                    className="input-glass"
                    placeholder="0"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="备注">
                    <textarea
                      rows={3}
                      className="input-glass resize-none"
                      placeholder="记录一些期待或计划..."
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleSave}
                  disabled={!form.name.trim()}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <IconCheck width={18} height={18} /> {isEditing ? '保存修改' : '添加到清单'}
                </button>
                <button onClick={closeForm} className="btn-glass">
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Wish List ===== */}
      {sortedWishes.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedWishes.map((w, i) => {
            const pm = PRIORITY_META[w.priority];
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                className="glass glass-sheen rounded-glass p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold truncate">{w.name}</h3>
                      <span className="chip !text-[10px] !px-2 !py-0.5">{TYPE_LABEL[w.type]}</span>
                    </div>
                    {w.country && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <IconLocation width={12} height={12} /> {w.country}
                      </div>
                    )}
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${pm.gradient} text-white text-xs font-bold shadow-md`}
                    title={`优先级 ${w.priority} · ${pm.label}`}
                  >
                    {w.priority}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <IconCalendar width={14} height={14} className="text-brand-500" />
                    <span>{w.plannedDate || '未定'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <IconWallet width={14} height={14} className="text-brand-500" />
                    <span>{w.budget ? `¥${w.budget.toLocaleString('en-US')}` : '—'}</span>
                  </div>
                </div>

                {w.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3 mb-3 flex-1">
                    {w.note}
                  </p>
                )}

                <div className="flex gap-2 pt-2 border-t border-white/30 dark:border-white/10">
                  <button
                    onClick={() => openEdit(w)}
                    className="btn-glass !py-1.5 !px-3 text-xs flex-1"
                  >
                    <IconEdit width={14} height={14} /> 编辑
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="btn-glass !py-1.5 !px-3 text-xs flex-1 hover:!text-rose-500"
                  >
                    <IconTrash width={14} height={14} /> 删除
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 block">
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-glass p-12 text-center"
    >
      <div className="grid place-items-center w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-400/30 to-fuchsia-400/30 text-brand-500 mb-4">
        <IconBookmark width={28} height={28} />
      </div>
      <h3 className="text-lg font-bold mb-1">还没有添加愿望</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        把心心念念的地方记下来，逐一去实现它吧。
      </p>
      <button onClick={onAdd} className="btn-primary">
        <IconPlus width={18} height={18} /> 添加第一个愿望
      </button>
    </motion.div>
  );
}
