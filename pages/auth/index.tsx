import axios from 'axios';
import { useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Input from '@/components/Input';

import { z } from 'zod';
const authSchema = z.object({
  name: z.string().min(2, 'Name is required').optional(), // only required for registration
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [variant, setVariant] = useState('login');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) => (currentVariant === 'login' ? 'register' : 'login'));
  }, []);

  const validateForm = () => {
    try {
      authSchema.parse({
        name: variant === 'register' ? name : undefined,
        email,
        password,
      });
      setErrors({}); // Clear errors if validation passes
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        console.error(e)
        const fieldErrors: { name?: string; email?: string; password?: string } = {};
        
        e.errors.forEach(err => {
          if (err.path.includes('name')) {
            fieldErrors.name = err.message;
          }
          if (err.path.includes('email')) {
            fieldErrors.email = err.message;
          }
          if (err.path.includes('password')) {
            fieldErrors.password = err.message;
          }
        });
  
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const login = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      router.push('/profiles');
    } catch (error) {
      console.error(error);
    }
  }, [email, password, router]);

  const register = useCallback(async () => {
    if (!validateForm()) return;

    try {
      await axios.post('/api/register', {
        email,
        name,
        password,
      });

      login();
    } catch (error) {
      console.log(error);
    }
  }, [email, name, password, login]);

  return (
    <div className="relative h-full w-full bg-no-repeat bg-center bg-fixed bg-cover">
      <div className="w-full h-full lg:bg-opacity-50">
        <nav className="px-12 py-5">
          <img src="/images/logo.png" className="h-12" alt="Logo" />
        </nav>
        <div className="flex justify-center">
          <div className="px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
            <h2 className="text-white text-4xl mb-8 font-semibold">
              {variant === 'login' ? 'Sign in' : 'Register'}
            </h2>
            <div className="flex flex-col gap-4">
              {variant === 'register' && (
                <>
                  <Input
                    id="name"
                    type="text"
                    label="Username"
                    value={name}
                    onChange={(e: any) => setName(e.target.value)}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </>
              )}
              <Input
                id="email"
                type="email"
                label="Email address or phone number"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              
              <Input
                type="password"
                id="password"
                label="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <button
              onClick={variant === 'login' ? login : register}
              className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
            >
              {variant === 'login' ? 'Login' : 'Sign up'}
            </button>
            <div className="flex flex-row items-center gap-4 mt-8 justify-center">
              <div
                data-testid="googleIcon"
                onClick={() => signIn('google', { callbackUrl: '/profiles' })}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
              >
                <FcGoogle size={32} />
              </div>
              <div
                data-testid="githubIcon"
                onClick={() => signIn('github', { callbackUrl: '/profiles' })}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition"
              >
                <FaGithub size={32} />
              </div>
            </div>
            <p className="text-neutral-500 mt-12">
              {variant === 'login' ? 'First time using Action Sphere?' : 'Already have an account?'}
              <span
                onClick={toggleVariant}
                className="text-white ml-1 hover:underline cursor-pointer"
              >
                {variant === 'login' ? 'Create an account' : 'Login'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;