import { API_BASE_URL } from '../config/api';

// 检查用户是否已登录
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('auth_token');
}

// 获取存储的token
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// 获取存储的用户信息
export function getStoredUserInfo(): UserInfo | null {
  const userInfo = localStorage.getItem('user_info');
  return userInfo ? JSON.parse(userInfo) : null;
}

interface LoginPasswordParams {
  identifier: string; // 支持用户名、邮箱或手机号
  password: string;
  rememberPassword?: boolean;
  autoLogin?: boolean;
}

interface RegisterParams {
  username: string;
  password: string;
  nickname: string;
  email?: string;
  phone?: string;
  email_verification_code?: string; // 当提供邮箱时必填
}

interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  role: number;
  created_at: string;
}

interface LoginResponseData {
  user: UserInfo;
  access_token: string;
  refresh_token?: string;
  is_new_user?: boolean;
  message: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
}

// 密码登录
export async function loginWithPassword(params: LoginPasswordParams): Promise<ApiResponse<LoginResponseData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: params.identifier,
        password: params.password,
      }),
    });

    const result: ApiResponse<LoginResponseData> = await response.json();
    
    if (response.ok && result.success) {
      // 保存 token 和用户信息
      if (result.data?.access_token) {
        localStorage.setItem('auth_token', result.data.access_token);
        if (result.data.refresh_token) {
          localStorage.setItem('refresh_token', result.data.refresh_token);
        }
        if (result.data.user) {
          localStorage.setItem('user_info', JSON.stringify(result.data.user));
        }
      }
      return result;
    } else {
      return { 
        success: false, 
        message: result.message || '登录失败',
        error_code: result.error_code 
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// 密码重置 - 发送验证码
export async function sendPasswordResetCode(identifier: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier }),
    });

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Send password reset code error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// 重置密码
export async function resetPassword(identifier: string, verificationCode: string, newPassword: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier,
        verification_code: verificationCode,
        new_password: newPassword,
      }),
    });

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Reset password error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// 发送邮箱验证码
export async function sendEmailVerificationCode(email: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-email-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Send email verification code error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// 验证邮箱验证码
export async function verifyEmailCode(email: string, verificationCode: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        verification_code: verificationCode,
      }),
    });

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Verify email code error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// 登出
export async function logout(): Promise<void> {
  const token = localStorage.getItem('auth_token');
  
  // 清除本地存储的token
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  
  // 注意：当前API文档中没有logout接口，所以只清除本地token
  // 如果后端添加了logout接口，可以取消注释下面的代码
  /*
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  */
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<ApiResponse<UserInfo>> {
  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return { success: false, message: '未登录' };
  }

  // 注意：当前API文档中没有获取用户信息的接口
  // 通常会有 GET /auth/me 或类似的接口
  // 这里先返回本地存储的用户信息，如果有的话
  
  try {
    // 如果后端有用户信息接口，可以取消注释下面的代码
    /*
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result: ApiResponse<UserInfo> = await response.json();
    
    if (response.ok && result.success) {
      return result;
    } else {
      return { success: false, message: result.message || '获取用户信息失败' };
    }
    */
    
    // 临时实现：从localStorage获取用户信息
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      return {
        success: true,
        message: '获取用户信息成功',
        data: JSON.parse(userInfo)
      };
    } else {
      return { success: false, message: '用户信息不存在' };
    }
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, message: '网络错误，请稍后重试' };
  }
}

// 用户注册
export async function register(params: RegisterParams): Promise<ApiResponse<LoginResponseData>> {
  try {
    const requestBody: any = {
      username: params.username,
      password: params.password,
      nickname: params.nickname,
    };

    // 如果提供了邮箱，则添加邮箱和验证码
    if (params.email) {
      requestBody.email = params.email;
      if (params.email_verification_code) {
        requestBody.email_verification_code = params.email_verification_code;
      }
    }

    // 如果提供了手机号，则添加手机号
    if (params.phone) {
      requestBody.phone = params.phone;
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const result: ApiResponse<LoginResponseData> = await response.json();
    
    if (response.ok && result.success) {
      // 注册成功后自动登录，保存 token 和用户信息
      if (result.data?.access_token) {
        localStorage.setItem('auth_token', result.data.access_token);
        if (result.data.refresh_token) {
          localStorage.setItem('refresh_token', result.data.refresh_token);
        }
        if (result.data.user) {
          localStorage.setItem('user_info', JSON.stringify(result.data.user));
        }
      }
      return result;
    } else {
      return { 
        success: false, 
        message: result.message || '注册失败',
        error_code: result.error_code 
      };
    }
  } catch (error) {
    console.error('Register error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// 修改密码
export async function changePassword(userId: string, oldPassword: string, newPassword: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify({
        user_id: userId,
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });

    const result: ApiResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Change password error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}

// GitHub OAuth 登录
export async function githubOAuth(githubData: {
  github_id: string;
  username: string;
  nickname: string;
  email?: string;
  avatar_url?: string;
}): Promise<ApiResponse<LoginResponseData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(githubData),
    });

    const result: ApiResponse<LoginResponseData> = await response.json();
    
    if (response.ok && result.success) {
      // 保存 token 和用户信息
      if (result.data?.access_token) {
        localStorage.setItem('auth_token', result.data.access_token);
        if (result.data.refresh_token) {
          localStorage.setItem('refresh_token', result.data.refresh_token);
        }
        if (result.data.user) {
          localStorage.setItem('user_info', JSON.stringify(result.data.user));
        }
      }
      return result;
    } else {
      return { 
        success: false, 
        message: result.message || 'GitHub登录失败',
        error_code: result.error_code 
      };
    }
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return { 
      success: false, 
      message: '网络错误，请稍后重试' 
    };
  }
}