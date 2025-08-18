'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { useAppDispatch } from '@/hooks/use-redux';
import { addUploadTask, updateUploadTaskProgress, updateUploadTaskStatus } from '@/store/features/uploadSlice';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import axios from 'axios';

export function CvUploader() {
  const dispatch = useAppDispatch();
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);

    fileRejections.forEach(rejection => {
      rejection.errors.forEach(error => {
        toast.error(`${rejection.file.name}: ${error.message}`);
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    onDropRejected: (fileRejections) => {
        fileRejections.forEach(rejection => {
          toast.error(`Dosya kabul edilmedi: ${rejection.file.name}. Sadece PDF dosyaları geçerlidir.`);
        });
      },
  });

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.warning('Lütfen en az bir dosya seçin.');
      return;
    }

    const tasks = files.map(file => ({
      id: `${file.name}-${Date.now()}`,
      fileName: file.name,
    }));

    tasks.forEach(task => dispatch(addUploadTask(task)));

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file);
      // Associate each file with its taskId
      formData.append('taskIds', tasks[index].id);
    });

    try {
      const response = await axios.post('/api/cv/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const totalProgress = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          tasks.forEach(task => {
            dispatch(updateUploadTaskProgress({ id: task.id, progress: totalProgress }));
            if (totalProgress === 100) {
              dispatch(updateUploadTaskStatus({ id: task.id, status: 'processing' }));
            } else {
                dispatch(updateUploadTaskStatus({ id: task.id, status: 'uploading' }));
            }
          });
        },
      });

      if (response.status === 200) {
        tasks.forEach(task => {
          dispatch(updateUploadTaskStatus({ id: task.id, status: 'success' }));
        });
        toast.success(`${tasks.length} CV başarıyla yüklendi.`);
      }
    } catch (error) {
      tasks.forEach(task => {
        dispatch(updateUploadTaskStatus({ id: task.id, status: 'error', error: 'Yükleme başarısız oldu.' }));
      });
      toast.error('CV yüklenirken bir hata oluştu.');
      console.error(error);
    } finally {
        setFiles([]);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloud className="w-12 h-12 text-gray-400" />
          {isDragActive ? (
            <p>Dosyaları buraya bırakın...</p>
          ) : (
            <p>CV dosyalarınızı buraya sürükleyin veya seçmek için tıklayın (.pdf)</p>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Seçilen Dosyalar:</h4>
          <ul className="space-y-2">
            {files.map(file => (
              <li key={file.name} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                <div className="flex items-center gap-2">
                    <FileIcon className="w-5 h-5 text-gray-500" />
                    <span>{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)}>
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={handleUpload} disabled={files.length === 0} className="w-full">
        Yükle ({files.length})
      </Button>
    </div>
  );
}
