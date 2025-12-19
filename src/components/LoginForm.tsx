import { useState } from 'react';
import { Eye, EyeOff, User, Lock, KeyRound, Smartphone } from 'lucide-react';
import { loginWithPassword, sendPasswordResetCode, resetPassword } from '../api/auth';
import whaleImage from '../assets/d9cb467c4b6e8f1a34d1066e38b0c5a06ba5c55f.png';

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
  onSwitchToRegister: () => void;
}

export function LoginForm({ onLoginSuccess, onSwitchToRegister }: LoginFormProps) {
  const [loginMode, setLoginMode] = useState<'password' | 'code' | 'reset'>('password');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rememberPassword, setRememberPassword] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // --- 逻辑部分保持不变 ---
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginWithPassword({
        identifier,
        password,
        rememberPassword,
        autoLogin,
      });
      if (response.success) {
        onLoginSuccess(response.data?.user.username || identifier);
      } else {
        setError(response.message || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('验证码登录功能暂未开放，请使用密码登录');
    setLoading(false);
  };

  const handleSendLoginCode = async () => {
    if (!identifier) {
      setError('请输入用户名/手机/邮箱');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await sendPasswordResetCode(identifier);
      if (response.success) {
        setCodeSent(true);
        alert(response.message || '验证码已发送');
      } else {
        setError(response.message || '发送失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await resetPassword(identifier, verificationCode, newPassword);
      if (response.success) {
        alert('密码重置成功！请使用新密码登录');
        setLoginMode('password');
        setVerificationCode('');
        setNewPassword('');
        setCodeSent(false);
      } else {
        setError(response.message || '重置失败');
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = handleSendLoginCode;

  // --- UI 渲染部分 ---
  return (
    <div className="relative w-full max-w-md mx-auto pt-16 pb-8 font-mono">
      
      {/* 1. 吉祥物 (绝对定位在卡片顶部) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="relative group cursor-pointer">
          <img 
            src={whaleImage} 
            alt="Whale" 
            className="w-28 h-28 object-contain drop-shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300" 
          />
          {/* 气泡装饰 */}
          <div className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-2xl">❤️</span>
          </div>
        </div>
      </div>

      {/* 2. 主卡片容器 */}
      <div className="bg-white border-[6px] border-blue-700 rounded-3xl shadow-2xl overflow-visible relative z-10">
        
        <div className="p-8 pt-16">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-blue-800 tracking-tighter mb-2" style={{ textShadow: '2px 2px 0px #bae6fd' }}>
              Whaletown
            </h1>
            <p className="text-slate-500 font-bold text-sm tracking-wide">
              开始你的小镇之旅！
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-600 text-sm font-bold animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* 表单区域 */}
          {loginMode === 'reset' ? (
             // --- 重置密码界面 ---
            <div>
              <div className="text-center mb-4">
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold border-2 border-red-200">
                  重置密码模式
                </span>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input
                    type="text"
                    placeholder="账号/手机/邮箱"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-colors font-bold text-slate-700"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="验证码"
                    className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-bold"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    disabled={loading || codeSent}
                    className="px-4 bg-blue-100 text-blue-700 border-2 border-blue-200 rounded-xl font-bold hover:bg-blue-200 disabled:opacity-50 text-sm whitespace-nowrap"
                  >
                    {codeSent ? '已发送' : '获取验证码'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input
                    type="password"
                    placeholder="新密码"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-bold"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-3.5 rounded-xl shadow-[0_4px_0_#991b1b] hover:shadow-[0_2px_0_#991b1b] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px] transition-all mt-2"
                >
                  确认重置
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMode('password')}
                  className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 py-2"
                >
                  取消
                </button>
              </form>
            </div>
          ) : (
            // --- 正常登录界面 (Tab 切换) ---
            <div>
              {/* Tab 切换 */}
              <div className="bg-slate-100 p-1.5 rounded-xl flex mb-6 border-2 border-slate-200">
                <button
                  onClick={() => setLoginMode('password')}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                    loginMode === 'password'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-white hover:text-slate-700'
                  }`}
                >
                  [ 密码登录 ]
                </button>
                <button
                  onClick={() => setLoginMode('code')}
                  className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                    loginMode === 'code'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-500 hover:bg-white hover:text-slate-700'
                  }`}
                >
                  [ 验证码登录 ]
                </button>
              </div>

              <form onSubmit={loginMode === 'password' ? handlePasswordLogin : handleCodeLogin} className="space-y-4">
                
                {/* 账号输入 */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {loginMode === 'password' ? <User size={20} /> : <Smartphone size={20} />}
                  </div>
                  <input
                    type="text"
                    placeholder={loginMode === 'password' ? "用户名/手机/邮箱" : "手机号码"}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-normal"
                    required
                  />
                </div>

                {/* 密码/验证码输入 */}
                {loginMode === 'password' ? (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="请输入密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-normal"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <div className="relative flex-1 group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500">
                        <KeyRound size={20} />
                      </div>
                      <input
                        type="text"
                        placeholder="输入验证码"
                        className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-slate-300 rounded-xl focus:border-blue-600 outline-none font-bold"
                        required
                      />
                    </div>
                    <button type="button" className="px-4 bg-slate-100 text-slate-600 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-200 text-sm">
                      获取
                    </button>
                  </div>
                )}

                {/* 选项行：记住密码 & 自动登录 */}
                {loginMode === 'password' && (
                  <div className="flex items-center justify-between px-1">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${rememberPassword ? 'bg-blue-600 border-blue-600' : 'border-slate-400 bg-white'}`}>
                          {rememberPassword && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={rememberPassword}
                          onChange={(e) => setRememberPassword(e.target.checked)}
                        />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">记住密码</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                         <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${autoLogin ? 'bg-blue-600 border-blue-600' : 'border-slate-400 bg-white'}`}>
                          {autoLogin && <span className="text-white text-xs">✓</span>}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={autoLogin}
                          onChange={(e) => setAutoLogin(e.target.checked)}
                        />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600">自动登录</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 登录大按钮 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-lg font-black py-4 rounded-xl shadow-[0_6px_0_#1e3a8a] hover:shadow-[0_3px_0_#1e3a8a] hover:translate-y-[3px] active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? '🚀 连接中...' : '进入小镇'}
                </button>

                {/* 底部链接 */}
                <div className="flex justify-between items-center pt-2 px-2 text-sm font-bold">
                  <button
                    type="button"
                    onClick={() => setLoginMode('reset')}
                    className="text-slate-500 hover:text-blue-600 underline decoration-2 decoration-transparent hover:decoration-blue-600 transition-all"
                  >
                    忘记密码?
                  </button>
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-slate-500 hover:text-blue-600 underline decoration-2 decoration-transparent hover:decoration-blue-600 transition-all"
                  >
                    注册居民身份
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* 3. 南瓜书装饰 (右下角) */}
      <div className="absolute -bottom-4 -right-12 z-10 hidden md:block transform rotate-6 hover:rotate-0 transition-transform duration-300">
        <div className="w-28 h-36 bg-orange-400 rounded-r-lg border-4 border-orange-800 shadow-xl relative flex flex-col items-center justify-center">
          {/* 书脊细节 */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-orange-600 border-r-2 border-orange-800 opacity-50"></div>
          
          {/* 封面文字 */}
          <div className="text-center transform -rotate-12">
            <div className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Pumpkin</div>
            <div className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Book</div>
            <div className="text-3xl mt-1 drop-shadow-md">🎃</div>
          </div>

          {/* 书页厚度效果 */}
          <div className="absolute -bottom-2 left-2 right-2 h-2 bg-white border-2 border-orange-800 rounded-b-sm"></div>
        </div>
      </div>
    </div>
  );
}