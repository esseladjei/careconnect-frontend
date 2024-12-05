import { SignUpType } from '../../types/typesdefinitions';
export async function signUp(formData: SignUpType) {

  // Call the provider to create a user...
  const submitData = { termsandconditions: 1, ...formData}
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/account/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submitData),
  });

  if (!response.ok) {
      const failedResponse =  await response.json();
      return new Error(`Sigup failed, ${failedResponse.careconnect.message}`);
  }
  const user = await response.json();
  const {careconnect } = user
  return careconnect;
}
export async function logout() {
  localStorage.removeItem('user')
 // redirect('/login')
}
