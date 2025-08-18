'use client';

import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/use-redux';
import { removeUploadTask, clearCompletedTasks, UploadTask, UploadStatus } from '@/store/features/uploadSlice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, CheckCircle, AlertTriangle, Loader2, Trash2, ChevronUp, ChevronDown, RefreshCw, CircleSlash } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const statusConfig: Record<UploadStatus, { icon: React.ElementType; text: string; color: string; progressColor: string }> = {
  pending: { icon: Loader2, text: 'Bekliyor...', color: 'text-gray-500', progressColor: 'bg-gray-400' },
  uploading: { icon: Loader2, text: 'CV Yükleniyor...', color: 'text-blue-500 animate-spin', progressColor: 'bg-blue-500' },
  processing: { icon: Loader2, text: 'AI Analizi Yapılıyor...', color: 'text-yellow-500 animate-spin', progressColor: 'bg-yellow-500' },
  success: { icon: CheckCircle, text: 'Başarılı', color: 'text-green-500', progressColor: 'bg-green-500' },
  error: { icon: AlertTriangle, text: 'Hata', color: 'text-red-500', progressColor: 'bg-red-500' },
};

const TaskItem = ({ task }: { task: UploadTask }) => {
  const dispatch = useAppDispatch();
  const config = statusConfig[task.status];

  const handleRetry = () => {
    console.log("Retry logic to be implemented for task:", task.id);
    dispatch(removeUploadTask(task.id));
  };

  const handleCancel = () => {
    console.log("Cancelling task:", task.id);
    dispatch(removeUploadTask(task.id));
  };


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
      className="mb-2 last:mb-0"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2 overflow-hidden">
          <config.icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${config.color}`} />
          <div className="flex-grow overflow-hidden">
            <p className="text-xs font-medium truncate" title={task.fileName}>{task.fileName}</p>
            <p className="text-xs text-muted-foreground">{config.text}</p>
            {task.status !== 'success' && task.status !== 'error' && (
                <div className="flex items-center gap-2 mt-1">
                    <Progress value={task.progress} indicatorClassName={config.progressColor} className="h-1" />
                    <span className="text-xs text-muted-foreground font-semibold">{Math.round(task.progress)}%</span>
                </div>
            )}
            {task.status === 'error' && <p className="text-xs text-red-500 mt-0.5 truncate" title={task.error}>{task.error}</p>}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center -mr-2">
            {task.status === 'error' && (
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleRetry} title="Yeniden Dene">
                    <RefreshCw className="h-3 w-3 text-blue-500" />
                </Button>
            )}
            {(task.status === 'uploading' || task.status === 'processing' || task.status === 'pending') && (
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCancel} title="İptal Et">
                    <CircleSlash className="h-3 w-3 text-red-500" />
                </Button>
            )}
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => dispatch(removeUploadTask(task.id))} title="Kapat">
                <X className="h-3 w-3" />
            </Button>
        </div>
      </div>
    </motion.div>
  );
};

export function UploadProgressTracker() {
  const tasks = useAppSelector((state) => state.upload.tasks);
  const dispatch = useAppDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const summary = useMemo(() => {
    if (tasks.length === 0) return null;

    const inProgress = tasks.filter(t => t.status === 'uploading' || t.status === 'processing');
    const errored = tasks.filter(t => t.status === 'error');
    const overallProgress = tasks.length > 0 ? tasks.reduce((acc, t) => acc + t.progress, 0) / tasks.length : 0;
    
    let overallStatus: UploadStatus = 'success';
    if (inProgress.length > 0) {
        overallStatus = tasks.some(t => t.status === 'uploading') ? 'uploading' : 'processing';
    } else if (errored.length > 0) {
        overallStatus = 'error';
    }

    const config = statusConfig[overallStatus];
    let summaryText = `${tasks.length} dosya tamamlandı.`;
    if (inProgress.length > 0) {
        summaryText = `${inProgress.length}/${tasks.length} dosya işleniyor...`;
    } else if (errored.length > 0) {
        const successful = tasks.length - errored.length;
        summaryText = `${errored.length} hatalı, ${successful} tamamlandı.`;
    }

    return { overallProgress, config, summaryText, overallStatus };
  }, [tasks]);

  if (tasks.length === 0) return null;

  const hasCompletedTasks = tasks.some(t => t.status === 'success' || t.status === 'error');
  const isAllDone = !tasks.some(t => t.status === 'uploading' || t.status === 'processing' || t.status === 'pending');

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 md:w-80">
      <AnimatePresence>
        {tasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            layout
          >
            <Card className="shadow-2xl rounded-lg">
              <CardHeader 
                className="p-2.5 border-b cursor-pointer select-none"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <div className="flex items-center justify-between">
                  {isCollapsed && summary ? (
                      <div className="flex items-center gap-2 overflow-hidden w-full">
                          <summary.config.icon className={`h-4 w-4 flex-shrink-0 ${summary.config.color}`} />
                          <div className="flex-grow overflow-hidden">
                              <p className="text-xs font-medium">{summary.summaryText}</p>
                              {summary.overallStatus !== 'success' && summary.overallStatus !== 'error' && (
                                  <Progress value={summary.overallProgress} indicatorClassName={summary.config.progressColor} className="h-1 mt-1" />
                              )}
                          </div>
                      </div>
                  ) : (
                      <CardTitle className="text-sm">Dosya Yüklemeleri</CardTitle>
                  )}
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.section
                    key="content"
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: 'auto' },
                      collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <CardContent className="p-2.5 max-h-56 overflow-y-auto">
                      {tasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </CardContent>
                    {isAllDone && hasCompletedTasks && (
                        <CardFooter className="p-1.5 border-t bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
                            <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => dispatch(clearCompletedTasks())}>
                                <Trash2 className="h-3 w-3 mr-2"/>
                                Tamamlananları Temizle
                            </Button>
                        </CardFooter>
                    )}
                  </motion.section>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
