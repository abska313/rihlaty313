import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Lightbulb,
  Plus,
  Quote,
  Star,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { BookItem, TaskItem } from '../types';

interface ReadingViewProps {
  books: BookItem[];
  currentDay: number;
  onSaveBook: (book: BookItem) => void;
  onDeleteBook: (id: string) => void;
  onConvertApplicationToTask: (task: TaskItem) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  books,
  currentDay,
  onSaveBook,
  onDeleteBook,
  onConvertApplicationToTask,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'insights'>('library');

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState<number>(200);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [status, setStatus] = useState<BookItem['status']>('reading');
  const [notes, setNotes] = useState('');
  const [quoteInput, setQuoteInput] = useState('');
  const [keyIdeaInput, setKeyIdeaInput] = useState('');
  const [practicalApp, setPracticalApp] = useState('');

  const filteredBooks = books.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newBook: BookItem = {
      id: `book_${Date.now()}`,
      title: title.trim(),
      author: author.trim() || 'مؤلف غير محدد',
      status,
      startDate: new Date().toISOString().split('T')[0],
      totalPages: Number(totalPages) || 100,
      currentPage: Number(currentPage) || 0,
      notes: notes.trim() || undefined,
      quotes: quoteInput.trim() ? [quoteInput.trim()] : [],
      keyIdeas: keyIdeaInput.trim() ? [keyIdeaInput.trim()] : [],
      practicalApplication: practicalApp.trim() || undefined,
    };

    onSaveBook(newBook);
    setShowAddModal(false);
    setTitle('');
    setAuthor('');
    setNotes('');
    setQuoteInput('');
    setKeyIdeaInput('');
    setPracticalApp('');
  };

  const handleConvertToTask = (book: BookItem) => {
    if (!book.practicalApplication) return;
    const task: TaskItem = {
      id: `task_book_${Date.now()}`,
      title: `تطبيق من كتاب «${book.title}»: ${book.practicalApplication.substring(0, 50)}...`,
      description: book.practicalApplication,
      pillarId: 'knowledge',
      difficulty: 'medium',
      estimatedMinutes: 20,
      status: 'pending',
      xp: 40,
      dayNumber: currentDay,
      date: new Date().toISOString().split('T')[0],
    };
    onConvertApplicationToTask(task);
    onSaveBook({ ...book, isTaskCreated: true });
  };

  return (
    <div className="space-y-6 pb-24 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-[#F4F0F1]">مكتبة القراءة والتطبيق العملي</h1>
          <p className="text-xs text-[#AAA2A7] mt-0.5">
            الهدف ليس تكديس الصفحات، بل استخلاص فكرة جوهرية وتحويلها إلى ممارسة حية.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة كتاب جديد</span>
        </button>
      </div>

      {/* Tabs: Library vs What I Learned */}
      <div className="flex items-center gap-2 border-b border-[#30262B] pb-2">
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'library'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          المكتبة والكتب ({books.length})
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'insights'
              ? 'bg-[#151316] text-[#F4F0F1] border border-[#6D1028]'
              : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-[#922D48]" />
          <span>ماذا تعلمت؟ (الأفكار والتطبيقات)</span>
        </button>
      </div>

      {/* Tab 1: Library View */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'reading', label: 'قيد القراءة' },
              { id: 'to_read', label: 'قائمة الانتظار' },
              { id: 'completed', label: 'مكتمل' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  filterStatus === f.id
                    ? 'bg-[#6D1028] text-white'
                    : 'bg-[#151316] text-[#AAA2A7] hover:text-[#F4F0F1]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#151316] border border-[#30262B] text-center space-y-3">
              <p className="text-xs text-[#AAA2A7]">لا توجد كتب مسجلة في هذا القسم حاليًا.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1028] text-white text-xs font-bold hover:bg-[#922D48] transition"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة أول كتاب في خطتك</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredBooks.map((book) => {
                const progressPct =
                  book.totalPages && book.currentPage
                    ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
                    : 0;

                return (
                  <div
                    key={book.id}
                    className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-[#F4F0F1]">{book.title}</h3>
                          <div className="text-xs text-[#AAA2A7] mt-0.5">{book.author}</div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                            book.status === 'completed'
                              ? 'bg-[#3B0A18] text-[#922D48]'
                              : 'bg-[#0B0B0D] text-[#AAA2A7]'
                          }`}
                        >
                          {book.status === 'completed'
                            ? 'مكتمل'
                            : book.status === 'reading'
                            ? 'قيد القراءة'
                            : 'لم أبدأ'}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px] text-[#AAA2A7]">
                          <span>{progressPct}%</span>
                          <span>
                            {book.currentPage || 0} من {book.totalPages || '؟'} صفحة
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#0B0B0D] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6D1028] to-[#922D48] rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Practical Application Banner */}
                      {book.practicalApplication && (
                        <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B] space-y-1.5">
                          <div className="text-[11px] font-bold text-[#F4F0F1] flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-[#922D48]" />
                            <span>التطبيق العملي المستخلص:</span>
                          </div>
                          <p className="text-[11px] text-[#AAA2A7] leading-relaxed">
                            {book.practicalApplication}
                          </p>
                          {!book.isTaskCreated && (
                            <button
                              onClick={() => handleConvertToTask(book)}
                              className="text-[10px] text-[#922D48] hover:underline font-bold"
                            >
                              + تحويل إلى مهمة في خطتي اليومية
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#30262B]">
                      <button
                        onClick={() => onDeleteBook(book.id)}
                        className="p-1 rounded-lg text-[#AAA2A7] hover:text-red-400"
                        title="حذف الكتاب"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Quick page update buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const next = Math.min(book.totalPages || 999, (book.currentPage || 0) + 10);
                            onSaveBook({
                              ...book,
                              currentPage: next,
                              status: next >= (book.totalPages || 999) ? 'completed' : book.status,
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-[#0B0B0D] hover:bg-[#20151b] text-xs text-[#AAA2A7] hover:text-[#F4F0F1] border border-[#30262B] transition"
                        >
                          +10 صفحات
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: What I Learned Summary View */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#151316] border border-[#30262B] space-y-2">
            <h3 className="text-xs font-bold text-[#F4F0F1]">خلاصة الفكر والتطبيق العملي</h3>
            <p className="text-xs text-[#AAA2A7] leading-relaxed">
              هنا تجتمع الدروس المستفادة والاقتباسات والتطبيقات الواقعية لكل ما قرأته خلال رحلة الـ 214 يومًا.
            </p>
          </div>

          <div className="space-y-3">
            {books.filter((b) => b.practicalApplication || b.quotes.length > 0 || b.keyIdeas.length > 0).map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-[#151316] border border-[#30262B] space-y-3">
                <div className="flex items-center justify-between border-b border-[#30262B] pb-2">
                  <span className="text-xs text-[#AAA2A7]">{b.author}</span>
                  <h4 className="text-xs font-black text-[#F4F0F1]">كتاب: {b.title}</h4>
                </div>

                {b.practicalApplication && (
                  <div className="text-xs text-[#AAA2A7] leading-relaxed">
                    <strong className="text-[#F4F0F1]">التطبيق العملي:</strong> {b.practicalApplication}
                  </div>
                )}

                {b.quotes.length > 0 && (
                  <div className="p-3 rounded-2xl bg-[#0B0B0D] border border-[#30262B] text-xs text-[#AAA2A7] italic">
                    «{b.quotes[0]}»
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-[#0B0B0D] border border-[#30262B] p-6 text-right shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#30262B] pb-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1]"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-sm font-bold text-[#F4F0F1]">إضافة كتاب للمكتبة</h3>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">عنوان الكتاب</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: العادات الذرية"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">اسم المؤلف</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="مثال: جيمس كلير"
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">عدد الصفحات الكلي</label>
                  <input
                    type="number"
                    value={totalPages}
                    onChange={(e) => setTotalPages(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">الحالة</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BookItem['status'])}
                    className="w-full px-2.5 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none"
                  >
                    <option value="reading">قيد القراءة</option>
                    <option value="to_read">في قائمة الانتظار</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAA2A7] mb-1">فكرة جوهرية أو تطبيق عملي ستنفذه من الكتاب</label>
                <textarea
                  rows={2}
                  value={practicalApp}
                  onChange={(e) => setPracticalApp(e.target.value)}
                  placeholder="مثال: تصميم عادة تجهيز مساحة العمل قبل النوم بخمس دقائق..."
                  className="w-full px-3 py-2 rounded-xl bg-[#151316] border border-[#30262B] text-xs text-[#F4F0F1] focus:outline-none focus:border-[#6D1028]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#6D1028] hover:bg-[#922D48] text-white text-xs font-bold transition shadow-md"
                >
                  إضافة الكتاب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
