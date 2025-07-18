import {
  Button,
  Checkbox,
  FileInput,
  Label,
  Radio,
  Select,
  Textarea,
  TextInput,
  ToggleSwitch,
} from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CustomForm() {
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const navigate = useNavigate();

  return (
    <form className='flex w-full max-w-4xl flex-col gap-4 border p-6 bg-white rounded-lg shadow-md'>
      <div>
        <div className='mb-2 block'>
          <Label htmlFor='email' className='!text-black'>
            Institute Email Address
          </Label>
        </div>
        <TextInput
          id='uid'
          type='text'
          placeholder='your-institution-email@university.edu'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          theme={{
            field: {
              input: {
                base: '!bg-gray-200 !text-gray-500 placeholder-gray-900 focus:bg-white',
              },
            },
          }}
        />
      </div>
      <div>
        <div className='mb-2 block'>
          <Label htmlFor='passcode' className='!text-black'>
            Passcode
          </Label>
        </div>
        <TextInput
          id='passcode'
          type='password'
          placeholder='KeepItSafe'
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          required
          theme={{
            field: {
              input: {
                base: '!bg-gray-200 !text-gray-500 placeholder-gray-400 focus:bg-white',
              },
            },
          }}
        />
      </div>
      <div className='flex items-center gap-2'>
        <Checkbox id='remember' />
        <Label htmlFor='remember' className='!text-black'>
          Remember me
        </Label>
      </div>
      <Button type='submit'>Sign In</Button>
      <div className='mb-8'>
        <a
          href='#'
          className='!text-black !underline text-base !hover:text-gray-200'
        >
          Forgot passcode?
        </a>
      </div>
      <Button
        type='button'
        className='w-full !bg-gray-500 text-white text-lg rounded-lg py-3 shadow hover:bg-gray-600 transition'
        onClick={() => navigate('/signup')}
      >
        Sign Up as a Verified Institution
      </Button>
    </form>
  );
}
