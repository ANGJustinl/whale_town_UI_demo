import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Smartphone, KeyRound, Smile } from 'lucide-react';
import { register, sendEmailVerificationCode } from '../api/auth';
import whaleImage from '../assets/d9cb467c4b6e8f1a34d1066e38b0c5a06ba5c55f.png';

interface RegisterFormProps {
  onRegisterSuccess: (username: string) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onRegisterSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
    email: '',
    phone: '',
    emailCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // --- 逻辑部分 (保持原有逻辑，增加useEffect处理倒计时清除) ---
  
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setEmailCodeSent(false);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSendEmailCode = async () => {
    if (!formData.email) {
      setError('请先输入邮箱地址');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('邮箱格式不正确');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await sendEmailVerificationCode(formData.email);
      if (response.success) {
        setEmailCodeSent(true);
        setCountdown(60);
        alert('验证码已发送，请查收邮箱');
      } else {
        setError(response.message || '发送验证码失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) { setError('请输入用户名'); return false; }
    if (formData.username.length < 3) { setError('用户名至少需要3个字符'); return false; }
    if (!formData.password) { setError('请输入密码'); return false; }
    if (formData.password.length < 6) { setError('密码至少需要6个字符'); return false; }
    if (!formData.nickname.trim()) { setError('请输入昵称'); return false; }
    if (!formData.email.trim()) { setError('请输入邮箱'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) { setError('邮箱格式不正确'); return false; }
    if (formData.phone.trim()) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone)) { setError('手机号格式不正确'); return false; }
    }
    if (!formData.emailCode.trim()) { setError('请输入邮箱验证码'); return false; }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const registerData: any = {
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
        email: formData.email,
        email_verification_code: formData.emailCode,
      };
      if (formData.phone.trim()) {
        registerData.phone = formData.phone;
      }
      const response = await register(registerData);
      if (response.success) {
        onRegisterSuccess(response.data?.user.username || formData.username);
      } else {
        setError(response.message || '注册失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // --- UI 渲染 ---
  return (
    <div className="relative w-full max-w-md mx-auto pt-16 pb-8 font-mono">
      
      {/* 1. 吉祥物 (悬浮效果) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="relative group cursor-pointer">
          <img 
            src={whaleImage} 
            alt="Whale" 
            className="w-24 h-24 object-contain drop-shadow-xl transform group-hover:-translate-y-2 transition-transform duration-300" 
          />
          <div className="absolute -right-6 top-4 bg-yellow-300 border-2 border-black px-2 py-0.5 rounded-lg text-xs font-bold transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity">
            New!
          </div>
        </div>
      </div>

      {/* 2. 主卡片 */}
      <div className="bg-white border-[6px] border-blue-700 rounded-3xl shadow-2xl relative z-10">
        <div className="p-8 pt-12">
          
          {/* 标题 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-blue-800 tracking-tighter mb-1">
              居民登记处
            </h1>
            <p className="text-slate-500 font-bold text-xs">
              填写信息领取你的小镇身份证
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-2 text-red-600 text-xs font-bold animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            
            {/* 用户名 */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="用户名 (登录用)"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 text-sm"
                required
              />
            </div>

            {/* 昵称 */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Smile size={18} />
              </div>
              <input
                type="text"
                placeholder="昵称 (大家怎么称呼你)"
                value={formData.nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 text-sm"
                required
              />
            </div>

            {/* 密码 */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="设置密码 (至少6位)"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* 邮箱 */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="电子邮箱"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 text-sm"
                required
              />
            </div>

            {/* 验证码组合 */}
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600">
                  <KeyRound size={18} />
                </div>
                <input
                  type="text"
                  placeholder="邮箱验证码"
                  value={formData.emailCode}
                  onChange={(e) => handleInputChange('emailCode', e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 text-sm"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendEmailCode}
                disabled={loading || emailCodeSent || !formData.email}
                className={`px-3 rounded-xl font-bold text-xs whitespace-nowrap border-2 transition-all ${
                  emailCodeSent 
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-200 hover:border-yellow-400'
                }`}
              >
                {emailCodeSent ? `${countdown}s 后重试` : '获取验证码'}
              </button>
            </div>

            {/* 手机号 (可选) */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors">
                <Smartphone size={18} />
              </div>
              <input
                type="tel"
                placeholder="手机号码 (可选)"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-green-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-700 text-sm"
              />
            </div>

            {/* 注册大按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-400 text-white text-lg font-black py-4 rounded-xl shadow-[0_5px_0_#15803d] hover:shadow-[0_2px_0_#15803d] hover:translate-y-[3px] active:shadow-none active:translate-y-[5px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? '📝 正在登记...' : '🎉 加入小镇'}
            </button>
          </form>

          {/* 底部返回链接 */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-slate-400 font-bold text-sm hover:text-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <span>←</span>
              <span>已有居民身份？去登录</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. 南瓜书装饰 (复用，保持一致性) */}
      <div className="absolute -bottom-4 -left-8 z-10 hidden md:block transform -rotate-6 hover:rotate-0 transition-transform duration-300">
         <div className="w-24 h-32 bg-green-400 rounded-l-lg border-4 border-green-800 shadow-xl relative flex flex-col items-center justify-center">
          <div className="absolute right-0 top-0 bottom-0 w-3 bg-green-600 border-l-2 border-green-800 opacity-50"></div>
          <div className="text-center transform rotate-6">
            <div className="text-[9px] font-black text-green-900 uppercase tracking-widest">Guide</div>
            <div className="text-2xl mt-1 drop-shadow-md">🗺️</div>
          </div>
          <div className="absolute -bottom-2 left-2 right-2 h-2 bg-white border-2 border-green-800 rounded-b-sm"></div>
        </div>
      </div>
    </div>
  );
}