'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from "@/context/AuthContext";
import { SignUpType, FormData } from '../../types/typesdefinitions';
import SignUpMessage from './SignUpMessage';
import { signUp } from '@/actions/authentication';
import { useRouter } from 'next/navigation';
import { formSchema } from '@/actions/validation';

const SignUp: React.FC = () => {
  const userData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    appUpdatesConsent: 0,
    accountOption: 'client'
  }
  const [signUpData, setSignUpData] = useState<SignUpType>(userData);
  const [verifyPassword, setVerifyPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Partial<FormData>| any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setAuthState } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data using Zod schema
    try {
      const validatedFields = formSchema.safeParse({
        firstname: signUpData.firstname,
        lastname: signUpData.lastname,
        email: signUpData.email,
        password: signUpData.password,
        confirmPassword: verifyPassword

      })
      // If any form fields are invalid, return early
      if (!validatedFields.success) {
        const errors: Partial<FormData> = {
          errors: validatedFields.error.flatten().fieldErrors
        };
        setFormErrors((prevError:  Partial<FormData>) => ({
          ...prevError,
          ...errors
        })); // Show validation errors
        setIsSubmitting(false); // Reset submission state
        return; // Exit early if validation fails
      }

      setFormErrors({}); // Clear errors if valid
      // Handle successful submission
      const signUpUser = await signUp(signUpData);
      const { role, token, id } = signUpUser;;
      setAuthState(signUpUser);
      document.cookie = `token=${token};  path=/;  samesite=strict`
      setIsSubmitting(false); // Reset submission state
      // 5. Redirect user
      router.push(`/profile/${role}/${id}`);

    } catch (error: unknown) {
      throw new Error(`${error}`);
    }
  }
  const handleVerifyPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setVerifyPassword(value);
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormErrors((prevState: Partial<FormData>) => ({
      ...prevState,
      errors: {
        [name]: null
      }
    }))
    setSignUpData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));

  }

  return (
    <>
      <section className="container px-0 mx-auto md:container md:mx-auto bg-white">
        <div className="lg:grid lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <Image
              alt="Video call with a doctor"
              layout="fill" // Fills the parent container
              objectFit="cover" // Ensures aspect ratio is maintained
              src="/images/istockphoto.jpg"
              className="w-full h-full absolute inset-0 object-cover opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <SignUpMessage
                linkClass='block text-white'
                headlineClass='mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl'
                paragraphClass='text-white/90'
              />
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <SignUpMessage
                  linkClass='inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20'
                  headlineClass='mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl'
                  paragraphClass='mt-4 leading-relaxed text-gray-500'
                />
              </div>

              <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>

                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.firstname || ''}
                    onChange={handleChange}
                  />
                  {formErrors?.errors?.firstname && <p className="text-red-500">{formErrors.errors.firstname}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>

                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.lastname || ''}
                    onChange={handleChange}
                  />
                  {formErrors?.errors?.lastname && <p className="text-red-500">{formErrors.errors.lastname}</p>}
                </div>

                <div className="col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700"> Email </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.email || ''}
                    onChange={handleChange}
                  />
                  {formErrors?.errors?.email && <p className="text-red-500">{formErrors.errors.email}</p>}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700"> Password </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={signUpData?.password || ''}
                    onChange={handleChange}
                  />
                  {formErrors?.errors?.password && (
                    <div>
                      <p>Password must:</p>
                      <ul>
                        {formErrors.errors.password.map((error) => (
                          <li key={error} className="text-red-500">- {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Password Confirmation
                  </label>

                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    value={verifyPassword || ''}
                    onChange={handleVerifyPasswordChange}
                  />
                  {formErrors?.errors?.confirmPassword && (
                    <div>
                      <p>Password must:</p>
                      <ul>
                        {formErrors.errors.confirmPassword.map((error: any) => (
                          <li key={error} className="text-red-500">- {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="col-span-3">
                  <label htmlFor="client"
                    className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                    <div>
                      <p className="text-gray-700">Client</p>
                      <p className="mt-1 text-gray-900">eg:(Patient)</p>
                    </div>
                    <input
                      id="client"
                      name="accountOption"
                      type="radio"
                      value="client"
                      className="size-5 border-gray-300 text-blue-500"
                      checked={signUpData?.accountOption === 'client'}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="col-span-3">
                  <label
                    htmlFor="practitioner"
                    className="flex cursor-pointer justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                    <div>
                      <p className="text-gray-700">Practitioner</p>
                      <p className="mt-1 text-gray-900">eg: (Doctor, Nurse etc)</p>
                    </div>
                    <input
                      id="practitioner"
                      name="accountOption"
                      type="radio"
                      className="size-5 border-gray-300 text-blue-500"
                      value="practitioner"
                      checked={signUpData?.accountOption === 'practitioner'}
                      onChange={handleChange}
                    />
                  </label>
                </div>

                <div className="col-span-6">
                  <label htmlFor="appUpdatesConsent" className="flex gap-4">
                    <input
                      type="checkbox"
                      id="appUpdatesConsent"
                      name="appUpdatesConsent"
                      className="size-5 rounded-md border-gray-200 bg-white shadow-sm"
                      checked={!!signUpData?.appUpdatesConsent}
                      onChange={handleChange}
                    />

                    <span className="text-sm text-gray-700">
                      I want to receive emails about account status, product updates and company announcements.
                    </span>
                  </label>
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our
                    <Link href="#" className="text-gray-700 underline"> terms and conditions </Link>
                    and
                    <Link href="#" className="text-gray-700 underline"> privacy policy</Link>.
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button className="inline-block shrink-0 rounded-md border border-blue-600
                   bg-blue-600  px-12 py-3 text-sm font-medium text-white transition w-full md:w-auto
                    hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                     disabled={isSubmitting}
                    type="submit"
                  >
                    Create an account
                  </button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?
                    <Link href="/" className="text-gray-700 underline">Log in</Link>.
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>

    </>
  )
}

export default SignUp;