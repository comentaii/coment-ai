'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Calendar, Clock, Users, User, FileText, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCreateInterviewSessionMutation } from '@/services/api/interviewApi';
import { useGetCandidatesForJobQuery } from '@/services/api/job-posting-api';
import { createInterviewSessionSchema } from '@/lib/validation-schemas';
// import { format } from 'date-fns';
// import { tr } from 'date-fns/locale';
import { IUser } from '@/schemas/user.model';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobPostingId: string;
  jobPostingTitle: string;
  onSuccess?: () => void;
}

interface Candidate {
  _id: string;
  analysisResult?: {
    fullName?: string;
    contactInfo?: {
      email?: string;
    };
    experienceLevel?: string;
    summary?: string;
  };
  matchScore?: number;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  jobPostingId,
  jobPostingTitle,
  onSuccess
}: ScheduleInterviewModalProps) {
  const { promise } = useToast();
  const [createInterviewSession, { isLoading }] = useCreateInterviewSessionMutation();
  const { data: candidatesData, isLoading: candidatesLoading } = useGetCandidatesForJobQuery(jobPostingId);
  
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [interviewers, setInterviewers] = useState<IUser[]>([]);

  const formik = useFormik({
    initialValues: {
      jobPostingId: jobPostingId,
      interviewerId: '',
      scheduledDate: '',
      candidateIds: [],
      notes: '',
    },
    validationSchema: createInterviewSessionSchema,
    onSubmit: async (values) => {
      console.log('Form submit başladı');
      console.log('values:', values);
      console.log('selectedCandidates:', selectedCandidates);
      console.log('selectedDate:', selectedDate);
      console.log('selectedTime:', selectedTime);
      
      if (selectedCandidates.length === 0) {
        console.log('Aday seçimi hatası');
        promise(Promise.reject(new Error('En az bir aday seçmelisiniz')), {
          loading: 'Kontrol ediliyor...',
          success: 'Başarılı',
          error: 'Aday seçimi zorunludur'
        });
        return;
      }

      if (!selectedDate || !selectedTime) {
        console.log('Tarih/saat seçimi hatası');
        promise(Promise.reject(new Error('Tarih ve saat seçimi zorunludur')), {
          loading: 'Kontrol ediliyor...',
          success: 'Başarılı',
          error: 'Tarih ve saat seçimi zorunludur'
        });
        return;
      }

      console.log('Form validasyonu geçti, API çağrısı yapılıyor');
      const scheduledDate = new Date(`${selectedDate}T${selectedTime}`);
      
      await promise(
        createInterviewSession({
          jobPostingId,
          interviewerId: values.interviewerId,
          scheduledDate: scheduledDate.toISOString(),
          candidateIds: selectedCandidates,
          notes: values.notes,
        }).unwrap(),
        {
          loading: 'Mülakat oturumu oluşturuluyor...',
          success: 'Mülakat oturumu başarıyla oluşturuldu!',
          error: 'Mülakat oturumu oluşturulamadı'
        }
      );

      onSuccess?.();
      onClose();
      resetForm();
    },
  });

  // Load interviewers when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchInterviewers();
      // Reset formik with correct initial values
      formik.setValues({
        jobPostingId: jobPostingId,
        interviewerId: '',
        scheduledDate: '',
        candidateIds: [],
        notes: '',
      });
    }
  }, [isOpen]);

  const fetchInterviewers = async () => {
    try {
      console.log('Fetching interviewers...');
      const response = await fetch('/api/personnel/interviewers');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Interviewers response data:', data);
        const interviewers = data.data?.interviewers || [];
        console.log('Setting interviewers:', interviewers);
        setInterviewers(interviewers);
      } else {
        console.error('Failed to fetch interviewers:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching interviewers:', error);
    }
  };

  const resetForm = () => {
    formik.resetForm();
    setSelectedCandidates([]);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleCandidateToggle = (candidateId: string) => {
    const newSelectedCandidates = selectedCandidates.includes(candidateId)
      ? selectedCandidates.filter(id => id !== candidateId)
      : [...selectedCandidates, candidateId];
    
    setSelectedCandidates(newSelectedCandidates);
    formik.setFieldValue('candidateIds', newSelectedCandidates);
  };

  const getMinDateTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    if (selectedDate === new Date().toISOString().split('T')[0]) {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(nextHour.getHours() + 1);
      return nextHour.toTimeString().slice(0, 5);
    }
    return '09:00';
  };

  const matchedCandidates = candidatesData?.matched || [];
  const unmatchedCandidates = candidatesData?.unmatched || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Calendar className="w-6 h-6 mr-2 text-brand-green" />
            Mülakat Planla
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Posting Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                İş İlanı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-gray-900 dark:text-white">{jobPostingTitle}</p>
            </CardContent>
          </Card>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Mülakat Tarihi
              </Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  if (e.target.value && selectedTime) {
                    formik.setFieldValue('scheduledDate', `${e.target.value}T${selectedTime}`);
                  }
                }}
                min={getMinDateTime()}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="time" className="flex items-center mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Mülakat Saati
              </Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  if (selectedDate && e.target.value) {
                    formik.setFieldValue('scheduledDate', `${selectedDate}T${e.target.value}`);
                  }
                }}
                min={getMinTime()}
                className="w-full"
              />
            </div>
          </div>

          {/* Interviewer Selection */}
          <div>
            <Label htmlFor="interviewerId" className="flex items-center mb-2">
              <User className="w-4 h-4 mr-2" />
              Mülakatçı
            </Label>
            <Select
              value={formik.values.interviewerId}
              onValueChange={(value) => formik.setFieldValue('interviewerId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Mülakatçı seçiniz" />
              </SelectTrigger>
              <SelectContent>
                {interviewers.map((interviewer) => (
                  <SelectItem key={interviewer._id as string} value={interviewer._id as string}>
                    <div className="flex items-center space-x-2">
                      <span>{interviewer.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {interviewer.roles.includes('hr_manager') ? 'İK' : 'Mülakatçı'}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.errors.interviewerId && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.interviewerId}</p>
            )}
          </div>

          {/* Candidate Selection */}
          <div>
            <Label className="flex items-center mb-3">
              <Users className="w-4 h-4 mr-2" />
              Aday Seçimi ({selectedCandidates.length} seçildi)
            </Label>

            {candidatesLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Adaylar yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Matched Candidates */}
                {matchedCandidates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                      ✅ Eşleştirilmiş Adaylar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {matchedCandidates.map((candidate: any) => (
                        <CandidateSelectionCard
                          key={candidate._id as string}
                          candidate={candidate}
                          isSelected={selectedCandidates.includes(candidate._id as string)}
                          onToggle={() => handleCandidateToggle(candidate._id as string)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Unmatched Candidates */}
                {unmatchedCandidates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">
                      ⏳ Eşleştirilmemiş Adaylar
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {unmatchedCandidates.map((candidate: any) => (
                        <CandidateSelectionCard
                          key={candidate._id as string}
                          candidate={candidate}
                          isSelected={selectedCandidates.includes(candidate._id as string)}
                          onToggle={() => handleCandidateToggle(candidate._id as string)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {matchedCandidates.length === 0 && unmatchedCandidates.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <p className="text-gray-500">Bu iş ilanı için aday bulunamadı</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="flex items-center mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Notlar (Opsiyonel)
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formik.values.notes}
              onChange={formik.handleChange}
              placeholder="Mülakat hakkında notlar..."
              rows={3}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              type="button"
              onClick={() => {
                console.log('Modal içindeki Mülakat Planla butonuna tıklandı');
                console.log('isLoading:', isLoading);
                console.log('selectedCandidates.length:', selectedCandidates.length);
                console.log('selectedCandidates:', selectedCandidates);
                console.log('formik.isValid:', formik.isValid);
                console.log('formik.errors:', formik.errors);
                console.log('formik.values:', formik.values);
                console.log('formik.handleSubmit çağrılıyor...');
                formik.handleSubmit();
              }}
              disabled={isLoading || selectedCandidates.length === 0}
              className="bg-brand-green hover:bg-brand-green/90"
            >
              {isLoading ? 'Oluşturuluyor...' : 'Mülakat Planla'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CandidateSelectionCardProps {
  candidate: Candidate;
  isSelected: boolean;
  onToggle: () => void;
}

function CandidateSelectionCard({ candidate, isSelected, onToggle }: CandidateSelectionCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-brand-green bg-green-50 dark:bg-green-900/20' 
          : 'hover:shadow-md'
      }`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {candidate.analysisResult?.fullName || 'İsim Belirtilmemiş'}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {candidate.analysisResult?.contactInfo?.email || 'Email Belirtilmemiş'}
            </p>
            {candidate.analysisResult?.experienceLevel && (
              <Badge variant="secondary" className="mt-2">
                {candidate.analysisResult.experienceLevel}
              </Badge>
            )}
            {candidate.matchScore && (
              <Badge 
                variant="outline" 
                className={`mt-2 ml-2 ${
                  candidate.matchScore > 75 ? 'text-green-600 border-green-600' :
                  candidate.matchScore > 40 ? 'text-yellow-600 border-yellow-600' :
                  'text-red-600 border-red-600'
                }`}
              >
                %{candidate.matchScore} Uyum
              </Badge>
            )}
          </div>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected 
              ? 'bg-brand-green border-brand-green' 
              : 'border-gray-300 dark:border-gray-600'
          }`}>
            {isSelected && <X className="w-3 h-3 text-white" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
