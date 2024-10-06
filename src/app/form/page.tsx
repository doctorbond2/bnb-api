'use client';
import { useUserContext } from '@/context/UserContext';
import { LoginInformation } from '@/models/types/Auth';
export default function Page() {
  const { login } = useUserContext();
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        const loginData: LoginInformation = {
          username: data.username as string,
          password: data.password as string,
        };
        await login(loginData);
      }}
    >
      <label>Name</label>
      <input name="username"></input>
      <label>Password</label>
      <input name="password"></input>
      <button type="submit">Submit</button>
    </form>
  );
}
