import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  Compass,
  FileSignature,
  FileText,
  Heart,
  Home,
  Layers,
  Mail,
  Menu,
  RotateCcw,
  Settings,
  Sparkles,
  TrendingUp,
  Wrench,
  X,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'tasks'
  | 'roadmap'
  | 'pillars'
  | 'contract'
  | 'challenges'
  | 'reading'
  | 'skills'
  | 'journal'
  | 'time'
  | 'experiences'
  | 'fitness'
  | 'archive'
  | 'achievements'
  | 'root_cause'
  | 'letter'
  | 'post_journey'
  | 'settings';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingTasksCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  pendingTasksCount,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs: { id: NavTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'tasks', label: 'المهام', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'roadmap', label: 'الخريطة', icon: Calendar },
    { id: 'pillars', label: 'الشجرة', icon: Layers },
  ];

  const allSections = [
    {
      group: 'المحاور والخطط اليومية',
      items: [
        { id: 'dashboard' as NavTab, label: 'لوحة القيادة الرئيسية', icon: Home },
        { id: 'tasks' as NavTab, label: 'مهام اليوم ونظام التدرج', icon: CheckSquare, badge: pendingTasksCount },
        { id: 'roadmap' as NavTab, label: 'خريطة الـ 214 يومًا', icon: Calendar },
        { id: 'pillars' as NavTab, label: 'شجرة تطوير الشخصية والمقياس', icon: Layers },
        { id: 'contract' as NavTab, label: 'عقد المرحلة الحالية', icon: FileSignature },
        { id: 'challenges' as NavTab, label: 'التحديات ومولّد العادات', icon: Sparkles },
      ],
    },
    {
      group: 'التطوير والتطبيق العملي',
      items: [
        { id: 'reading' as NavTab, label: 'مكتبة القراءة والتطبيق', icon: BookOpen },
        { id: 'skills' as NavTab, label: 'مشروع المهارة والتطبيق', icon: Wrench },
        { id: 'journal' as NavTab, label: 'دفتر اكتشاف الذات والتأمل', icon: Compass },
        { id: 'time' as NavTab, label: 'تنظيم الوقت والمخطط اليومي', icon: Clock },
        { id: 'experiences' as NavTab, label: 'تجارب أريد خوضها', icon: Sparkles },
        { id: 'fitness' as NavTab, label: 'المتابعة البدنية والنشاط (اختياري)', icon: Activity },
      ],
    },
    {
      group: 'التحليل والتوثيق والختام',
      items: [
        { id: 'archive' as NavTab, label: 'أرشيف التغيير والصور والتقارير', icon: FileText },
        { id: 'achievements' as NavTab, label: 'الألقاب والإنجازات وبنك المكافآت', icon: Award },
        { id: 'root_cause' as NavTab, label: 'تحليل أسباب التعثر السلوكي', icon: TrendingUp },
        { id: 'letter' as NavTab, label: 'رسالة اليوم 214 (كبسولة الزمن)', icon: Mail },
        { id: 'post_journey' as NavTab, label: 'خطة ما بعد اليوم 214', icon: RotateCcw },
        { id: 'settings' as NavTab, label: 'الإعدادات والنسخ الاحتياطي', icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Bottom Floating Navigation Bar */}
      <nav
        aria-label="التنقل الرئيسي"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0D]/95 backdrop-blur-lg border-t border-[#30262B] px-3 py-2 pb-safe select-none"
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition ${
                  isActive
                    ? 'text-[#F4F0F1] font-bold'
                    : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
                }`}
              >
                <div className="relative">
                  <div
                    className={`p-1.5 rounded-xl transition ${
                      isActive ? 'bg-[#6D1028] text-[#F4F0F1]' : 'hover:bg-[#151316]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#922D48] text-[9px] font-black text-white">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[11px] mt-1">{tab.label}</span>
              </button>
            );
          })}

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition ${
              drawerOpen ? 'text-[#F4F0F1] font-bold' : 'text-[#AAA2A7] hover:text-[#F4F0F1]'
            }`}
          >
            <div className="p-1.5 rounded-xl hover:bg-[#151316]">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-1">المزيد</span>
          </button>
        </div>
      </nav>

      {/* Slide-out Full Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
          <div className="w-full max-h-[85vh] bg-[#0B0B0D] border-t border-[#30262B] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#30262B]">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#F4F0F1]">أقسام ABSKA — 214</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#151316] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto p-4 space-y-6 pb-12 text-right">
              {allSections.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2">
                  <h4 className="text-xs font-bold text-[#AAA2A7] px-2">{group.group}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectTab(item.id);
                            setDrawerOpen(false);
                          }}
                          className={`flex items-center justify-between p-3 rounded-2xl border text-right transition ${
                            isActive
                              ? 'bg-[#151316] border-[#6D1028] text-[#F4F0F1] shadow-inner'
                              : 'bg-[#0B0B0D] border-[#30262B] text-[#AAA2A7] hover:text-[#F4F0F1] hover:bg-[#151316]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-xl ${
                                isActive ? 'bg-[#6D1028] text-white' : 'bg-[#151316] text-[#AAA2A7]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-[#F4F0F1]">{item.label}</span>
                          </div>
                          {item.badge && item.badge > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#6D1028] text-white text-[10px] font-bold">
                              {item.badge}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
