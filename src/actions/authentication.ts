import { SignUpType } from '../../types/typesdefinitions';
export async function signUp(formData: SignUpType) {

  // Call the provider to create a user...
  const submitData = { termsandconditions: 1, ...formData}
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submitData),
  });

  if (!response.ok) {
    throw new Error("Signup failed. Please try again.");
  }
  const user = await response.json();
  const {careconnect } = user
  const id= careconnect.clientId || careconnect.practitionerId
  // 4. Create user session
  localStorage.setItem('user', JSON.stringify(careconnect));
  // 5. Redirect user
  //redirect(`/profile/${id}`)
  return careconnect;
}
export async function logout() {
  localStorage.removeItem('user')
 // redirect('/login')
}
