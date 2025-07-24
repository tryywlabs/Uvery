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

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
}

interface CustomFormProps {
  title?: string;
  fields: FormField[];
  submitButtonText: string;
  onSubmit: (formData: Record<string, any>) => void;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  linkButton?: {
    text: string;
    href: string;
  };
}

export function CustomForm({
  title,
  fields,
  submitButtonText,
  onSubmit,
  showRememberMe = false,
  showForgotPassword = false,
  secondaryButton,
  linkButton,
}: CustomFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (showRememberMe) {
      submitData.rememberMe = rememberMe;
    }
    onSubmit(submitData);
  };

  const renderField = (field: FormField) => {
    const baseTheme = {
      field: {
        input: {
          base: '!bg-gray-200 !text-gray-500 placeholder-gray-400 focus:bg-white',
        },
      },
    };

    switch (field.type) {
      case 'select':
        return (
          <Select
            id={field.id}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            className='!bg-gray-200 !text-gray-500 placeholder-gray-400 rounded-lg'
            theme={{
              field: {
                select: {
                  base: '!bg-gray-200 !text-gray-500 placeholder-gray-400 focus:bg-white',
                },
              },
            }}
          >
            <option value='' className='text-gray-400'>
              {field.placeholder || 'Select an option'}
            </option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );

      case 'textarea':
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            required={field.required}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );

      case 'file':
        return (
          <FileInput
            id={field.id}
            required={field.required}
            onChange={(e) => handleInputChange(field.id, e.target.files?.[0])}
          />
        );

      default:
        return (
          <TextInput
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            theme={baseTheme}
          />
        );
    }
  };

  return (
    <form
      className='flex w-full max-w-4xl flex-col gap-4 border p-6 bg-white rounded-lg shadow-md'
      onSubmit={handleSubmit}
    >
      {title && <h2 className='text-xl font-bold text-black mb-4'>{title}</h2>}

      {fields.map((field) => (
        <div key={field.id}>
          <div className='mb-2 block'>
            <Label htmlFor={field.id} className='!text-black'>
              {field.label}
            </Label>
          </div>
          {renderField(field)}
        </div>
      ))}

      {showRememberMe && (
        <div className='flex items-center gap-2'>
          <Checkbox
            id='remember'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Label htmlFor='remember' className='!text-black'>
            Remember me
          </Label>
        </div>
      )}

      <Button type='submit' className='w-full'>
        {submitButtonText}
      </Button>

      {showForgotPassword && (
        <div className='mb-4'>
          <a
            href='#'
            className='!text-black !underline text-base hover:text-gray-600'
          >
            Forgot passcode?
          </a>
        </div>
      )}

      {linkButton && (
        <div className='mb-4'>
          <a
            href={linkButton.href}
            className='!text-black !underline text-base hover:text-gray-600'
          >
            {linkButton.text}
          </a>
        </div>
      )}

      {secondaryButton && (
        <Button
          type='button'
          className='w-full !bg-gray-500 text-white text-lg rounded-lg py-3 shadow hover:bg-gray-600 transition'
          onClick={secondaryButton.onClick}
        >
          {secondaryButton.text}
        </Button>
      )}
    </form>
  );
}
