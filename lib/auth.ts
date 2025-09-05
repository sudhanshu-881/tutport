interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'admin';
  studentId?: string;
  grade?: string;
  department?: string;
}

// Mock authentication functions - replace with Supabase integration
export const loginUser = async (email: string, password: string, role: 'student' | 'admin') => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  if (email === 'student@test.com' && password === 'password') {
    return {
      id: '1',
      email,
      role,
      name: 'John Doe'
    };
  }
  
  if (email === 'admin@test.com' && password === 'password') {
    return {
      id: '2',
      email,
      role,
      name: 'Admin User'
    };
  }
  
  throw new Error('Invalid credentials');
};

export const signupUser = async (data: SignupData) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user creation
  return {
    id: Math.random().toString(36),
    email: data.email,
    role: data.role,
    name: data.fullName
  };
};

export const getCurrentUser = async () => {
  // Mock current user
  return {
    id: '1',
    email: 'student@test.com',
    role: 'student',
    name: 'John Doe'
  };
};