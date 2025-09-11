import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useForm, Controller } from 'react-hook-form';

interface FileUploadForm {
  file: FileList;
}

const FileUploader: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [fileName, setFileName] = useState('');
  const { token } = useSelector((state: RootState) => state.auth);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FileUploadForm>();

  const onSubmit = async (data: FileUploadForm) => {
    const selectedFile = data.file[0];
    if (!selectedFile) {
      setMessage('Будь ласка, оберіть файл для завантаження.');
      return;
    }

    setUploadStatus('loading');
    setMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(
        'https://localhost:3000/transactions/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUploadStatus('success');
      setMessage(`Успішно імпортовано ${response.data.count} транзакцій.`);
      reset(); // Очищаємо форму після успішного завантаження
    } catch (error: any) {
      setUploadStatus('error');
      setMessage(`Помилка під час завантаження файлу: ${error.response?.data?.message || 'Невідома помилка'}`);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-lg max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Завантажити транзакції</h2>
      <p className="text-gray-600 mb-6">Підтримується лише формат PDF.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center">
        <div className="flex items-center">
          <label htmlFor="file-upload" className="cursor-pointer bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
            Оберіть файл
          </label>
          <Controller
            name="file"
            control={control}
            rules={{
              required: 'Будь ласка, оберіть файл.',
              validate: {
                fileType: (value: FileList) =>
                  value[0]?.type === 'application/pdf' || 'Підтримується лише формат PDF.'
              }
            }}
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            render={({ field: { onChange, value, ...rest } }) => (
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  onChange(e.target.files);
                  // Оновлюємо стан, щоб відображати ім'я файлу
                  if (e.target.files && e.target.files.length > 0) {
                    setFileName(e.target.files[0].name);
                  } else {
                    setFileName('')
                  }
                }}
                {...rest}
              />
            )}
          />
        </div>
        {fileName && (
          <p className="mt-2 text-sm text-gray-600">
            Обрано: <span className="font-semibold">{fileName}</span>
          </p>
        )}
        {errors.file && (
          <p className="mt-2 text-smart text-sm">{errors.file.message}</p>
        )}

        <button
          type="submit"
          disabled={uploadStatus === 'loading'}
          className={`mt-6 px-6 py-3 rounded-full text-white font-bold transition-all duration-200 ${
            uploadStatus === 'loading' ? 'bg-body-text cursor-not-allowed' : 'bg-back-green hover:bg-green-600'
          }`}
        >
          {uploadStatus === 'loading' ? 'Завантаження...' : 'Завантажити'}
        </button>
      </form>

      {message && uploadStatus !== 'idle' && (
        <div className={`mt-4 p-3 rounded-lg w-full text-center ${uploadStatus === 'success' ? 'bg-green-100 text-back-green' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
