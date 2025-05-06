import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowRight, Check, Clock } from 'lucide-react';

export type StatusType = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface StatusStep {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  date?: string;
}

interface ProjectStatusProps {
  steps: StatusStep[];
  className?: string;
  ariaLabel?: string;
}

export function ProjectStatus({
  steps,
  className,
  ariaLabel = 'Project status timeline',
}: ProjectStatusProps) {
  const activeStepIndex = steps.findIndex(step => step.status === 'in_progress');
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'completed':
        return <Check className="h-5 w-5 text-white" aria-hidden="true" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-white" aria-hidden="true" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-white" aria-hidden="true" />;
      default:
        return <ArrowRight className="h-5 w-5 text-white" aria-hidden="true" />;
    }
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'failed':
        return 'Failed';
      default:
        return 'Pending';
    }
  };

  return (
    <div
      className={cn('relative px-4 py-8', className)}
      role="progressbar"
      aria-valuenow={progressPercentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      {/* Progress bar */}
      <div className="absolute left-0 top-12 w-full h-1 bg-gray-200" aria-hidden="true">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center"
            role="listitem"
            aria-current={index === activeStepIndex ? 'step' : undefined}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300',
                getStatusColor(step.status),
                step.status === 'in_progress' && 'animate-pulse'
              )}
              aria-label={`${step.title} - ${getStatusText(step.status)}`}
            >
              {getStatusIcon(step.status)}
            </div>
            <div className="text-center">
              <div
                className={cn(
                  'text-sm font-medium',
                  step.status === 'in_progress'
                    ? 'text-blue-600'
                    : step.status === 'completed'
                    ? 'text-green-600'
                    : step.status === 'failed'
                    ? 'text-red-600'
                    : 'text-gray-500'
                )}
              >
                {step.title}
              </div>
              {step.description && (
                <div
                  className="text-xs text-gray-500 mt-1 max-w-[100px] text-center"
                  aria-hidden="true"
                >
                  {step.description}
                </div>
              )}
              {step.date && (
                <div className="text-xs text-gray-400 mt-1" aria-hidden="true">
                  {step.date}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
