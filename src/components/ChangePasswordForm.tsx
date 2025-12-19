import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { changePassword, getStoredUserInfo } from '../api/auth';

export function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userInfo = getStoredUserInfo();

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const validateForm = () => {
    if (!formData.oldPassword) {
      setError('请输入当前密码');
      return false;
    }
    if (!formData.newPassword) {
      setError('请输入新密码');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('新密码至少需要6个字符');
      return false;
    }
    if (!formData.confirmPassword) {
      setError('请确认新密码');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('两次输入的新密码不一致');
      return false;
    }
    if (formData.oldPassword === formData.newPassword) {
      setError('新密码不能与当前密码相同');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    if (!userInfo?.id) {
      setError('用户信息获取失败，请重新登录');
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword(
        userInfo.id,
        formData.oldPassword,
        formData.newPassword
      );

      if (response.success) {
        setSuccess('密码修改成功！');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setError(response.message || '密码修改失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 当前密码 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-tight">
            当前密码
          </label>
          <div className="relative">
            <input
              type={showPasswords.old ? 'text' : 'password'}
              placeholder="请输入当前密码"
              value={formData.oldPassword}
              onChange={(e) => handleInputChange('oldPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('old')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* 新密码 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-tight">
            新密码
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="请输入新密码（至少6个字符）"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* 确认新密码 */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-tight">
            确认新密码
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="请再次输入新密码"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* 错误信息 */}
        {error && (
          <div className="p-3 bg-red-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-red-700 font-bold">
            {error}
          </div>
        )}

        {/* 成功信息 */}
        {success && (
          <div className="p-3 bg-green-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-green-700 font-bold">
            {success}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold uppercase tracking-tight"
        >
          {loading ? '修改中...' : '修改密码'}
        </button>
      </form>

      {/* 安全提示 */}
      <div className="mt-6 p-4 bg-yellow-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h4 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-tight">安全提示：</h4>
        <ul className="text-sm text-slate-700 space-y-1 font-mono">
          <li>• 密码长度至少6个字符</li>
          <li>• 建议使用字母、数字和符号的组合</li>
          <li>• 不要使用过于简单的密码</li>
          <li>• 定期更换密码以保证账户安全</li>
        </ul>
      </div>
    </div>
  );
}