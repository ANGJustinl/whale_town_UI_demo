import React, { useState } from 'react';
import { 
  Trophy, 
  Settings, 
  LogOut, 
  Map as MapIcon, 
  Database, 
  Factory, 
  Briefcase, 
  Coffee, 
  Cpu, 
  Mountain,
  User,
  X
} from 'lucide-react';
import { getStoredUserInfo, logout } from '../api/auth';
import { ChangePasswordForm } from './ChangePasswordForm';
import bgImage from '../assets/bg.jpg';

// -----------------------------------------------------------------------------
// 类型与数据定义
// -----------------------------------------------------------------------------

interface DashboardProps {
  onLogout: () => void;
}

// 模拟地图上的区域数据
const ZONES = [
  {
    id: 'port',
    title: '鲸之港 (Whale Port)',
    desc: '系统主控中心与调度枢纽',
    icon: <MapIcon size={32} />,
    color: 'bg-blue-500',
    accent: 'border-blue-700',
    shadow: 'shadow-blue-900',
    bgPattern: 'bg-blue-50'
  },
  {
    id: 'factory',
    title: '模型工厂 (Model Factory)',
    desc: 'AI 模型训练与流水线管理',
    icon: <Factory size={32} />,
    color: 'bg-slate-600',
    accent: 'border-slate-800',
    shadow: 'shadow-slate-900',
    bgPattern: 'bg-slate-100'
  },
  {
    id: 'pumpkin',
    title: '南瓜谷 (Pumpkin Valley)',
    desc: '计算资源监控与农场',
    icon: <Database size={32} />,
    color: 'bg-orange-500',
    accent: 'border-orange-700',
    shadow: 'shadow-orange-900',
    bgPattern: 'bg-orange-50'
  },
  {
    id: 'kernel',
    title: '内核岛 (Kernel Island)',
    desc: '核心配置与密钥管理',
    icon: <Cpu size={32} />,
    color: 'bg-purple-500',
    accent: 'border-purple-700',
    shadow: 'shadow-purple-900',
    bgPattern: 'bg-purple-50'
  },
  {
    id: 'offer',
    title: 'Offer 城 (Career City)',
    desc: '用户简历与面试记录',
    icon: <Briefcase size={32} />,
    color: 'bg-indigo-500',
    accent: 'border-indigo-700',
    shadow: 'shadow-indigo-900',
    bgPattern: 'bg-indigo-50'
  },
  {
    id: 'beach',
    title: '摸鱼海滩 (Fish Beach)',
    desc: '社区讨论与休息区',
    icon: <Coffee size={32} />,
    color: 'bg-yellow-400',
    accent: 'border-yellow-600',
    shadow: 'shadow-yellow-800',
    bgPattern: 'bg-yellow-50',
    textColor: 'text-yellow-900' // 特殊处理浅色背景文字
  },
  {
    id: 'ladder',
    title: '天梯峰 (Ladder Peak)',
    desc: '排行榜与挑战赛',
    icon: <Mountain size={32} />,
    color: 'bg-emerald-500',
    accent: 'border-emerald-700',
    shadow: 'shadow-emerald-900',
    bgPattern: 'bg-emerald-50'
  },
  {
    id: 'ruins',
    title: '数据遗迹 (Data Ruins)',
    desc: '历史归档与日志回溯',
    icon: <Trophy size={32} />,
    color: 'bg-teal-600',
    accent: 'border-teal-800',
    shadow: 'shadow-teal-900',
    bgPattern: 'bg-teal-50'
  },
];

// -----------------------------------------------------------------------------
// 组件实现
// -----------------------------------------------------------------------------

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const userInfo = getStoredUserInfo();

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    // 1. 全局背景：使用 CSS 径向渐变模拟点阵纸/复古显示器背景
    <div className="min-h-screen font-mono selection:bg-pink-500 selection:text-white"
         style={{
           backgroundColor: '#e0e7ff',
           backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)',
           backgroundSize: '24px 24px'
         }}>
      
      {/* 2. 顶部 HUD (Head-Up Display) */}
      <header className="sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* 左侧：Logo区域 */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 border-4 border-black flex items-center justify-center text-white text-2xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
              W
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                WHALE<span className="text-blue-600">TOWN</span>
              </h1>
              <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                SYSTEM ONLINE
              </div>
            </div>
          </div>

          {/* 右侧：用户信息面板 */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-slate-800">LV.1 {userInfo?.nickname || 'Traveller'}</span>
              <div className="w-32 h-4 bg-slate-200 border-2 border-black rounded-full overflow-hidden relative">
                <div className="absolute top-0 left-0 h-full w-[60%] bg-green-400"></div>
              </div>
            </div>
            
            {/* 设置按钮 */}
            <button 
              onClick={() => setShowChangePassword(true)}
              className="p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            
            {/* 退出按钮 */}
            <button 
              onClick={handleLogout}
              className="px-4 py-3 bg-red-500 text-white font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none flex items-center gap-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">EJECT</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. 主内容区 */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:px-8 pb-20">
        
        {/* 欢迎横幅 */}
        <div className="mb-8 text-center md:text-left">
           <div className="inline-block bg-yellow-300 border-2 border-black px-4 py-1 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 mb-4">
             🚧 Early Access Build v0.9
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
             Select Your <br className="md:hidden"/> Destination
           </h2>
        </div>

        {/* 背景图片展示区 */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <img 
              src={bgImage} 
              alt="Whaletown Map" 
              className="max-w-full h-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg"
              style={{ maxHeight: '400px' }}
            />
            {/* 图片装饰框 */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 border-2 border-black"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-2 border-black"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 border-2 border-black"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-yellow-500 border-2 border-black"></div>
            
            {/* 图片标签 */}
            <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
              🗺️ TOWN MAP
            </div>
          </div>
        </div>

        {/* 卡片网格：完全响应式 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ZONES.map((zone) => (
            <div 
              key={zone.id}
              onClick={() => setActiveZone(zone.id)}
              className={`
                group relative h-64 cursor-pointer transition-all duration-200 
                border-4 border-black bg-white
                hover:-translate-y-2 
                hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                flex flex-col
              `}
            >
              {/* 卡片顶部色块 */}
              <div className={`h-24 ${zone.color} border-b-4 border-black relative overflow-hidden flex items-center justify-center group-hover:bg-opacity-90 transition-colors`}>
                {/* 装饰性背景纹理 */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }} 
                />
                <div className={`text-white drop-shadow-md transform group-hover:scale-110 transition-transform duration-300 ${zone.textColor || ''}`}>
                  {zone.icon}
                </div>
              </div>

              {/* 卡片内容 */}
              <div className={`flex-1 p-4 flex flex-col justify-between ${zone.bgPattern}`}>
                <div>
                  <h3 className="font-black text-lg text-slate-800 leading-tight mb-2 group-hover:text-blue-700">
                    {zone.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    {zone.desc}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5">
                     ZONE-{zone.id.toUpperCase().substring(0,3)}
                   </span>
                   <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                </div>
              </div>

              {/* 选中状态指示器 (仅视觉装饰) */}
              {activeZone === zone.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-2 border-black flex items-center justify-center text-white text-xs font-bold z-10 shadow-sm animate-bounce">
                  !
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 4. 底部状态栏装饰 */}
        <div className="mt-16 border-t-4 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 font-bold text-sm">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-500 border-2 border-black"></div>
            <div className="w-4 h-4 bg-yellow-500 border-2 border-black"></div>
            <div className="w-4 h-4 bg-blue-500 border-2 border-black"></div>
            <span>SYSTEM STATUS: NORMAL</span>
          </div>
          <div>
            © 2025 WHALETOWN OS. ALL RIGHTS RESERVED.
          </div>
        </div>

      </main>

      {/* 模拟 CRT 扫描线效果 (可选，增加复古感) */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))]" style={{backgroundSize: '100% 2px, 3px 100%'}}></div>

      {/* 密码修改模态框 */}
      {showChangePassword && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowChangePassword(false)}
          ></div>
          
          {/* 模态框内容 */}
          <div className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* 模态框头部 */}
            <div className="bg-blue-600 border-b-4 border-black p-4 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                修改密码
              </h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* 模态框内容 */}
            <div className="p-6">
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}